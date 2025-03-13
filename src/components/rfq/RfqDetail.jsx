import { useEffect, useState, useContext } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data;
import AuthContext from "../../context/AuthContext"; // Context for authentication
import { commonUOMs } from "../../helpers"; // List of common UOMs (Units of Measurement)
import "../styles/PageDetail.css";
import "font-awesome/css/font-awesome.min.css"; // FontAwesome icons for buttons

const RfqDetail = () => {
	const { rfqId } = useParams(); // Get the RFQ ID from the URL
	const [rfq, setRfq] = useState(null); // State to store RFQ details
	const [isLoading, setIsLoading] = useState(true); // State to manage loading state
	const [editingItem, setEditingItem] = useState(null); // Track which item is being edited
	const [formData, setFormData] = useState({}); // Form data for editing item
	const [newRow, setNewRow] = useState(null); // State for handling new item row
	const [rfqUpdated, setRfqUpdated] = useState(false); // State for triggering re-fetch of RFQ data

	// Retrieve the logged-in user's details from the AuthContext
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user;
	const companyId = loggedUser?.company?.companyId;
	const navigate = useNavigate(); // Navigation hook for programmatic navigation
	const location = useLocation(); // Location hook for URL search parameters
	const params = new URLSearchParams(location.search); // Parse search params from URL
	const userId = params.get("userId"); // Get the userId from search parameters

	/** Fetch RFQ details from API */
	const fetchRfqData = async () => {
		try {
			const rfqData = await EasyRFQApi.getRfq(rfqId, userId);

			// Ensure rfqData and rfqItems exist before setting state
			if (rfqData && rfqData.rfqItems) {
				rfqData.rfqItems.sort((a, b) => a.id - b.id); // Sort items by id to maintain order
			}

			setRfq(rfqData); // Update the RFQ state with the fetched data
		} catch (err) {
			console.error("Error fetching RFQ details:", err);
		} finally {
			setIsLoading(false); // Set loading to false after fetching
		}
	};

	// Fetch RFQ data when the component mounts or when rfqId or rfqUpdated changes
	useEffect(() => {
		const fetchData = async () => {
			await fetchRfqData();
		};

		fetchData();
	}, [rfqId, rfqUpdated]);

	// If data is still loading, display a loading message
	if (isLoading) return <p>Loading...</p>;

	/** Handle when an Edit button is clicked */
	const handleEditClick = (item) => {
		setEditingItem(item.id); // Use item id for editing
		setFormData({
			itemCode: item.itemCode,
			quantity: item.quantity,
			itemUom: item.itemUom,
			itemDescription: item.itemDescription,
			itemCost: item.itemCost,
		}); // Populate form data with the item's current details
	};

	/** Handle form input changes during editing */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prev) => ({ ...prev, [name]: value })); // Update form data for the specific input
	};

	/** Handle Save */
	const handleSave = async (itemCode, rfqItemId) => {
		try {
			// Update item details in API (do not include itemCode)
			await EasyRFQApi.editItem(companyId, itemCode, {
				uom: formData.itemUom,
				description: formData.itemDescription,
				cost: parseFloat(formData.itemCost),
			});

			// Update quantity in rfq_items in API
			await EasyRFQApi.editRfqItem(rfqItemId, companyId, { quantity: parseInt(formData.quantity) });

			// Correct state update logic: Update the specific item in the list without changing the order
			setRfq((prevRfq) => {
				const updatedRfqItems = prevRfq.rfqItems.map((item) =>
					item.id === rfqItemId // Match by ID to update the correct item
						? {
								...item,
								quantity: parseInt(formData.quantity),
								itemUom: formData.itemUom,
								itemDescription: formData.itemDescription,
								itemCost: parseFloat(formData.itemCost),
						  }
						: item
				);

				return {
					...prevRfq,
					rfqItems: updatedRfqItems, // Keep the existing order intact
				};
			});

			setEditingItem(null); // Clear the editing state
		} catch (err) {
			console.error("Error updating RFQ item:", err);
		}
	};

	/** Handle Add New Item */
	const handleAddItem = () => {
		setNewRow({
			itemCode: "",
			quantity: "",
			itemUom: "",
			itemDescription: "",
			itemCost: "",
		}); // Initialize the new row with empty fields
	};

	/** Handle Cancel New Row */
	const handleCancelNewRow = () => {
		setNewRow(null); // Reset the new row state
	};

	/** Handle Save New Row */
	const handleSaveNewRow = async () => {
		try {
			let createdItem, createdRfqItem;

			let existingItem; // Try fetching the item to check if it already exists in the system
			try {
				existingItem = await EasyRFQApi.getItem(companyId, newRow.itemCode);
			} catch (error) {
				console.error("Error fetching item:", error);
				existingItem = false; // Treat errors as "item not found"
			}

			if (existingItem) {
				// If the item exists, PATCH it to update any changes
				await EasyRFQApi.editItem(companyId, existingItem.itemCode, {
					item_code: newRow.itemCode,
					uom: newRow.itemUom,
					description: newRow.itemDescription,
					cost: parseFloat(newRow.itemCost),
					company_id: companyId,
				});
				// Now, create the RFQ item with the existing item code
				createdRfqItem = await EasyRFQApi.createRfqItem({
					rfq_id: rfq.id,
					item_code: existingItem.itemCode,
					quantity: parseInt(newRow.quantity),
					company_id: companyId,
					item_description: newRow.itemDescription,
					item_cost: parseFloat(newRow.itemCost),
				});

				createdItem = existingItem; // Reuse the existing item data
			} else {
				// If the item does not exist, create a new one
				createdItem = await EasyRFQApi.createItem({
					itemCode: newRow.itemCode,
					description: newRow.itemDescription,
					uom: newRow.itemUom,
					cost: parseFloat(newRow.itemCost),
					companyId: companyId,
				});

				// Then create the RFQ item using the new item
				createdRfqItem = await EasyRFQApi.createRfqItem({
					rfq_id: rfq.id,
					item_code: createdItem.itemCode,
					quantity: parseInt(newRow.quantity),
					company_id: companyId,
					item_description: newRow.itemDescription,
					item_cost: parseFloat(newRow.itemCost),
				});
			}

			// Insert the new RFQ item without sorting
			setRfq((prevRfq) => {
				const updatedRfqItems = [
					...prevRfq.rfqItems,
					{
						...createdItem,
						quantity: parseInt(newRow.quantity),
						itemUom: newRow.itemUom,
						itemDescription: newRow.itemDescription,
						itemCost: parseFloat(newRow.itemCost),
						total: (parseFloat(newRow.itemCost) * parseInt(newRow.quantity)).toFixed(2), // Add total here
						id: createdRfqItem.id,
					},
				];

				return {
					...prevRfq,
					rfqItems: updatedRfqItems,
				};
			});

			// Clear the new row after saving
			setNewRow(null);
		} catch (err) {
			console.error("Error saving new RFQ item:", err);
		}
	};

	/** Get the first two words of the item description */
	const getFirstTwoWords = (description) => {
		if (!description) return ""; // Return empty if no description exists
		const words = description.split(" "); // Split the description into words
		return words.slice(0, 2).join(" "); // Join the first two words and return
	};

	/** Handle deleting an RFQ item */
	const handleDelete = async (itemCode) => {
		try {
			await EasyRFQApi.deleteRfqItem(itemCode, companyId); // Call API to delete the RFQ item
			setRfqUpdated((prev) => !prev); // Toggle state to force re-fetch of RFQ items
		} catch (err) {
			console.error("Error deleting RFQ item:", err);
		}
	};

	/** Columns for RFQ item table */
	const columns = [
		{ header: "Line", key: "line" },
		{ header: "Item Code", key: "itemCode" },
		{ header: "Quantity", key: "quantity" },
		{ header: "UOM", key: "itemUom" },
		{ header: "Description", key: "itemDescription" },
		{ header: "Cost", key: "cost" },
		{ header: "Total", key: "total" },
		{ header: "Actions", key: "actions" },
	];

	/** Calculate the total cost (quantity * cost) */
	const getTotalCost = (quantity, cost) => {
		return (quantity * cost).toFixed(2); // Return formatted total cost
	};

	/** Redirect to the quote form page */
	const goToQuoteForm = () => {
		navigate("/quotes/new", {
			state: {
				rfqData: rfq, // Pass RFQ data as state to the quote form
			},
		});
	};

	return (
		<div className="PageDetail">
			{/* Page Header */}
			<div className="PageDetail-header">
				<h1>RFQ Details</h1>
			</div>

			{/* Convert RFQ to Quote Button */}
			<section className="PageTable-section">
				{/* Button that triggers conversion from RFQ to Quote */}
				<div>
					<h2>
						<button onClick={goToQuoteForm}>Convert to Quote</button>
					</h2>
				</div>

				{/* Add Item Button */}
				{/* This button triggers the display of a new row form to add an item */}
				<button onClick={handleAddItem} className="addButton">
					<i className="fa fa-plus"></i> Add Item
				</button>

				{/* RFQ Table */}
				{/* This table displays the list of items in the RFQ */}
				<table className="PageTable">
					<thead>
						<tr>
							{/* Mapping through the columns array to generate the table header */}
							{columns.map((col) => (
								<th key={col.key}>{col.header}</th> // Displaying each column header
							))}
						</tr>
					</thead>
					<tbody>
						{/* Loop through rfqItems to render each item row */}
						{rfq?.rfqItems?.map((item, index) => {
							return (
								<tr key={item.id}>
									{/* Displaying row number (index + 1) */}
									<td>{index + 1}</td>

									{/* Conditionally render itemCode based on edit mode */}
									<td>{editingItem === item.id ? item.itemCode : item.itemCode}</td>

									{/* Conditionally render the quantity input field or show the quantity */}
									<td>
										{editingItem === item.id ? (
											<input
												type="number"
												name="quantity"
												value={formData.quantity}
												onChange={(e) => handleChange(e)} // Handle changes to the quantity input field
											/>
										) : (
											item.quantity // Show current quantity when not in edit mode
										)}
									</td>

									{/* Conditionally render itemUom (unit of measure) input field or show the current value */}
									<td>
										{editingItem === item.id ? (
											<select
												name="itemUom"
												value={formData.itemUom}
												onChange={(e) => handleChange(e)} // Handle changes to UOM selection
											>
												<option value="">Select UOM</option>
												{/* Render UOM options dynamically from commonUOMs array */}
												{commonUOMs.map((uom) => (
													<option key={uom} value={uom}>
														{uom}
													</option>
												))}
											</select>
										) : (
											item.itemUom // Display current UOM when not in edit mode
										)}
									</td>

									{/* Conditionally render item description input or show truncated description */}
									<td>
										{editingItem === item.id ? (
											<input
												type="text"
												name="itemDescription"
												value={formData.itemDescription}
												onChange={(e) => handleChange(e)} // Handle changes to the description
											/>
										) : (
											getFirstTwoWords(item.itemDescription) // Show first two words of the description when not in edit mode
										)}
									</td>

									{/* Conditionally render item cost input field or show the current item cost */}
									<td>
										{editingItem === item.id ? (
											<input
												type="number"
												step="0.01"
												name="itemCost"
												value={formData.itemCost}
												onChange={(e) => handleChange(e)} // Handle changes to the cost input field
											/>
										) : (
											item.itemCost // Show current item cost when not in edit mode
										)}
									</td>

									{/* Display total cost based on either the formData (edit mode) or current item data */}
									<td>
										{editingItem === item.id
											? getTotalCost(formData.quantity, formData.itemCost) // Total cost based on edited quantity and cost
											: getTotalCost(item.quantity, item.itemCost)}{" "}
										{/* Total cost based on existing data */}
									</td>

									{/* Conditionally render action buttons based on edit mode */}
									<td>
										{/* If item is being edited, show Save and Cancel buttons */}
										{editingItem === item.id ? (
											<>
												{/* Save button */}
												<button onClick={() => handleSave(item.itemCode, item.id)} className="saveButton" title="Save">
													<i className="fa fa-check"></i>
												</button>
												{/* Cancel button */}
												<button onClick={() => setEditingItem(null)} className="cancelButton" title="Cancel">
													<i className="fa fa-times"></i>
												</button>
											</>
										) : (
											<>
												{/* Edit button */}
												<button onClick={() => handleEditClick(item)} className="editButton" title="Edit">
													<i className="fa fa-edit"></i>
												</button>
												{/* Delete button */}
												<button onClick={() => handleDelete(item.id)} className="deleteButton" title="Delete">
													<i className="fa fa-trash"></i>
												</button>
											</>
										)}
									</td>
								</tr>
							);
						})}

						{/* Render new row for adding item if newRow exists */}
						{newRow && (
							<tr>
								<td></td>
								{/* Render form inputs for the new item row */}
								<td>
									<input
										type="text"
										name="itemCode"
										value={newRow.itemCode}
										onChange={(e) => setNewRow({ ...newRow, itemCode: e.target.value })} // Handle changes to item code
									/>
								</td>
								<td>
									<input
										type="number"
										name="quantity"
										value={newRow.quantity}
										onChange={(e) => setNewRow({ ...newRow, quantity: e.target.value })} // Handle changes to quantity
									/>
								</td>
								<td>
									<select
										name="itemUom"
										value={newRow.itemUom}
										onChange={(e) => setNewRow({ ...newRow, itemUom: e.target.value })} // Handle changes to UOM
									>
										<option value="">Select UOM</option>
										{/* Render UOM options dynamically */}
										{commonUOMs.map((uom) => (
											<option key={uom} value={uom}>
												{uom}
											</option>
										))}
									</select>
								</td>
								<td>
									<input
										type="text"
										name="itemDescription"
										value={newRow.itemDescription}
										onChange={(e) => setNewRow({ ...newRow, itemDescription: e.target.value })} // Handle changes to description
									/>
								</td>
								<td>
									<input
										type="number"
										name="itemCost"
										value={newRow.itemCost}
										onChange={(e) => setNewRow({ ...newRow, itemCost: e.target.value })} // Handle changes to cost
									/>
								</td>
								{/* Display total cost of the new row */}
								<td>{(newRow.itemCost * newRow.quantity).toFixed(2)}</td>
								{/* Save and Cancel buttons for new row */}
								<td>
									<button onClick={handleSaveNewRow} className="saveButton">
										<i className="fa fa-check"></i>
									</button>
									<button onClick={handleCancelNewRow} className="cancelButton">
										<i className="fa fa-times"></i>
									</button>
								</td>
							</tr>
						)}
					</tbody>
				</table>

				{/* Extended RFQ Info */}
				{/* This section displays additional details about the RFQ */}
				<div className="PageDetail-extended-info">
					{/* Display RFQ number */}
					<span>
						<b>RFQ#:</b>&nbsp;
						{rfq.rfqNumber}
					</span>
					{/* Display customer name */}
					<span>
						<b>Customer:</b>&nbsp;
						{rfq.customerName}
					</span>
					{/* Display user who created the RFQ */}
					<span>
						<b>Created by:</b>&nbsp;
						{rfq.userFullName}
					</span>
					{/* Display creation timestamp in a human-readable format */}
					<span>
						<b>Created:</b>&nbsp;
						{new Date(rfq.createdAt).toLocaleString("en-US", {
							year: "numeric",
							month: "2-digit",
							day: "2-digit",
							hour: "2-digit",
							minute: "2-digit",
							second: "2-digit",
							hour12: true,
						})}
					</span>
				</div>
			</section>
		</div>
	);
};

export default RfqDetail;
