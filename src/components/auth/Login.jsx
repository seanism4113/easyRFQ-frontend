import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JoblyApi } from "../../api/api"; // JoblyApi for interacting with the API, specifically for user authentication
import AuthContext from "../../context/AuthContext"; // AuthContext to manage authentication-related state
import "../styles/Forms.css";

/**

 * Component renders the login form where users can enter their username and password to authenticate.
 * Upon successful authentication, the user is logged in and redirected to the homepage.
 */

const Login = () => {
	// State to manage form data (username and password) for the login form
	const [formData, setFormData] = useState({ username: "", password: "" });

	// State to manage error messages in case of failed login attempt
	const [error, setError] = useState("");

	// Access login function and loading state from AuthContext
	const { login, loading } = useContext(AuthContext);

	const navigate = useNavigate();

	// Handle input field changes

	const handleChange = (evt) => {
		const { name, value } = evt.target; // Extract name and value from the input element
		setFormData((data) => ({
			...data, // Spread the existing form data
			[name]: value, // Update the respective field in the formData object
		}));
	};

	// Handle form submission

	const handleSubmit = async (evt) => {
		evt.preventDefault();

		try {
			// Call the API to authenticate the user with the provided username and password
			const { token } = await JoblyApi.authenticateUser(formData.username, formData.password);

			// If authentication is successful, log the user in using the login function from context
			login(token);

			navigate("/");
		} catch (err) {
			console.error("Login failed:", err);
			setError("Invalid username or password.");
		}
	};

	// If loading is true, display a loading message
	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="Form-container">
			<h1 className="Form-header">Login</h1>
			<form onSubmit={handleSubmit}>
				{" "}
				{/* Form element with onSubmit handler */}
				<div>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						value={formData.username}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>
				<div>
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type="password"
						value={formData.password}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>
				{/* Show error message if login fails */}
				{error && <div className="error-message">{error}</div>}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default Login;
