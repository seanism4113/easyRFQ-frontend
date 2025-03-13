import { NavLink } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../../context/AuthContext"; // Import AuthContext to access user authentication status

/**
 * NavLinks component renders the navigation links in the sidebar or navbar based on the login status of the user.
 * - If the user is logged in, they will see a list of links related to their profile, RFQs, Quotes, and more.
 * - If the user is not logged in, they will see links to the login and sign-up pages.
 *
 * Props:
 * - isLoggedIn: Boolean to check if the user is logged in
 * - toggleSidebar: Function to toggle the visibility of the sidebar
 * - handleLogout: Function to handle user logout
 */
const NavLinks = ({ isLoggedIn, toggleSidebar, handleLogout }) => {
	/**
	 * Function to dynamically assign the class name for active links.
	 * When a link is active, the 'active' class is added to style it differently.
	 */
	const getClassName = ({ isActive }) => `NavBar-link ${isActive ? "active" : ""}`;

	// Access the current user from AuthContext to determine if they are logged in
	const { currentUser } = useContext(AuthContext);
	// Destructure the logged-in user from currentUser context (if available)
	const loggedUser = currentUser?.user;

	return (
		<ul className="nav-links">
			{/* Conditional rendering based on whether the user is logged in or not */}
			{isLoggedIn ? (
				// If logged in, show these links:
				<>
					{/* Link to RFQs */}
					<li>
						<NavLink className={getClassName} to="/rfqs" onClick={toggleSidebar}>
							<span>RFQs</span>
							<span>&gt;</span> {/* This '>' adds a small arrow after the link text */}
						</NavLink>
					</li>

					{/* Link to Quotes */}
					<li>
						<NavLink className={getClassName} to="/quotes" onClick={toggleSidebar}>
							<span>Quotes</span>
							<span>&gt;</span>
						</NavLink>
					</li>

					{/* Link to Customers */}
					<li>
						<NavLink className={getClassName} to="/customers" onClick={toggleSidebar}>
							<span>Customers</span>
							<span>&gt;</span>
						</NavLink>
					</li>

					{/* Link to Items */}
					<li>
						<NavLink className={getClassName} to="/items" onClick={toggleSidebar}>
							<span>Items</span>
							<span>&gt;</span>
						</NavLink>
					</li>

					{/* Conditionally render Company Directory link if the logged-in user has a company */}
					{loggedUser?.company && (
						<li>
							<NavLink className={getClassName} to={`/companies/company/${loggedUser.company.companyId}/directory`} onClick={toggleSidebar}>
								<span>Company Directory</span>
								<span>&gt;</span>
							</NavLink>
						</li>
					)}

					{/* Link to Profile */}
					<li>
						<NavLink className={getClassName} to="/profile" onClick={toggleSidebar}>
							<span>Profile</span>
							<span>&gt;</span>
						</NavLink>
					</li>

					{/* Logout link */}
					<li>
						<a href="#" className="NavBar-link" onClick={handleLogout}>
							Logout
						</a>
					</li>
				</>
			) : (
				// If not logged in, show these links:
				<>
					{/* Link to Login page */}
					<li>
						<NavLink className={getClassName} to="/login" onClick={toggleSidebar}>
							<span>Login</span>
							<span>&gt;</span>
						</NavLink>
					</li>

					{/* Link to Signup page */}
					<li>
						<NavLink className={getClassName} to="/signup" onClick={toggleSidebar}>
							<span>Sign Up</span>
							<span>&gt;</span>
						</NavLink>
					</li>
				</>
			)}
		</ul>
	);
};

export default NavLinks;
