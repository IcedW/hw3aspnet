import { useEffect, useState } from 'react'
import MovieList from './components/MovieList.jsx'
import MovieForm from './components/MovieForm.jsx'
import { getMovies, createMovie, updateMovie, deleteMovie } from './api.js'

export default function App() {
  const [movies, setMovies] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(null)
  const [showForm, setShowForm] = useState(false)
  const [editingMovie, setEditingMovie] = useState(null)
  const [formError, setFormError] = useState(null)

  function loadMovies() {
    setLoading(true)
    getMovies()
      .then((data) => {
        setMovies(data)
        setLoadError(null)
      })
      .catch((err) => setLoadError(err.message))
      .finally(() => setLoading(false))
  }

  useEffect(loadMovies, [])

  function openCreateForm() {
    setEditingMovie(null)
    setFormError(null)
    setShowForm(true)
  }

  function openEditForm(movie) {
    setEditingMovie(movie)
    setFormError(null)
    setShowForm(true)
  }

  async function handleSubmit(form) {
    try {
      if (editingMovie) {
        await updateMovie(editingMovie.id, form)
      } else {
        await createMovie(form)
      }
      setShowForm(false)
      loadMovies()
    } catch (err) {
      setFormError(err.message)
    }
  }

  async function handleDelete(id) {
    if (!confirm('Видалити цей фільм?')) return
    try {
      await deleteMovie(id)
      loadMovies()
    } catch (err) {
      alert(err.message)
    }
  }

  return (
    <div className="app">
      <header>
        <h1>Кінопошук</h1>
        {!showForm && <button onClick={openCreateForm}>+ Додати фільм</button>}
      </header>

      {loading && <p>Завантаження...</p>}
      {loadError && <p className="error">Не вдалося завантажити фільми: {loadError}</p>}

      {!loading && !loadError && !showForm && (
        <MovieList movies={movies} onEdit={openEditForm} onDelete={handleDelete} />
      )}

      {showForm && (
        <MovieForm
          initialMovie={editingMovie}
          onSubmit={handleSubmit}
          onCancel={() => setShowForm(false)}
          errorMessage={formError}
        />
      )}
    </div>
  )
}
