import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Import authentication context
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data
import "../styles/Forms.css";
import { formatPhoneNumber } from "../../helpers"; // Helper function for phone number formatting
import ResponseMessage from "../auth/ResponseMessage"; // Component for showing response messages
import { usStateAbbreviations } from "../../helpers"; // US state abbreviations for the dropdown

/**
 * This component displays a form to create a new customer.
 * It handles input changes, form submission, and API communication to create a new customer.
 */
const CustomerForm = () => {
	// Initial form data, including default values for each field
	const INITIAL_INPUT = {
		name: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		country: "USA", // Default country is USA
		phoneMain: "",
		markupType: "percentage", // Default markup type is percentage
		markup: "",
	};

	// Get the current logged-in user from the AuthContext
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Get the current user object
	const navigate = useNavigate();

	// useState hooks to manage form state and error messages
	const [formData, setFormData] = useState(INITIAL_INPUT); // Stores the form data
	const [errorMessage, setErrorMessage] = useState(null); // Stores error message for API calls

	/** Handles input change for the form */
	const handleChange = (e) => {
		const { name, value } = e.target; // Get the name and value of the input field

		// If the field is for phone number, format it using the helper function
		if (name === "phoneMain") {
			setFormData((prevData) => ({
				...prevData,
				[name]: formatPhoneNumber(value), // Format the phone number input
			}));
			return;
		}

		// For other fields, update the form data normally
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
	};

	/** Handle form submission */
	const handleSubmit = async (evt) => {
		evt.preventDefault(); // Prevent the default form submission behavior

		// Get the companyId from the logged-in user's company data
		const companyId = loggedUser.company.companyId;

		try {
			// Map formData keys from camelCase to snake_case before sending to API
			const formDataSnakeCase = {
				customer_name: formData.name,
				address_line1: formData.addressLine1,
				address_line2: formData.addressLine2,
				city: formData.city,
				state: formData.state,
				country: formData.country,
				phone_main: formData.phoneMain,
				markup_type: formData.markupType,
				markup: formData.markup,
				company_id: companyId, // Associate the customer with the logged-in user's company
			};

			// Call the API to create the customer with the transformed data
			await EasyRFQApi.createCustomer(formDataSnakeCase);

			// Clear the form data after successful submission
			setFormData(INITIAL_INPUT);

			// Navigate to the customers page after successful form submission
			navigate("/customers");
		} catch (err) {
			console.error("Error creating customer:", err);
			setErrorMessage(err); // Set the error message to show in the response message component
		}
	};

	return (
		<div className="modal2">
			<div className="CustomerForm-header">
				<h1>Create Customer</h1>
			</div>
			<section className="CustomerForm-details">
				{/* The form element for customer data input */}
				<form className="CustomerForm-form" onSubmit={handleSubmit}>
					{/* Name field*/}
					<div>
						<label>Name:</label>
						<input type="text" name="name" value={formData.name} onChange={handleChange} />
					</div>

					{/* Address Line 1 field*/}
					<div>
						<label>Address Line 1:</label>
						<input type="text" name="addressLine1" value={formData.addressLine1} onChange={handleChange} />
					</div>

					{/* Address Line 2 field*/}
					<div>
						<label>Address Line 2:</label>
						<input type="text" name="addressLine2" value={formData.addressLine2} onChange={handleChange} />
					</div>

					{/* City field*/}
					<div>
						<label>City:</label>
						<input type="text" name="city" value={formData.city} onChange={handleChange} />
					</div>

					{/* State dropdown field*/}
					<div>
						<label>State:</label>
						{/* Dropdown for selecting state */}
						<select name="state" value={formData.state} onChange={handleChange}>
							<option value="">Select a state</option>
							{/* Map over usStateAbbreviations to create the state options */}
							{usStateAbbreviations.map((state) => (
								<option key={state} value={state}>
									{state}
								</option>
							))}
						</select>
					</div>

					{/* Country field*/}
					<div>
						<label>Country:</label>
						<input type="text" name="country" value={formData.country} onChange={handleChange} />
					</div>

					{/* Phone field*/}
					<div>
						<label>Phone:</label>
						<input type="text" name="phoneMain" value={formData.phoneMain} onChange={handleChange} />
					</div>

					{/* Markup Type dropdown field*/}
					<div>
						<label>Markup Type:</label>
						{/* Dropdown for selecting markup type (percentage or fixed) */}
						<select name="markupType" value={formData.markupType} onChange={handleChange}>
							<option value="percentage">Percentage</option>
							<option value="fixed">Fixed</option>
						</select>
					</div>

					{/* Markup field*/}
					<div>
						<label>Markup:</label>
						<input type="text" name="markup" value={formData.markup} onChange={handleChange} />
					</div>

					{/* Display error message if there is one */}
					<ResponseMessage messageType="error" message={errorMessage} />

					{/* Submit button to save the form data */}
					<div>
						<button type="submit">Save</button>
					</div>
				</form>
			</section>
		</div>
	);
};

export default CustomerForm;
