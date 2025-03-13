import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // AuthContext provides authentication-related data such as current user and token
import { EasyRFQApi } from "../api/mainApi"; // EasyRFQApi to fetch data from the API (e.g., counts of items, customers, etc.)
import "./styles/Home.css";

/**
 * Displays the homepage of the EasyRFQ application.
 * Depending on the user's authentication state, different sections are displayed (guest or logged-in).
 */

// Guest Section Component
// This is shown to the user when they are not logged in
const GuestSection = ({ navigate }) => (
	<div>
		{/* Informing the user about the features of the platform */}
		<p>Simplifying the process of creating and maintaining Requests for Quote (RFQ) and transforming it into a ready made Quote to send to the customer </p>
		<ul>
			<li>RFQ creation</li>
			<li>Quote creation</li>
			<li>Item Maintenance</li>
			<li>Customer Maintenance</li>
			<li>Customized to user information</li>
		</ul>
		{/* Buttons to allow the user to either log in or sign up */}
		<button onClick={() => navigate("/login")}>Log in</button>
		<button className="Home-SignUpbtn" onClick={() => navigate("/signup")}>
			Sign Up
		</button>
	</div>
);

// Logged In Header Section Component
// This is shown to the user when they are logged in, and displays a welcome message
const LoggedInHeaderSection = ({ loggedUser }) => (
	<div>
		{/* Display a personalized greeting to the user, using their full name if available */}
		<h2>Welcome {loggedUser?.fullName || "User"}!</h2>
	</div>
);

// Logged In Body Section Component
// This shows different counts of RFQs, Quotes, Inventory Items, and Customers, along with links to respective pages
const LoggedInBodySection = ({ rfqCount, quoteCount, itemCount, customerCount }) => (
	<section className="Home-loggedIn-body">
		{/* Displaying counts for different resources (RFQs, Quotes, Items, Customers) */}
		<div className="Home-loggedIn-divs">
			<h2>RFQs</h2>
			{/* Link to the RFQs page with the RFQ count displayed */}
			<a href="/rfqs" className="rfq-count-link">
				{rfqCount || 0}
			</a>
		</div>
		<div className="Home-loggedIn-divs">
			<h2>Quotes</h2>
			{/* Link to the Quotes page with the Quote count displayed */}
			<a href="/quotes" className="quote-count-link">
				{quoteCount || 0}
			</a>
		</div>
		<div className="Home-loggedIn-divs">
			<h2>Inventory Items</h2>
			{/* Link to the Items page with the Item count displayed */}
			<a href="/items" className="item-count-link">
				{itemCount || 0}
			</a>
		</div>
		<div className="Home-loggedIn-divs">
			<h2>Customers</h2>
			{/* Link to the Customers page with the Customer count displayed */}
			<a href="/customers" className="customer-count-link">
				{customerCount || 0}
			</a>
		</div>
	</section>
);

// Actions Section Component
// This section contains options to create RFQs, Quotes, Items, and Customers and is shown only if the user is NOT logged in
const InformationSection = () => (
	<section className="Home-section-two">
		{/* Options to create various entities are shown to the user if they are not logged in */}
		<div>Create a RFQ</div>
		<div>Create a Quote</div>
		<div>Add an Item</div>
		<div>Add a Customer</div>
	</section>
);

const Home = () => {
	// Initialize the navigation hook to allow for page navigation
	const navigate = useNavigate();

	// Destructure values from the AuthContext, which includes currentUser (logged-in user) and authentication token
	const { currentUser, token, loading } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Extract user details from the currentUser object

	// Define state variables to hold counts of various entities (items, customers, RFQs, and quotes)
	const [itemCount, setItemCount] = useState(null);
	const [customerCount, setCustomerCount] = useState(null);
	const [rfqCount, setRfqCount] = useState(null);
	const [quoteCount, setQuoteCount] = useState(null);

	// Fetch counts of entities (items, customers, RFQs, and quotes) when the user is logged in
	useEffect(() => {
		// Function to fetch the counts from the API
		const fetchCounts = async () => {
			const companyId = loggedUser?.company?.companyId; // Get companyId from the logged-in user
			const userId = loggedUser?.id; // Get userId from the logged-in user

			// Only fetch counts if both companyId and userId are available
			if (companyId || userId) {
				try {
					// Fetch the counts for customers, RFQs, items, and quotes from the API
					const resCustomers = await EasyRFQApi.getCustomerCount(companyId);
					const resRfqs = await EasyRFQApi.getRfqCount(userId);
					const resItems = await EasyRFQApi.getItemCount(companyId);
					const resQuotes = await EasyRFQApi.getQuoteCount(userId);

					// Update the state with the fetched counts, ensuring fallback to 0 if no data is returned
					setItemCount(resItems || 0);
					setCustomerCount(resCustomers || 0);
					setRfqCount(resRfqs || 0);
					setQuoteCount(resQuotes || 0);
				} catch (error) {
					console.error("Error fetching counts:", error);
				}
			} else {
				console.error("Missing companyId or userId");
			}
		};

		// Only fetch counts if the user is logged in (token and loggedUser exist)
		if (token && loggedUser) {
			fetchCounts();
		}
	}, [token, loggedUser]);

	// While loading, show a loading message
	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="Home">
			<div className="Home-wrapper">
				<section className="Home-section-one">
					<h1>The Sales Team Solution</h1>
					{/* Conditionally render either the guest or logged-in section */}
					{token ? <LoggedInHeaderSection loggedUser={loggedUser} /> : <GuestSection navigate={navigate} />}
				</section>
			</div>

			{/* Show the InformationSection only if the user is not logged in */}
			{!token && <InformationSection />}
			{/* Show the LoggedInBodySection if the user is logged in, passing the counts as props */}
			{token && <LoggedInBodySection rfqCount={rfqCount} quoteCount={quoteCount} itemCount={itemCount} customerCount={customerCount} />}
		</div>
	);
};

export default Home;
