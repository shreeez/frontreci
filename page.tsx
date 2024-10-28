'use client'

import React, { useState, useEffect } from 'react'
import { Recipe } from '../types/types'
import { fetchRecipes } from '../services/recipeService'
import Link from 'next/link'

interface Ingredient {
	name: string
	unit: string
	quantity: number | ''
}

interface NewRecipe {
	name: string
	isVegetarian: boolean
	isVegan: boolean
	ingredients: Ingredient[]
}

export default function Home() {
	const [recipes, setRecipes] = useState<Recipe[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])
	const [openAddRecipe, setOpenAddRecipe] = useState(false)
	const [newRecipe, setNewRecipe] = useState<NewRecipe>({
		name: '',
		isVegetarian: false,
		isVegan: false,
		ingredients: [],
	})

	// Загрузка рецептов при монтировании компонента
	useEffect(() => {
		const loadRecipes = async () => {
			try {
				const data = await fetchRecipes()
				setRecipes(data)
				setFilteredRecipes(data.slice(0, 10)) // Отображаем первые 10 рецептов по умолчанию
			} catch (error) {
				console.error('Ошибка при загрузке рецептов:', error)
			}
		}

		loadRecipes()
	}, [])

	// Обработчик изменения поискового запроса
	const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const value = event.target.value
		setSearchTerm(value)

		const filtered = recipes.filter(recipe =>
			recipe.name.toLowerCase().includes(value.toLowerCase())
		)

		setFilteredRecipes(filtered.slice(0, 10)) // Ограничиваем до 10 рецептов
	}

	// Обработчики для добавления рецепта
	const handleOpenAddRecipe = () => {
		setOpenAddRecipe(true)
	}

	const handleCloseAddRecipe = () => {
		setOpenAddRecipe(false)
		setNewRecipe({
			name: '',
			isVegetarian: false,
			isVegan: false,
			ingredients: [],
		})
	}

	const handleSaveRecipe = () => {
		// Отправка newRecipe на бэкэнд
		console.log('Новый рецепт:', newRecipe)
		handleCloseAddRecipe()
	}

	// Обработчик добавления ингредиента
	const handleAddIngredient = () => {
		setNewRecipe(prevState => ({
			...prevState,
			ingredients: [
				...prevState.ingredients,
				{ name: '', unit: '', quantity: '' },
			],
		}))
	}

	// Обработчик изменения ингредиента
	const handleIngredientChange = (
		index: number,
		field: keyof Ingredient,
		value: string | number | ''
	) => {
		const updatedIngredients = newRecipe.ingredients.map((ingredient, i) =>
			i === index ? { ...ingredient, [field]: value } : ingredient
		)
		setNewRecipe(prevState => ({
			...prevState,
			ingredients: updatedIngredients,
		}))
	}

	// Обработчик удаления ингредиента
	const handleRemoveIngredient = (index: number) => {
		const updatedIngredients = newRecipe.ingredients.filter(
			(_, i) => i !== index
		)
		setNewRecipe(prevState => ({
			...prevState,
			ingredients: updatedIngredients,
		}))
	}

	return (
		<div style={{ display: 'flex' }}>
			{/* Левая часть экрана */}
			<div style={{ flex: 1, padding: '20px' }}>
				<h1>Поиск рецептов</h1>
				<input
					type='text'
					value={searchTerm}
					onChange={handleSearchChange}
					placeholder='Введите название рецепта'
					style={{ width: '70%', padding: '10px', fontSize: '18px' }}
				/>
				<button
					onClick={handleOpenAddRecipe}
					style={{ marginTop: '25px', padding: '10px', fontSize: '20px' }}
				>
					Новый рецепт
				</button>

				{/* Форма добавления рецепта */}
				{openAddRecipe && (
					<div
						style={{
							marginTop: '20px',
							padding: '10px',
							border: '1px solid #ccc',
						}}
					>
						<h2>Добавить новый рецепт</h2>
						<input
							type='text'
							value={newRecipe.name}
							onChange={e =>
								setNewRecipe({ ...newRecipe, name: e.target.value })
							}
							placeholder='Название рецепта'
							style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
						/>
						<div>
							<label>
								<input
									type='checkbox'
									checked={newRecipe.isVegetarian}
									onChange={e =>
										setNewRecipe({
											...newRecipe,
											isVegetarian: e.target.checked,
										})
									}
								/>
								Вегетарианский
							</label>
							<label style={{ marginLeft: '20px' }}>
								<input
									type='checkbox'
									checked={newRecipe.isVegan}
									onChange={e =>
										setNewRecipe({ ...newRecipe, isVegan: e.target.checked })
									}
								/>
								Веганский
							</label>
						</div>
						<h3>Ингредиенты</h3>
						{newRecipe.ingredients.map((ingredient, index) => (
							<div
								key={index}
								style={{
									marginBottom: '10px',
									border: '1px solid #eee',
									padding: '10px',
									position: 'relative',
								}}
							>
								<button
									onClick={() => handleRemoveIngredient(index)}
									style={{ position: 'absolute', top: '5px', right: '5px' }}
								>
									Удалить
								</button>
								<input
									type='text'
									placeholder='Название'
									value={ingredient.name}
									onChange={e =>
										handleIngredientChange(index, 'name', e.target.value)
									}
									style={{ width: '30%', padding: '5px', marginRight: '10px' }}
								/>
								<input
									type='text'
									placeholder='Единица измерения'
									value={ingredient.unit}
									onChange={e =>
										handleIngredientChange(index, 'unit', e.target.value)
									}
									style={{ width: '30%', padding: '5px', marginRight: '10px' }}
								/>
								<input
									type='number'
									placeholder='Количество'
									value={ingredient.quantity}
									onChange={e =>
										handleIngredientChange(
											index,
											'quantity',
											e.target.value === '' ? '' : Number(e.target.value)
										)
									}
									style={{ width: '30%', padding: '5px' }}
								/>
							</div>
						))}
						<button onClick={handleAddIngredient}>Добавить ингредиент</button>
						<div style={{ marginTop: '10px' }}>
							<button onClick={handleSaveRecipe}>Сохранить</button>
							<button
								onClick={handleCloseAddRecipe}
								style={{ marginLeft: '10px' }}
							>
								Отмена
							</button>
						</div>
					</div>
				)}
			</div>

			{/* Правая часть экрана */}
			<div style={{ flex: 1, padding: '20px' }}>
				<h1>Список рецептов</h1>
				{filteredRecipes.length > 0 ? (
					<ul style={{ listStyleType: 'none', padding: 0 }}>
						{filteredRecipes.map(recipe => (
							<li
								key={recipe.recipeID}
								style={{
									marginBottom: '20px',
									borderBottom: '1px solid #ccc',
									paddingBottom: '10px',
								}}
							>
								<h2>
									<Link href={`/recipes/${recipe.recipeID}`}>
										{recipe.name}
									</Link>
								</h2>
								<p>Вегетарианский: {recipe.isVegetarian ? 'Да' : 'Нет'}</p>
								<p>Веганский: {recipe.isVegan ? 'Да' : 'Нет'}</p>
							</li>
						))}
					</ul>
				) : (
					<p>Рецепты не найдены.</p>
				)}
			</div>
		</div>
	)
}
