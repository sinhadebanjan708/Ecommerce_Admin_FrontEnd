import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMeRequest, loginRequest } from "../../api/authApi";

const TOKEN_KEY = "token";

// export const loginUser = createAsyncThunk(
//   "auth/login",
//   async (credentials, { rejectWithValue }) => {
//     try {
//       return await loginRequest(credentials);
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );

// export const fetchMe = createAsyncThunk(
//   "auth/fetchMe",
//   async (_, { rejectWithValue }) => {
//     try {
//       return await getMeRequest();
//     } catch (err) {
//       return rejectWithValue(err.message);
//     }
//   }
// );
const storedToken = localStorage.getItem("access-token");
const storedUser = localStorage.getItem("user");
const initialState = {
  token: storedToken && storedToken !== "undefined" ? storedToken : null,
  loggedInUser:
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  user:
    storedUser && storedUser !== "undefined" ? JSON.parse(storedUser) : null,
  isAuthenticated: Boolean(storedToken && storedToken !== "undefined"),
  status: "idle", // idle | loading | succeeded | failed
  error: null,
  availableUser: null,
  emailId: null
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.user = null;
      state.isAuthenticated = false;
      state.status = "idle";
      state.emailId = null;
      state.availableUser = null;
      state.error = null;
      localStorage.removeItem(TOKEN_KEY);
      localStorage.clear();
    },
    // Dispatched by the axios response interceptor on a 401
    sessionExpired(state) {
      state.token = null;
      state.user = null;
      localStorage.removeItem(TOKEN_KEY);
    },
    storeEmailId(state,action){
      state.emailId = action.payload
    },
    loginSuccess: (state, action) => {
      state.loading = false;

      state.loggedInUser = action.payload.user;
      state.isAuthenticated = true;
      state.token = action.payload.accessToken;
      state.menus = action.payload.menus || [];

      localStorage.setItem("access-token", action.payload.accessToken);

      localStorage.setItem("refresh-token", action.payload.refreshToken);
      localStorage.setItem("user", JSON.stringify(action.payload.user));

      localStorage.setItem("permissions", JSON.stringify(action.payload.permissions || []));
    },
    checkUserAvailable : (state, action) => {
      state.availableUser = action.payload
    }
  },
  // extraReducers: (builder) => {
  //   builder
  //     // login
  //     .addCase(loginUser.pending, (state) => {
  //       state.status = "loading";
  //       state.error = null;
  //     })
  //     .addCase(loginUser.fulfilled, (state, action) => {
  //       const { accessToken, ...user } = action.payload;
  //       state.status = "succeeded";
  //       state.token = accessToken;
  //       state.user = user;
  //       localStorage.setItem(TOKEN_KEY, accessToken);
  //     })
  //     .addCase(loginUser.rejected, (state, action) => {
  //       state.status = "failed";
  //       state.error = action.payload || "Login failed";
  //     })
  //     // fetch current user (used to restore session after a page refresh)
  //     .addCase(fetchMe.fulfilled, (state, action) => {
  //       state.user = action.payload;
  //     });
  // },
});

export const { logout, sessionExpired , loginSuccess, checkUserAvailable , storeEmailId} = authSlice.actions;
export default authSlice.reducer;
