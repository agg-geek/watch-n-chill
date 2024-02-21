import { useState, useEffect } from 'react';

export function useLocalStorage(initialState, localKey) {
	const [value, setValue] = useState(function () {
		const storedData = JSON.parse(localStorage.getItem(localKey));
		return storedData ? storedData : initialState;
	});

	useEffect(
		function () {
			localStorage.setItem(localKey, JSON.stringify(value));
		},
		[value, localKey]
	);

	return [value, setValue];
}
