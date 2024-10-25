// src/app/recipes/[id]/page.tsx

import { Recipe } from '../../../types/types'
import { fetchRecipeById } from '../../../services/recipeService'

interface RecipePageProps {
	params: {
		id: string
	}
}

export default async function RecipePage({ params }: RecipePageProps) {
	const resolvedParams = await params
	const { id } = resolvedParams

	let recipe: Recipe | null = null

	try {
		recipe = await fetchRecipeById(id)
	} catch (error) {
		console.error(error)
	}

	if (!recipe) {
		return <div>Рецепт не найден</div>
	}

	return (
		<div>
			<h1>{recipe.name}</h1>
			<p>Вегетарианский: {recipe.isVegetarian ? 'Да' : 'Нет'}</p>
			<p>Веганский: {recipe.isVegan ? 'Да' : 'Нет'}</p>
			{recipe.ingredients && recipe.ingredients.length > 0 && (
				<div>
					<h3>Ингредиенты:</h3>
					<ul>
						{recipe.ingredients.map((ingredient, index) => (
							<li key={index}>
								{ingredient.name}
								{ingredient.quantity && ` - ${ingredient.quantity}`}
								{ingredient.unit && ` ${ingredient.unit}`}
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	)
}
