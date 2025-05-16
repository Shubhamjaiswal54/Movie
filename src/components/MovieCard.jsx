function MovieCard({ movie }) {
    const {  vote_average, poster_path, release_date, original_language } = movie;
    return (<div className="movie-card">
        <img src={poster_path ? `https://image.tmdb.org/t/p/w500/${poster_path}` : '/no-movie.png'} />

        <div className="mt-4">
            <h3>{movie.title || movie.name}</h3>

            <div className="content">
                <div className="rating">
                    <img src="/star.svg" alt="star" />
                    <p>{vote_average ? vote_average.toFixed(1) : 'N/A'}</p>
                </div>

                <span>.</span>
                <p className="year">
                    {release_date ? release_date : 'N/A'}
                </p>
                <p className="original-language">{original_language}</p>
            </div>
        </div>

    </div>);
}


export default MovieCard;