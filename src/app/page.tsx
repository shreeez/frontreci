// src/app/page.tsx

'use client'

import React, { useState, useEffect } from 'react'
import { Recipe } from '../types/types'
import { fetchRecipes } from '../services/recipeService'
import Link from 'next/link'

export default function Home() {
	const [recipes, setRecipes] = useState<Recipe[]>([])
	const [searchTerm, setSearchTerm] = useState('')
	const [filteredRecipes, setFilteredRecipes] = useState<Recipe[]>([])

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
					style={{ width: '100%', padding: '10px', fontSize: '16px' }}
				/>
			</div>

			{/* Правая часть экрана */}
			<div style={{ flex: 1, padding: '20px' }}>
				<h1>Список рецептов</h1>
				{filteredRecipes.length > 0 ? (
					<ul>
						{filteredRecipes.map(recipe => (
							<li key={recipe.recipeID}>
								<h2>
                  <Link href={`/recipes/${recipe.recipeID}`}>{recipe.name}</Link>
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
