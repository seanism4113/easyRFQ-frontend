import { Link } from "react-router-dom";
import "../styles/CompanyCard.css";

/**
 * Displays a card for a single company.
 * It links to the company's detailed page via the company's handle.
 */

const CompanyCard = ({ company }) => {
	return (
		// Link that allows navigation to the company detail page
		<Link to={`/companies/${company.handle}`} className="CompanyCard-link">
			<div className="CompanyCard">
				{/* Company name displayed as a heading */}
				<h3>{company.name}</h3>
				{/* Company description displayed in paragraph */}
				<p>{company.description}</p>
			</div>
		</Link>
	);
};

export default CompanyCard;
