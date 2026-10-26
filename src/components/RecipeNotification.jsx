import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSocket } from '../contexts/SocketIOContext.jsx'

export function RecipeNotification() {
  const socket = useSocket()
  const navigate = useNavigate()
  const [newRecipe, setNewRecipe] = useState(null)

  useEffect(() => {
    if (!socket) return

    const handleNewRecipe = (recipe) => {
      setNewRecipe(recipe)
    }

    socket.on('recipe.created', handleNewRecipe)

    return () => {
      socket.off('recipe.created', handleNewRecipe)
    }
  }, [socket])

  if (!newRecipe) return null

  return (
    <div
      style={{
        position: 'fixed',
        top: 20,
        right: 20,
        padding: 16,
        backgroundColor: '#ffffff',
        border: '2px solid #333333',
        borderRadius: 8,
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
        zIndex: 1000,
        maxWidth: 300,
      }}
    >
      <p>
        <strong>New recipe added!</strong>
      </p>
      <button
        type='button'
        onClick={() => {
          navigate(`/recipes/${newRecipe.id}`)
          setNewRecipe(null)
        }}
      >
        View recipe: {newRecipe.title}
      </button>
      <button
        type='button'
        onClick={() => setNewRecipe(null)}
        style={{ marginLeft: 8 }}
      >
        Close
      </button>
    </div>
  )
}
