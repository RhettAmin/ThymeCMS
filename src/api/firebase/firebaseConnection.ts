import { uploadBytesResumable, getDownloadURL, getMetadata, deleteObject, ref as storageRef, type StorageReference } from 'firebase/storage'
import ThymeFirebaseConn from '@/config/firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Recipe, MainImageRef, InstructionImageRef } from '@/models/recipeModel'
import ProgressBar from '@/components/ProgressBar.vue'
import Toaster from "@/components/toast";
import JSZip from 'jszip'

const zipper = new JSZip()

let firebaseStorageRef = null as unknown as StorageReference

async function uploadImage(location: string, data: any, progressbar: typeof ProgressBar) {
    return await new Promise<string>( (resolve, reject) => {

        console.log("firebase Image Upload starting...")
        firebaseStorageRef = storageRef(ThymeFirebaseConn.thymeStorage, location) 
        if (data) {

            // Authenticate first
            signInWithEmailAndPassword(ThymeFirebaseConn.thymeAuth, ThymeFirebaseConn.auth[0], ThymeFirebaseConn.auth[1])
           
            const uploadTask = uploadBytesResumable(firebaseStorageRef, data);
            Toaster.toastInfo("Image upload Started")
            // Register three observers:
            // 1. 'state_changed' observer, called any time the state changes
            // 2. Error observer, called on failure
            // 3. Completion observer, called on successful completion
            uploadTask.on('state_changed', 
                (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        progressbar.updateProgress(progress)
                        console.log('Upload is ' + progress + '% done');
                        break;
                }
                            }, 
                (error) => {
                    // Handle unsuccessful uploads
                    console.error(error)
                    reject("ERROR!")
                }, 
                () => {
                    // Handle successful uploads on complete
                    // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        Toaster.toastInfo("Image upload Done!")
                        resolve(downloadURL) 
                    });
                }
            )
             
        }
    })
}

async function deleteStorageFile(fileName: string) {
    const file = storageRef(ThymeFirebaseConn.thymeStorage, fileName)

    deleteObject(file).then(() => {

    })
}

async function getImage(recipe: Recipe) {
    return await new Promise<Recipe> ( (resolve, reject) => {

        getImagefromFirebase(recipe).then((recipeResponse) => {
            resolve(recipeResponse)
        }).catch((error) => {
            reject(error)
        })

    })
}

async function getImagefromFirebase(recipe: Recipe) {
    return await new Promise<Recipe> ( (resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        try {
            xhr.onload = () => {
                const blob = xhr.response;

                zipper.loadAsync(blob).then( (zip) => {    
                    const zipContent = Object.keys(zip.files).filter(file => file.includes(recipe.recipeId))
                    let instructionImagesSize = zipContent.length-1

                    for (const [index, value] of zipContent.entries()) {
                        const file = value
                        // console.log(value)

                        zip.files[file].async("base64").then(function (base64file) {
                            if (base64file != '') {
                                const imageFile = convertbase64toFile(base64file, file)
                                if (file.includes("hero_")) {
                                    const heroImageRef: MainImageRef = new MainImageRef

                                    const nameMatch = value.match(".*\/hero_(.*)")
                                    if (nameMatch) {
                                        heroImageRef.imageFileRef = imageFile
                                        heroImageRef.imageName = nameMatch[1]
                                        recipe.heroImage = heroImageRef
                                    }                                    
                                } else if (file.includes("main_")) {
                                    const mainImageRef: MainImageRef = new MainImageRef

                                    const nameMatch = value.match(".*\/main_(.*)")
                                    if (nameMatch) {
                                        mainImageRef.imageFileRef = imageFile
                                        mainImageRef.imageName = nameMatch[1]
                                        recipe.mainImage = mainImageRef
                                    }   
                                } else {
                                    const matches = file.match(".*/(.d*)_(.*)")
                                    if (matches) {
                                        const capturedIndex: number = Number(matches[1])
                                        const name = matches[2]
                                        const instructionImageRef: InstructionImageRef = new InstructionImageRef
                                        
                                        instructionImageRef.imageFileRef = imageFile
                                        instructionImageRef.imageName = name
                                        instructionImageRef.index = capturedIndex
                                        recipe.instructionSection[capturedIndex].image = instructionImageRef
                                    }
                                }
                                instructionImagesSize--

                                if (instructionImagesSize == 0) {
                                    resolve(recipe)
                                }
                            }
                        })
                        
                    }
                })
            }
            xhr.open('GET', recipe.images);
            xhr.send();
        } catch {
            reject("failed to fetch Image" + recipe.images)
        }
    })
}

function convertbase64toFile(string64: string, fileName: string): File {
    //console.log(string64)
    const imageContent = atob(string64);
    
    // image details
    const buffer = new ArrayBuffer(imageContent.length);
    const view = new Uint8Array(buffer);

    for (let n = 0; n < imageContent.length; n++) {
      view[n] = imageContent.charCodeAt(n);
    }

    const imgType = fileName.split(".")[1]
    const type = 'image/'+imgType;

    const blob = new Blob([buffer], { type });
    return new File([blob], fileName, { lastModified: new Date().getTime(), type });
}

const FirebaseConn = {
        uploadImage, getImage
}

export default FirebaseConn