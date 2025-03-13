import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * CustomerApi class handles all API requests related to customers.
 */
class CustomerApi {
	/**
	 * Create a new customer associated with a specific company.
	 *
	 * @param {Object} customerData - The customer data, including name, company_id, and other details.
	 * @returns {Object} - The created customer object.
	 */
	static async createCustomer(customerData) {
		try {
			const res = await EasyRFQApi.request(`customers?companyId=${customerData.company_id}`, customerData, "post");
			return res.customer;
		} catch (error) {
			console.error("Error creating customer:", error);
			throw error;
		}
	}

	/**
	 * Retrieve all customers associated with a given company.
	 *
	 * @param {number} companyId - The ID of the company whose customers should be fetched.
	 * @returns {Array} - List of customer objects.
	 */
	static async getUserCustomers(companyId) {
		try {
			// Send companyId in the request body
			const res = await EasyRFQApi.request("customers", { companyId }, "get");
			return res.customers;
		} catch (error) {
			console.error("Error getting customers:", error);
			throw error;
		}
	}

	/**
	 * Retrieve a specific customer by name within a given company.
	 *
	 * @param {string} customerName - The name of the customer.
	 * @param {number} companyId - The ID of the company the customer belongs to.
	 * @returns {Object} - The customer details.
	 */
	static async getCustomer(customerName, companyId) {
		try {
			let res = await EasyRFQApi.request(`customers/customer/${customerName}?companyId=${companyId}`);
			return res.customer;
		} catch (error) {
			console.error("Error getting customer:", error);
			throw error;
		}
	}

	/**
	 * Get the total count of customers for a specific company.
	 *
	 * @param {number} companyId - The ID of the company.
	 * @returns {number} - The total number of customers for the company.
	 */
	static async getCustomerCount(companyId) {
		try {
			const res = await EasyRFQApi.request(`customers/count?companyId=${companyId}`);
			return res?.count || 0;
		} catch (error) {
			console.error("Error getting customer count:", error);
			throw error;
		}
	}

	/**
	 * Edit an existing customer's details.
	 *
	 * @param {string} customerName - The name of the customer to update.
	 * @param {number} companyId - The ID of the company the customer belongs to.
	 * @param {Object} customerData - The updated customer data (e.g., name, markupType, markup).
	 * @returns {Object} - The updated customer object.
	 */
	static async editCustomer(customerName, companyId, customerData) {
		try {
			let res = await EasyRFQApi.request(`customers/customer/${customerName}?companyId=${companyId}`, customerData, "patch");
			return res.customer;
		} catch (error) {
			console.error("Error editing customer:", error);
			throw error;
		}
	}

	/**
	 * Delete a customer from a specific company.
	 *
	 * @param {string} customerName - The name of the customer to delete.
	 * @param {number} companyId - The ID of the company the customer belongs to.
	 * @returns {boolean} - Returns true if the customer was successfully deleted.
	 */
	static async deleteCustomer(customerName, companyId) {
		try {
			const res = await EasyRFQApi.request(`customers/customer/${customerName}?companyId=${companyId}`, {}, "delete");
			return res.deleted;
		} catch (error) {
			console.error("Error deleting customer:", error);
			throw error;
		}
	}
}

export default CustomerApi;
