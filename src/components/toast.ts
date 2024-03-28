import { useToast } from "vue-toastification";  

const toast = useToast()


function toastSuccess(message: string) {
    toast.success(message)
}

function toastInfo(message: string) {
    toast.info(message)
}

function toastError(message: string) {
    toast.error(message)
}

const Toaster = {
    toastSuccess, toastInfo, toastError
}

export default Toaster
