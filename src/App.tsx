
import Navigation from './sidenav/navigation';
import { Routes, Route } from 'react-router-dom';
import { lazy, Suspense } from 'react'
const ViewRecipes = lazy(() => import('./pages/viewRecipes'));
const AddRecipe = lazy(() => import('./pages/addRecipe'));

function App() {

  return (
    <div className="flex flex-col w-full h-full bg-thymeBackground">
      <Navigation />
      <Suspense fallback={<div>Loading...</div>}>
        <div className="p-2">
          <Routes>
              <Route path="/" element={<ViewRecipes />} />
              <Route path="/addrecipe" element={<AddRecipe />} />
          </Routes>
        </div>
      </Suspense>
    </div>
  )
}

export default App
