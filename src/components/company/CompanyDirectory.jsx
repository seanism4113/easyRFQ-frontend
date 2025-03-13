import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { EasyRFQApi } from "../../api/mainApi"; // Importing API utility for fetching company directory data
import "../styles/CompanyDirectory.css";

/**
 * CompanyDirectory component fetches and displays a list of users in a specific company's directory.
 * It fetches the company data and users based on the companyId passed from the URL parameters.
 */

const CompanyDirectory = () => {
	// Extracting companyId from the URL parameters using useParams hook
	const { companyId } = useParams();

	// State to store the list of users in the company directory
	const [users, setUsers] = useState([]);
	// State to store the company data
	const [company, setCompany] = useState([]);
	// State to track loading status (whether data is being fetched)
	const [loading, setLoading] = useState(true);
	// State to store any error message encountered during fetching
	const [error, setError] = useState(null);

	// useEffect hook to fetch company directory data when the component is mounted or when companyId changes
	useEffect(() => {
		// Function to fetch the company directory data from the API
		const fetchDirectory = async () => {
			try {
				// Fetch the directory data by calling the EasyRFQApi.getDirectory method with companyId
				const data = await EasyRFQApi.getDirectory(companyId);
				setUsers(data.users);
				setCompany(data.company);
			} catch (err) {
				setError("Failed to load directory.");
			} finally {
				setLoading(false);
			}
		};

		// Call the function to fetch the directory when component is mounted or when companyId changes
		fetchDirectory();
	}, [companyId]); // Dependency array includes companyId to refetch data when it changes

	// If data is still loading, show a loading message
	if (loading) return <p>Loading...</p>;
	// If an error occurred during data fetching, show the error message
	if (error) return <p>{error}</p>;

	return (
		<div className="CompanyDirectory">
			{/* Display the company name dynamically from the company state */}
			<h2>{company.name} Directory</h2>
			{/* Render a table to display the list of users in the directory */}
			<table>
				<thead>
					<tr>
						<th>Name</th>
						<th>Phone</th>
						<th>Email</th>
					</tr>
				</thead>
				{/* Loop over the users array and display each user's information in a table row */}
				<tbody>
					{users.map((user) => (
						<tr key={user.id}>
							<td>{user.fullName}</td>
							<td>{user.phone || "N/A"}</td>
							<td>{user.email}</td>
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
};

export default CompanyDirectory;
