import { useState, useEffect } from 'react';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export function useMovies(query) {
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	useEffect(
		function () {
			const controller = new AbortController();

			async function fetchMovies() {
				try {
					setIsLoading(true);
					setError('');

					const res = await fetch(
						`http://www.omdbapi.com/?apikey=${API_KEY}&s=${query}`,
						{ signal: controller.signal }
					);
					if (!res.ok) throw new Error('Something went wrong');

					const data = await res.json();
					if (data.Response === 'False') throw new Error(data.Error);

					setMovies(data.Search);
				} catch (err) {
					if (err.name !== 'AbortError') {
						setError(err.message);
					}
				} finally {
					setIsLoading(false);
				}
			}

			if (!query.length) {
				setError('');
				setMovies([]);
				return;
			}

			fetchMovies();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return { movies, isLoading, error };
}
