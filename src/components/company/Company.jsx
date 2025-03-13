const Company = ({ setShowCompanyData, showCompanyData, company }) => {
	// Destructure the company data from the 'company' prop for easier access
	const { companyName, companyAddressLine1, companyAddressLine2, companyCity, companyState, companyCountry, companyPhoneMain } = company;

	return (
		<>
			{/*
			 * Conditionally render the company data modal only if the `showCompanyData` state is true.
			 * This allows toggling the visibility of the modal.
			 */}
			{showCompanyData && (
				<>
					{/*
					 * Dark overlay background that is displayed when the modal is visible.
					 * This darkens the background to focus the user's attention on the modal.
					 */}
					<div className="overlay"></div>

					{/*
					 * The modal itself containing company data.
					 * It's only shown when `showCompanyData` is true.
					 */}
					<div className="modal2">
						{/* Modal Header with a close button */}
						<div className="modal2-header">
							{/* Close button to hide the company data modal. It triggers the `setShowCompanyData` function to set the modal state to false. */}
							<button className="cancel-button" type="button" onClick={() => setShowCompanyData(false)}>
								X
							</button>
						</div>

						{/* Display the company name in a large heading */}
						<h2>{companyName}</h2>

						{/* Subheading for the address section */}
						<h3>Address</h3>

						{/* Display the company address, with two address lines */}
						<div className="address-lines">
							<span>{companyAddressLine1}</span>
							<span>{companyAddressLine2}</span>
						</div>

						{/* Display city, state, and country */}
						<div className="city-st-cty">
							<span>{companyCity},</span>
							<span>{companyState}</span>
							<span>{companyCountry}</span>
						</div>

						{/* Display the main phone number of the company */}
						<p>
							<b>Main Phone:</b> {companyPhoneMain}
						</p>
					</div>
				</>
			)}
		</>
	);
};

export default Company;
