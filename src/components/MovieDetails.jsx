export default function MovieDetails({ movieId, onCloseMovieDetails }) {
	return (
		<div className="details">
			{movieId}
			<button className="btn-back" onClick={onCloseMovieDetails}>
				&larr;
			</button>
		</div>
	);
}
