import { FaEye, FaEyeSlash } from "react-icons/fa";

/**
 * PasswordToggle Component
 *
 * This component provides a button to toggle password visibility.
 * It displays an eye icon when the password is visible and a crossed-out eye icon when hidden.
 *
 * @param {boolean} showPassword - Determines if the password is currently visible.
 * @param {function} togglePassword - Function to toggle the visibility of the password.
 */

const PasswordToggle = ({ showPassword, togglePassword }) => {
	return (
		<button
			type="button"
			className="toggle-password"
			onClick={togglePassword} // Calls function to toggle password visibility
			aria-label="Toggle password visibility"
		>
			{/* Show different icons based on the password visibility state */}
			{showPassword ? <FaEye /> : <FaEyeSlash />}
		</button>
	);
};

export default PasswordToggle;
