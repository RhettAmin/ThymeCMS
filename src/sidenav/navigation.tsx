import { useState } from 'react';
import { Link } from 'react-router-dom';

const Navigation = () => {

    const [activeTab, setActiveTab] = useState(0)

    return (
        <div className="flex flex-row w-full items-center text-center bg-thymeNav">
            <h1 className="text-3xl font-bold ml-12">Thyme CMS</h1>
            <nav className="flex flex-row items-center text-center ml-12">
                <Link 
                    className={`w-44 font-bold py-4 ${activeTab == 0 ? 'bg-navActiveHighlight' : ''} `} 
                    onClick={() => setActiveTab(0)}
                    to="/"
                >
                    View Recipes
                </Link>
                <Link 
                    className={`w-44  font-bold py-4 ${activeTab == 1 ? 'bg-navActiveHighlight' : ''} `} 
                    onClick={() => setActiveTab(1)}
                    to="/addrecipe"
                >
                    Add Recipes
                </Link>
            </nav>
        </div>
    )
}

export default Navigation