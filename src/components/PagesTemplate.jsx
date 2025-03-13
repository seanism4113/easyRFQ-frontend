import SearchBar from "./common/SearchBar"; // Import the SearchBar component to allow users to search through the list
import "./styles/PagesTemplate.css";

/**
 * A reusable template component for displaying lists with features like pagination or search.
 * This component handles the loading state, optionally renders a search bar, and renders a list
 * of items based on the provided data. It is highly customizable and can be used for different
 * types of lists or paginated content.
 */

const PagesTemplate = ({
	isLoading, // Boolean indicating whether data is being fetched
	data, // Array of items to display in the list
	renderItem, // Function to render individual items in the list
	onSearch, // Callback function to handle search input
	searchBy, // String to display in the search bar label or placeholder
	searchBar = true, // Boolean indicating whether to show the search bar (default is true)
	actionButton, // Optional button displayed above the list
	customKeyValue, // Optional function to generate a custom key for each list item
}) => {
	return (
		<div className="container">
			{/* Render an action button if it's provided in the props */}
			{actionButton && <div className="action-button">{actionButton}</div>}

			{/* Conditionally render the SearchBar based on the `searchBar` prop */}
			{searchBar ? <SearchBar onSearch={onSearch} searchBy={searchBy} /> : null}

			{/* Display a loading state if the `isLoading` prop is true */}
			{isLoading ? (
				<p>Loading...</p> // Show loading text if data is still being fetched
			) : (
				// Once loading is complete, render the list of items
				<ul className="PagesTemplate-list">
					{/* Map over the data array and render each item using the custom renderItem function */}
					{data.map((item, index) => (
						<li key={`${customKeyValue ? customKeyValue(item) : item.handle || item.id}-${index}`}>
							{/* Render each list item using the provided renderItem function */}
							{renderItem(item, index)}
						</li>
					))}
				</ul>
			)}
		</div>
	);
};

export default PagesTemplate;
