import { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Importing authentication context for user data
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data related to RFQs and customers
import "../styles/Forms.css";
import ResponseMessage from "../auth/ResponseMessage"; // Component to show error or success messages

/**
 * Form for creating a new RFQ (Request for Quote)
 * This form allows the user to input details such as customer name and RFQ number
 * and submit the information to create a new RFQ.
 */

const RfqForm = () => {
	// Define the initial state of the form inputs
	const INITIAL_INPUT = {
		customerName: "",
		rfqNumber: "",
	};

	// Using context to access the current logged-in user from the AuthContext
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Retrieve the logged-in user from context
	const navigate = useNavigate();

	// State variables to manage form data, error messages, and customer data
	const [formData, setFormData] = useState(INITIAL_INPUT);
	const [errorMessage, setErrorMessage] = useState(null);
	const [customers, setCustomers] = useState([]); // Stores the list of customers fetched from the API

	// useEffect hook to fetch the list of customers when the component mounts
	useEffect(() => {
		const fetchCustomers = async () => {
			try {
				// Get the companyId from the logged-in user to fetch associated customers
				const companyId = loggedUser.company.companyId;

				// API call to get customers associated with the logged user's company
				const customerData = await EasyRFQApi.getUserCustomers(companyId);

				// Set the fetched customers to the state
				setCustomers(customerData);
			} catch (err) {
				// If there's an error, log it and show an error message
				console.error("Error fetching customers:", err);
				setErrorMessage("Failed to load customers.");
			}
		};

		fetchCustomers(); // Call the function to fetch customers
	}, [loggedUser]);

	/** Handles input changes in the form fields */
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Update the form data state with the new value for the changed input field
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
	};

	/** Handles the form submission (saving the new RFQ) */
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		// Get the companyId from the logged-in user's data (needed for the RFQ creation)
		const companyId = loggedUser.company.companyId;

		try {
			// Map the form data from camelCase to snake_case as required by the API
			const formDataSnakeCase = {
				company_id: companyId,
				customer_name: formData.customerName,
				user_id: loggedUser.id,
				rfq_number: formData.rfqNumber,
			};

			// API call to create a new RFQ with the mapped data
			await EasyRFQApi.createRfq(formDataSnakeCase);

			// Clear the form data after successful submission
			setFormData(INITIAL_INPUT);

			// Navigate the user to the list of RFQs after successfully creating one
			navigate("/rfqs");
		} catch (err) {
			console.error("Error creating rfq:", err);
			setErrorMessage(err); // Set error message to state
		}
	};

	return (
		<div className="modal2">
			{/* Modal container for the form */}
			{/* Header section of the form */}
			<div className="RfqForm-header">
				<h1>Create RFQ</h1>
			</div>
			{/* Form section */}
			<section className="RfqForm-details">
				{/* Form for inputting RFQ details */}
				<form className="RfqForm-form" onSubmit={handleSubmit}>
					{/* Customer dropdown selection */}
					<div>
						<label>Customer</label>
						<select name="customerName" value={formData.customerName} onChange={handleChange} required>
							<option value="">Select a customer</option> {/* Default option */}
							{/* Mapping over the customers array to render each option */}
							{customers.map((customer) => (
								<option key={customer.customerName} value={customer.customerName}>
									{customer.customerName} {/* Display customer name */}
								</option>
							))}
						</select>
					</div>

					{/* RFQ Number input field */}
					<div>
						<label>RFQ#:</label>
						<input type="text" name="rfqNumber" value={formData.rfqNumber} onChange={handleChange} />
					</div>

					{/* Display any error message, if there is one */}
					<ResponseMessage messageType="error" message={errorMessage} />

					{/* Submit button for saving the form */}
					<div>
						<button type="submit">Save</button> {/* Trigger handleSubmit on click */}
					</div>
				</form>
			</section>
		</div>
	);
};

export default RfqForm;
