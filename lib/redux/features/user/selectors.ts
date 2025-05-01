import { RootState } from "../../store";

// Basic selectors
export const selectUserData = (state: RootState) => state.user.userData;
export const selectUserLoading = (state: RootState) => state.user.loading;
export const selectUserError = (state: RootState) => state.user.error;

// Derived selectors
export const selectUser = (state: RootState) => state.user.userData?.data;
export const selectIsAuthenticated = (state: RootState) => 
  !!state.user.userData?.data?._id;
// export const selectUsername = (state: RootState) => 
//   state.user.userData?.data?.username;
// export const selectEducation = (state: RootState) => 
//   state.user.userData?.data?.education || [];
// export const selectExperience = (state: RootState) => 
//   state.user.userData?.data?.experience || [];
