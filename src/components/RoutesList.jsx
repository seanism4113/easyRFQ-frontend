import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext"; // Import AuthContext to manage user authentication state

// Import all the components needed for routing
import Home from "./Home";
import NavBar from "./common/NavBar";
import Footer from "./common/Footer";

import Profile from "./auth/Profile";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";

import CustomerList from "./customer/CustomerList";
import CustomerDetail from "./customer/CustomerDetail";
import CustomerForm from "./customer/CustomerForm";

import ItemList from "./item/ItemList";
import ItemDetail from "./item/ItemDetail";
import ItemForm from "./item/ItemForm";

import CompanyDirectory from "./company/CompanyDirectory";

import RfqList from "./rfq/RfqList";
import RfqDetail from "./rfq/RfqDetail";
import RfqForm from "./rfq/RfqForm";

import QuoteList from "./quote/QuoteList";
import QuoteForm from "./quote/QuoteForm";
import QuoteTemplate from "./quote/QuoteTemplate";

const RoutesList = () => {
	// Get the authentication token and loading state from AuthContext
	const { token, loading } = useContext(AuthContext);

	// If the app is in a loading state (e.g., fetching user authentication status), render a loading message
	if (loading) {
		return <div>Loading...</div>;
	}

	/**
	 * This component defines the routes for the application.
	 * It conditionally renders routes based on whether the user is logged in (checked via the presence of a token).
	 * If the user is logged in, they can access specific routes, otherwise, they will be redirected to the login page.
	 */

	return (
		<BrowserRouter>
			<div className="App-container">
				{/* Navigation Bar */}
				<NavBar />

				{/* Main content area where the routes are rendered */}
				<main className="Main-content">
					<Routes>
						{/* Public Route: Home page, accessible by everyone */}
						<Route path="/" element={<Home />} />

						{/* User Authentication Routes */}
						{/* If the user is already logged in (has a token), they will be redirected to the home page */}
						{/* If not logged in, they can access the login or signup page */}
						<Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
						<Route path="/signup" element={token ? <Navigate to="/" /> : <SignUp />} />
						<Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />

						{/* Customer Routes */}
						{/* Protect all customer-related routes by checking if the user is logged in */}
						<Route path="/customers" element={token ? <CustomerList /> : <Navigate to="/login" />} />
						<Route path="/customers/new" element={token ? <CustomerForm /> : <Navigate to="/login" />} />
						<Route path="/customers/:customerName" element={token ? <CustomerDetail /> : <Navigate to="/login" />} />

						{/* Item Routes */}
						{/* Protect all item-related routes with authentication check */}
						<Route path="/items" element={token ? <ItemList /> : <Navigate to="/login" />} />
						<Route path="/items/new" element={token ? <ItemForm /> : <Navigate to="/login" />} />
						<Route path="/items/:itemCode" element={token ? <ItemDetail /> : <Navigate to="/login" />} />

						{/* Company Directory Route */}
						{/* Protect company directory route by checking authentication */}
						<Route path="/companies/company/:companyId/directory" element={token ? <CompanyDirectory /> : <Navigate to="/login" />} />

						{/* RFQ (Request For Quote) Routes */}
						{/* Protect all RFQ-related routes with authentication check */}
						<Route path="/rfqs" element={token ? <RfqList /> : <Navigate to="/login" />} />
						<Route path="/rfqs/:rfqId" element={token ? <RfqDetail /> : <Navigate to="/login" />} />
						<Route path="/rfqs/new" element={token ? <RfqForm /> : <Navigate to="/login" />} />

						{/* Quote Routes */}
						{/* Protect all quote-related routes with authentication check */}
						<Route path="/quotes" element={token ? <QuoteList /> : <Navigate to="/login" />} />
						<Route path="/quotes/new" element={token ? <QuoteForm /> : <Navigate to="/login" />} />
						<Route path="/quotes/:quoteId" element={token ? <QuoteTemplate /> : <Navigate to="/login" />} />

						{/* Catch-all Route for undefined paths */}
						{/* Any route that does not match will be redirected to the Home page */}
						<Route path="*" element={<Navigate to="/" />} />
					</Routes>
				</main>

				{/* Footer component */}
				<Footer />
			</div>
		</BrowserRouter>
	);
};

export default RoutesList;
