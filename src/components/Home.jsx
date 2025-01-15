import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import AuthContext from "../context/AuthContext"; // AuthContext to access authentication-related data
import "./styles/Home.css";

/**
 * Displays the homepage of the Jobly application.
 * It shows a welcome message for logged-in users or login/signup buttons for guests.
 */

const Home = () => {
	// Destructure values from the AuthContext
	const { currentUser, token, loading } = useContext(AuthContext);

	// Check if a user is logged in based on token existence
	const isLoggedIn = !!token;

	// Initialize navigation hook
	const navigate = useNavigate();

	// Extract user details from the currentUser object
	const loggedUser = currentUser?.user;

	if (loading) {
		return <div>Loading...</div>;
	}

	return (
		<div className="Home">
			<div className="Home-wrapper">
				<h1>Jobly</h1>
				<p>All the jobs in one, convenient place.</p>

				{/* Conditional rendering based on the user's login status */}
				{!isLoggedIn ? (
					<div>
						<button onClick={() => navigate("/login")}>Log in</button>
						<button onClick={() => navigate("/signup")}>Sign Up</button>
					</div>
				) : (
					<div>
						{/* Welcome message for logged-in users */}
						<h2>Welcome back {loggedUser?.firstName || "User"}!</h2>
					</div>
				)}
			</div>
		</div>
	);
};

export default Home;
