export default function WatchedList({ watched }) {
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
