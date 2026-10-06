import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeList } from '../components/RecipeList.jsx'
import { getRecipes } from '../api/recipes.js'

export function RecipeHome() {
  const [sortOrder, setSortOrder] = useState('descending')
  const recipesQuery = useQuery({
    queryKey: ['recipes', sortOrder],
    queryFn: () =>
      getRecipes({
        sortBy: 'likes',
        sortOrder,
      }),
  })

  const recipes = recipesQuery.data ?? []

  return (
    <main style={{ padding: 16 }}>
      <Header />

      <hr />

      <h1>Recipe Sharing App</h1>
      <p>Share your favorite recipes with the community.</p>

      <h2>Add a Recipe</h2>
      <CreateRecipe />

      <hr />

      <h2>Recipes</h2>

      <label htmlFor='sort-likes'>Sort by likes: </label>
      <select
        id='sort-likes'
        value={sortOrder}
        onChange={(event) => setSortOrder(event.target.value)}
      >
        <option value='descending'>Most Liked</option>
        <option value='ascending'>Least Liked</option>
      </select>

      {recipesQuery.isPending && <p>Loading recipes...</p>}

      {recipesQuery.isError && <p>Unable to load recipes. Please try again.</p>}

      {recipesQuery.isSuccess && <RecipeList recipes={recipes} />}
    </main>
  )
}
