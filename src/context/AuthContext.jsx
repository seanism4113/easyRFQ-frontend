import { createContext, useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode"; // Utility to decode JSON Web Tokens.
import { JoblyApi } from "../api/api"; // API wrapper for making backend calls.

// Create a React Context for authentication.
const AuthContext = createContext();

// The AuthProvider component wraps the application and provides authentication state and methods to all child components

export const AuthProvider = ({ children }) => {
	// State to store the authentication token using localStorage
	const [token, setToken] = useState(() => localStorage.getItem("token") || null);

	// State to store the current logged-in user's data.
	const [currentUser, setCurrentUser] = useState(null);

	// State to indicate whether authentication-related data is still loading.
	const [loading, setLoading] = useState(true);

	/**
	 * Synchronize the `token` state with localStorage and set it for API requests.
	 * - If `token` exists, save it to localStorage and set it for the API.
	 * - If `token` is null, remove it from localStorage and clear user data.
	 */
	const handleTokenChange = () => {
		if (token) {
			localStorage.setItem("token", token);
			JoblyApi.token = token;
		} else {
			localStorage.removeItem("token");
			setCurrentUser(null);
		}
	};

	/**
	 * Fetch the current user's data from the backend based on the token.
	 * - Decodes token to extract the username.
	 * - Fetches user data from the API and sets it in the state.
	 * - If fetching fails, clears the current user.
	 */
	const fetchCurrentUser = async () => {
		// No token means no user to fetch; stop loading.
		if (!token) {
			setLoading(false);
			return;
		}

		try {
			setLoading(true); // Start loading user data.
			const decodedToken = jwtDecode(token); // Decode the JWT to get user's info.
			const user = await JoblyApi.getUser(decodedToken.username); // Fetch user data using the API.
			setCurrentUser(user); // Update the current user state with fetched data.
		} catch (err) {
			console.error("Error fetching current user:", err);
			setCurrentUser(null); // Clear user data in case of an error.
		} finally {
			setLoading(false); // Ensure loading is set to false after attempt.
		}
	};

	/**
	 * Sync the `token` state with localStorage and API settings.
	 * Fetch the current user whenever the `token` state changes.
	 */
	useEffect(() => {
		handleTokenChange();
		fetchCurrentUser();
	}, [token]);

	// Login the user
	const login = (newToken) => {
		setToken(newToken); // Update the `token` state
	};

	// Log the user out
	const logout = () => {
		setToken(null); // Clear the token
		setCurrentUser(null); // Clear the current user state.
		localStorage.removeItem("token"); // Remove the token from localStorage.
	};

	/**
	 * Provide the authentication-related state and methods to child components.
	 */
	return (
		<AuthContext.Provider
			value={{
				token,
				currentUser,
				login,
				logout,
				loading,
				setCurrentUser,
			}}
		>
			{children} {/* Render any child components that need access to authentication context. */}
		</AuthContext.Provider>
	);
};

export default AuthContext;
