import { useEffect, useState } from 'react';
import './index.css';

import { Navbar, Logo, Search, NumResults } from './components/Navbar';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedList from './components/WatchedList';
import Loader from './components/Loader';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function App() {
	const [query, setQuery] = useState('');
	const [movies, setMovies] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	const [watched, setWatched] = useState(function () {
		return JSON.parse(localStorage.getItem('watched'));
	});

	const [activeMovieId, setActiveMovieId] = useState('');
	const userMovieRating = watched?.find(
		movie => movie.imdbID === activeMovieId
	)?.userRating;

	function handleSelectMovie(id) {
		setActiveMovieId(activeId => (id === activeId ? null : id));
	}

	function handleCloseMovieDetails() {
		setActiveMovieId(null);
	}

	function handleAddWatchedMovie(movie) {
		setWatched(watched => [...watched, movie]);
	}

	function handleDeleteWatched(movieId) {
		setWatched(watched => watched.filter(m => m.imdbID !== movieId));
	}

	useEffect(
		function () {
			localStorage.setItem('watched', JSON.stringify(watched));
		},
		[watched]
	);

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
			handleCloseMovieDetails();

			return function () {
				controller.abort();
			};
		},
		[query]
	);

	return (
		<>
			<Navbar>
				<Logo />
				<Search query={query} handleQuery={setQuery} />
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<Box>
					{isLoading && <Loader />}
					{error && <ErrorMessage message={error} />}
					{!isLoading && !error && (
						<MovieList movies={movies} onSelectMovie={handleSelectMovie} />
					)}
				</Box>

				<Box>
					{activeMovieId ? (
						<MovieDetails
							key={activeMovieId}
							movieId={activeMovieId}
							userMovieRating={userMovieRating}
							onCloseMovieDetails={handleCloseMovieDetails}
							onAddWatchedMovie={handleAddWatchedMovie}
						/>
					) : (
						<>
							<WatchedSummary watched={watched} />
							<WatchedList
								watched={watched}
								onDeleteWatched={handleDeleteWatched}
							/>
						</>
					)}
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

function ErrorMessage({ message }) {
	return (
		<p className="error">
			<span>⛔️</span> {message}
		</p>
	);
}
