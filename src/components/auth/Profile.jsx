import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi";
import AuthContext from "../../context/AuthContext";
import ResponseMessage from "./ResponseMessage";
import ChangePasswordForm from "./ChangePasswordForm";
import Company from "../company/Company";
import { formatPhoneNumber } from "../../helpers";

/**
 * Profile Component
 *
 * This component allows the user to:
 * - View and update their profile details (full name, phone number)
 * - View their associated company details
 * - Change their password
 * - Display success/error messages based on form submission results
 *
 * Uses context to fetch and update the current user's profile.
 */

const Profile = () => {
	// Extract current user details from AuthContext
	const { currentUser, setCurrentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Get the user object
	const { company } = loggedUser; // Extract company details from user object

	// Local state to manage form data, success/error messages, and modal visibility
	const [formData, setFormData] = useState({
		email: loggedUser?.email || "",
		fullName: loggedUser?.fullName || "",
		phone: loggedUser?.phone || "",
	});

	const [error, setError] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);
	const [showChangePassword, setShowChangePassword] = useState(false);
	const [showCompanyData, setShowCompanyData] = useState(false);

	const navigate = useNavigate();

	/**
	 * Handles input changes for the profile form.
	 * - Formats the phone number input automatically.
	 * - Updates the form state dynamically.
	 *
	 * @param {Event} evt - The input event object.
	 */
	const handleChange = (evt) => {
		const { name, value } = evt.target;

		// Format phone number before setting state
		if (name === "phone") {
			setFormData((prevData) => ({
				...prevData,
				[name]: formatPhoneNumber(value),
			}));
			return;
		}

		// Update form state for other fields
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	/**
	 * Handles form submission for updating user profile details.
	 * - Prevents default form submission behavior.
	 * - Sends an API request to update user information.
	 * - Updates local state and displays success/error messages.
	 *
	 * @param {Event} evt - The form submission event.
	 */
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		// Exclude email from updates since it's not editable
		const { email, ...updatedData } = formData;

		try {
			// Send updated user data to API
			const updatedUser = await EasyRFQApi.editProfile(updatedData, loggedUser?.id);

			// Update user context with new details
			setCurrentUser((prevState) => ({ ...prevState, user: updatedUser }));

			// Show success message and navigate back to profile after a delay
			setSuccessMessage("Profile successfully updated!");
			setTimeout(() => navigate("/profile"), 2000);
		} catch (error) {
			// Handle errors and display message
			setError(error.message);
		}
	};

	return (
		<div className="Form-container">
			<h1 className="Form-header">Profile</h1>

			{/* Dark overlay effect when modals are open */}
			<div className={`form-wrapper ${showChangePassword || showCompanyData ? "blurred" : ""}`}>
				<form onSubmit={handleSubmit}>
					{/* Email Field (Read-Only) */}
					<div>
						<label htmlFor="email">Email</label>
						<input id="email" name="email" value={formData.email} disabled />
					</div>

					{/* Full Name Input */}
					<div>
						<label htmlFor="fullName">Full name</label>
						<input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} />
					</div>

					{/* Phone Number Input (Auto-formatted) */}
					<div>
						<label htmlFor="phone">Phone Number</label>
						<input id="phone" name="phone" value={formData.phone} placeholder="(777) 777-7777" onChange={handleChange} />
					</div>

					{/* Company Information Button */}
					<div className="form-link">
						<label>Company</label>
						<button type="button" onClick={() => setShowCompanyData(true)}>
							{company?.companyName}
						</button>
					</div>

					{/* Display error or success messages */}
					<ResponseMessage messageType="error" message={error} />
					<ResponseMessage messageType="success" message={successMessage} />

					{/* Submit Button for Updating Profile */}
					<button type="submit">Save changes</button>
				</form>

				{/* Button to Open Change Password Modal */}
				<button id="pass-change" type="button" onClick={() => setShowChangePassword(true)}>
					Change password
				</button>
			</div>

			{/* Display Company Details Modal */}
			{showCompanyData && <Company showCompanyData={showCompanyData} setShowCompanyData={setShowCompanyData} company={company} />}

			{/* Display Change Password Modal */}
			<ChangePasswordForm showChangePassword={showChangePassword} setShowChangePassword={setShowChangePassword} currentUser={loggedUser} setSuccessMessage={setSuccessMessage} setError={setError} />
		</div>
	);
};

export default Profile;
