import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import AuthContext from "../context/AuthContext";

// import the components needed for routing
import Home from "./Home";
import NavBar from "./common/NavBar";
import SignUp from "./auth/SignUp";
import Login from "./auth/Login";
import CompanyList from "./company/CompanyList";
import CompanyDetail from "./company/CompanyDetail";
import JobList from "./job/JobList";
import Profile from "./user/Profile";

const RoutesList = () => {
	const { token, loading } = useContext(AuthContext); // Get token and loading state from context

	// If loading is true, render ...loading
	if (loading) {
		return <div>Loading...</div>;
	}

	/**
	 * Returns routes dependent on whether the user is logged in or not by token existence
	 */
	return (
		<BrowserRouter>
			<NavBar />
			<Routes>
				<Route path="/" element={<Home />} />
				<Route path="/login" element={token ? <Navigate to="/" /> : <Login />} />
				<Route path="/signup" element={token ? <Navigate to="/" /> : <SignUp />} />
				<Route path="/companies" element={token ? <CompanyList /> : <Navigate to="/login" />} />
				<Route path="/companies/:handle" element={token ? <CompanyDetail /> : <Navigate to="/login" />} />
				<Route path="/jobs" element={token ? <JobList /> : <Navigate to="/login" />} />
				<Route path="/profile" element={token ? <Profile /> : <Navigate to="/login" />} />
				{/* Catch-all route */}
				<Route path="*" element={<Navigate to="/" />} />
			</Routes>
		</BrowserRouter>
	);
};

export default RoutesList;
