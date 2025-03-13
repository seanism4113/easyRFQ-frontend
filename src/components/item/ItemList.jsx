import { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Keep EasyRFQApi as requested
import PagesTemplate from "../PagesTemplate"; // Template for displaying lists with optional search bar
import ItemCard from "./ItemCard"; // Component for rendering individual item details
import AuthContext from "../../context/AuthContext";

/**
 * This component fetches and displays a list of items.
 * It includes functionality for filtering items by code.
 * Displays them using the `ItemCard` component and PagesTemplate.
 */

const ItemList = () => {
	// State to store the list of items
	const [items, setItems] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Get the logged-in user context
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user;
	const companyId = loggedUser?.company?.companyId; // Ensure companyId is available

	const navigate = useNavigate();

	/**
	 * Calls the `getUserItems` method from `EasyRFQApi`
	 * to fetch the list of items and updates the state.
	 */
	const fetchItems = async () => {
		if (!companyId) return;

		try {
			const allItems = await EasyRFQApi.getUserItems(companyId); // Keep EasyRFQApi
			setItems(allItems); // Update state with fetched items
		} catch (err) {
			console.error("Error fetching items:", err);
		} finally {
			setIsLoading(false);
		}
	};

	// useEffect Hook to fetch the list of items on mount and when `loggedUser` changes.
	useEffect(() => {
		if (companyId) {
			fetchItems();
		}
	}, [companyId]);

	// Filter items based on the search term
	const filteredItems = items.filter(
		(item) => item.itemCode.toLowerCase().includes(searchTerm.toLowerCase()) // Ensure correct property reference
	);

	// Navigate to the 'new item' page when the button is clicked
	const handleAddItem = () => {
		navigate("new");
	};

	return (
		<PagesTemplate
			isLoading={isLoading} // Pass loading state to `PagesTemplate`
			data={filteredItems} // Pass the filtered list of items
			renderItem={(item) => <ItemCard item={item} />} // Render each item using `ItemCard`
			onSearch={setSearchTerm} // Pass the search term setter to `PagesTemplate`
			searchBy="Search by item code..." // Placeholder text for the search bar
			actionButton={
				<button className="addItem-btn" onClick={handleAddItem}>
					Add New Item
				</button>
			}
		/>
	);
};

export default ItemList;
