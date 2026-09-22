import { posterUrl } from '../api.js'

export default function MovieList({ movies, onEdit, onDelete }) {
  if (movies.length === 0) {
    return <p className="empty">Фільмів поки немає. Додайте перший!</p>
  }

  return (
    <div className="movie-grid">
      {movies.map((movie) => (
        <div className="movie-card" key={movie.id}>
          {movie.posterPath ? (
            <img src={posterUrl(movie.posterPath)} alt={movie.title} className="poster" />
          ) : (
            <div className="poster poster-placeholder">Немає постера</div>
          )}
          <div className="movie-info">
            <h3>{movie.title} ({movie.releaseYear})</h3>
            <p><strong>Режисер:</strong> {movie.director}</p>
            <p><strong>Жанр:</strong> {movie.genre}</p>
            <p className="description">{movie.description}</p>
            <div className="actions">
              <button onClick={() => onEdit(movie)}>Редагувати</button>
              <button className="danger" onClick={() => onDelete(movie.id)}>Видалити</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
