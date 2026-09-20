import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { useAuth } from '../contexts/AuthContext.jsx'
import { createRecipe } from '../api/recipes.js'

export function CreateRecipe() {
  const [title, setTitle] = useState('')
  const [ingredientsText, setIngredientsText] = useState('')
  const [imageUrl, setImageUrl] = useState('')
  const [token] = useAuth()

  const queryClient = useQueryClient()

  const createRecipeMutation = useMutation({
    mutationFn: () => {
      const ingredients = ingredientsText
        .split('\n')
        .map((ingredient) => ingredient.trim())
        .filter((ingredient) => ingredient.length > 0)

      return createRecipe(token, {
        title,
        ingredients,
        imageUrl,
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
      setTitle('')
      setIngredientsText('')
      setImageUrl('')
    },
  })

  const handleSubmit = (event) => {
    event.preventDefault()
    createRecipeMutation.mutate()
  }

  if (!token) {
    return <div>Please log in to create a new recipe.</div>
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor='recipe-title'>Recipe title: </label>
        <input
          type='text'
          id='recipe-title'
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor='recipe-ingredients'>Ingredients, one per line:</label>
        <br />
        <textarea
          id='recipe-ingredients'
          rows='6'
          value={ingredientsText}
          onChange={(event) => setIngredientsText(event.target.value)}
          required
        />
      </div>

      <br />

      <div>
        <label htmlFor='recipe-image'>Image URL: </label>
        <input
          type='url'
          id='recipe-image'
          value={imageUrl}
          onChange={(event) => setImageUrl(event.target.value)}
          required
        />
      </div>

      <br />

      <input
        type='submit'
        value={createRecipeMutation.isPending ? 'Creating...' : 'Create Recipe'}
        disabled={
          !title.trim() ||
          !ingredientsText.trim() ||
          !imageUrl.trim() ||
          createRecipeMutation.isPending
        }
      />

      {createRecipeMutation.isSuccess && <p>Recipe created successfully!</p>}

      {createRecipeMutation.isError && (
        <p>Unable to create the recipe. Please try again.</p>
      )}
    </form>
  )
}
