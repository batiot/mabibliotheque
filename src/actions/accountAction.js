import { ADD_ACCOUNT, DELETE_ACCOUNT,FETCH_ACCOUNT_PENDING,FETCH_ACCOUNT_SUCCESS,FETCH_ACCOUNT_ERROR } from "./actionTypes";

/**
 * Try to add new account
 * @param {object} credentials: cardId , password
 */
export const addAccount = credentials => {
	return {
		type: ADD_ACCOUNT,
		credentials: credentials
	};
};

/**
 * delete account
 * @param {object} cardId The account cardId
 */
export const deleteAccount = cardId => {
	return {
		type: DELETE_ACCOUNT,
		cardId: cardId
	};
};

export const fetchAccountPending = credentials => {
    return {
        type: FETCH_ACCOUNT_PENDING,
        cardId: credentials.cardId
    }
}

/**
 * Successly fecthed account
 * @param {object} cardId The account cardId
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