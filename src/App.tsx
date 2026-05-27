
import Navigation from './nav/navigation'
import { Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const ViewRecipes = lazy(() => import('./pages/viewRecipes'))
const RecipeEditor = lazy(() => import('./pages/recipeEditor'))

function App() {

  return (
    <div className="flex flex-col w-full h-screen bg-thymeBackground">
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="p-2 w-full h-full">
          <Routes>
              <Route path="/" element={<ViewRecipes />} />
              <Route path="/recipeEditor" element={<RecipeEditor />} />
          </Routes>
        </div>
      </Suspense>
    </div>
  )
}

export default App
