import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { JoblyApi } from "../../api/api"; // JoblyApi for interacting with the API, specifically for user registration
import AuthContext from "../../context/AuthContext"; // AuthContext to access authentication-related functions like login
import "../styles/Forms.css";

/**

 * Component renders the signup form for new users. 
 * It collects the user's details and sends them to the API for registration. 
 */

const SignUp = () => {
	// Access the login function from AuthContext to log in the user after successful registration
	const { login } = useContext(AuthContext);

	// Local state to manage form data inputs
	const [formData, setFormData] = useState({
		username: "",
		password: "",
		firstName: "",
		lastName: "",
		email: "",
	});

	// State to handle any error messages during signup
	const [error, setError] = useState(null);

	const navigate = useNavigate();

	// Handle input field changes
	const handleChange = (e) => {
		const { name, value } = e.target; // Extract name and value from the input element
		setFormData({
			...formData, // Copy the current state
			[name]: value, // Update the specific field in the formData object
		});
	};

	// Handle form submission
	const handleSubmit = async (e) => {
		e.preventDefault();

		try {
			// Call the API to register the user with the provided form data
			const token = await JoblyApi.registerUser(formData);

			// If registration is successful, log the user in using the login function from context
			login(token, { username: formData.username });

			navigate("/");
		} catch (error) {
			setError(error);
			console.error("Error during signup:", error);
		}
	};

	return (
		<div className="Form-container">
			<h1 className="Form-header">Sign Up</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username</label> {/* Label for the username input */}
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
						minLength={6}
						value={formData.password}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>
				<div>
					<label htmlFor="firstName">First name</label>
					<input
						id="firstName"
						name="firstName"
						value={formData.firstName}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>
				<div>
					<label htmlFor="lastName">Last name</label>
					<input
						id="lastName"
						name="lastName"
						value={formData.lastName}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email"
						value={formData.email}
						onChange={handleChange} // Update the form data state when user types
						required
					/>
				</div>

				{/* Display error message if there is an error */}
				{error && <div className="error-message">{error}</div>}

				<button type="submit">Submit</button>
			</form>
		</div>
	);
};

export default SignUp;
