import "../styles/JobCard.css";

/**
 * Renders an individual job card displaying details about a job
 */

const JobCard = ({ job }) => {
	// Format the job salary for display.

	const setJobSalary = job.salary
		? job.salary.toLocaleString("en-US", {
				style: "currency", // Format as currency
				currency: "USD", // Use US Dollars
				minimumFractionDigits: 0, // No decimal places
				maximumFractionDigits: 0,
		  })
		: "";

	// If an equity value is provided, use it. Otherwise, default to 0.

	const setJobEquity = job.equity ? job.equity : 0;

	/**
	 * Handle button click to disable the button after applying.
	 * Once the button is clicked, its text changes to "APPLIED", its styling changes, and it becomes disabled.
	 */

	const disableBtn = (evt) => {
		evt.target.textContent = "APPLIED";
		evt.target.className = "disabled";
		evt.target.disabled = true;
	};

	return (
		<div className="JobCard">
			{/* Job title and company name */}
			<div className="JobCard-info1">
				<h3>{job.title}</h3>
				<span>{job.companyName}</span>
			</div>

			{/* Job salary and equity information */}
			<div className="JobCard-info2">
				<span>{`Salary: ${setJobSalary}`}</span>
				<span>{`Equity: ${setJobEquity}`}</span>
			</div>

			{/* Apply button */}
			<div className="JobCard-btn-div">
				<button type="button" onClick={disableBtn}>
					APPLY
				</button>
			</div>
		</div>
	);
};

export default JobCard;
