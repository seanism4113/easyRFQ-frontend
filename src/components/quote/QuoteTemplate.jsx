import { useEffect, useState } from "react";
import { EasyRFQApi } from "../../api/mainApi"; // API utility to fetch quote data
import { useLocation, useParams } from "react-router-dom";
import "../styles/QuoteTemplate.css";

/**
 * QuoteTemplate Component
 * This component displays a detailed quote, including customer information, quote items, total amount, service fees, and special notes.
 * It fetches the quote details and associated customer and user data from the backend.
 */

const QuoteTemplate = () => {
	// State hooks for storing quote data, customer details, user details, and loading status
	const [quote, setQuote] = useState(null);
	const [customer, setCustomer] = useState(null);
	const [user, setUser] = useState(null);
	const [isLoading, setIsLoading] = useState(true);

	// Get the quoteId from URL parameters and the userId from the query parameters
	const { quoteId } = useParams(); // URL parameter for quote ID
	const location = useLocation(); // Get current URL location
	const params = new URLSearchParams(location.search); // Get query parameters from URL
	const userId = params.get("userId"); // Extract userId from query params

	/**
	 * Fetches the quote details along with the associated user and customer information.
	 * It updates the state with the fetched data.
	 */
	const fetchQuote = async () => {
		try {
			// Fetch the quote data from the backend using EasyRFQApi
			const quoteDetails = await EasyRFQApi.getQuote(quoteId, userId);
			setQuote(quoteDetails); // Set the fetched quote data in state

			// Fetch the user data associated with the quote (user who created the quote)
			const userDetails = await EasyRFQApi.getUser(quoteDetails.userId);
			setUser(userDetails); // Set the user data in state

			// Fetch the customer details based on the customerName and companyId from the quote
			const customerDetails = await EasyRFQApi.getCustomer(quoteDetails.customerName, quoteDetails.companyId);
			setCustomer(customerDetails); // Set the customer data in state
		} catch (err) {
			console.error("Error fetching quote details:", err);
		} finally {
			// Set loading state to false after data is fetched or an error occurs
			setIsLoading(false);
		}
	};

	// useEffect hook to fetch quote details whenever the quoteId changes
	useEffect(() => {
		if (quoteId) {
			fetchQuote(); // Fetch the quote when the component mounts or quoteId changes
		}
	}, [quoteId]);

	/**
	 * Formats the date string to a more user-friendly format (MM/DD/YYYY).
	 * @param {string} dateString - The date string to format
	 * @returns {string} - The formatted date
	 */
	const formatDate = (dateString) => {
		const date = new Date(dateString); // Convert date string to Date object
		return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`; // Format date to MM/DD/YYYY
	};

	// Display loading spinner if data is still being fetched
	if (isLoading) {
		return <div>Loading...</div>;
	}

	// Display error message if no quote is found
	if (!quote) {
		return <div>Quote not found</div>;
	}

	// Calculate the total price of the quote, including the service fee if applicable
	const quoteTotal =
		quote.quoteItems?.reduce((total, item) => {
			// Add each item's total (item price * quantity) to the total
			return total + item.itemPrice * item.quantity;
		}, 0) + (customer.markupType === "fixed" ? Number(customer.markup) : 0); // Add service fee if markup type is "fixed"

	return (
		<div className="quote-container">
			{/* Quote Header */}
			<div className="quote-header">
				{/* Left side of the header with company information */}
				<div className="quote-header-left">
					{/* Company name and address */}
					<span>{user.user.company.companyName}</span>
					<span>{user.user.company.companyAddressLine1}</span>
					<span>{user.user.company.companyAddressLine2}</span>
					<div>
						<span>{user.user.company.companyCity},&nbsp;</span>
						<span>{user.user.company.companyState}&nbsp;</span>
						<span>{user.user.company.companyCountry}</span>
					</div>
					{/* Company phone number */}
					<span>Phone: {user.user.company.companyPhoneMain}</span>
				</div>

				{/* Right side of the header with quote-specific information */}
				<div className="quote-header-right">
					<h1>Quote</h1>
					{/* Quote number */}
					<span>
						<b>Quote#:</b> {quote.quoteNumber}
					</span>
					{/* Quote creation date */}
					<span>
						<b>Quote Date:</b> {formatDate(quote.createdAt)}
					</span>
					{/* Quote validity date */}
					<span>
						<b>Valid Until:</b> {formatDate(quote.validUntil)}
					</span>
				</div>
			</div>

			{/* Customer Billing Information */}
			<div className="quote-info">
				<div className="quote-info-left">
					<h3>Bill To</h3>
					{/* Customer name and address */}
					<span>{customer.customerName}</span>
					<span>{customer.addressLine1}</span>
					<span>{customer.addressLine2}</span>
					<div>
						<span>{customer.city},&nbsp;</span>
						<span>{customer.state}&nbsp;</span>
						<span>{customer.country}</span>
					</div>
					{/* Customer phone number */}
					<span>Phone: {customer.phoneMain}</span>
				</div>
			</div>

			{/* Quote Items Table */}
			<div className="quote-items">
				{/* Render a table of quote items */}
				<table>
					<thead>
						<tr>
							{/* Table column headers */}
							<th>Item</th>
							<th>Description</th>
							<th style={{ textAlign: "center" }}>Unit Price</th>
							<th style={{ textAlign: "center" }}>Quantity</th>
							<th style={{ textAlign: "center" }}>Total</th>
						</tr>
					</thead>
					<tbody>
						{/* Map over the quoteItems array to render each item */}
						{quote.quoteItems?.map((item, index) => (
							<tr key={index}>
								{/* Item code, description, price, quantity, and total */}
								<td>{item.itemCode}</td>
								<td>{item.itemDescription}</td>
								<td style={{ textAlign: "center" }}>${item.itemPrice}</td>
								<td style={{ textAlign: "center" }}>{item.quantity}</td>
								<td style={{ textAlign: "center" }}>${(item.itemPrice * item.quantity).toFixed(2)}</td>
							</tr>
						))}

						{/* Empty row between items and service fee */}
						<tr>
							<td></td>
							<td></td>
							<td></td>
							<td></td>
							<td style={{ textAlign: "center" }}>-</td>
						</tr>

						{/* Render the service fee if applicable */}
						{customer.markupType === "fixed" && (
							<tr>
								<td>Service Fee</td>
								<td>service charge</td>
								<td style={{ textAlign: "center" }}>{customer.markup}</td>
								<td style={{ textAlign: "center" }}>1</td>
								<td style={{ textAlign: "center" }}>${customer.markup}</td>
							</tr>
						)}

						{/* Display the total quote amount */}
						<tr>
							<td style={{ border: "none" }}></td>
							<td style={{ border: "none" }}></td>
							<td style={{ border: "none" }}></td>
							<td style={{ borderRight: "none", borderLeft: "none", padding: "5px", textAlign: "right" }}>
								<b>Total $:</b>
							</td>
							<td style={{ borderLeft: "none", padding: "5px", textAlign: "center" }}>
								<b>${quoteTotal.toFixed(2)}</b>
							</td>
						</tr>
					</tbody>
				</table>
			</div>

			{/* Display special notes if available */}
			{quote.notes && (
				<div className="quote-notes">
					<h3>Special Notes & Instructions</h3>
					<p>{quote.notes}</p>
				</div>
			)}

			{/* Footer with user contact information */}
			<div className="quote-footer">
				<p>
					For information or questions regarding this quote please contact {user.user.fullName}
					{user.user.phone && ` by phone at ${user.user.phone} or`}
					&nbsp;by email at {user.user.email}
				</p>
			</div>
		</div>
	);
};

export default QuoteTemplate;
