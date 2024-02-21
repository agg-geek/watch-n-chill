import { useEffect, useRef, useState } from 'react';
import { useKey } from '../hooks/useKey';

export function Navbar({ children }) {
	return <nav className="nav-bar">{children}</nav>;
}

export function Logo() {
	return (
		<div className="logo">
			<span role="img">🍿</span>
			<h1>Watch-n-chill</h1>
		</div>
	);
}

export function Search({ query, handleQuery }) {
	const searchElem = useRef(null);

	useEffect(function () {
		searchElem.current.focus();
	}, []);

	useKey('Enter', function () {
		if (document.activeElement === searchElem.current) return;
		searchElem.current.focus();
		handleQuery('');
	});

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
