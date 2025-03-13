import axios from "axios";
import UserApi from "./userApi";
import CustomerApi from "./customerApi";
import CompanyApi from "./companyApi";
import ItemApi from "./itemApi";
import RfqApi from "./rfqApi";
import QuoteApi from "./quoteApi";

// Base URL for API requests, either from environment variable or default to localhost.
const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/**
 * EasyRFQApi Class.
 * A static class that aggregates methods from different API classes
 * and handles communication with the backend API.
 */
class EasyRFQApi {
	// Token for interacting with the API. This should be set after user authentication.
	static token;

	/**
	 * General method to make API requests.
	 *
	 * @param {string} endpoint - The API endpoint to send the request to.
	 * @param {Object} data - The data to be sent with the request (for POST, PATCH, DELETE).
	 * @param {string} method - The HTTP method (GET, POST, PATCH, DELETE).
	 * @returns {Object} - The response data from the API.
	 * @throws {Array} - An array of error messages if the request fails.
	 */
	static async request(endpoint, data = {}, method = "get") {
		// Construct the full URL using the base URL and the endpoint
		const url = `${BASE_URL}/${endpoint}`;

		// Set up the headers for the request, including the Authorization token if available
		const headers = {
			Authorization: `Bearer ${EasyRFQApi.token}`,
			...data.headers, // Merge additional headers if provided
		};

		// If it's a GET request, pass data as query parameters, otherwise send it as the request body
		const params = method === "get" ? data : {};

		try {
			// Make the API request using axios and return the response data
			return (await axios({ url, method, data, params, headers })).data;
		} catch (err) {
			// Handle errors, log the error response, and throw the error message(s)
			console.error("API Error:", err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message]; // Return error message(s)
		}
	}

	// User API Methods
	static registerUser = UserApi.registerUser; // Register a new user
	static authenticateUser = UserApi.authenticateUser; // Authenticate a user
	static getUser = UserApi.getUser; // Get user details
	static editProfile = UserApi.editProfile; // Edit user profile
	static changePassword = UserApi.changePassword; // Change user password

	// Customer API Methods
	static createCustomer = CustomerApi.createCustomer; // Create a new customer
	static getUserCustomers = CustomerApi.getUserCustomers; // Get all customers for the user
	static getCustomer = CustomerApi.getCustomer; // Get a specific customer
	static editCustomer = CustomerApi.editCustomer; // Edit customer details
	static deleteCustomer = CustomerApi.deleteCustomer; // Delete a customer
	static getCustomerCount = CustomerApi.getCustomerCount; // Get the total count of customers

	// Company API Methods
	static getCompanies = CompanyApi.getCompanies; // Get all companies
	static getCompany = CompanyApi.getCompany; // Get a specific company by ID
	static createCompany = CompanyApi.createCompany; // Create a new company
	static addItemToCompany = CompanyApi.addItemToCompany; // Add an item to a company
	static getDirectory = CompanyApi.getDirectory; // Get a company's directory

	// Item API Methods
	static createItem = ItemApi.createItem; // Create a new item
	static getUserItems = ItemApi.getUserItems; // Get all items for a company
	static getItem = ItemApi.getItem; // Get a specific item
	static editItem = ItemApi.editItem; // Edit an item's details
	static getItemCount = ItemApi.getItemCount; // Get the total number of items
	static deleteItem = ItemApi.deleteItem; // Delete an item

	// RFQ API Methods
	static createRfq = RfqApi.createRfq; // Create a new RFQ
	static getUserRfqs = RfqApi.getUserRfqs; // Get all RFQs for a user
	static getRfq = RfqApi.getRfq; // Get a specific RFQ
	static editRfq = RfqApi.editRfq; // Edit an RFQ
	static deleteRfq = RfqApi.deleteRfq; // Delete an RFQ
	static createRfqItem = RfqApi.createRfqItem; // Create an item within an RFQ
	static editRfqItem = RfqApi.editRfqItem; // Edit an item within an RFQ
	static deleteRfqItem = RfqApi.deleteRfqItem; // Delete an item within an RFQ
	static getRfqCount = RfqApi.getRfqCount; // Get the total count of RFQs

	// Quote API Methods
	static createQuote = QuoteApi.createQuote; // Create a new quote
	static getUserQuotes = QuoteApi.getUserQuotes; // Get all quotes for a user
	static getQuote = QuoteApi.getQuote; // Get a specific quote
	static editQuote = QuoteApi.editQuote; // Edit a quote
	static deleteQuote = QuoteApi.deleteQuote; // Delete a quote
	static createQuoteItem = QuoteApi.createQuoteItem; // Create an item within a quote
	static editQuoteItem = QuoteApi.editQuoteItem; // Edit an item within a quote
	static deleteQuoteItem = QuoteApi.deleteQuoteItem; // Delete an item within a quote
	static getQuoteCount = QuoteApi.getQuoteCount; // Get the total count of quotes
}

export { EasyRFQApi };
