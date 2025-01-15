import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import PagesTemplate from "../PagesTemplate"; // Template component for rendering lists
import { JoblyApi } from "../../api/api"; // API utility for fetching data
import JobCard from "../job/JobCard"; // Component to display individual job details
import "../styles/CompanyDetail.css";

/**
 * Displays detailed information about a specific company, including its jobs.
 * The company is fetched based on the 'handle' retrieved from the route parameters.
 */

const CompanyDetail = () => {
	// Extract handle from the URL parameters
	const { handle } = useParams();

	// State to store the company details
	const [company, setCompany] = useState(null);

	// State to track whether the data is loading
	const [isLoading, setIsLoading] = useState(true);

	/**
	 * Fetch company details from the API based on the provided 'handle'.
	 * Calls the `getCompany` method from `JoblyApi` and updates the state
	 */

	const fetchCompanyData = async () => {
		try {
			// Fetch the company details using the API
			const companyData = await JoblyApi.getCompany(handle);

			// Update the state with the fetched company data
			setCompany(companyData);
		} catch (err) {
			console.error("Error fetching company details:", err);
		} finally {
			// Ensure loading state is set to false
			setIsLoading(false);
		}
	};

	// useEffect Hook to fetch companiey data.

	useEffect(() => {
		fetchCompanyData();
	}, [handle]); // Ensures this runs whenever 'handle' changes

	// Show a loading indicator while data is being fetched.
	if (isLoading) return <p>Loading...</p>;

	return (
		<div className="CompanyDetail">
			<div className="CompanyDetail-header">
				<h2>Jobs at {company.name}</h2> {/* Display the company name */}
				<p>{company.description}</p> {/* Display the company description */}
			</div>

			{/* Render the list of jobs using PagesTemplate */}
			<PagesTemplate
				isLoading={isLoading} // Pass loading state to PagesTemplate
				searchBar={false} // Disable the search bar
				data={company.jobs} // Pass the list of jobs for the company
				renderItem={(job) => <JobCard job={job} />} // Render each job using JobCard
			/>
		</div>
	);
};

export default CompanyDetail;
