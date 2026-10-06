export const getRecipes = async (queryParams = {}) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes?` +
      new URLSearchParams(queryParams),
  )

  if (!res.ok) {
    throw new Error('Failed to load recipes')
  }

  return await res.json()
}

export const getRecipeById = async (recipeId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}`,
  )

  if (!res.ok) {
    throw new Error('Failed to load recipe')
  }

  return await res.json()
}

export const createRecipe = async (token, recipe) => {
  const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/recipes`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(recipe),
  })

  if (!res.ok) {
    throw new Error('Failed to create recipe')
  }

  return await res.json()
}

export const likeRecipe = async (token, recipeId) => {
  const res = await fetch(
    `${import.meta.env.VITE_BACKEND_URL}/recipes/${recipeId}/like`,
    {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  )

  if (!res.ok) {
    throw new Error('Failed to like recipe')
  }

  return await res.json()
}
