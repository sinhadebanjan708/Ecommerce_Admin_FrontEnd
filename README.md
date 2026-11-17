# React 18 + Redux Toolkit + React Router + Axios

## Run

```bash
npm install
npm run dev
```

Open http://localhost:5173

Demo login (dummyjson.com): `emilys` / `emilyspass` (pre-filled on the login form).

## Structure

```
src/
  api/
    axiosInstance.js   axios.create + request/response interceptors
    authApi.js         login, me
    postsApi.js        posts list
  store/
    index.js           configureStore
    slices/            authSlice, postsSlice (createAsyncThunk)
  routes/
    AppRoutes.jsx      route tree
    PublicRoute.jsx    guests only  -> <Outlet /> or redirect to /dashboard
    ProtectedRoute.jsx logged in    -> <Outlet /> or redirect to /login
  layouts/             PublicLayout, ProtectedLayout (both render <Outlet />)
  pages/               Login, Dashboard, Posts, NotFound
```

## Config

The API base URL lives in `.env` as `VITE_API_BASE_URL`. Change it to point at your own backend.
Auth thunks expect `POST /auth/login` to return `{ accessToken, ...user }` and `GET /auth/me` to return the user.
Adjust `src/store/slices/authSlice.js` if your backend's response shape differs.
