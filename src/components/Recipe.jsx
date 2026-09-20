import PropTypes from 'prop-types'
import { User } from './User.jsx'

export function Recipe({ title, ingredients, imageUrl, author }) {
  return (
    <article>
      <h2>{title}</h2>

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
  title: PropTypes.string.isRequired,
  ingredients: PropTypes.arrayOf(PropTypes.string).isRequired,
  imageUrl: PropTypes.string.isRequired,
  author: PropTypes.string,
}
