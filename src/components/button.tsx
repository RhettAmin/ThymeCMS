
type ButtonProps = {
    message: string,
    width?: string,
    onClickFn: (() => void),
    shouldErrorRender?: boolean
}
const Button = ({ message, width, onClickFn, shouldErrorRender = false}: ButtonProps) => {

    return ( 
        <button 
            className={`border border-1 px-8 py-2 rounded-lg shadow-lg cursor-pointer transition-colors duration-200
                ${ width ? "w-"+width : ""}
                ${ shouldErrorRender ? 'bg-thymeNegative hover:bg-thymeNegativeHover' : 'bg-thymeButton hover:bg-thymeButtonHover'}
                `}
            onClick={onClickFn}
        >
            { message } 
        </button>
    )
}

export default Button