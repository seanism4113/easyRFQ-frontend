import "../styles/Footer.css";
import { FaRegEnvelope, FaRegComment } from "react-icons/fa"; // Importing icons from 'react-icons' library

/**
 * Footer component for displaying contact options and phone number.
 * It includes a contact email link, chat option, and a phone number for users to reach out.
 */

const NavBar = () => {
	return (
		<footer className="Footer">
			<div className="Footer-phone">
				<span>United States</span>
				<span>+1-800-888-8888</span>
			</div>
			{/* Section with a contact email link */}
			<div className="Footer-contact">
				<a href="#">
					<span>
						<FaRegEnvelope /> {/* Envelope icon representing email */}
						Contact us
					</span>
				</a>
			</div>
			{/* Section with a chat option */}
			<div className="Footer-chat">
				<a href="#">
					<span>
						<FaRegComment /> {/* Chat bubble icon for live chat */}
						Chat now
					</span>
				</a>
			</div>
		</footer>
	);
};

export default NavBar;
