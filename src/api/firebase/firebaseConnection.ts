import { uploadBytesResumable, getDownloadURL, ref as storageRef, type StorageReference } from 'firebase/storage'
import { thymeStorage } from '@/config/firebase'
import ProgressBar from '@/components/ProgressBar.vue'
import Toaster from "@/components/toast";

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

async function uploadImage(location: string, imageFolder: any, progressbar: typeof ProgressBar) {
    return await new Promise<string>( (resolve, reject) => {
        console.log("firebase Image Upload starting...")
        firebaseStorageRef = storageRef(thymeStorage, location) 
        if (imageFolder) {
            const uploadTask = uploadBytesResumable(firebaseStorageRef, imageFolder);
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

const firebaseConn = {
    uploadImage
}

export default firebaseConn