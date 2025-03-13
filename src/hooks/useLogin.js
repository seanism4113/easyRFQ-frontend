import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../api/mainApi";
import AuthContext from "../context/AuthContext";

/**
 * Custom hook for handling user login.
 *
 * This hook manages authentication by interacting with the API,
 * updating authentication state, and handling navigation upon successful login.
 */
const useLogin = () => {
	const [error, setError] = useState(""); // State to track login errors
	const { login, loading } = useContext(AuthContext); // Get login function and loading state from AuthContext
	const navigate = useNavigate(); // Hook to handle navigation

	/**
	 * Handles user login by sending credentials to the API.
	 *
	 * @param {string} email - The user's email.
	 * @param {string} password - The user's password.
	 */
	const handleLogin = async (email, password) => {
		try {
			// Authenticate user via API
			const { token } = await EasyRFQApi.authenticateUser(email, password);

			// Update authentication state with the received token
			login(token);

			// Redirect user to the home page after successful login
			navigate("/");
		} catch (err) {
			console.error("Login failed:", err);
			setError("Invalid email or password."); // Set an error message for invalid login
		}
	};

	// Return the login function, error state, and loading state for use in components
	return { handleLogin, error, setError, loading };
};

export default useLogin;
