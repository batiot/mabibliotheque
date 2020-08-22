import { ADD_ACCOUNT, DELETE_ACCOUNT } from "./actionTypes";

/**
 * Add a new account
 * @param {object} data The account data
 */
export const addAccount = data => {
	return {
		type: ADD_ACCOUNT,
		data,
	};
};

/**
 * delete account
 * @param {object} data The account uuid
 */
export const deleteAccount = uid => {
	return {
		type: DELETE_ACCOUNT,
		uid,
	};
};