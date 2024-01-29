import { useEffect, useState } from 'react';
import StarRating from './StarRating';
import Loader from './Loader';

const API_KEY = import.meta.env.VITE_OMDB_API_KEY;

export default function MovieDetails({
	movieId,
	onCloseMovieDetails,
	onAddWatchedMovie,
	userMovieRating,
}) {
	const [movie, setMovie] = useState({});
	const [isLoading, setIsLoading] = useState(false);
	const [userRating, setUserRating] = useState('');

	const {
		Title: title,
		Year: year,
		Poster: poster,
		Runtime: runtime,
		imdbRating,
		Plot: plot,
		Released: released,
		Actors: actors,
		Director: director,
		Genre: genre,
	} = movie;

	function handleAddWatched() {
		const newWatchedMovie = {
			imdbID: movieId,
			title,
			year,
			poster,
			imdbRating: Number(imdbRating),
			runtime: Number(runtime.split(' ')[0]),
			userRating,
		};

		onAddWatchedMovie(newWatchedMovie);
		onCloseMovieDetails();
	}

	useEffect(
		function () {
			async function getMovieDetails() {
				setIsLoading(true);

				const res = await fetch(
					`http://www.omdbapi.com/?apikey=${API_KEY}&i=${movieId}`
				);

				const data = await res.json();
				setMovie(data);
				setIsLoading(false);
			}
			getMovieDetails();
		},
		[movieId]
	);

	useEffect(
		function () {
			if (!title) return;
			document.title = `Movie | ${title}`;

			return function () {
				document.title = 'Watch-n-chill';
			};
		},
		[title]
	);

	return (
		<div className="details">
			{isLoading ? (
				<Loader />
			) : (
				<>
					<header>
						<button className="btn-back" onClick={onCloseMovieDetails}>
							&larr;
						</button>
						<img src={poster} alt={`Poster of ${movie} movie`} />
						<div className="details-overview">
							<h2>{title}</h2>
							<p>
								{released} &bull; {runtime}
							</p>
							<p>{genre}</p>
							<p>
								<span>⭐️</span>
								{imdbRating} IMDb rating
							</p>
						</div>
					</header>
					<section>
						<div className="rating">
							{userMovieRating ? (
								<p>You rated this movie {userMovieRating} ⭐️</p>
							) : (
								<>
									<StarRating
										maxRating={10}
										size={24}
										onSetRating={setUserRating}
									/>
									{userRating > 0 && (
										<button
											className="btn-add"
											onClick={handleAddWatched}
										>
											+ Add to list
										</button>
									)}
								</>
							)}
						</div>
						<p>
							<em>{plot}</em>
						</p>
						<p>Starring {actors}</p>
						<p>Directed by {director}</p>
					</section>
				</>
			)}
		</div>
	);
}
