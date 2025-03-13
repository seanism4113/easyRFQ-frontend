import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Import the API utility to interact with backend
import { commonUOMs } from "../../helpers"; // Import predefined units of measure (UOM)
import "../styles/PageDetail.css";

/**
 * The ItemDetail component displays detailed information for a specific item.
 * It retrieves the item data based on the 'itemCode' and displays it, allowing the user to edit or delete the item.
 */
const ItemDetail = () => {
	// Extract the itemCode from the URL parameters using useParams hook
	const { itemCode } = useParams();
	const location = useLocation(); // Get the current location object to access query parameters
	const navigate = useNavigate();

	// Retrieve companyId from the URL query string
	const urlParams = new URLSearchParams(location.search);
	const companyId = urlParams.get("companyId");

	// State hooks for item data, loading status, editing mode, and form data
	const [item, setItem] = useState(null);
	const [isLoading, setIsLoading] = useState(true);
	const [isEditing, setIsEditing] = useState(false);
	const [formData, setFormData] = useState({
		itemCode: "",
		description: "",
		uom: "",
		cost: "",
	});

	/** Fetches the item details from the API based on the itemCode and companyId */
	const fetchItemData = async () => {
		try {
			// Call the API to get the item details
			const itemData = await EasyRFQApi.getItem(companyId, itemCode);

			// Set the fetched item data to the state
			setItem(itemData);
			setFormData({
				itemCode: itemData.itemCode || "",
				description: itemData.description || "",
				uom: itemData.uom || "",
				cost: itemData.cost || "",
			});
		} catch (err) {
			console.error("Error fetching item details:", err);
		} finally {
			// Set loading state to false after data is fetched (success or error)
			setIsLoading(false);
		}
	};

	// useEffect hook to fetch item details on component mount or when itemCode or companyId changes
	useEffect(() => {
		fetchItemData();
	}, [itemCode, companyId]);

	/** Handles form input changes and updates the formData state */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	/** Handles form submission to update the item */
	const handleSubmit = async () => {
		try {
			// Destructure formData to exclude itemCode as it's not part of the update request
			const { itemCode, ...updateData } = formData;

			// Call the API to update the item with the new form data
			const updatedItem = await EasyRFQApi.editItem(companyId, itemCode, updateData);

			// Update the state with the response data from the API (updated item)
			setItem(updatedItem);
			setFormData({
				itemCode: updatedItem.itemCode || "",
				description: updatedItem.description || "",
				uom: updatedItem.uom || "",
				cost: updatedItem.cost || "",
			});
			// Exit editing mode
			setIsEditing(false);
		} catch (err) {
			console.error("Error updating item:", err);
		}
	};

	/** Handles cancel action and resets the form to the original item details */
	const handleCancel = () => {
		setFormData({
			itemCode: item.itemCode || "",
			description: item.description || "",
			uom: item.uom || "",
			cost: item.cost || "",
		});
		// Exit editing mode
		setIsEditing(false);
	};

	/** Handles the delete action for the item */
	const handleDelete = async (companyId, itemCode) => {
		try {
			// Call the API to delete the item
			await EasyRFQApi.deleteItem(companyId, itemCode);
			// Redirect to the items list page after successful deletion
			navigate(`/items/?companyId=${companyId}`);
		} catch (err) {
			console.error("Error deleting item:", err);
		}
	};

	// If the item is still loading, show a loading message
	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="PageDetail">
			{/* Page header displaying the title of the page */}
			<div className="PageDetail-header">
				<h1>Item Maintenance</h1>
			</div>
			<section className="PageDetails">
				{/* Display the item code as the main title of the item */}
				<div>
					<h2>{item.itemCode}</h2>
					{/* Toggle between "Edit details" button or "Save" and "Cancel" buttons */}
					{!isEditing ? (
						<button onClick={() => setIsEditing(true)}>Edit details</button>
					) : (
						<>
							<button onClick={handleSubmit}>Save</button>
							<button onClick={handleCancel}>Cancel</button>
						</>
					)}
				</div>
				{/* Item detail form */}
				<form className="PageDetail-form">
					<div>
						{/* Displaying the item code input (disabled because it's read-only) */}
						<label htmlFor="itemCode">Item Code:</label>
						<input id="itemCode" type="text" name="itemCode" value={formData.itemCode} onChange={handleChange} disabled />
					</div>

					<div>
						{/* Description field - editable only when in editing mode */}
						<label htmlFor="description">Description:</label>
						<input id="description" type="text" name="description" value={formData.description} onChange={handleChange} disabled={!isEditing} />
					</div>

					<div>
						{/* Unit of Measure (UOM) selection - editable only when in editing mode */}
						<label htmlFor="uom">Unit of Measure:</label>
						<select id="uom" name="uom" value={formData.uom} onChange={handleChange} disabled={!isEditing}>
							<option value="">Select UOM</option>
							{/* Dynamically rendering UOM options from the imported commonUOMs array */}
							{commonUOMs.map((uom) => (
								<option key={uom} value={uom}>
									{uom}
								</option>
							))}
						</select>
					</div>

					<div>
						{/* Cost field - editable only when in editing mode */}
						<label htmlFor="cost">Unit Cost:</label>
						<input id="cost" type="number" name="cost" value={formData.cost} onChange={handleChange} disabled={!isEditing} />
					</div>
				</form>
				{/* Button to delete the item */}
				<button onClick={() => handleDelete(companyId, itemCode)} style={{ marginTop: "10px" }} className="deleteButton" title="Delete">
					Delete item
				</button>
			</section>
		</div>
	);
};

export default ItemDetail;
