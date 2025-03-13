import { Link } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext"; // Importing the AuthContext to access the logged-in user's data
import "../styles/PageCard.css";

/**
 * CustomerCard component displays a card for a single customer.
 * The card is a clickable link that navigates to the customer's detailed page
 * based on the customer's name and the logged-in user's company ID.
 */

const CustomerCard = ({ customer }) => {
	// Accessing the current user data from AuthContext
	const { currentUser } = useContext(AuthContext);

	// Destructuring the logged-in user's data from the context (if available)
	const loggedUser = currentUser?.user;

	return (
		// Link component used to create a navigable area for the customer card.
		// It redirects to the customer's detail page based on the customer's name
		// and the logged-in user's company ID for the query parameter.
		<Link to={`/customers/${customer.customerName}?companyId=${loggedUser?.company?.companyId}`} className="PageCard-link">
			{/* Card container that displays customer information */}
			<div className="PageCard">
				{/* Customer name displayed as a heading */}
				<h3>{customer.customerName}</h3>
			</div>
		</Link>
	);
};

export default CustomerCard;
