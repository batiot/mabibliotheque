import { ADD_ACCOUNT, DELETE_ACCOUNT,FETCH_ACCOUNT_PENDING,FETCH_ACCOUNT_SUCCESS,FETCH_ACCOUNT_ERROR } from "./actionTypes";

/**
 * delete account
 * @param {object} cardId The account cardId
 */
export const deleteAccount = cardId => {
	return {
		type: DELETE_ACCOUNT,
		payload: cardId
	};
};

/**
 * Start fetching account data
 * @param {object} cardId The account cardId
 */
export const fetchAccountPending = cardId => {
    return {
        type: FETCH_ACCOUNT_PENDING,
        payload: cardId
    }
}

/**
 * Successly fecthed account
 * @param {object} accountData The account data
 */
export const fetchAccountSuccess = accountData => {
    return {
        type: FETCH_ACCOUNT_SUCCESS,
        payload: accountData
    }
}

export const fetchAccountError = (cardId,error) => {
    return {
        type: FETCH_ACCOUNT_ERROR,
        payload: cardId,
        error: error
    }
}