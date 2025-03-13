import NavLinks from "./NavLinks"; // Import NavLinks component to render the navigation links inside the sidebar

/**
 * Sidebar component represents a sidebar that can be toggled on and off.
 * It conditionally renders navigation links based on the user's login status.
 *
 * Props:
 * - isSidebarOpen: Boolean value indicating whether the sidebar is open or closed
 * - toggleSidebar: Function to toggle the sidebar open and closed
 * - isLoggedIn: Boolean value indicating the user's login status
 * - handleLogout: Function to handle logging out the user
 */
const Sidebar = ({ isSidebarOpen, toggleSidebar, isLoggedIn, handleLogout }) => {
	return (
		<div className={`box ${isSidebarOpen ? "active" : ""}`}>
			<nav className="SideBar">
				<NavLinks isLoggedIn={isLoggedIn} toggleSidebar={toggleSidebar} handleLogout={handleLogout} />
			</nav>
		</div>
	);
};

export default Sidebar;
