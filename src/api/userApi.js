import { EasyRFQApi } from "./mainApi"; // Import the main API class for making requests

/**
 * UserApi class handles all API requests related to user authentication and profile management.
 */
class UserApi {
	/**
	 * Register a new user.
	 *
	 * @param {Object} userData - The user data including name, email, password, and other details.
	 * @returns {string} - The authentication token returned after successful registration.
	 */
	static async registerUser(userData) {
		try {
			const res = await EasyRFQApi.request("auth/register", userData, "post");
			return res.token; // Return the token from the registration response.
		} catch (error) {
			console.error("Error registering user:", error);
			throw error;
		}
	}

	/**
	 * Authenticate user by email and password.
	 *
	 * @param {string} email - The user's email.
	 * @param {string} password - The user's password.
	 * @returns {Object} - The authentication response, which may include a token and user details.
	 */
	static async authenticateUser(email, password) {
		try {
			const res = await EasyRFQApi.request("auth/token", { email, password }, "post");
			return res; // Return the authentication response.
		} catch (error) {
			console.error("Error authenticating user:", error);
			throw error;
		}
	}

	/**
	 * Retrieve user data by ID.
	 *
	 * @param {number} id - The ID of the user to fetch.
	 * @returns {Object} - The user data including name, email, and other profile details.
	 */
	static async getUser(id) {
		try {
			const res = await EasyRFQApi.request(`users/${id}`);
			return res; // Return the user data.
		} catch (error) {
			console.error("Error fetching user:", error);
			throw error;
		}
	}

	/**
	 * Edit user profile data.
	 *
	 * @param {Object} userData - The updated user data.
	 * @param {number} id - The ID of the user whose profile is being updated.
	 * @returns {Object} - The updated user data.
	 */
	static async editProfile(userData, id) {
		try {
			const res = await EasyRFQApi.request(`users/${id}`, userData, "patch");
			if (res.token) {
				localStorage.setItem("token", res.token); // Update the stored authentication token if provided.
			}
			return res.user; // Return the updated user profile.
		} catch (error) {
			console.error("Error editing profile:", error);
			throw error;
		}
	}

	/**
	 * Change user password.
	 *
	 * @param {number} userId - The ID of the user changing their password.
	 * @param {string} currentPassword - The current password of the user.
	 * @param {string} newPassword - The new password to be set.
	 * @returns {Object} - The response data indicating success or failure.
	 */
	static async changePassword(userId, currentPassword, newPassword) {
		try {
			const res = await EasyRFQApi.request(`users/${userId}/password`, { currentPassword, newPassword }, "patch");
			return res.data; // Return the response data.
		} catch (error) {
			console.error("Error changing password:", error);
			throw error;
		}
	}
}

export default UserApi;
