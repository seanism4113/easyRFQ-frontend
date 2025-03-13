import { useEffect, useState, useContext } from "react";
import { EasyRFQApi } from "../../api/mainApi"; // Import the API utility for fetching data
import AuthContext from "../../context/AuthContext"; // Import authentication context for accessing the current user's data
import { useNavigate } from "react-router-dom";
import SearchBar from "../common/SearchBar"; // Import the SearchBar component for searching quotes
import QuoteTable from "./QuoteTable"; // Import QuoteTable component to display quotes in a table format
import "../styles/QuoteList.css";

/**
 * The QuoteList component is responsible for displaying a list of quotes to the user.
 * It fetches the quotes based on the logged-in user's company or user ID, supports searching through quotes by quote number,
 * and allows navigation to a page to create a new quote.
 */

const QuoteList = () => {
	// State variables to store quotes, loading status, search term, and quote update status
	const [quotes, setQuotes] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [searchTerm, setSearchTerm] = useState("");
	const [quoteUpdated, setQuoteUpdated] = useState(false);

	// Access the current logged-in user through AuthContext
	const { currentUser } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // The logged-in user object

	const navigate = useNavigate();

	/**
	 * Fetch Quotes from the API based on the companyId or userId of the logged-in user.
	 * This is called when the component mounts or when a quote is updated.
	 */
	const fetchQuotes = async () => {
		try {
			const companyId = loggedUser?.company?.companyId; // Get companyId from logged-in user
			const userId = loggedUser?.id; // Get userId from logged-in user

			// Fetch quotes based on the userId (for now, using EasyRFQApi.getUserQuotes)
			const allQuotes = await EasyRFQApi.getUserQuotes(userId);

			setQuotes(allQuotes); // Set the fetched quotes to the state
		} catch (err) {
			console.error("Error fetching Quotes:", err);
		} finally {
			// Set loading state to false once the fetch operation is complete
			setIsLoading(false);
		}
	};

	// useEffect hook to trigger fetchQuotes when the component mounts or when the quoteUpdated state changes
	useEffect(() => {
		// Only fetch quotes if a logged-in user is available
		if (loggedUser) {
			fetchQuotes();
		}
	}, [loggedUser, quoteUpdated]); // The effect runs when loggedUser or quoteUpdated changes

	/**
	 * Filter the quotes based on the search term.
	 * The quotes are filtered by checking if the quote number includes the search term.
	 */
	const filteredQuotes = quotes.filter((quote) => quote.quoteNumber.includes(searchTerm));

	/**
	 * Navigate to the "new" page where the user can create a new quote.
	 * This is triggered when the user decides to add a new quote.
	 */
	const handleAddQuote = () => {
		navigate("new"); // Navigate to the new quote creation page
	};

	/**
	 * Handle the search input from the SearchBar component.
	 * Update the searchTerm state with the value entered by the user.
	 */
	const handleSearch = (searchInput) => {
		setSearchTerm(searchInput); // Set the search term to the value entered in the search bar
	};

	return (
		<div className="QuoteList-container">
			{/* Search Bar Component for searching quotes by quote number */}
			<div className="QuoteList-searchbar">
				{/* Pass handleSearch function as a prop to SearchBar for managing the search input */}
				<SearchBar onSearch={handleSearch} searchBy="Search by Quote#" />
			</div>

			{/* Loading State Displayed while quotes are being fetched */}
			{isLoading && <div className="QuoteList-loading">Loading...</div>}

			{/* Quote Table displaying the filtered quotes */}
			<div className="QuoteList-table">
				{/* Pass filteredQuotes to the QuoteTable for displaying the quotes */}
				<QuoteTable quotes={filteredQuotes} setQuoteUpdated={setQuoteUpdated} />
			</div>
		</div>
	);
};

export default QuoteList;
