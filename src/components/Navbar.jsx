import { useState } from 'react';

export function Navbar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

export function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>usePopcorn</h1>
		</div>
	);
}

export function Search({ query, handleQuery }) {
	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => handleQuery(e.target.value)}
		/>
	);
}

export function NumResults({ movies }) {
	return (
		<p className="num-results">
			Found <strong>{movies.length}</strong> results
		</p>
	);
}
