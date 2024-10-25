// src/app/error.tsx
'use client'

export default function Error({
	error,
	reset,
}: {
	error: Error
	reset: () => void
}) {
	return (
		<div>
			<p>Ошибка: {error.message}</p>
			<button onClick={() => reset()}>Попробовать снова</button>
		</div>
	)
}
