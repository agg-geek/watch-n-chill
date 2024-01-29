import { useEffect, useState } from 'react';
import './index.css';

import { Navbar, Logo, Search, NumResults } from './components/Navbar';
import MovieList from './components/MovieList';
import WatchedSummary from './components/WatchedSummary';
import WatchedList from './components/WatchedList';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function App() {
	const [movies, setMovies] = useState([]);
	const [watched, setWatched] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState('');
	const tempQuery = 'interstellar';

	// useEffect cannot use async fns directly as async fn returns a promise
	useEffect(function () {
		async function fetchMovies() {
			try {
				setIsLoading(true);

				// prettier-ignore
				const res = await fetch(`http://www.omdbapi.com/?apikey=${API_KEY}&s=${tempQuery}`);
				if (!res.ok) throw new Error('Something went wrong');

				const data = await res.json();
				if (data.Response === 'False') throw new Error(data.Error);

				setMovies(data.Search);
			} catch (err) {
				setError(err.message);
			} finally {
				setIsLoading(false);
			}
		}
		fetchMovies();
	}, []);

	return (
		<>
			<Navbar>
				<Logo />
				<Search />
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{error && <ErrorMessage message={error} />}
					{!isLoading && !error && <MovieList movies={movies} />}
				</Box>

				<Box>
					<WatchedSummary watched={watched} />
					<WatchedList watched={watched} />
				</Box>
			</Main>
		</>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function Box({ children }) {
	const [isOpen, setIsOpen] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen(open => !open)}>
				{isOpen ? '–' : '+'}
			</button>
			{isOpen && children}
		</div>
	);
}

function Loader() {
	return <p className="loader">Loading...</p>;
}

// ErrorMessage because Error keyword already exists in JS
function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔️</span> {message}
		</p>
	);
}
