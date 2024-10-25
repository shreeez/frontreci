// services/recipeService.ts
import { Recipe } from '../types/types'

const API_URL = 'http://localhost:5103' // Замените на ваш URL бэкенда

export const fetchRecipes = async (): Promise<Recipe[]> => {
	const response = await fetch(`${API_URL}/recipes`)
	if (!response.ok) {
		throw new Error('Ошибка при получении рецептов')
	}
	const data: Recipe[] = await response.json()
	return data
}

// services/recipeService.ts
// Добавьте эту функцию
export const fetchRecipeById = async (id: string): Promise<Recipe> => {
  const response = await fetch(`${API_URL}/recipes/${id}`, {
    cache: 'no-store',
  });
  if (!response.ok) {
    throw new Error('Ошибка при получении рецепта');
  }
  const data: Recipe = await response.json();
  return data;
};