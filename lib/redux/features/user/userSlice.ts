import { UserResponse, Experience, Education } from "@/service/api.interface";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define types based on your backend response

interface UserState {
    userData: UserResponse | null;
    loading: boolean;
    error: string | null;
}

const initialState: UserState = {
    userData: null,
    loading: false,
    error: null,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        fetchUserStart: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchUserSuccess: (state, action: PayloadAction<UserResponse>) => {
            state.userData = action.payload;
            state.loading = false;
            state.error = null;
        },
        fetchUserFailure: (state, action: PayloadAction<string>) => {
            state.loading = false;
            state.error = action.payload;
        },
        clearUserData: (state) => {
            state.userData = null;
        },
        updateUserDetails: (
            state,
            action: PayloadAction<Partial<UserResponse["data"]>>
        ) => {
            if (state.userData && state.userData.data) {
                state.userData.data = {
                    ...state.userData.data,
                    ...action.payload,
                };
            }
        },
    },
});

export const {
    fetchUserStart,
    fetchUserSuccess,
    fetchUserFailure,
    clearUserData,
    updateUserDetails,
} = userSlice.actions;

export default userSlice.reducer;
