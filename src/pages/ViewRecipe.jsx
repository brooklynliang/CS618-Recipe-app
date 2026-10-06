import { Link, useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { Recipe } from '../components/Recipe.jsx'
import { getRecipeById } from '../api/recipes.js'

export function ViewRecipe() {
  const { recipeId } = useParams()

  const recipeQuery = useQuery({
    queryKey: ['recipe', recipeId],
    queryFn: () => getRecipeById(recipeId),
  })

  const recipe = recipeQuery.data

  return (
    <main style={{ padding: 16 }}>
      <Header />

      <hr />

      <Link to='/'>Back to main page</Link>

      <hr />

      {recipeQuery.isPending && <p>Loading recipe...</p>}

      {recipeQuery.isError && <p>Unable to load recipe.</p>}

      {recipeQuery.isSuccess && recipe && <Recipe {...recipe} />}
    </main>
  )
}
