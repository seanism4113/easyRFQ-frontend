import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * QuoteApi class handles all API requests related to quotes.
 */
class QuoteApi {
	/**
	 * Create a new quote for a specific user.
	 *
	 * @param {Object} quoteData - The quote data, including user_id and other relevant details.
	 * @returns {Object} - The created quote object.
	 */
	static async createQuote(quoteData) {
		try {
			const res = await EasyRFQApi.request(`quotes?userId=${quoteData.user_id}`, quoteData, "post");
			return res.quote;
		} catch (error) {
			console.error("Error creating quote:", error);
			throw error;
		}
	}

	/**
	 * Retrieve all quotes for a specific user.
	 *
	 * @param {number} userId - The ID of the user whose quotes should be fetched.
	 * @returns {Array} - An array of quote objects.
	 */
	static async getUserQuotes(userId) {
		try {
			const res = await EasyRFQApi.request("quotes", { userId });
			return res.quotes;
		} catch (error) {
			console.error("Error getting quotes:", error);
			throw error;
		}
	}

	/**
	 * Retrieve a specific quote by its ID for a particular user.
	 *
	 * @param {number} quoteId - The ID of the quote to be retrieved.
	 * @param {number} userId - The ID of the user to whom the quote belongs.
	 * @returns {Object} - The quote details.
	 */
	static async getQuote(quoteId, userId) {
		try {
			let res = await EasyRFQApi.request(`quotes/quote/${quoteId}?userId=${userId}`);
			return res.quote;
		} catch (error) {
			console.error("Error getting quote:", error);
			throw error;
		}
	}

	/**
	 * Retrieve the total count of quotes for a specific user or company.
	 *
	 * @param {number} userId - The ID of the user whose quotes count should be fetched.
	 * @param {number} companyId - The ID of the company whose quotes count should be fetched.
	 * @returns {number} - The total count of quotes.
	 */
	static async getQuoteCount(userId, companyId) {
		try {
			const params = {};
			if (companyId) params.companyId = companyId; // Use companyId if provided
			else if (userId) params.userId = userId; // Use userId if provided

			const res = await EasyRFQApi.request("quotes/count", params, "get");
			return res?.count || 0; // Return the count or 0 if not available
		} catch (error) {
			console.error("Error getting quote count:", error);
			throw error;
		}
	}

	/**
	 * Edit the details of an existing quote.
	 *
	 * @param {number} id - The ID of the quote to edit.
	 * @param {Object} quoteData - The updated quote data.
	 * @returns {Object} - The updated quote object.
	 */
	static async editQuote(id, quoteData) {
		try {
			let res = await EasyRFQApi.request(`quotes/quote/${id}`, quoteData, "patch");
			return res.quote;
		} catch (error) {
			console.error("Error editing quote:", error);
			throw error;
		}
	}

	/**
	 * Delete a quote for a specific user.
	 *
	 * @param {number} quoteId - The ID of the quote to delete.
	 * @param {number} userId - The ID of the user who owns the quote.
	 * @returns {boolean} - Returns true if the quote was successfully deleted.
	 */
	static async deleteQuote(quoteId, userId) {
		try {
			const res = await EasyRFQApi.request(`quotes/quote/${quoteId}?userId=${userId}`, {}, "delete");
			return res.deleted;
		} catch (error) {
			console.error("Error deleting quote:", error);
			throw error;
		}
	}

	/**
	 * Create a new item within a quote.
	 *
	 * @param {Object} quoteItemData - The quote item data, including the necessary details.
	 * @param {number} userId - The ID of the user creating the quote item.
	 * @returns {Object} - The created quote item object.
	 */
	static async createQuoteItem(quoteItemData, userId) {
		try {
			const res = await EasyRFQApi.request(`quotes/quote-items?userId=${userId}`, quoteItemData, "post");
			return res.quoteItem;
		} catch (error) {
			console.error("Error creating quote item:", error);
			throw error;
		}
	}

	/**
	 * Edit the details of an existing quote item.
	 *
	 * @param {number} id - The ID of the quote item to edit.
	 * @param {Object} quoteItemData - The updated quote item data.
	 * @returns {Object} - The updated quote item object.
	 */
	static async editQuoteItem(id, quoteItemData) {
		try {
			const res = await EasyRFQApi.request(`quotes/quote-items/${id}`, quoteItemData, "patch");
			return res.quoteItem;
		} catch (error) {
			console.error("Error editing quote item:", error);
			throw error;
		}
	}

	/**
	 * Delete a quote item.
	 *
	 * @param {number} id - The ID of the quote item to delete.
	 * @returns {boolean} - Returns true if the quote item was successfully deleted.
	 */
	static async deleteQuoteItem(id) {
		try {
			const res = await EasyRFQApi.request(`quotes/quote-items/${id}`, {}, "delete");
			return res.deleted;
		} catch (error) {
			console.error("Error deleting quote item:", error);
			throw error;
		}
	}
}

export default QuoteApi;
