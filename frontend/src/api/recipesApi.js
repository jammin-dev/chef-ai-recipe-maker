import axios from "axios";
import { ROOTURL } from "@/constants";

// Base URL for your API
// const BASE_URL = "http://192.168.1.212:8000/api/v1/"; // Replace with your actual API base URL
const BASE_URL = ROOTURL;
const getToken = () => {
  return localStorage.getItem("jwt");
};

// Create an Axios instance with the Authorization header
const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${getToken()}`, // Attach JWT token to the Authorization header
  },
});
// Interceptor to dynamically add Authorization header before each request
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt"); // Get the latest token
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`; // Attach token to the request header
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
// Function to get all recipes
export const getAllRecipes = async () => {
  try {
    const response = await axiosInstance.get("/recipes/"); // API endpoint to get all recipes
    return response.data; // Return or process the data as needed
  } catch (error) {
    console.error("Error fetching recipes:", error);
    // Handle error, maybe show a notification or alert the user
  }
};

export const getRecipe = async (recipeId) => {
  try {
    const response = await axiosInstance.get(`/recipes/${recipeId}`); // API endpoint to get a single recipe
    return response.data; // Return or process the data as needed
  } catch (error) {
    console.error("Error fetching recipe:", error);
    // Handle error, maybe show a notification or alert the user
  }
};

export const createRecipe = async (recipe) => {
  try {
    const response = await axiosInstance.post("/recipes/", recipe); // API endpoint to create a recipe
    return response.data; // Return or process the data as needed
  } catch (error) {
    console.error("Error creating recipe:", error);
    // Handle error, maybe show a notification or alert the user
  }
};

export const deleteRecipe = async (uuid) => {
  try {
    const response = await axiosInstance.delete(`/recipes/${uuid}/`);
    return response.data;
  } catch (error) {
    console.error(
      "Error deleting recipe:",
      error.status,
      error.code,
      error.message
    );
  }
};

export const updateRecipe = async (recipeId, updatedRecipe) => {
  try {
    const response = await axiosInstance.put(
      `/recipes/${recipeId}/`,
      updatedRecipe
    ); // API endpoint to update a recipe
    return response.data; // Return or process the data as needed
  } catch (error) {
    console.error("Error updating recipe:", error);
    // Handle error, maybe show a notification or alert the user
  }
};
