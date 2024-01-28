import { useState } from 'react';
import './index.css';
import { movieData, watchedData } from './../data';

const average = arr => arr.reduce((acc, cur, i, arr) => acc + cur / arr.length, 0);

// see problem below, before numResults function
// notice that the problem is fixed using component composition
// we're passing movies directly to NumResults and MovieList
export default function App() {
	const [movies, setMovies] = useState(movieData);
	return (
		<>
			<Navbar>
				<Logo />
				<Search />
				<NumResults movies={movies} />
			</Navbar>

			<Main>
				<SearchedBox>
					<MovieList movies={movies} />
				</SearchedBox>

				<WatchedBox />
			</Main>
		</>
	);
}

function Navbar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

function Search() {
	const [query, setQuery] = useState('');

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => setQuery(e.target.value)}
		/>
	);
}

// to fix the numResults thing here, you would have to pass movies to numResults,
// and movies is defined in MovieList rn so you'll have to lift the state up,
// and then pass movies all the way down
// 1. App -> Navbar -> NumResults
// 2. App -> Main -> SearchedBox -> MovieList
// since none of the intermediate components need the prop, this is Prop drilling
function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}

function Main({ children }) {
	return <main className="main">{children}</main>;
}

function SearchedBox({ children }) {
	const [isOpen1, setIsOpen1] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen1(open => !open)}>
				{isOpen1 ? '–' : '+'}
			</button>
			{isOpen1 && children}
		</div>
	);
}

function MovieList({ movies }) {
	return (
		<ul className="list">
			{movies?.map(movie => (
				<Movie movie={movie} />
			))}
		</ul>
	);
}

function Movie({ movie }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>🗓</span>
					<span>{movie.Year}</span>
				</p>
			</div>
		</li>
	);
}

function WatchedBox() {
	const [watched, setWatched] = useState(watchedData);
	const [isOpen2, setIsOpen2] = useState(true);

	return (
		<div className="box">
			<button className="btn-toggle" onClick={() => setIsOpen2(open => !open)}>
				{isOpen2 ? '–' : '+'}
			</button>
			{isOpen2 && (
				<>
					<WatchedSummary watched={watched} />
					<WatchedList watched={watched} />
				</>
			)}
		</div>
	);
}

function WatchedSummary({ watched }) {
	const avgImdbRating = average(watched.map(movie => movie.imdbRating));
	const avgUserRating = average(watched.map(movie => movie.userRating));
	const avgRuntime = average(watched.map(movie => movie.runtime));

	return (
		<div className="summary">
			<h2>Movies you watched</h2>
			<div>
				<p>
					<span>#️⃣</span>
					<span>{watched.length} movies</span>
				</p>
				<p>
					<span>⭐️</span>
					<span>{avgImdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{avgUserRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{avgRuntime} min</span>
				</p>
			</div>
		</div>
	);
}

function WatchedList({ watched }) {
	return (
		<ul className="list">
			{watched.map(movie => (
				<WatchedMovie movie={movie} />
			))}
		</ul>
	);
}

function WatchedMovie({ movie }) {
	return (
		<li key={movie.imdbID}>
			<img src={movie.Poster} alt={`${movie.Title} poster`} />
			<h3>{movie.Title}</h3>
			<div>
				<p>
					<span>⭐️</span>
					<span>{movie.imdbRating}</span>
				</p>
				<p>
					<span>🌟</span>
					<span>{movie.userRating}</span>
				</p>
				<p>
					<span>⏳</span>
					<span>{movie.runtime} min</span>
				</p>
			</div>
		</li>
	);
}
