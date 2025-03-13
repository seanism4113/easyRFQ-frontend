import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * ItemApi class handles all API requests related to items.
 */
class ItemApi {
	/**
	 * Create a new item associated with a specific company.
	 *
	 * @param {Object} itemData - The item data, including companyId, item name, and other details.
	 * @returns {Object} - The created item object.
	 */
	static async createItem(itemData) {
		try {
			const res = await EasyRFQApi.request(`items?companyId=${itemData.companyId}`, itemData, "post");
			return res.item;
		} catch (error) {
			console.error("Error creating item:", error);
			throw error;
		}
	}

	/**
	 * Retrieve all items associated with a given company.
	 *
	 * @param {number} companyId - The ID of the company whose items should be fetched.
	 * @returns {Array} - List of item objects.
	 */
	static async getUserItems(companyId) {
		try {
			const res = await EasyRFQApi.request(`items?companyId=${companyId}`, {}, "get");
			return res.items;
		} catch (error) {
			console.error("Error getting items:", error);
			throw error;
		}
	}

	/**
	 * Retrieve a specific item by itemCode within a given company.
	 *
	 * @param {number} companyId - The ID of the company the item belongs to.
	 * @param {string} itemCode - The code of the item to fetch.
	 * @returns {Object} - The item details.
	 */
	static async getItem(companyId, itemCode) {
		try {
			const res = await EasyRFQApi.request(`items/item/${itemCode}?companyId=${companyId}`);
			return res.item;
		} catch (error) {
			console.error("Error getting item:", error);
			throw error;
		}
	}

	/**
	 * Get the total count of items for a specific company.
	 *
	 * @param {number} companyId - The ID of the company.
	 * @returns {number} - The total number of items for the company.
	 */
	static async getItemCount(companyId) {
		try {
			const res = await EasyRFQApi.request(`items/count?companyId=${companyId}`, {}, "get");
			return res?.count || 0; // Expect the API to return `{ count: number }`
		} catch (error) {
			console.error("Error getting item count:", error);
			throw error;
		}
	}

	/**
	 * Edit an existing item's details.
	 *
	 * @param {number} companyId - The ID of the company the item belongs to.
	 * @param {string} itemCode - The code of the item to edit.
	 * @param {Object} itemData - The updated item data (e.g., name, description, price).
	 * @returns {Object} - The updated item object.
	 */
	static async editItem(companyId, itemCode, itemData) {
		try {
			const res = await EasyRFQApi.request(`items/item/${itemCode}?companyId=${companyId}`, itemData, "patch");
			return res.item;
		} catch (error) {
			console.error("Error editing item:", error);
			throw error;
		}
	}

	/**
	 * Delete an item from a specific company.
	 *
	 * @param {number} companyId - The ID of the company the item belongs to.
	 * @param {string} itemCode - The code of the item to delete.
	 * @returns {boolean} - Returns true if the item was successfully deleted.
	 */
	static async deleteItem(companyId, itemCode) {
		try {
			const res = await EasyRFQApi.request(`items/item/${itemCode}?companyId=${companyId}`, {}, "delete");
			return res.deleted;
		} catch (error) {
			console.error("Error deleting item:", error);
			throw error;
		}
	}
}

export default ItemApi;
