import { useState } from "react";

/**
 * Component provides a text input and a submit button to allow users to search for data (e.g., companies, jobs).
 * Props:
 * 1. `onSearch` - A function to be called when the user submits a search query.
 * 2. `searchBy` - A placeholder text for input
 */

const SearchBar = ({ onSearch, searchBy }) => {
	// State for storing the search input value
	const [searchInput, setSearchInput] = useState("");

	// Handle changes to the search input field
	const handleChange = (evt) => {
		// Update the local state with the current value of the input
		setSearchInput(evt.target.value);
	};

	// Handle the form submission
	const handleSubmit = (evt) => {
		evt.preventDefault();

		// Only perform the search if the search input is not empty
		if (searchInput !== "") {
			// Call the onSearch function with the trimmed search input
			onSearch(searchInput.trim());

			// Clear the search input field after search
			setSearchInput("");
		}
	};

	return (
		<div className="searchbar">
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					placeholder={searchBy} // Placeholder text provided via the searchBy prop
					value={searchInput} // Bind the input value to the searchInput state
					onChange={handleChange} // Update the searchInput state whenever the user types
				/>
				<button type="submit">Search</button>
			</form>
		</div>
	);
};

export default SearchBar;
