import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Import AuthContext to access the logged-in user
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data, specifically for item creation
import "../styles/Forms.css";
import ResponseMessage from "../auth/ResponseMessage"; // Import component to display response messages (e.g., errors)
import { commonUOMs } from "../../helpers"; // Import common units of measure for the UOM selection

/**
 * The ItemForm component is used to create a new item in the system.
 * The form includes fields for the item code, description, unit of measure, and cost.
 * The companyId is automatically included in the form data when submitting the item.
 */

const ItemForm = () => {
	// Initial form data structure with empty values
	const INITIAL_INPUT = {
		itemCode: "",
		description: "",
		uom: "",
		cost: "",
		companyId: "", // The companyId will be dynamically assigned based on the logged-in user
	};

	// Use the AuthContext to access the logged-in user and companyId
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user;
	const companyId = loggedUser?.company?.companyId; // Retrieve the companyId of the logged-in user

	const navigate = useNavigate();

	// State to manage form data, initialized with the companyId
	const [formData, setFormData] = useState({
		...INITIAL_INPUT,
		companyId: companyId || "", // Ensure companyId is included in the form data
	});

	// State for tracking any error messages during form submission
	const [errorMessage, setErrorMessage] = useState(null);

	/**
	 * Handles input changes for the form fields.
	 * Updates the state (formData) when a user changes any field.
	 */
	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevData) => ({ ...prevData, [name]: value }));
	};

	/**
	 * Handles form submission.
	 * Prevents default form submission, sends a request to create a new item via API,
	 * and navigates to the items page on success.
	 */
	const handleSubmit = async (evt) => {
		evt.preventDefault();

		try {
			// Call the API to create the item with the form data, including companyId
			await EasyRFQApi.createItem(formData);

			// Clear the form data after successful submission
			setFormData({ ...INITIAL_INPUT, companyId: companyId || "" });

			// Navigate to the items page after successfully creating the item
			navigate("/items");
		} catch (err) {
			console.error("Error creating item:", err);
			setErrorMessage(err);
		}
	};

	return (
		<div className="modal2">
			{/* Modal header displaying the title of the form */}
			<div className="ItemForm-header">
				<h1>Create Item</h1>
			</div>
			<section className="ItemForm-details">
				{/* Form to create a new item, calling handleSubmit on submit */}
				<form className="ItemForm-form" onSubmit={handleSubmit}>
					<div>
						{/* Input field for Item Code */}
						<label htmlFor="itemCode">Item Code:</label>
						<input id="itemCode" type="text" name="itemCode" value={formData.itemCode} onChange={handleChange} required />
					</div>

					<div>
						{/* Input field for Item Description */}
						<label htmlFor="itemDescription">Description:</label>
						<input id="itemDescription" type="text" name="description" value={formData.description} onChange={handleChange} required />
					</div>

					<div>
						{/* Select field for Unit of Measure (UOM), options come from commonUOMs */}
						<label htmlFor="itemUom">Unit of Measure:</label>
						<select id="itemUom" name="uom" value={formData.uom} onChange={handleChange} required>
							<option value="">Select UOM</option>
							{/* Dynamically generate options for UOM based on commonUOMs array */}
							{commonUOMs.map((uom) => (
								<option key={uom} value={uom}>
									{uom}
								</option>
							))}
						</select>
					</div>

					<div>
						{/* Input field for Item Cost */}
						<label htmlFor="itemCost">Cost:</label>
						<input id="itemCost" type="number" name="cost" value={formData.cost} step="0.01" onChange={handleChange} required />
					</div>

					{/* Display error message if there is one */}
					<ResponseMessage messageType="error" message={errorMessage} />

					<div>
						{/* Submit button to create the item */}
						<button type="submit">Save</button>
					</div>
				</form>
			</section>
		</div>
	);
};

export default ItemForm;
