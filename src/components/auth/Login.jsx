import React, { useState } from "react";
import useLogin from "../../hooks/useLogin";
import PasswordToggle from "./PasswordToggle";
import ResponseMessage from "./ResponseMessage";
import "../styles/Forms.css";

/**
 * Login Component
 *
 * This component renders a login form that allows users to enter their email and password
 * to authenticate. If authentication is successful, the user is logged in and redirected to the homepage.
 */

const Login = () => {
	/**
	 * State management:
	 * - `formData`: Stores email and password entered by the user.
	 * - `showPassword`: Boolean flag to toggle password visibility.
	 */
	const [formData, setFormData] = useState({ email: "", password: "" });
	const [showPassword, setShowPassword] = useState(false);

	/**
	 * Extracts the `handleLogin` function, error message, and loading state
	 * from the `useLogin` custom hook. This hook connects to authentication logic.
	 */
	const { handleLogin, error, loading } = useLogin();

	/**
	 * Handles input field changes.
	 *
	 * @param {object} evt - The event object triggered by user input.
	 */
	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	/**
	 * Handles form submission.
	 *
	 * @param {object} evt - The event object triggered by form submission.
	 */
	const handleSubmit = async (evt) => {
		evt.preventDefault(); // Prevents page reload on form submission
		handleLogin(formData.email, formData.password); // Calls login function
	};

	// If loading is true, display a loading message instead of the form
	if (loading) {
		return <p>Loading...</p>;
	}

	return (
		<div className="Form-container">
			{/* Login Form Header */}
			<h1 className="Form-header">Login</h1>

			{/* Login Form */}
			<form onSubmit={handleSubmit}>
				{/* Email input field */}
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email" // Ensures proper email format
						value={formData.email}
						onChange={handleChange} // Update the form data state when user types
						required // Makes this field mandatory
					/>
				</div>

				{/* Password input field with toggle visibility option */}
				<div className="password-input-wrapper">
					<label htmlFor="password">Password</label>
					<input
						id="password"
						name="password"
						type={showPassword ? "text" : "password"} // Toggle password visibility
						value={formData.password}
						onChange={handleChange}
						required
					/>
					{/* Password visibility toggle button */}
					<PasswordToggle showPassword={showPassword} togglePassword={() => setShowPassword((prev) => !prev)} />
				</div>

				{/* Display an error message if authentication fails */}
				<ResponseMessage messageType="error" message={error} />

				{/* Submit button */}
				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default Login;
