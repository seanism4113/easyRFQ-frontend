import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // API functions for handling user registration
import CompanyForm from "../company/CompanyForm"; // Form to add a new company if not listed
import ResponseMessage from "./ResponseMessage"; // Component to display success or error messages
import useLogin from "../../hooks/useLogin"; // Custom hook to handle user login
import PasswordToggle from "./PasswordToggle"; // Component to toggle password visibility
import "../styles/Forms.css";

/**
 * SignUp Component
 *
 * This component renders the signup form, allowing new users to create an account.
 * It collects user details, validates input, sends registration requests to the API,
 * and logs in the user upon successful registration.
 */

const SignUp = () => {
	// Access login function from authentication context to log in users after registration
	const { handleLogin } = useLogin();
	const navigate = useNavigate(); // Hook for navigation after signup

	// Local state to manage form inputs
	const [formData, setFormData] = useState({
		email: "",
		password: "",
		passwordConfirm: "",
		fullName: "",
		companyId: "",
	});

	// State to manage error and success messages
	const [errorMessage, setErrorMessage] = useState(null);
	const [successMessage, setSuccessMessage] = useState(null);

	// State to store the list of available companies
	const [companies, setCompanies] = useState([]);

	// State to control password visibility toggle
	const [showPassword, setShowPassword] = useState(false);

	// State to control whether the "Add Company" form is visible
	const [showCompanyForm, setShowCompanyForm] = useState(false);

	/**
	 * Fetch companies from the API when the component mounts.
	 * Populates the dropdown for company selection.
	 */
	useEffect(() => {
		const fetchCompanies = async () => {
			try {
				const res = await EasyRFQApi.getCompanies(); // API call to retrieve list of companies
				setCompanies(res || []); // Ensure empty array if no companies are returned
			} catch (err) {
				console.error("Error fetching companies:", err);
			}
		};

		fetchCompanies();
	}, []);

	/**
	 * Handles form input changes and updates state.
	 * @param {Object} e - Event object from input field change.
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};

	/**
	 * Handles form submission to register a new user.
	 * Validates input, sends data to API, and logs in the user upon success.
	 * @param {Object} e - Event object from form submission.
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage(null); // Clear previous errors
		setSuccessMessage(null); // Clear previous success messages

		// Check if passwords match before proceeding
		if (formData.password !== formData.passwordConfirm) {
			setErrorMessage("Passwords do not match");
			return;
		}

		try {
			// Exclude password confirmation before sending data to API
			const { passwordConfirm, ...dataToSubmit } = formData;

			// Send registration request to API
			const token = await EasyRFQApi.registerUser(dataToSubmit);

			// If successful, log in the user
			handleLogin(formData.email, formData.password);

			// Redirect to home page after successful registration
			navigate("/");
		} catch (error) {
			setErrorMessage(error || "Signup failed. Please try again.");
		}
	};

	return (
		<div className="Form-container">
			{/* Apply blur effect when the company form is open */}
			<div className={`form-wrapper ${showCompanyForm ? "blurred" : ""}`}>
				<h1 className="Form-header">Sign Up</h1>

				<form onSubmit={handleSubmit}>
					{/* Email Input */}
					<div>
						<label htmlFor="email">Email</label>
						<input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required autoComplete="username" />
					</div>

					{/* Password Input with Toggle */}
					<div className="password-input-wrapper">
						<label htmlFor="password">Password</label>
						<input
							id="password"
							name="password"
							type={showPassword ? "text" : "password"} // Toggles between text and password
							value={formData.password}
							onChange={handleChange}
							minLength={6}
							maxLength={18}
							required
							autoComplete="new-password"
						/>
						{/* Password visibility toggle button */}
						<PasswordToggle showPassword={showPassword} togglePassword={() => setShowPassword((prev) => !prev)} />
					</div>

					{/* Confirm Password Input */}
					<div className="password-input-wrapper">
						<label htmlFor="passwordConfirm">Re-enter Password</label>
						<input
							id="passwordConfirm"
							name="passwordConfirm"
							type={showPassword ? "text" : "password"} // Toggles between text and password
							value={formData.passwordConfirm}
							onChange={handleChange}
							minLength={6}
							maxLength={18}
							required
							autoComplete="new-password"
						/>
					</div>

					{/* Full Name Input */}
					<div>
						<label htmlFor="fullName">Full Name</label>
						<input id="fullName" name="fullName" placeholder="First and last name" value={formData.fullName} minLength={6} maxLength={30} onChange={handleChange} required />
					</div>

					{/* Company Selection Dropdown */}
					<div>
						<label htmlFor="companyId">Company</label>
						<select id="company" name="companyId" value={formData.companyId} onChange={handleChange} required>
							<option value="">Select a company</option>
							{companies.map((company) => (
								<option key={company.id} value={company.id}>
									{company.name}
								</option>
							))}
						</select>
					</div>

					{/* Option to Add a New Company */}
					<div className="flex">
						<span>Don't see your company listed?&nbsp; </span>
						<div className="form-link">
							<button type="button" onClick={() => setShowCompanyForm(true)}>
								Add Company
							</button>
						</div>
					</div>

					{/* Display Error or Success Messages */}
					<ResponseMessage messageType="error" message={errorMessage} />
					<ResponseMessage messageType="success" message={successMessage} />

					{/* Submit Button */}
					<button type="submit">Submit</button>
				</form>
			</div>

			{/* Render CompanyForm Component if the User Chooses to Add a New Company */}
			{showCompanyForm && <CompanyForm setCompanies={setCompanies} setShowCompanyForm={setShowCompanyForm} setSuccessMessage={setSuccessMessage} />}
		</div>
	);
};

export default SignUp;
