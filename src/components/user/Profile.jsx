// Import necessary hooks and context
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { JoblyApi } from "../../api/api"; // JoblyApi for making API requests
import AuthContext from "../../context/AuthContext"; // AuthContext to access and update authentication-related data

/**
 * Allows the logged-in user to view and edit their profile information.
 */

const Profile = () => {
	// Access authentication context to retrieve and update user data
	const { currentUser, setCurrentUser } = useContext(AuthContext);

	// Get logged-in user's details from the context
	const loggedUser = currentUser?.user;

	// Initialize form state with the current user's data
	const [formData, setFormData] = useState({
		username: loggedUser?.username || "",
		firstName: loggedUser?.firstName || "",
		lastName: loggedUser?.lastName || "",
		email: loggedUser?.email || "",
	});

	// State for error and success messages
	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	const navigate = useNavigate();

	/**
	 * Handle input changes in the form
	 */
	const handleChange = (evt) => {
		const { name, value } = evt.target;
		setFormData({
			...formData,
			[name]: value, // Update the corresponding field in formData
		});
	};

	/**
	 * Handle form submission
	 * Sends the updated user data to the API and updates the context on success.
	 */
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		// Destructure username from formData (username is not editable)
		const { username, ...updatedData } = formData;

		try {
			// Send the updated user data to the API
			const updatedUser = await JoblyApi.editProfile(updatedData, username);

			// Update the currentUser in the context with the new user data
			setCurrentUser((prevState) => ({
				...prevState,
				user: updatedUser,
			}));

			setSuccessMessage("Profile successfully updated!");

			// Redirect to the profile page. Delay needed for render
			setTimeout(() => navigate("/profile"), 2000);
		} catch (error) {
			setError(error.message);
			console.error("Error during profile update:", error);
		}
	};

	return (
		<div className="Form-container">
			<h1 className="Form-header">Profile</h1>
			<form onSubmit={handleSubmit}>
				<div>
					<label htmlFor="username">Username</label>
					<input
						id="username"
						name="username"
						value={formData.username}
						onChange={handleChange}
						disabled // Prevent editing of the username
					/>
				</div>
				<div>
					<label htmlFor="firstName">First name</label>
					<input id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="lastName">Last name</label>
					<input id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} />
				</div>
				<div>
					<label htmlFor="email">Email</label>
					<input
						id="email"
						name="email"
						type="email" // Enforces email validation
						value={formData.email}
						onChange={handleChange}
					/>
				</div>

				{/* Display error message if an error occurs */}
				{error && <div className="error-message">{error}</div>}

				{/* Display success message after a successful update */}
				{successMessage && <div className="success-message">{successMessage}</div>}

				<button type="submit">Save Changes</button>
			</form>
		</div>
	);
};

export default Profile;
