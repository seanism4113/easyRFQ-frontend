import { useEffect, useState, useContext } from "react";
import { EasyRFQApi } from "../../api/mainApi"; // API utility for fetching RFQ data
import AuthContext from "../../context/AuthContext"; // Context for accessing authentication data
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar"; // Importing SearchBar component for searching RFQs
import RfqTable from "./RfqTable"; // Importing RfqTable component to display the list of RFQs
import "../styles/RfqList.css";

/**
 * RfqList component displays a list of RFQs (Request for Quotes) that can be filtered by RFQ number.
 * It allows users to search for RFQs, view the list, and add new RFQs.
 */
const RfqList = () => {
	const [rfqs, setRfqs] = useState([]); // Holds the list of RFQs fetched from the API
	const [isLoading, setIsLoading] = useState(true); // Tracks the loading state (whether the data is being fetched)
	const [searchTerm, setSearchTerm] = useState(""); // Holds the search term entered by the user
	const [rfqUpdated, setRfqUpdated] = useState(false); // Tracks if a new RFQ has been added or updated

	// Using AuthContext to get the current logged-in user
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Extracts the logged-in user's information from the context

	const navigate = useNavigate();

	/**
	 * fetchRfqs is an async function that fetches RFQs based on the logged-in user's companyId or userId.
	 * It calls the EasyRFQApi to get RFQs for the logged-in user and stores them in the rfqs state.
	 */
	const fetchRfqs = async () => {
		try {
			// Extract userId from the logged-in user's data
			const userId = loggedUser?.id;

			// Fetch all RFQs for the logged-in user using the userId (could be extended to filter by companyId as well)
			const allRfqs = await EasyRFQApi.getUserRfqs(userId);

			// Set the fetched RFQs to the state
			setRfqs(allRfqs);
		} catch (err) {
			console.error("Error fetching RFQs:", err);
		} finally {
			// Set isLoading to false after the fetch operation is complete (either successful or with an error)
			setIsLoading(false);
		}
	};

	// useEffect hook to fetch RFQs when the component mounts or when the rfqUpdated state changes
	useEffect(() => {
		if (loggedUser) {
			// If the logged-in user exists, call fetchRfqs to get RFQs
			fetchRfqs();
		}
	}, [loggedUser, rfqUpdated]);

	/**
	 * filteredRfqs is derived from the rfqs state.
	 * It filters the RFQs based on the searchTerm entered by the user.
	 * It checks if the RFQ number contains the search term.
	 */
	const filteredRfqs = rfqs.filter((rfq) => rfq.rfqNumber.includes(searchTerm));

	/**
	 * handleAddRfq is called when the "New RFQ" button is clicked.
	 */
	const handleAddRfq = () => {
		navigate("new"); // Navigates to the "new" route to create a new RFQ
	};

	/**
	 * handleSearch updates the searchTerm state when the user types something in the search bar.
	 * It is passed down to the SearchBar component.
	 */
	const handleSearch = (searchInput) => {
		setSearchTerm(searchInput);
	};

	return (
		<div className="RfqList-container">
			{/* Search Bar component for searching RFQs */}
			<div className="RfqList-searchbar">
				<SearchBar onSearch={handleSearch} searchBy="Search by RFQ#" /> {/* Pass handleSearch as a prop */}
			</div>
			{/* Loading State: Display a loading message if RFQs are still being fetched */}
			{isLoading && <div className="RfqList-loading">Loading...</div>}
			{/* Button to add a new RFQ */}
			<button className="addRfq-btn" onClick={handleAddRfq}>
				New RFQ
			</button>
			<div className="RfqList-table">
				{/* RfqTable receives filteredRfqs and setRfqUpdated as props */}
				<RfqTable rfqs={filteredRfqs} setRfqUpdated={setRfqUpdated} />
			</div>
		</div>
	);
};

export default RfqList;
