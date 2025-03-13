import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data
import "../styles/PageDetail.css";
import { formatPhoneNumber, usStateAbbreviations } from "../../helpers";

/**
 * CustomerDetail component displays detailed information about a specific customer.
 * The customer is fetched based on the 'customerName' and 'companyId' from the URL.
 */

const CustomerDetail = () => {
	// Extract customerName from the URL parameters (from the route)
	const { customerName } = useParams();
	// Get the current location object to access query parameters
	const location = useLocation();
	// Hook to programmatically navigate to other routes
	const navigate = useNavigate();

	// Get the companyId from the URL query parameters
	const urlParams = new URLSearchParams(location.search);
	const companyId = urlParams.get("companyId"); // Extract companyId from the query string

	// State variables to manage the customer details, loading state, editing state, and form data
	const [customer, setCustomer] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		customerName: "",
		addressLine1: "",
		addressLine2: "",
		city: "",
		state: "",
		country: "",
		phoneMain: "",
		markupType: "",
		markup: "",
	});

	/**
	 * Fetch customer details from the API.
	 * This function is triggered to get the customer data from the server
	 * based on customerName and companyId.
	 */
	const fetchCustomerData = async () => {
		// If the companyId is missing, log an error and return early
		if (!companyId) {
			console.error("Company ID is missing in the URL.");
			return;
		}

		try {
			// Fetch the customer details using the EasyRFQApi service
			const customerData = await EasyRFQApi.getCustomer(customerName, companyId);

			// Once data is fetched, set the customer state and populate the form data
			setCustomer(customerData);
			setFormData({
				customerName: customerData.customerName || "",
				addressLine1: customerData.addressLine1 || "",
				addressLine2: customerData.addressLine2 || "",
				city: customerData.city || "",
				state: customerData.state || "",
				country: customerData.country || "",
				phoneMain: customerData.phoneMain || "",
				markupType: customerData.markupType || "",
				markup: customerData.markup || "",
			});
		} catch (err) {
			// Handle any errors that occur while fetching data
			console.error("Error fetching customer details:", err);
		} finally {
			// Set loading state to false once data fetching is done
			setIsLoading(false);
		}
	};

	// useEffect hook to fetch the customer data whenever customerName or companyId changes
	useEffect(() => {
		fetchCustomerData(); // Fetch customer details
	}, [customerName, companyId]); // Dependencies: Re-fetch if customerName or companyId changes

	/**
	 * Handles the input change for the form.
	 * The input field name is used to identify which field is being updated.
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;

		// Special handling for phone number field to format it
		if (name === "phoneMain") {
			// Format the phone number before updating the form data
			setFormData((prevData) => ({
				...prevData,
				[name]: formatPhoneNumber(value),
			}));
			return;
		}

		// For other fields, just update the form data as normal
		setFormData((prevData) => {
			const updatedData = { ...prevData, [name]: value };
			return updatedData;
		});
	};

	/**
	 * Handles the save action, sending updated data to the API.
	 * It converts the form data from camelCase to snake_case before sending it to the API.
	 */
	const handleSave = async () => {
		try {
			// Convert formData to snake_case for the API
			const formDataSnakeCase = {
				customerName: formData.customerName,
				address_line1: formData.addressLine1,
				address_line2: formData.addressLine2,
				city: formData.city,
				state: formData.state,
				country: formData.country,
				phone_main: formData.phoneMain,
				markup_type: formData.markupType,
				markup: formData.markup,
			};

			// Send the updated customer data to the API
			const updatedCustomer = await EasyRFQApi.editCustomer(customerName, companyId, formDataSnakeCase);

			// Update the state with the updated customer data
			setCustomer(updatedCustomer);
			setFormData({
				customerName: updatedCustomer.customerName || "",
				addressLine1: updatedCustomer.addressLine1 || "",
				addressLine2: updatedCustomer.addressLine2 || "",
				city: updatedCustomer.city || "",
				state: updatedCustomer.state || "",
				country: updatedCustomer.country || "",
				phoneMain: updatedCustomer.phoneMain || "",
				markupType: updatedCustomer.markupType || "",
				markup: updatedCustomer.markup || "",
			});
			setIsEditing(false); // Disable editing mode

			// Update the URL after the customer name has been changed
			navigate(`/customers/${updatedCustomer.customerName}?companyId=${companyId}`);
		} catch (err) {
			// Log any errors that occur during the save operation
			console.error("Error updating customer:", err);
		}
	};

	/**
	 * Handle cancel action.
	 * This resets the form data to the original customer data and disables editing.
	 */
	const handleCancel = () => {
		setFormData({
			customerName: customer.customerName || "",
			addressLine1: customer.addressLine1 || "",
			addressLine2: customer.addressLine2 || "",
			city: customer.city || "",
			state: customer.state || "",
			country: customer.country || "",
			phoneMain: customer.phoneMain || "",
			markupType: customer.markup_type || "", // Convert snake_case to camelCase
			markup: customer.markup || "",
		});
		setIsEditing(false); // Disable editing mode
	};

	/**
	 * Handle delete action.
	 * This deletes the customer using the API and then redirects to the customer list page.
	 */
	const handleDelete = async (customerName, companyId) => {
		try {
			// Call the API to delete the customer
			await EasyRFQApi.deleteCustomer(customerName, companyId);
			// After successful deletion, navigate to the customer list page
			navigate("/customers");
		} catch (err) {
			// Log any errors that occur during the delete operation
			console.error("Error deleting customer:", err);
		}
	};

	// If the data is still loading, display a loading message
	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="PageDetail">
			<div className="PageDetail-header">
				<h1>Customer Maintenance</h1>
			</div>
			<section className="PageDetails">
				<div>
					<h2>{customer.companyName}</h2>
					{/* Display the edit buttons based on the editing state */}
					{!isEditing ? (
						<button onClick={() => setIsEditing(true)}>Edit details</button>
					) : (
						<>
							<button onClick={handleSave}>Save</button>
							<button onClick={handleCancel}>Cancel</button>
						</>
					)}
				</div>
				{/* Render form fields dynamically from the formData */}
				<form className="PageDetail-form">
					{Object.entries(formData).map(([key, value]) => (
						<div key={key}>
							<label>{key.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}:</label>
							{/* Handle rendering of specific form fields */}
							{key === "state" ? (
								<select name={key} value={value} onChange={handleChange} disabled={!isEditing}>
									<option value="">Select a state</option>
									{usStateAbbreviations.map((state) => (
										<option key={state} value={state}>
											{state}
										</option>
									))}
								</select>
							) : key === "markupType" ? (
								<select name={key} value={value} onChange={handleChange} disabled={!isEditing}>
									<option value="percentage">Percentage</option>
									<option value="fixed">Fixed</option>
								</select>
							) : (
								<input
									type={typeof value === "number" ? "number" : "text"} // Dynamically choose input type based on value type
									name={key}
									value={value}
									onChange={handleChange}
									disabled={!isEditing} // Disable input fields when not in editing mode
								/>
							)}
						</div>
					))}
				</form>
				{/* Button to delete the customer */}
				<button onClick={() => handleDelete(customerName, companyId)} style={{ marginTop: "10px" }} className="deleteButton" title="Delete">
					Delete item
				</button>
			</section>
		</div>
	);
};

export default CustomerDetail;
