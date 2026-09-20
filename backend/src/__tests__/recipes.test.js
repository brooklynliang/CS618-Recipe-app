import mongoose from 'mongoose'
import { describe, expect, test, beforeEach, beforeAll } from '@jest/globals'
import {
  createRecipe,
  listAllRecipes,
  listRecipesByAuthor,
  getRecipeById,
  updateRecipe,
  deleteRecipe,
} from '../services/recipes.js'
import { Recipe } from '../db/models/recipe.js'
import { createUser } from '../services/users.js'

let testUser = null
let sampleRecipes = []
let createdSampleRecipes = []

beforeAll(async () => {
  testUser = await createUser({
    username: 'sample',
    password: 'user',
  })

  sampleRecipes = [
    {
      title: 'Egg Fried Rice',
      ingredients: ['rice', 'eggs', 'soy sauce'],
      imageUrl: 'https://example.com/fried-rice.jpg',
      author: testUser._id,
    },
    {
      title: 'Tomato Pasta',
      ingredients: ['pasta', 'tomatoes', 'olive oil'],
      imageUrl: 'https://example.com/pasta.jpg',
      author: testUser._id,
    },
  ]
})

beforeEach(async () => {
  await Recipe.deleteMany({})
  createdSampleRecipes = []

  for (const recipe of sampleRecipes) {
    const createdRecipe = new Recipe(recipe)
    createdSampleRecipes.push(await createdRecipe.save())
  }
})

describe('getting a recipe', () => {
  test('should return the full recipe', async () => {
    const recipe = await getRecipeById(createdSampleRecipes[0]._id)

    expect(recipe.toObject()).toEqual(createdSampleRecipes[0].toObject())
  })

  test('should return null when the recipe does not exist', async () => {
    const recipe = await getRecipeById('000000000000000000000000')

    expect(recipe).toEqual(null)
  })
})

describe('updating recipes', () => {
  test('should update a recipe owned by the user', async () => {
    await updateRecipe(testUser._id, createdSampleRecipes[0]._id, {
      title: 'Updated Fried Rice',
      ingredients: ['rice', 'eggs', 'soy sauce'],
      imageUrl: 'https://example.com/updated.jpg',
    })

    const updatedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)

    expect(updatedRecipe.title).toEqual('Updated Fried Rice')
  })

  test('should not update a recipe for another user', async () => {
    const differentUserId = new mongoose.Types.ObjectId()

    const recipe = await updateRecipe(
      differentUserId,
      createdSampleRecipes[0]._id,
      {
        title: 'Unauthorized Change',
        ingredients: ['nothing'],
        imageUrl: 'https://example.com/nothing.jpg',
      },
    )

    expect(recipe).toEqual(null)
  })
})

describe('deleting recipes', () => {
  test('should delete a recipe owned by the user', async () => {
    const result = await deleteRecipe(testUser._id, createdSampleRecipes[0]._id)

    expect(result.deletedCount).toEqual(1)

    const deletedRecipe = await Recipe.findById(createdSampleRecipes[0]._id)

    expect(deletedRecipe).toEqual(null)
  })

  test('should not delete a recipe owned by another user', async () => {
    const differentUserId = new mongoose.Types.ObjectId()

    const result = await deleteRecipe(
      differentUserId,
      createdSampleRecipes[0]._id,
    )

    expect(result.deletedCount).toEqual(0)
  })
})

describe('listing recipes', () => {
  test('should return all recipes', async () => {
    const recipes = await listAllRecipes()

    expect(recipes.length).toEqual(createdSampleRecipes.length)
  })

  test('should filter recipes by author', async () => {
    const recipes = await listRecipesByAuthor(testUser.username)

    expect(recipes.length).toEqual(2)
  })
})

describe('creating recipes', () => {
  test('should create a recipe with all required fields', async () => {
    const recipe = {
      title: 'Chicken Noodles',
      ingredients: ['chicken', 'noodles', 'vegetables'],
      imageUrl: 'https://example.com/noodles.jpg',
    }

    const createdRecipe = await createRecipe(testUser._id, recipe)

    expect(createdRecipe._id).toBeInstanceOf(mongoose.Types.ObjectId)

    const foundRecipe = await Recipe.findById(createdRecipe._id)

    expect(foundRecipe).toEqual(expect.objectContaining(recipe))
    expect(foundRecipe.createdAt).toBeInstanceOf(Date)
    expect(foundRecipe.updatedAt).toBeInstanceOf(Date)
  })

  test('should reject a recipe without a title', async () => {
    const recipe = {
      ingredients: ['rice'],
      imageUrl: 'https://example.com/rice.jpg',
    }

    await expect(createRecipe(testUser._id, recipe)).rejects.toBeInstanceOf(
      mongoose.Error.ValidationError,
    )
  })

  test('should reject a recipe without an image URL', async () => {
    const recipe = {
      title: 'Rice',
      ingredients: ['rice'],
    }

    await expect(createRecipe(testUser._id, recipe)).rejects.toBeInstanceOf(
      mongoose.Error.ValidationError,
    )
  })
})
