import { useEffect, useState } from "react";
import { JoblyApi } from "../../api/api"; // API class for interacting with the backend
import PagesTemplate from "../PagesTemplate"; // Template for rendering pages with search functionality
import JobCard from "./JobCard"; // Component for rendering individual job cards

/**
 * This component displays a list of jobs fetched from the API.
 * It integrates with the `PagesTemplate` component for a standardized layout.
 */

const JobList = () => {
	// State to hold the list of all jobs
	const [jobs, setJobs] = useState([]);

	// State to track whether the jobs are still loading
	const [isLoading, setIsLoading] = useState(true);

	// State for the search term entered by the user
	const [searchTerm, setSearchTerm] = useState("");

	/**
	 * Retrieves all jobs from the backend using the `JoblyApi` class.
	 * Updates the `jobs` state with the fetched data and sets the loading state.
	 */
	const fetchJobs = async () => {
		try {
			// Make API call to fetch all jobs
			const allJobs = await JoblyApi.getJobs();

			// Update the jobs state with the fetched data
			setJobs(allJobs);
		} catch (err) {
			console.error("Error fetching jobs:", err);
		} finally {
			setIsLoading(false);
		}
	};

	/**
	 * Fetch the initial list of jobs.
	 */

	useEffect(() => {
		fetchJobs(); // Call fetchJobs when the component is first rendered
	}, []); // Empty dependency array ensures it only runs once

	// Filter jobs based on search term

	const filteredJobs = jobs.filter((job) => job.title.toLowerCase().includes(searchTerm.toLowerCase()));

	return (
		<PagesTemplate
			isLoading={isLoading} // Whether the jobs are still loading
			data={filteredJobs} // The list of filtered jobs
			renderItem={(job) => <JobCard job={job} />} // Render each job as a `JobCard`
			onSearch={setSearchTerm} // Callback to update search term
			searchBy="Search by job title..." // Placeholder for the search bar
		/>
	);
};

export default JobList;
