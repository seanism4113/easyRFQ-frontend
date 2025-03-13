import { useState } from "react";
import { EasyRFQApi } from "../../api/mainApi"; // Importing the API utility for creating companies and fetching company data
import { formatPhoneNumber } from "../../helpers"; // Importing the helper function for formatting phone numbers
import ResponseMessage from "../auth/ResponseMessage"; // Importing a component to display response messages (success or error)
import { usStateAbbreviations } from "../../helpers"; // Importing an array of state abbreviations to populate the state dropdown

/**
 * CompanyForm component allows users to create a new company by filling out a form.
 * It handles the form data, phone number formatting, submission, and error handling.
 */

const CompanyForm = ({ setCompanies, setShowCompanyForm, setSuccessMessage }) => {
	// Local state to manage form data inputs
	const [formData, setFormData] = useState({
		name: "", // Company name
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		country: "USA",
		phoneMain: "",
	});

	// State to handle any error messages
	const [error, setError] = useState(null);

	/**
	 * Handle input field changes.
	 * This function updates the form data state whenever the user types in any input field.
	 * It also formats the phone number if the field name is 'phoneMain'.
	 * @param {Object} e - The event object containing the input data
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Check if the input is for phone number, then format it
		if (name === "phoneMain") {
			setFormData((prevData) => ({
				...prevData,
				[name]: formatPhoneNumber(value), // Format the phone number using helper function
			}));
			return;
		}

		// For other fields, just update the value normally
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
	};

	/**
	 * Handle form submission.
	 * When the form is submitted, this function is called to create a new company by sending the form data
	 * to the backend API. On success, it shows a success message and updates the company list.
	 * @param {Object} e - The event object for form submission
	 */
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			// Attempt to create a new company via API
			await EasyRFQApi.createCompany(formData);

			// On successful company creation, set the success message
			setSuccessMessage("Company successfully added!");

			// Fetch the updated list of companies after creating the new one
			const res = await EasyRFQApi.getCompanies();

			// Update the parent component with the new list of companies
			setCompanies(res || []);

			// Close the company form modal
			setShowCompanyForm(false);
		} catch (error) {
			// In case of an error, display an error message
			setError(error.response?.data?.message || "Failed to add company. Please try again.");
		}
	};

	return (
		<>
			{/* Overlay background to darken the area outside the form */}
			<div className="overlay"></div>
			{/* Modal container for the company form */}
			<div className="modal2">
				{/* Modal header with a close button */}
				<div className="modal-header">
					<button className="cancel-button" type="button" onClick={() => setShowCompanyForm(false)}>
						X
					</button>
				</div>

				{/* Form header */}
				<h1 className="Form-header">Add Company</h1>

				{/* Form submission handler */}
				<form onSubmit={handleSubmit}>
					{/* Company Name */}
					<div>
						<label htmlFor="name">Company Name</label>
						<input id="name" name="name" type="text" value={formData.name} onChange={handleChange} required />
					</div>

					{/* Address Line 1 */}
					<div>
						<label htmlFor="addressLine1">Address Line 1</label>
						<input id="addressLine1" name="addressLine1" type="text" value={formData.addressLine1} onChange={handleChange} required />
					</div>

					{/* Address Line 2 */}
					<div>
						<label htmlFor="addressLine2">Address Line 2 (Optional)</label>
						<input id="addressLine2" name="addressLine2" type="text" value={formData.addressLine2} onChange={handleChange} />
					</div>

					{/* City */}
					<div>
						<label htmlFor="city">City</label>
						<input id="city" name="city" type="text" value={formData.city} onChange={handleChange} required />
					</div>

					{/* State */}
					<div>
						<label htmlFor="state">State</label>
						<select id="state" name="state" value={formData.state} onChange={handleChange} required>
							<option value="">Select a state</option>
							{/* Map through the usStateAbbreviations array to generate state options */}
							{usStateAbbreviations.map((state) => (
								<option key={state} value={state}>
									{state}
								</option>
							))}
						</select>
					</div>

					{/* Country */}
					<div>
						<label htmlFor="country">Country</label>
						<input id="country" name="country" type="text" value={formData.country} onChange={handleChange} required />
					</div>

					{/* Phone Main */}
					<div>
						<label htmlFor="phoneMain">Main Phone</label>
						<input id="phoneMain" name="phoneMain" type="text" value={formData.phoneMain} onChange={handleChange} placeholder="(777) 777-7777" required />
					</div>

					{/* Display error message if there is an error */}
					<ResponseMessage message={error} type="error" />

					{/* Submit button */}
					<button type="submit">Submit</button>
				</form>
			</div>
		</>
	);
};

export default CompanyForm;
