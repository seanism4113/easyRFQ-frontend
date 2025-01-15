// Contains the routing logic for the app.
import RoutesList from "./components/RoutesList";

// AuthProvider wraps the application and provides authentication-related state and functionality
import { AuthProvider } from "./context/AuthContext";

// Import the global stylesheet for the application.
import "./components/styles/App.css";

const App = () => {
	return (
		<>
			<AuthProvider>
				<RoutesList />
			</AuthProvider>
		</>
	);
};

export default App;
