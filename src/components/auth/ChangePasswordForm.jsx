import { useState } from "react";
import { EasyRFQApi } from "../../api/mainApi";
import PasswordToggle from "./PasswordToggle";

/**
 * ChangePasswordForm component allows users to update their password.
 *
 * @param {boolean} showChangePassword - Controls the visibility of the password change modal.
 * @param {function} setShowChangePassword - Function to toggle the visibility of the modal.
 * @param {object} currentUser - The currently logged-in user.
 * @param {function} setSuccessMessage - Function to set a success message upon successful password change.
 * @param {function} setError - Function to set an error message in case of failure.
 */
const ChangePasswordForm = ({ showChangePassword, setShowChangePassword, currentUser, setSuccessMessage, setError }) => {
	// State to manage password input values
	const [passwordData, setPasswordData] = useState({
		currentPassword: "",
		newPassword: "",
	});

	// State to control password visibility toggle
	const [showPassword, setShowPassword] = useState(false);

	/**
	 * Handles changes in password input fields and updates state accordingly.
	 *
	 * @param {object} evt - The event object from input change.
	 */
	const handlePasswordChange = (evt) => {
		const { name, value } = evt.target;
		setPasswordData({ ...passwordData, [name]: value });
	};

	/**
	 * Handles form submission for password update.
	 *
	 * @param {object} evt - The event object from form submission.
	 */
	const handlePasswordSubmit = async (evt) => {
		evt.preventDefault(); // Prevents page reload on form submission

		try {
			// Call API to update password
			await EasyRFQApi.changePassword(currentUser?.id, passwordData.currentPassword, passwordData.newPassword);

			// Set success message and reset form
			setSuccessMessage("Password successfully updated!");
			setPasswordData({ currentPassword: "", newPassword: "" });

			// Close the modal upon successful password change
			setShowChangePassword(false);
		} catch (error) {
			// Capture and display error message
			setError(error.message);
		}
	};

	return (
		<>
			{/* Render modal only if showChangePassword is true */}
			{showChangePassword && (
				<>
					{/* Dark overlay for modal background */}
					<div className="overlay"></div>

					{/* Modal container */}
					<div className="modal">
						{/* Modal header with close button */}
						<div className="modal-header">
							<button className="cancel-button" type="button" onClick={() => setShowChangePassword(false)}>
								X
							</button>
						</div>

						{/* Modal title */}
						<h2>Change Password</h2>

						{/* Password change form */}
						<form onSubmit={handlePasswordSubmit}>
							{/* Current password input */}
							<div className="password-input-wrapper">
								<label>Current Password</label>
								<input type={showPassword ? "text" : "password"} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} required />
								{/* Password visibility toggle button */}
								<PasswordToggle showPassword={showPassword} togglePassword={() => setShowPassword((prev) => !prev)} />
							</div>

							{/* New password input */}
							<div className="password-input-wrapper">
								<label>New Password</label>
								<input type={showPassword ? "text" : "password"} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} required />
							</div>

							{/* Submit button for password update */}
							<button type="submit">Update Password</button>
						</form>
					</div>
				</>
			)}
		</>
	);
};

export default ChangePasswordForm;
