// Import the SearchBar component
import SearchBar from "./common/SearchBar";
import "./styles/PagesTemplate.css";

/**
 * A reusable template for displaying paginated or searchable lists.
 * It handles loading states, displays a search bar if needed, and renders a list of items.
 */

const PagesTemplate = ({
	isLoading, // Boolean: determines if the loading state is active.
	data, // Array: data to be displayed in the list.
	renderItem, // Function: custom renderer for list items.
	onSearch, // Function: callback to handle search queries.
	searchBy, // String: search field identifier.
	searchBar = true, // Boolean: determines whether to show the search bar (default is true).
}) => {
	return (
		<div className="container">
			<div>
				{/* Conditionally render the SearchBar if the `searchBar` prop is true */}
				{searchBar ? <SearchBar onSearch={onSearch} searchBy={searchBy} /> : null}

				{/* Show a loading indicator if data is being fetched */}
				{isLoading ? (
					<p>Loading...</p>
				) : (
					<ul className="PagesTemplate-list">
						{data.map((item) => (
							// Use either `handle` or `id` as the unique key for each list item.
							<li key={item.handle ? item.handle : item.id}>{renderItem(item)}</li>
						))}
					</ul>
				)}
			</div>
		</div>
	);
};

export default PagesTemplate;
