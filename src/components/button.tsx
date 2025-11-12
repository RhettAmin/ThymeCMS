
type ButtonProps = {
    message: string,
    onClickFn: (() => void),
    shouldErrorRender?: boolean
}
const Button = ({ message, onClickFn, shouldErrorRender = false}: ButtonProps) => {

    return (
        <div> 
            <button 
                className={`border border-1 px-8 py-2 rounded-lg shadow-lg cursor-pointer transition-colors duration-200
                    ${ shouldErrorRender ? 'bg-thymeNegative hover:bg-thymeNegativeHover' : 'bg-thymeButton hover:bg-thymeButtonHover'}
                    `}
                onClick={onClickFn}
            >
                { message } 
            </button>
        </div>
    )
}

export default Button