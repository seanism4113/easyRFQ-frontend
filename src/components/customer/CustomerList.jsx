import { useEffect, useState, useContext } from "react";
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching data
import PagesTemplate from "../PagesTemplate"; // Template for displaying lists with optional search bar
import CustomerCard from "./CustomerCard"; // Component for rendering individual customer details
import AuthContext from "../../context/AuthContext";
import { useNavigate } from "react-router-dom"; // import useLocation

/**
 * This component fetches and displays a list of customers.
 * It includes functionality for filtering customers by name .
 * Displays them using the `CustomerCard` component and PagesTemplate
 */

const CustomerList = () => {
	// State to store the list of customers
	// State to track whether the data is loading
	// State to store the search term entered by the user
	const [customers, setCustomers] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");

	// Get the logged-in user context
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user;

	const navigate = useNavigate();

	/**
	 * Calls the `getCustomers` method from the `EasyRFQApi`
	 * to fetch the list of customers and updates the state with the fetched data.
	 */

	const fetchCustomers = async () => {
		try {
			const companyId = loggedUser?.company?.companyId;
			// Now passing the companyId as a query parameter
			const allCustomers = await EasyRFQApi.getUserCustomers(companyId);

			// Update the state with the fetched customers
			setCustomers(allCustomers);
		} catch (err) {
			console.error("Error fetching customers:", err);
		} finally {
			// Ensure the loading state is set to false
			setIsLoading(false);
		}
	};

	// useEffect Hook to fetch the list of customers.
	useEffect(() => {
		if (loggedUser) {
			fetchCustomers();
		}
	}, [loggedUser]);

	// Filter the customers based on the search term.
	// Ensure you're filtering based on the correct property (like `customer_name`)
	const filteredCustomers = (customers || []).filter((customer) => customer.customerName.toLowerCase().includes(searchTerm.toLowerCase()));

	// Navigate to the 'new customer' page when the button is clicked
	const handleAddCustomer = () => {
		navigate("new");
	};

	return (
		<>
			<PagesTemplate
				isLoading={isLoading} // Pass loading state to `PagesTemplate`
				data={filteredCustomers} // Pass the filtered list of customers
				renderItem={(customer, index) => <CustomerCard customer={customer} />} // Use the index as key for now
				onSearch={setSearchTerm} // Pass the search term setter to `PagesTemplate`
				searchBy="Search by customer..." // Placeholder text for the search bar
				actionButton={
					<button className="addCustomer-btn" onClick={handleAddCustomer}>
						Add New Customer
					</button>
				}
				customKeyValue={(item) => `${item.customerName}-${item.customerName.length}`}
			/>
		</>
	);
};

export default CustomerList;
