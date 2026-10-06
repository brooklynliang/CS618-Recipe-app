import { Link } from 'react-router-dom'
import PropTypes from 'prop-types'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { User } from './User.jsx'
import { useAuth } from '../contexts/AuthContext.jsx'
import { likeRecipe } from '../api/recipes.js'

export function Recipe({
  _id,
  title,
  ingredients,
  imageUrl,
  author,
  likes = [],
  linkTitle = false,
}) {
  const [token] = useAuth()
  const queryClient = useQueryClient()

  const likeRecipeMutation = useMutation({
    mutationFn: () => likeRecipe(token, _id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['recipes'] })
    },
  })
  return (
    <article>
      <h2>{linkTitle ? <Link to={`/recipes/${_id}`}>{title}</Link> : title}</h2>

      <img
        src={imageUrl}
        alt={title}
        style={{
          width: '100%',
          maxWidth: '400px',
          height: '250px',
          objectFit: 'cover',
        }}
      />

      <h3>Ingredients</h3>

      <ul>
        {ingredients.map((ingredient, index) => (
          <li key={`${ingredient}-${index}`}>{ingredient}</li>
        ))}
      </ul>

      <p>Likes: {likes.length}</p>

      {token && (
        <button
          type='button'
          onClick={() => likeRecipeMutation.mutate()}
          disabled={likeRecipeMutation.isPending}
        >
          {likeRecipeMutation.isPending ? 'Liking...' : 'Like'}
        </button>
      )}

      {likeRecipeMutation.isError && <p>Unable to like this recipe.</p>}

      {author && (
        <p>
          <em>
            Created by <User id={author} />
          </em>
        </p>
      )}
    </article>
  )
}

Recipe.propTypes = {
  _id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageUrl: PropTypes.string.isRequired,
  author: PropTypes.string,
  likes: PropTypes.arrayOf(PropTypes.string),
  linkTitle: PropTypes.bool,
}
