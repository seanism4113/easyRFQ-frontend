import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL || "http://localhost:3001";

/** API Class.
 *
 * Static class tying together methods used to get/send to to the API.
 * There shouldn't be any frontend-specific stuff here, and there shouldn't
 * be any API-aware stuff elsewhere in the frontend.
 *
 */

class JoblyApi {
	// the token for interactive with the API will be stored here.
	static token;

	static async request(endpoint, data = {}, method = "get") {
		//there are multiple ways to pass an authorization token, this is how you pass it in the header.
		//this has been provided to show you another way to pass the token. you are only expected to read this code for this project.
		const url = `${BASE_URL}/${endpoint}`;
		const headers = {
			Authorization: `Bearer ${JoblyApi.token}`,
			...data.headers, // If there are any additional headers passed, merge them
		};
		const params = method === "get" ? data : {};

		try {
			return (await axios({ url, method, data, params, headers })).data;
		} catch (err) {
			console.error("API Error:", err.response);
			let message = err.response.data.error.message;
			throw Array.isArray(message) ? message : [message];
		}
	}

	// Individual API routes

	/** Get details on all companies */

	static async getCompanies() {
		try {
			let res = await this.request("companies");
			return res.companies;
		} catch (error) {
			console.error("Error getting companies:", error);
			throw error;
		}
	}

	/** Get details on a company by handle. */

	static async getCompany(handle) {
		try {
			let res = await this.request(`companies/${handle}`);
			return res.company;
		} catch (error) {
			console.error("Error getting company:", error);
			throw error;
		}
	}

	/** Get details on all jobs */

	static async getJobs() {
		try {
			let res = await this.request("jobs");
			return res.jobs;
		} catch (error) {
			console.error("Error getting jobs:", error);
			throw error;
		}
	}

	/** Authenticate user */

	static async authenticateUser(username, password) {
		try {
			let res = await this.request("auth/token", { username, password }, "post");
			const { token } = res; // Extract the token from the response
			return { token }; // Only return the token
		} catch (error) {
			console.error("Error authenticating user:", error);
			throw error;
		}
	}

	/** Register a new user */

	static async registerUser(userData) {
		try {
			// The 'userData' object should contain { username, firstName, lastName, email }
			let res = await this.request("auth/register", userData, "post");
			return res.token;
		} catch (error) {
			console.error("Error registering user:", error);
			throw error;
		}
	}

	/** Edit user data */

	static async editProfile(userData, username) {
		// The 'userData' object should contain { firstName, lastName, email }
		try {
			// Make the API request to update user data
			let res = await this.request(`users/${username}`, userData, "patch");

			// Save the updated token to localStorage (if available)
			if (res.token) {
				localStorage.setItem("token", res.token);
			}

			return res.user;
		} catch (error) {
			console.error("Error editing profile:", error);
			throw error;
		}
	}

	/** Get user data */

	static async getUser(username) {
		if (!this.token) {
			console.error("No token available. Cannot fetch user.");
			return null;
		}

		if (!username) {
			console.error("Username is undefined. Ensure it is being passed correctly.");
			return null;
		}

		try {
			const res = await this.request(`users/${username}`);
			return res;
		} catch (err) {
			console.error("Error fetching user:", err);
			return null;
		}
	}
}

export { JoblyApi };
