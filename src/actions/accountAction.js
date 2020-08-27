import { ADD_ACCOUNT, DELETE_ACCOUNT,FETCH_ACCOUNT_PENDING,FETCH_ACCOUNT_SUCCESS,FETCH_ACCOUNT_ERROR } from "./actionTypes";

/**
 * Add a new account
 * @param {object} account The account data
 */
export const addAccount = account => {
	return {
		type: ADD_ACCOUNT,
		account: account
	};
};

/**
 * delete account
 * @param {object} uuid The account uuid
 */
export const deleteAccount = uuid => {
	return {
		type: DELETE_ACCOUNT,
		uuid: uuid
	};
};


export const fetchAccountPending = () => {
    return {
        type: FETCH_ACCOUNT_PENDING
    }
}

/**
 * Successly fecthed account
 * @param {object} uuid The account uuid
 */
export const fetchAccountSuccess = account => {
    return {
        type: FETCH_ACCOUNT_SUCCESS,
        account: account
    }
}

export const fetchAccountError = error => {
    return {
        type: FETCH_ACCOUNT_ERROR,
        error: error
    }
}