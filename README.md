# Кінопошук — WebApi + React

Проєкт переведено з ASP.NET Core MVC на **ASP.NET Core WebApi**: контролер `MoviesController`
більше не повертає HTML-сторінки — усі методи (`GET`, `GET /{id}`, `POST`, `PUT`, `DELETE`)
повертають JSON. Доступ до даних, як і раніше, здійснюється лише через шари
`Service → IRepository/UnitOfWork → DbContext`, контролер напряму з `DbContext` не працює.

## Структура репозиторію

```
backend/   — ASP.NET Core WebApi (.NET 10, EF Core, SQL Server)
frontend/  — React (Vite) додаток, який звертається до API
```

## Запуск бекенду (WebApi)

```bash
cd backend
dotnet restore
dotnet ef database update   # застосувати міграції (потрібен dotnet-ef)
dotnet run
```

API буде доступне на `http://localhost:5253/api/movies` (порт — з `Properties/launchSettings.json`).

Ендпоінти:

| Метод  | Маршрут              | Опис                                   |
|--------|-----------------------|-----------------------------------------|
| GET    | /api/movies            | усі фільми                              |
| GET    | /api/movies/{id}        | один фільм за id                        |
| POST   | /api/movies            | створити фільм (multipart/form-data)    |
| PUT    | /api/movies/{id}        | оновити фільм (multipart/form-data)     |
| DELETE | /api/movies/{id}        | видалити фільм                          |

## Запуск фронтенду (React)

```bash
cd frontend
npm install
npm run dev
```

Додаток відкриється на `http://localhost:5173` і звертатиметься до API за адресою,
вказаною у `frontend/.env` (`VITE_API_URL`, за замовчуванням `http://localhost:5253/api`).

CORS на бекенді дозволяє звернення саме з `http://localhost:5173` (налаштування —
у `backend/appsettings.json`, секція `Cors:AllowedOrigins`).
