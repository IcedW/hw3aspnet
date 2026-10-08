import { useEffect, useState } from 'react'
import MovieList from './components/MovieList.jsx'
import MovieForm from './components/MovieForm.jsx'
import LanguageSwitcher from './components/LanguageSwitcher.jsx'
import { getMovies, getMovieTranslations, createMovie, updateMovie, deleteMovie } from './api.js'
import { useI18n } from './i18n/I18nContext.jsx'

export default function App() {
  const { language, t } = useI18n()
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

  // Список перезавантажується при зміні мови: бекенд повертає тексти фільмів обраною мовою
  useEffect(loadMovies, [language])

  function openCreateForm() {
    setEditingMovie(null)
    setFormError(null)
    setShowForm(true)
  }

  // Для редагування потрібні всі переклади фільму, а не лише поточна мова
  async function openEditForm(movie) {
    try {
      const full = await getMovieTranslations(movie.id)
      setEditingMovie(full)
      setFormError(null)
      setShowForm(true)
    } catch (err) {
      alert(err.message)
    }
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
    if (!confirm(t('app.confirmDelete'))) return
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
        <h1>{t('app.title')}</h1>
        <div className="header-controls">
          <LanguageSwitcher />
          {!showForm && <button onClick={openCreateForm}>{t('app.addMovie')}</button>}
        </div>
      </header>

      {loading && <p>{t('app.loading')}</p>}
      {loadError && <p className="error">{t('app.loadError', { error: loadError })}</p>}

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
