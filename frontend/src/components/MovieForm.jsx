import { useState, useEffect } from 'react'

const emptyForm = { title: '', director: '', genre: '', releaseYear: '', description: '', poster: null }

export default function MovieForm({ initialMovie, onSubmit, onCancel, errorMessage }) {
  const [form, setForm] = useState(emptyForm)

  useEffect(() => {
    if (initialMovie) {
      setForm({
        title: initialMovie.title,
        director: initialMovie.director,
        genre: initialMovie.genre,
        releaseYear: initialMovie.releaseYear,
        description: initialMovie.description,
        poster: null,
      })
    } else {
      setForm(emptyForm)
    }
  }, [initialMovie])

  function handleChange(e) {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
  }

  function handleFileChange(e) {
    setForm((prev) => ({ ...prev, poster: e.target.files[0] || null }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onSubmit(form)
  }

  return (
    <form className="movie-form" onSubmit={handleSubmit}>
      <h2>{initialMovie ? 'Редагування фільму' : 'Новий фільм'}</h2>
      {errorMessage && <p className="error">{errorMessage}</p>}

      <label>
        Назва
        <input name="title" value={form.title} onChange={handleChange} required maxLength={200} />
      </label>

      <label>
        Режисер
        <input name="director" value={form.director} onChange={handleChange} required maxLength={100} />
      </label>

      <label>
        Жанр
        <input name="genre" value={form.genre} onChange={handleChange} required maxLength={50} />
      </label>

      <label>
        Рік випуску
        <input
          type="number"
          name="releaseYear"
          value={form.releaseYear}
          onChange={handleChange}
          required
          min={1888}
          max={2100}
        />
      </label>

      <label>
        Опис
        <textarea name="description" value={form.description} onChange={handleChange} required maxLength={2000} rows={4} />
      </label>

      <label>
        Постер {initialMovie ? '(залиште порожнім, щоб не змінювати)' : ''}
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </label>

      <div className="actions">
        <button type="submit">Зберегти</button>
        <button type="button" onClick={onCancel}>Скасувати</button>
      </div>
    </form>
  )
}
