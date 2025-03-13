import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * RfqApi class handles all API requests related to RFQs (Request for Quotations).
 */
class RfqApi {
	/**
	 * Create a new RFQ for a specific user.
	 *
	 * @param {Object} rfqData - The RFQ data, including user_id and other relevant details.
	 * @returns {Object} - The created RFQ object.
	 */
	static async createRfq(rfqData) {
		try {
			const res = await EasyRFQApi.request(`rfqs?userId=${rfqData.user_id}`, rfqData, "post");
			return res.rfq; // Returns RFQ details including ID, company_id, and RFQ number.
		} catch (error) {
			console.error("Error creating RFQ:", error);
			throw error;
		}
	}

	/**
	 * Retrieve all RFQs for a specific user.
	 *
	 * @param {number} userId - The ID of the user whose RFQs should be fetched.
	 * @returns {Array} - An array of RFQ objects.
	 */
	static async getUserRfqs(userId) {
		try {
			const res = await EasyRFQApi.request("rfqs", { userId });
			return res.rfqs; // Returns a list of RFQs for the user.
		} catch (error) {
			console.error("Error getting RFQs:", error);
			throw error;
		}
	}

	/**
	 * Retrieve a specific RFQ by its ID for a particular user.
	 *
	 * @param {number} rfqId - The ID of the RFQ to be retrieved.
	 * @param {number} userId - The ID of the user to whom the RFQ belongs.
	 * @returns {Object} - The RFQ details including associated RFQ items.
	 */
	static async getRfq(rfqId, userId) {
		try {
			let res = await EasyRFQApi.request(`rfqs/rfq/${rfqId}?userId=${userId}`);
			return res.rfq; // Returns RFQ details including items.
		} catch (error) {
			console.error("Error getting RFQ:", error);
			throw error;
		}
	}

	/**
	 * Retrieve the total count of RFQs for a specific user or company.
	 *
	 * @param {number} userId - The ID of the user whose RFQ count should be fetched.
	 * @param {number} companyId - The ID of the company whose RFQ count should be fetched.
	 * @returns {number} - The total count of RFQs.
	 */
	static async getRfqCount(userId, companyId) {
		try {
			const params = {};
			if (companyId) params.companyId = companyId; // Use companyId if provided
			else if (userId) params.userId = userId; // Use userId if provided

			const res = await EasyRFQApi.request("rfqs/count", params, "get");
			return res?.count || 0; // Return the count or 0 if not available
		} catch (error) {
			console.error("Error getting RFQ count:", error);
			throw error;
		}
	}

	/**
	 * Edit the details of an existing RFQ.
	 *
	 * @param {number} rfqId - The ID of the RFQ to edit.
	 * @param {Object} rfqData - The updated RFQ data.
	 * @returns {Object} - The updated RFQ object.
	 */
	static async editRfq(rfqId, rfqData) {
		try {
			let res = await EasyRFQApi.request(`rfqs/rfq/${rfqId}`, rfqData, "patch");
			return res.rfq; // Returns the updated RFQ details.
		} catch (error) {
			console.error("Error editing RFQ:", error);
			throw error;
		}
	}

	/**
	 * Delete an RFQ for a specific user.
	 *
	 * @param {number} rfqId - The ID of the RFQ to delete.
	 * @param {number} userId - The ID of the user who owns the RFQ.
	 * @returns {boolean} - Returns true if the RFQ was successfully deleted.
	 */
	static async deleteRfq(rfqId, userId) {
		try {
			const res = await EasyRFQApi.request(`rfqs/rfq/${rfqId}?userId=${userId}`, {}, "delete");
			return res.deleted;
		} catch (error) {
			console.error("Error deleting RFQ:", error);
			throw error;
		}
	}

	/**
	 * Create a new item within an RFQ.
	 *
	 * @param {Object} rfqItemData - The RFQ item data, including rfq_id and item details.
	 * @returns {Object} - The created RFQ item object.
	 */
	static async createRfqItem(rfqItemData) {
		try {
			const res = await EasyRFQApi.request(`rfqs/rfq-items?companyId=${rfqItemData.company_id}`, rfqItemData, "post");
			return res.rfqItem; // Returns RFQ item details.
		} catch (error) {
			console.error("Error creating RFQ item:", error);
			throw error;
		}
	}

	/**
	 * Edit the details of an existing RFQ item.
	 *
	 * @param {number} rfqId - The ID of the RFQ item to edit.
	 * @param {number} companyId - The ID of the company associated with the RFQ item.
	 * @param {Object} rfqItemData - The updated RFQ item data.
	 * @returns {Object} - The updated RFQ item object.
	 */
	static async editRfqItem(rfqId, companyId, rfqItemData) {
		try {
			const res = await EasyRFQApi.request(`rfqs/rfq-items/${rfqId}?companyId=${companyId}`, rfqItemData, "patch");
			return res.rfqItem; // Returns the updated RFQ item details.
		} catch (error) {
			console.error("Error editing RFQ item:", error);
			throw error;
		}
	}

	/**
	 * Delete an RFQ item.
	 *
	 * @param {number} rfqId - The ID of the RFQ item to delete.
	 * @param {number} companyId - The ID of the company associated with the RFQ item.
	 * @returns {boolean} - Returns true if the RFQ item was successfully deleted.
	 */
	static async deleteRfqItem(rfqId, companyId) {
		try {
			const res = await EasyRFQApi.request(`rfqs/rfq-items/${rfqId}?companyId=${companyId}`, {}, "delete");
			return res.deleted; // API should return { deleted: id }
		} catch (error) {
			console.error("Error deleting RFQ item:", error);
			throw error;
		}
	}
}

export default RfqApi;
