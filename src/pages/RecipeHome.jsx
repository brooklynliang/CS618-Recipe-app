import { useQuery } from '@tanstack/react-query'
import { Header } from '../components/Header.jsx'
import { CreateRecipe } from '../components/CreateRecipe.jsx'
import { RecipeList } from '../components/RecipeList.jsx'
import { getRecipes } from '../api/recipes.js'

export function RecipeHome() {
  const recipesQuery = useQuery({
    queryKey: ['recipes'],
    queryFn: () =>
      getRecipes({
        sortBy: 'createdAt',
        sortOrder: 'descending',
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

      <h2>Latest Recipes</h2>

      {recipesQuery.isPending && <p>Loading recipes...</p>}

      {recipesQuery.isError && <p>Unable to load recipes. Please try again.</p>}

      {recipesQuery.isSuccess && <RecipeList recipes={recipes} />}
    </main>
  )
}
