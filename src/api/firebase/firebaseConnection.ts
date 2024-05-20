import { uploadBytesResumable, getDownloadURL, ref as storageRef, type StorageReference } from 'firebase/storage'
import ThymeFirebaseConn from '@/config/firebaseConfig'
import { signInWithEmailAndPassword } from "firebase/auth";
import { Recipe } from '@/models/recipeModel'
import ProgressBar from '@/components/ProgressBar.vue'
import Toaster from "@/components/toast";
import JSZip from 'jszip'

const zipper = new JSZip()

let firebaseStorageRef = null as unknown as StorageReference

export class ImageRef {
    imageFileRef: any = null
    imageURLPreview: string = ""
}

export class MainImageRef extends ImageRef {}

export class InstructionImageRef extends ImageRef {
    instructionSection: string = ""
    index = 0
}

async function uploadImage(location: string, data: any, progressbar: typeof ProgressBar) {
    return await new Promise<string>( (resolve, reject) => {
        console.log("firebase Image Upload starting...")
        
        firebaseStorageRef = storageRef(ThymeFirebaseConn.thymeStorage, location) 
        if (data) {

            // Authenticate first
            console.log(location)
            console.log(data)
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

async function getImage(recipe: Recipe) {
    return await new Promise<Recipe> ( (resolve, reject) => {

        getImagefromFirebase(recipe).then((recipeResponse) => {
            console.log("returning recipe")
            console.log(recipe)
            resolve(recipeResponse)
        })

    })
}

async function getImagefromFirebase(recipe: Recipe) {
    return await new Promise<Recipe> ( (resolve, reject) => {
        const referenceName = recipe.name.replace(/ /g, '-') + "_" + recipe.recipeId

        const xhr = new XMLHttpRequest();
        xhr.responseType = 'blob';
        try {
            xhr.onload = () => {
                const blob = xhr.response;

                zipper.loadAsync(blob).then( (zip) => {    
                    // boolean to determine if we're setting the main Image or instructionImages
                    let isMainImage = true
                    let counter = 0
                    const zipContent = Object.keys(zip.files)
                    for (const [index, value] of zipContent.entries()) {
                        const file = value
                        if (file != referenceName+"/") {
                            zip.files[file].async("blob").then(function (blobFile) {
                                if (blobFile.size != 0) {
                                    if (isMainImage) {
                                        recipe.mainImage = blobFile
                                        isMainImage = false
                                    } else {
                                        recipe.instructionSection[counter].image = blobFile
                                        counter++
                                        if (index == zipContent.length-1) {
                                            resolve(recipe)
                                        }
                                    }
                                }
                            })
                        }
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

const FirebaseConn = {
    uploadImage, getImage
}

export default FirebaseConn