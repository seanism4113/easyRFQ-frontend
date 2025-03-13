import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext"; // Import the AuthContext to access the logged-in user's data
import "../styles/PageCard.css";

/**
 * The ItemCard component displays a card for a single item.
 * It links to the detailed page for the item using its unique code.
 */
const ItemCard = ({ item }) => {
	// Accessing the current logged-in user from the AuthContext
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Getting the user object from the currentUser (optional chaining)

	return (
		// Link component to create a clickable area that navigates to the detailed item page
		// The URL includes the itemCode as a path parameter and the companyId as a query parameter
		<Link to={`/items/${item.itemCode}?companyId=${loggedUser?.company?.companyId}`} className="PageCard-link">
			<div className="PageCard">
				{/* Displaying the item's unique code as a heading */}
				<h3>{item.itemCode}</h3>
				{/* Displaying a brief description of the item */}
				<p>{item.description}</p>
			</div>
		</Link>
	);
};

export default ItemCard;
