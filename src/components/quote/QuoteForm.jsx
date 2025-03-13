import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Import the API utility for sending requests
import "../styles/Forms.css";
import ResponseMessage from "../auth/ResponseMessage"; // Import component to display error or success messages

/**
 * The QuoteForm component is used to create a new quote for a customer based on the selected RFQ (Request for Quote) data.
 * It includes fields for the quote number, notes, and validity date.
 * The form is pre-populated with data from the selected RFQ, and once submitted, the quote is created along with its associated items.
 */

const QuoteForm = () => {
	// Initial structure for the form data (quote number, notes, and valid until date)
	const INITIAL_INPUT = {
		quoteNumber: "",
		notes: "",
		validUntil: "",
	};

	// Use location hook to get the RFQ data passed through navigation (e.g., from a previous page)
	const location = useLocation();
	const { rfqData } = location.state || {}; // Get RFQ data from location state

	// State for holding the customer details fetched based on the RFQ
	const [customer, setCustomer] = useState();

	const navigate = useNavigate();

	// State variables to manage form data, loading state, and error message
	const [formData, setFormData] = useState(INITIAL_INPUT);
	const [isLoading, setIsLoading] = useState(true); // Track loading state
	const [errorMessage, setErrorMessage] = useState(null);

	// Fetch the customer details based on the RFQ data
	const fetchCustomer = async () => {
		try {
			// API call to fetch customer details using the customer name and company ID from RFQ data
			const customerDetails = await EasyRFQApi.getCustomer(rfqData.customerName, rfqData.companyId);
			setCustomer(customerDetails); // Store the fetched customer data
		} catch (err) {
			console.error("Error fetching quote details:", err);
		} finally {
			// Once data is fetched, set loading state to false
			setIsLoading(false);
		}
	};

	// useEffect to fetch customer details when RFQ data is available
	useEffect(() => {
		if (rfqData) {
			fetchCustomer();
		}
	}, [rfqData]);

	/**
	 * Handles input change for the form fields.
	 * Updates the corresponding field in the form data whenever a user modifies an input.
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		// Update the formData state with the new value for the corresponding field
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
	};

	/**
	 * Handles form submission.
	 * Maps the form data to a format that the API expects, sends the quote creation request,
	 * processes the RFQ items, and navigates to the quotes page upon success.
	 */
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		try {
			// Map formData to snake_case as required by the API
			const formDataSnakeCase = {
				company_id: rfqData.companyId,
				customer_name: rfqData.customerName,
				user_id: rfqData.userId,
				valid_until: formData.validUntil,
				quote_number: formData.quoteNumber,
				notes: formData.notes,
			};

			// API call to create the quote using the mapped form data
			const createdQuote = await EasyRFQApi.createQuote(formDataSnakeCase);
			const quoteId = createdQuote.id; // Get the ID of the created quote

			// Process each item from the RFQ and create quote items for the quote
			for (let item of rfqData.rfqItems) {
				let itemPrice = item.itemCost; // Default to item cost

				// Apply markup logic if the customer’s markup type is percentage
				if (customer.markupType === "percentage") {
					itemPrice = item.itemCost * (1 + customer?.markup / 100); // Apply markup
				}

				// Map the RFQ item to a quote item with necessary fields
				const quoteItem = {
					quote_id: quoteId,
					company_id: rfqData.companyId,
					item_code: item.itemCode,
					quantity: item.quantity,
					item_description: item.itemDescription,
					item_price: itemPrice,
				};

				// API call to create quote item for the created quote
				await EasyRFQApi.createQuoteItem(quoteItem, rfqData.userId);
			}

			// Clear the form data after successful submission
			setFormData(INITIAL_INPUT);

			// Navigate to the quotes page after successfully creating the quote
			navigate("/quotes");
		} catch (err) {
			console.error("Error creating Quote:", err);
			setErrorMessage(err); // Set the error message to be displayed in the UI
		}
	};

	// The form UI to create a new quote
	return (
		<div className="modal2">
			{/* Header for the quote form */}
			<div className="QuoteForm-header">
				<h1>Create Quote</h1>
			</div>
			<section className="QuoteForm-details">
				{/* Show loading state if still fetching customer data */}
				{isLoading ? (
					<div>Loading customer data...</div>
				) : (
					// Form for creating a quote, calling handleSubmit when form is submitted
					<form className="QuoteForm-form" onSubmit={handleSubmit}>
						{/* Input field for Quote Number */}
						<div>
							<label>Quote#:</label>
							<input type="text" name="quoteNumber" value={formData.quoteNumber} onChange={handleChange} />
						</div>

						{/* Textarea for Notes and Terms for the quote */}
						<div>
							<label>Quote Notes & Terms:</label>
							<textarea name="notes" value={formData.notes} onChange={handleChange} rows="4" cols="50" />
						</div>

						{/* Input field for Valid Until date */}
						<div>
							<label>Valid Until:</label>
							<input type="date" name="validUntil" value={formData.validUntil} onChange={handleChange} />
						</div>

						{/* Display error message if there is any */}
						<ResponseMessage messageType="error" message={errorMessage} />

						{/* Submit button to save the quote */}
						<div>
							<button type="submit">Save</button>
						</div>
					</form>
				)}
			</section>
		</div>
	);
};

export default QuoteForm;
