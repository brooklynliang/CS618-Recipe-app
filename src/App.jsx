import { ViewRecipe } from './pages/ViewRecipe.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RecipeHome } from './pages/RecipeHome.jsx'
import { Signup } from './pages/Signup.jsx'
import { Login } from './pages/Login.jsx'
import { AuthContextProvider } from './contexts/AuthContext.jsx'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { SocketIOContextProvider } from './contexts/SocketIOContext.jsx'
import { RecipeNotification } from './components/RecipeNotification.jsx'

const queryClient = new QueryClient()

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <>
        <RecipeHome />
        <RecipeNotification />
      </>
    ),
  },
  {
    path: '/signup',
    element: <Signup />,
  },
  {
    path: '/login',
    element: <Login />,
  },
  {
    path: '/recipes/:recipeId',
    element: <ViewRecipe />,
  },
])

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthContextProvider>
        <SocketIOContextProvider>
          <RouterProvider router={router} />
        </SocketIOContextProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  )
}
