import { useEffect, useRef, useState } from 'react';

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
	const searchElem = useRef(null);

	useEffect(function () {
		// functionality to focus the search input when the app starts
		// notice that we set .focus() in useEffect because the searchElem
		// will exist only after this Search component is committed to DOM
		searchElem.current.focus();
	}, []);

	return (
		<input
			className="search"
			type="text"
			placeholder="Search movies..."
			value={query}
			onChange={e => handleQuery(e.target.value)}
			ref={searchElem}
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
