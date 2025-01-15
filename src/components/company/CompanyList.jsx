// Import necessary hooks and components
import { useEffect, useState } from "react";
import { JoblyApi } from "../../api/api"; // API utility for fetching data
import PagesTemplate from "../PagesTemplate"; // Template for displaying lists with optional search bar
import CompanyCard from "./CompanyCard"; // Component for rendering individual company details

/**
 * This component fetches and displays a list of companies.
 * It includes functionality for filtering companies by name .
 * Displays them using the `CompanyCard` component and PagesTemplate
 */

const CompanyList = () => {
	// State to store the list of companies
	const [companies, setCompanies] = useState([]);

	// State to track whether the data is loading
	const [isLoading, setIsLoading] = useState(true);

	// State to store the search term entered by the user
	const [searchTerm, setSearchTerm] = useState("");

	/**
	 * Calls the `getCompanies` method from the `JoblyApi`
	 * to fetch the list of companies and updates the state with the fetched data.
	 */

	const fetchCompanies = async () => {
		try {
			// Fetch the list of companies using the API
			const allCompanies = await JoblyApi.getCompanies();

			// Update the state with the fetched companies
			setCompanies(allCompanies);
		} catch (err) {
			console.error("Error fetching companies:", err);
		} finally {
			// Ensure the loading state is set to false
			setIsLoading(false);
		}
	};

	// useEffect Hook  to fetch the list of companies.

	useEffect(() => {
		fetchCompanies();
	}, []);

	// Filter the companies based on the search term.

	const filteredCompanies = companies.filter((company) => company.name.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<PagesTemplate
			isLoading={isLoading} // Pass loading state to `PagesTemplate`
			data={filteredCompanies} // Pass the filtered list of companies
			renderItem={(company) => <CompanyCard company={company} />} // Render each company using `CompanyCard`
			onSearch={setSearchTerm} // Pass the search term setter to `PagesTemplate`
			searchBy="Search by company..." // Placeholder text for the search bar
		/>
	);
};

export default CompanyList;
