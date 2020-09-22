import {
  FETCH_LOAN_PENDING,
  FETCH_LOAN_SUCCESS,
  FETCH_LOAN_ERROR,
} from '../actions/actionTypes';

import produce from 'immer';

const initialStateLoans = [];
const example = {
  pending: false,
  error: null,
  auteur: 'Saint-Mars, Dominique de 1949-....',
  cardId: '11111',
  dateMax: '10/12/2016',
  datePret: "En prêt jusqu'au 10/12/2016",
  editeur: 'Calligram-C. Gallimard',
  id: 98700,
  isbn: '9782884803359',
  linkProlongation:
    '<a class="lien-prolongation" href="/osiros/web/aloes_prolongation.php?idProlong=6121790&ajax=1"><b>Prolongation</b></a>',
  permalien:
    'http://www.la-bibliotheque.com/recherche/notice.php?queryosiros=id:o98700',
  picture: '/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif',
  resume: '',
  titre: 'Lili part en camp de vacances',
  user_id: '1111',
  notice: {
    DCContributor: 'Bloch, Serge',
    DCCreator: 'Saint-Mars, Dominique de',
    DCDate: 'cop. 2007',
    DCDescription: '',
    DCFormat: '1 vol. (45 p.) ; ill. en coul., couv. ill. en coul. ; 16 cm',
    DCIdentifier:
      'http://www.la-bibliotheque.com/notice.php?queryosiros=id:98700',
    DCLanguage: 'français',
    DCPublisher: 'Calligram-C. Gallimard',
    DCRelation: 'Ainsi va la vie',
    DCRights: 'BNF',
    DCSource: '',
    DCSubject: 'Albums',
    DCTitle: 'Lili part en camp de vacances',
    DCType: 'book',
    description: '',
    generator: 'WordPress 4.9.5"',
    isbn: '9782884803359',
    ogimage:
      'http://www.la-bibliotheque.com/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif',
    ogtitle: 'Lili part en camp de vacances',
    ogtype: 'article',
    ogurl:
      'http://www.la-bibliotheque.com/recherche/notice.php?queryosiros=id:o98700',
    title: 'Lili part en camp de vacances',
    twitterimage:
      'http://www.la-bibliotheque.com/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif',
    twittertitle: 'Lili part en camp de vacances',
    numColl:'12',
    section:'Jeunesse',
    emplacement:'ALBUMS',
    typeDocument:'Livre'
  },
};
export default function (state = initialStateLoans, action) {
  switch (action.type) {
    case FETCH_LOAN_PENDING:
      return produce(state, (draftState) => {
        //on passe tous les anciens pret de la carte a pending = true;
        draftState
          .filter((loan) => {
            return loan.cardId == action.payload;
          })
          .forEach((loan) => {
            loan.pending = true;
          });
        console.log('pending', draftState);
      });
    case FETCH_LOAN_SUCCESS:
      let newLoanList = action.payload.loanList;
      let currentCardId = action.payload.cardId;
      let newState = state.reduce(
        (accumulateur, valeurCourante, index, array) => {
          if (valeurCourante.cardId == currentCardId) {
            let matchedNewLoan = newLoanList.filter(
              (newLoan) => newLoan.id == valeurCourante.id,
            )[0];
            //Si present dans la nouvelle liste de prêt, on le mets a jour
            if (matchedNewLoan) {
              accumulateur.push({...valeurCourante, ...matchedNewLoan});
              //On le supprime de la nouvelle liste car son cas est traité
              let newLoanIndex = newLoanList.indexOf(matchedNewLoan);
              newLoanList.splice(newLoanIndex, 1);
            }
          } else {
            accumulateur.push(valeurCourante); //On touche pas au pret des autres cartes
          }
          return accumulateur;
        }, []
      );
      newState.push(...newLoanList);//Les nouveau prêt
      //console.log(newState);
      newState.sort((a, b) => {
        let titreA = a.titre.toLowerCase();
        let titreB = b.titre.toLowerCase();
        if (titreA > titreB) {
          return 1;
        }
        if (titreB > titreA) {
          return -1;
        }
        return 0;
      });

      return newState;

    /**
      newState.push(...newLoanList);
      return newState;

      return produce(state, (draftState) => {
        let newLoanList = [];//action.payload.loanList;
        let currentCardId = action.payload.cardId;
        //console.log('draftState',draftState);
        //on passe tous les anciens pret de la carte a pending = false;
        draftState
          //.filter((draftLoan) => draftLoan.cardId == currentCardId)
          .forEach(function (draftLoan, index, draftLoanList) {
            if (draftLoan.cardId == currentCardId) {
              //Pour ceux de cette carte
              draftLoan.pending = false;
              draftLoan.error = null;
              //On cherche un pret avec le même id
              //action.payload.loanList
              let matchedNewLoan = newLoanList.filter(
                (newLoan) => newLoan.id == draftLoan.id,
              )[0];
              //Si present dans la nouvelle liste de prêt, on le mets a jour
              if (matchedNewLoan) {
                draftLoan = {...draftLoan, ...matchedNewLoan};
                //On le supprime car son cas est traité
                let newLoanIndex = newLoanList.indexOf(matchedNewLoan);
                newLoanList.splice(newLoanIndex, 1);
              } else {
                //Si pas présent dans la nouvelle liste, ont le supprime
                draftState.splice(index, 1);
              }
            }
            //draftState.splice(index, 1);
          });
        //On ajoute les prêt qui n'était pas déja la
        draftState.push(...newLoanList);
      }); */
    case FETCH_LOAN_ERROR:
      return produce(state, (draftState) => {
        //on passe tous les anciens pret de la carte a pending = false;
        draftState
          .filter((loan) => {
            return loan.cardId == action.payload;
          })
          .forEach((loan) => {
            loan.pending = false;
            loan.error = action.error;
          });
      });
    default: {
      return state;
    }
  }
}
