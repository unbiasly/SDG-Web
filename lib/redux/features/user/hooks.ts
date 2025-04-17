import React from "react";
import { useAppSelector, useAppDispatch } from "../../hooks";
import { 
  selectUser, 
  selectUserLoading, 
  selectUserError, 
  selectIsAuthenticated,
  selectExperience,
  selectEducation
} from "./selectors";
import { 
  fetchUserStart, 
  fetchUserSuccess, 
  fetchUserFailure,
  updateUserDetails,
//   addEducation,
//   addExperience,
  setFallbackColor
} from "./userSlice";
import { UserResponse, Education, Experience } from "@/service/api.interface";

const generateRandomColor = () => {
  const randomColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
  return randomColor;
};

export const useUser = () => {
  const user = useAppSelector(selectUser);
  const userLoading = useAppSelector(selectUserLoading);
  const error = useAppSelector(selectUserError);
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const experience = useAppSelector(selectExperience);
  const education = useAppSelector(selectEducation);
  
  const dispatch = useAppDispatch();

  
  // Function to update user details
  const updateUser = (details: Partial<UserResponse['data']>) => {
    dispatch(updateUserDetails(details));
  };
  
  // Functions to add education and experience
//   const addUserEducation = (edu: Education) => {
//     dispatch(addEducation(edu));
//   };
  
//   const addUserExperience = (exp: Experience) => {
//     dispatch(addExperience(exp));
//   };
  
  return {
    user,
    userLoading,
    error,
    isAuthenticated,
    experience,
    selectExperience,
    selectEducation,
    education,
    updateUser,
    // addUserEducation,
    // addUserExperience
  };
}; 

