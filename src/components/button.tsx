
type ButtonProps = {
    message: string,
    width?: string,
    onClickFn: (() => void),
    shouldErrorRender?: boolean
}
export const Button = ({ message, width, onClickFn, shouldErrorRender = false}: ButtonProps) => {

    return ( 
        <button 
            className={`border border-1 px-8 py-2 text-text-on-dark hover:text-text-muted rounded-lg shadow-lg cursor-pointer transition-colors duration-200
                ${ width ? "w-"+width : ""}
                ${ shouldErrorRender ? 'bg-status-error hover:bg-status-error-light' : 'bg-brand-mid hover:bg-brand-soft'}
                `}
            onClick={onClickFn}
        >
            { message } 
        </button>
    )
}
