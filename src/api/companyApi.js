import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * CompanyApi class handles all API requests related to companies.
 */
class CompanyApi {
	/**
	 * Get a list of all companies.
	 *
	 * @returns {Array} - List of company objects.
	 */
	static async getCompanies() {
		try {
			let res = await EasyRFQApi.request("companies");
			return res.companies;
		} catch (error) {
			console.error("Error getting companies:", error);
			throw error;
		}
	}

	/**
	 * Retrieve a specific company's details by its name.
	 *
	 * @param {string} companyName - The name of the company to retrieve.
	 * @returns {Object} - The company details.
	 */
	static async getCompany(companyName) {
		try {
			let res = await EasyRFQApi.request(`companies/company/${companyName}`);
			return res.companies;
		} catch (error) {
			console.error("Error getting company:", error);
			throw error;
		}
	}

	/**
	 * Create a new company.
	 *
	 * @param {Object} companyData - The data for the new company
	 * @returns {Object} - The created company object..
	 */
	static async createCompany(companyData) {
		try {
			let res = await EasyRFQApi.request("companies/company", companyData, "post");
			return res?.data?.company;
		} catch (error) {
			console.error("Error creating company:", error);
			throw error;
		}
	}

	/**
	 * Associate an item with a company.
	 *
	 * @param {string} itemCode - The unique code of the item to be added.
	 * @param {number} companyId - The ID of the company to which the item should be added.
	 * @returns {Object} - The updated company-item relationship data.
	 */
	static async addItemToCompany(itemCode, companyId) {
		try {
			const res = await EasyRFQApi.request("companies/company/add-item", { itemCode, companyId }, "post");
			return res.companyItem;
		} catch (error) {
			console.error("Error adding item to company:", error);
			throw error;
		}
	}

	/**
	 * Get the directory for a company, which includes company details and associated users.
	 *
	 * @param {number} companyId - The ID of the company.
	 * @returns {Object} - The company directory, including users and company details.
	 */
	static async getDirectory(companyId) {
		try {
			const res = await EasyRFQApi.request(`companies/company/${companyId}/directory`);
			return res; // This will contain both company and user information
		} catch (error) {
			console.error("Error getting company directory:", error);
			throw error;
		}
	}
}

export default CompanyApi;
