
import Navigation from './components/navbar'
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const ViewRecipes = lazy(() => import('./pages/viewRecipes'))
const RecipeEditor = lazy(() => import('./pages/recipeEditor'))

function App() {

  return (
    <div className="flex flex-col w-full h-screen bg-surface-page">
      <div className="h-[10%]">
        <Navigation />
      </div>
      <div className="w-full flex-1 min-h-0">
        <Routes>
            <Route path="/" element={<ViewRecipes />} />
            <Route path="/recipeEditor" element={<RecipeEditor />} />
        </Routes>
      </div>
    </div>
  )
}

export default App
