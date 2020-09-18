import { FETCH_LOAN_PENDING,FETCH_LOAN_SUCCESS,FETCH_LOAN_ERROR } from "./actionTypes";


/**
 * Start fetching loan data list for an account
 * @param {object} cardId The loan cardId
 */
export const fetchLoanPending = cardId => {
    return {
        type: FETCH_LOAN_PENDING,
        payload: cardId
    }
}

/**
 * Successly fecthed loan list  for an account
 * @param {object} loanList The loan list data
 */
export const fetchLoanSuccess = (cardId,loanList) => {
    return {
        type: FETCH_LOAN_SUCCESS,
        payload: {'cardId':cardId,'loanList':loanList}
    }
}

export const fetchLoanError = (cardId,error) => {
    return {
        type: FETCH_LOAN_ERROR,
        payload: cardId,
        error: error
    }
}