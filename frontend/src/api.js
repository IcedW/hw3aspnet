const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5253/api'

async function handleResponse(response) {
  if (response.status === 204) return null

  const isJson = response.headers.get('content-type')?.includes('application/json')
  const data = isJson ? await response.json() : null

  if (!response.ok) {
    const message = data?.message || data?.title || 'Сталася помилка при зверненні до API.'
    const error = new Error(message)
    error.details = data
    throw error
  }

  return data
}

export function getMovies() {
  return fetch(`${API_URL}/movies`).then(handleResponse)
}

export function getMovie(id) {
  return fetch(`${API_URL}/movies/${id}`).then(handleResponse)
}

function toFormData(movie) {
  const formData = new FormData()
  formData.append('Title', movie.title)
  formData.append('Director', movie.director)
  formData.append('Genre', movie.genre)
  formData.append('ReleaseYear', movie.releaseYear)
  formData.append('Description', movie.description)
  if (movie.poster) formData.append('Poster', movie.poster)
  return formData
}

export function createMovie(movie) {
  return fetch(`${API_URL}/movies`, {
    method: 'POST',
    body: toFormData(movie),
  }).then(handleResponse)
}

export function updateMovie(id, movie) {
  return fetch(`${API_URL}/movies/${id}`, {
    method: 'PUT',
    body: toFormData(movie),
  }).then(handleResponse)
}

export function deleteMovie(id) {
  return fetch(`${API_URL}/movies/${id}`, { method: 'DELETE' }).then(handleResponse)
}

export function posterUrl(path) {
  if (!path) return null
  const origin = new URL(API_URL).origin
  return origin + path
}
