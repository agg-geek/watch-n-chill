import { useEffect, useState } from 'react';
import { useMovies } from './hooks/useMovies';
import './index.css';

import { Navbar, Logo, Search, NumResults } from './components/Navbar';
import MovieList from './components/MovieList';
import MovieDetails from './components/MovieDetails';
import WatchedSummary from './components/WatchedSummary';
import WatchedList from './components/WatchedList';
import Loader from './components/Loader';

export default function App() {
	const [query, setQuery] = useState('');
	const { movies, isLoading, error } = useMovies(query);

	const [watched, setWatched] = useState(function () {
		// if you clear the local storage, then JSON.parse(null) returns null
		// watched will be then null instead of [], which creates problems
		const watchedData = JSON.parse(localStorage.getItem('watched'));
		return watchedData ? watchedData : [];
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
