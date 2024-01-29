import { useState, useEffect } from 'react';

// this hook will work the exactly same way as useState
// except that it will only store the local storage to store state
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
