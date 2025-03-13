import { Link } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Import the API utility to handle RFQ-related API requests
import "../styles/PageTable.css";

/**
 * RfqTable component receives a list of RFQs (rfqs) and a function to trigger updates (setRfqUpdated).
 * It renders a table displaying the RFQ details and allows users to delete RFQs.
 */
const RfqTable = ({ rfqs, setRfqUpdated }) => {
	/**
	 * handleDelete is an async function that is triggered when a user clicks the "Delete" button.
	 * It sends a request to delete an RFQ by its ID and user ID, and then toggles the rfqUpdated state
	 * to re-fetch and refresh the list of RFQs after deletion.
	 * @param {string} rfqId - The ID of the RFQ to be deleted.
	 * @param {string} userId - The ID of the user associated with the RFQ.
	 */
	const handleDelete = async (rfqId, userId) => {
		try {
			// Attempt to delete the RFQ using the EasyRFQApi
			await EasyRFQApi.deleteRfq(rfqId, userId);

			// After successful deletion, toggle the state to trigger a re-fetch of RFQs
			setRfqUpdated((prev) => !prev);
		} catch (err) {
			console.error("Error deleting RFQ item:", err);
		}
	};

	return (
		<table className="PageTable">
			{/* Table Header Row */}
			<thead>
				<tr>
					<th>RFQ#</th>
					<th>Total $</th>
					<th>Customer</th>
					<th>User</th>
					<th>Created Date</th>
					<th>Actions</th>
				</tr>
			</thead>

			<tbody>
				{/* Check if there are RFQs to display */}
				{rfqs.length > 0 ? (
					// If RFQs exist, map through each RFQ and display a table row for each
					rfqs.map((rfq) => (
						<tr key={rfq.id}>
							{/* RFQ Number - Link to the individual RFQ detail page */}
							<td>
								<Link to={`/rfqs/${rfq.id}?userId=${rfq.userId}`} className="PageTable-link">
									<span>{rfq.rfqNumber}</span> {/* Display RFQ number */}
								</Link>
							</td>
							{/* Total RFQ amount, formatted to two decimal places */}
							<td>
								{Number(rfq.rfqtotal).toLocaleString(undefined, {
									minimumFractionDigits: 2, //Ensures two decimal places
									maximumFractionDigits: 2,
								})}
							</td>
							<td>{rfq.customerName}</td>
							{/* Customer Name */}

							<td>{rfq.userFullName}</td>
							{/* User's Full Name */}

							<td>
								{/* Creation Date - Formatting the date in a readable format */}
								{new Date(rfq.createdAt).toLocaleString("en-US", {
									year: "numeric",
									month: "2-digit",
									day: "2-digit",
									hour: "2-digit",
									minute: "2-digit",
									second: "2-digit",
									hour12: true,
								})}
							</td>
							<td>
								{/* Action Buttons - Delete button */}
								<button onClick={() => handleDelete(rfq.id, rfq.userId)} className="deleteButton" title="Delete">
									{/* Delete button with an icon, triggers handleDelete when clicked */}
									<i className="fa fa-trash"></i>
								</button>
							</td>
						</tr>
					))
				) : (
					// If no RFQs are found, display a message indicating no RFQs are available
					<tr>
						<td colSpan="6">No RFQs found.</td> {/* Spans across all columns */}
					</tr>
				)}
			</tbody>
		</table>
	);
};

export default RfqTable;
