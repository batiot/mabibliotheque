import { FETCH_LOAN_PENDING,FETCH_LOAN_SUCCESS,FETCH_LOAN_ERROR,LOAN_UNCHECK,LOAN_CHECK,LOAN_SORT } from "./actionTypes";
import {WS} from '../services';

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
 * mark loan as checked
 * @param {object} loanId The loan id
 */
export const loanCheck = loanId => {
  return {
      type: LOAN_CHECK,
      payload: loanId
  }
}

/**
 * mark loan as unchecked
 * @param {object} loanId The loan id
 */
export const loanUnCheck = loanId => {
  return {
      type: LOAN_UNCHECK,
      payload: loanId
  }
}

/**
 * sort loan
 * @param {object} sortBy the sort by loan attributes name
 */
export const loanSort = sortBy => {
  return {
      type: LOAN_SORT,
      payload: sortBy
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


export const fetchLoanByAccount = async (dispatch,account,existingLoans) => {
    try {
      // Reducers may handle this to set a flag like isFetching
      await dispatch(fetchLoanPending(account.cardId));
      //Perform the actual API call
      let newLoanList = await WS.fetchAccountLoans(account);
      //On fait les appel en sequentiel pour ne pas surcharger le serveur
      for (let newLoan of newLoanList) {
        let [notice] = existingLoans
          .filter((loan) => (loan.id == newLoan.id))
          .map((loan) => {return loan.notice;})
        if (!notice) {
          //appel distant que si on a pas déja l'info
          notice = await WS.fetchRemoteNotice(newLoan.id);
        }
        newLoan.notice = notice;
      }
      //newLoanList = [];
      return dispatch(fetchLoanSuccess(account.cardId, newLoanList));
    } catch (error) {
      console.log('fetchLoanError', error);
      await dispatch(fetchLoanError(account.cardId, error));
      //await dispatch(fetchLoanError(account.cardId, error));
    }
  }