import { useEffect, useRef, useState } from 'react';
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

	// DEMO: Refs to persist data between re-renders
	// say we want to store the number of times the user clicks on the star rating
	// since userRating is a state variable which will rerender state
	// we cannot use a normal variable cnt as it will reset to 0 on rerender

	const numRatings = useRef(0);

	useEffect(
		function () {
			// change numRatings only when the user has actually rated
			// you need the if condition (check!)
			if (userRating) numRatings.current++;
		},
		[userRating]
	);

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
			numRatings,
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

	useEffect(
		function () {
			function closeMovieOnEscape(evt) {
				if (evt.code === 'Escape') onCloseMovieDetails();
			}

			document.addEventListener('keydown', closeMovieOnEscape);

			return function () {
				document.removeEventListener('keydown', closeMovieOnEscape);
			};
		},
		[onCloseMovieDetails]
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
