import { useContext, useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Import the authentication context to manage user login state
import Sidebar from "./SideBar"; // Import the Sidebar component, which will be toggled via the Navbar
import "../styles/NavBar.css";

/**
 * NavBar component represents the top navigation bar, which includes:
 * - Branding (logo)
 * - Hamburger menu (for mobile view)
 * - Sidebar (for navigation links)
 * - Logout functionality
 */
const NavBar = () => {
	// Extracting 'token' and 'logout' function from the AuthContext to manage user session and logout
	const { token, logout } = useContext(AuthContext);
	const isLoggedIn = !!token; // Check if token exists to determine if the user is logged in
	const navigate = useNavigate();

	// State to manage whether the sidebar is open or closed
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);

	// Function to toggle the sidebar visibility (open/close)
	const toggleSidebar = () => {
		setIsSidebarOpen(!isSidebarOpen);
	};

	/**
	 * Handles the logout process:
	 * - Calls the 'logout' function from the context to clear the user session
	 * - Redirects the user to the homepage after a short delay
	 * - Closes the sidebar if it's open
	 */
	const handleLogout = () => {
		logout();
		setTimeout(() => {
			navigate("/");
		}, 100);
		setIsSidebarOpen(false);
	};

	return (
		<>
			{/* Main Navbar */}
			<nav className="NavBar">
				{/* Branding and Logo (Link to homepage) */}
				<NavLink className="NavBar-brand" to="/">
					<img src="/EasyRFQ.jpeg" alt="EasyRFQ Logo" /> {/* Logo image */}
				</NavLink>
			</nav>

			{/* Hamburger Menu (Appears below the Navbar) */}
			<div
				className={`menu_icon_box ${isSidebarOpen ? "active" : ""}`} // Toggle the 'active' class based on the sidebar state
				onClick={toggleSidebar} // Trigger the toggleSidebar function when clicked
			>
				{/* Flag section (just a flag icon) */}
				<div className="NavBar-flag">
					<img src="/us_flag.svg.png" alt="flag" /> {/* US Flag Image */}
				</div>

				{/* Three horizontal lines representing the hamburger menu */}
				<div>
					<div className="line1"></div> {/* Top line */}
					<div className="line2"></div> {/* Middle line */}
					<div className="line3"></div> {/* Bottom line */}
				</div>
			</div>

			{/* Sidebar Component (conditionally rendered based on 'isSidebarOpen') */}
			<Sidebar
				isSidebarOpen={isSidebarOpen} // Pass the state to determine if the sidebar is open
				toggleSidebar={toggleSidebar} // Pass the function to toggle sidebar visibility
				isLoggedIn={isLoggedIn} // Pass login status to the sidebar for conditional rendering of menu items
				handleLogout={handleLogout} // Pass the logout function to be used in the sidebar
			/>
		</>
	);
};

export default NavBar;
