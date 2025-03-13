import { Link } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Import the API utility to interact with backend data
import "../styles/PageTable.css";

/**
 * QuoteTable Component
 * Displays a table of quotes with details such as quote number, total price, customer, user, validity date, and actions (delete).
 * Handles deleting quotes and updates the quote list after deletion.
 */

const QuoteTable = ({ quotes, setQuoteUpdated }) => {
	/**
	 * Handles the delete action for a specific quote.
	 * It calls the API to delete the quote and updates the quote list after a successful deletion.
	 */
	const handleDelete = async (quoteId, userId) => {
		try {
			// Call the delete API to remove the quote with the provided quoteId and userId
			await EasyRFQApi.deleteQuote(quoteId, userId);
			// Trigger re-fetch of the quotes after deletion by toggling the state
			setQuoteUpdated((prev) => !prev);
		} catch (err) {
			console.error("Error deleting Quote item:", err);
		}
	};

	return (
		<table className="PageTable">
			{/* Table header */}
			<thead>
				<tr>
					<th>Quote#</th>
					<th>Total $</th>
					<th>Customer</th>
					<th>User</th>
					<th>Valid until</th>
					<th>Actions</th>
				</tr>
			</thead>
			<tbody>
				{/* Render rows for each quote in the quotes array */}
				{quotes.length > 0 ? (
					// If there are quotes, map over them and display each quote's data in a row
					quotes.map((quote) => (
						<tr key={quote.id}>
							{/* Quote number is wrapped in a Link to navigate to the quote details page */}
							<td>
								<Link to={`/quotes/${quote.id}?userId=${quote.userId}`} className="PageTable-link">
									<span>{quote.quoteNumber}</span>
								</Link>
							</td>
							{/* Format and display the quote total price with 2 decimal places */}
							<td>
								{Number(quote.quotetotal).toLocaleString(undefined, {
									minimumFractionDigits: 2,
									maximumFractionDigits: 2,
								})}
							</td>
							{/* Display the customer name associated with the quote */}
							<td>{quote.customerName}</td>
							{/* Display the full name of the user associated with the quote */}
							<td>{quote.userFullName}</td>
							{/* Format and display the valid until date in a readable format */}
							<td>
								{new Date(quote.validUntil).toLocaleString("en-US", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
									hour12: true,
								})}
							</td>
							{/* Action button to delete the quote */}
							<td>
								<button onClick={() => handleDelete(quote.id, quote.userId)} className="deleteButton" title="Delete">
									<i className="fa fa-trash"></i> {/* Trash icon for visual indication of delete action */}
								</button>
							</td>
						</tr>
					))
				) : (
					// If no quotes are available, display a message indicating no quotes were found
					<tr>
						<td colSpan="6">No Quotes found.</td>
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default QuoteTable;
