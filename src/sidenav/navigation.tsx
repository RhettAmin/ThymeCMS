import { Link, useLocation } from 'react-router-dom'

const Navigation = () => {

    const location = useLocation()

    return (
        <div className="flex flex-row w-full items-center text-center bg-thymeNav">
            <h1 className="text-3xl font-bold ml-12">Thyme CMS</h1>
            <nav className="flex flex-row items-center text-center ml-12">
                <Link 
                    className={`w-44 font-bold py-4 ${ location.pathname === '/' ? 'bg-navActiveHighlight' : ''} `} 
                    to="/"
                >
                    View Recipes
                </Link>
                <Link 
                    className={`w-44 font-bold py-4 ${ location.pathname === '/addrecipe' ? 'bg-navActiveHighlight' : ''} `} 
                    to="/addrecipe"
                >
                    Add Recipes
                </Link>
            </nav>
        </div>
    )
}

export default Navigation