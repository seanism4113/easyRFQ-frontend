import { useContext } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import AuthContext from "../../context/AuthContext"; // Importing AuthContext to access authentication state
import "../styles/NavBar.css";

/**
 * Component renders the navigation bar at the top of the application. It displays different links based on whether the user is logged in.
 */

const NavBar = () => {
	// Access authentication-related context values using useContext hook
	const { currentUser, token, logout } = useContext(AuthContext);
	const loggedUser = currentUser?.user; // Extract user details from currentUser object

	// Determine if the user is logged in based on the presence of a token
	const isLoggedIn = !!token;

	const navigate = useNavigate();

	// Function to determine the correct class for active navigation links
	const getClassName = ({ isActive }) => `NavBar-link ${isActive ? "active" : ""}`;

	// Handle the logout process
	const handleLogout = () => {
		logout(); // Call logout function from context to clear the user and token

		setTimeout(() => {
			navigate("/");
		}, 100);
	};

	return (
		<nav className="NavBar">
			<NavLink className="NavBar-brand" to="/">
				Jobly {/* LOGO */}
			</NavLink>
			<div>
				{/* Conditional rendering based on whether the user is logged in */}
				{isLoggedIn ? (
					// Render these links if the user is logged in
					<>
						<NavLink className={getClassName} to="/companies">
							Companies
						</NavLink>
						<NavLink className={getClassName} to="/jobs">
							Jobs
						</NavLink>
						<NavLink className={getClassName} to="/profile">
							Profile
						</NavLink>
						<NavLink className={getClassName} style={{ fontWeight: "500", color: "rgb(153, 149, 149)" }} onClick={handleLogout}>
							{loggedUser ? `Logout ${loggedUser.username}` : "Logout"}
						</NavLink>
					</>
				) : (
					// Render these links if the user is not logged in
					<>
						<NavLink className={getClassName} to="/login">
							Login
						</NavLink>
						<NavLink className={getClassName} to="/signup">
							Sign Up
						</NavLink>
					</>
				)}
			</div>
		</nav>
	);
};

export default NavBar;
