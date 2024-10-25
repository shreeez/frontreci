// types/types.ts
export interface Ingredient {
	name: string
	quantity?: number
	unit?: string
}

export interface Recipe {
	recipeID: number
	name: string
	isVegetarian: boolean
	isVegan: boolean
	ingredients?: Ingredient[]
}
