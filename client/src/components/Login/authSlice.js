import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import userApi from "../../api/userApi";
import Cookies from "js-cookie";

const initialState = {
  isLogging: false,
  currentUser: undefined,
};

export const login = createAsyncThunk(
  "auth/login",
  async (payload, { fulfillWithValue, rejectWithValue }) => {
    try {
      const response = await userApi.login(payload);
      return response.message;
    } catch (error) {
      const errorObj = JSON.parse(error.request.response);
      return rejectWithValue(errorObj);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.isLogging = false;
      state.currentUser = undefined;
      localStorage.removeItem("user");
      Cookies.remove("cookieLogin");
    },
  },
  extraReducers: (builder) => {
    builder.addCase(login.fulfilled, (state, action) => {
      const payload = action.payload;
      state.currentUser = payload;
      localStorage.setItem("user", JSON.stringify(payload));
      Cookies.set("cookieLogin", payload.token);
    });
    builder.addCase(login.rejected, (state, action) => {
      console.log(action.payload);
    });
  },
});

export const authActions = authSlice.actions;

export const selectCurrentUser = (state) => state.auth.currentUser;

const authReducer = authSlice.reducer;
export default authReducer;
