const login = (cardId, password) => {
  return fetch(process.env.REACT_APP_URL_LOGIN, {
    method: 'POST',
    headers: {
      'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'User-Agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36',
      Origin: 'http://www.la-bibliotheque.com',
      Referer: 'http://www.la-bibliotheque.com/votre-espace/',
    },
    body:
      'login=aloes&log=' +
      cardId +
      '&pwd=' +
      password +
      '&wp-submit=Se connecter&redirect_to=http://www.la-bibliotheque.com/espace-prive',
  })
    .then((res) => {
      console.log(res.headers.get('content-type'));
      console.log(res.url, process.env.REACT_APP_URL_LOGIN);
      if (res.url == process.env.REACT_APP_URL_LOGIN) {
        // http://www.la-bibliotheque.com/espace-prive/ http://www.la-bibliotheque.com/votre-espace/
        throw new Error('login failed');
      }
      //else successful login redirect to another url
      return res.text().then(function (bodyText) {
        let account = {};
        account.cardId = bodyText
          .substr(bodyText.indexOf('card_id') + 10, 7)
          .replace("'", ''); //card_id: '974920',
        account.userId = bodyText
          .substr(bodyText.indexOf('user_id') + 16, 5)
          .replace('"', ''); //<input type="hidden" name="user_id" value="5675"/>
        account.token = bodyText.substr(bodyText.indexOf('token=') + 6, 33); // var wbs_url = 'http://www.la-bibliotheque.com/osiros/web/services/ws.pretsEnCours.php?token=osik58c2c9ds8vf1gb56dza5c6132cq6s&id_user=5685';
        //account.tokenValidUntil
        let blockMesInfos = bodyText.substr(
          bodyText.indexOf('Mes informations</h1><br><br>') + 50,
          310,
        );
        //console.log(account, 'Mes informations', blockMesInfos);
        let result = blockMesInfos.match(/<p>(.*?)<\/p>/g);
        account.userName = result[0].substring(3, result[0].length - 4);
        account.cardStartDate = result[2].substring(51, result[2].length - 4);
        //<section id="section_infos_emprunteur" class="section_prets" style="background-color:white; ">
        //<h1 class="SQtitle2 SQblack">Mes informations</h1><br><br>
        //<div class="pret_liste">
        //<p>M. DURAND Didier</p>
        //<p><b>Numéro de carte : </b>974442</p>
        //<p><b>Date de réabonnement à La Bibliothèque : </b>13/10/2017</p>
        //console.log('account',account);
        return account;
      });
    })
    .catch((e) => {
      throw e;
    });
};

const fetchCurrentLoan = (urlLoan, account)=> {
    let queryLoan = urlLoan + "?token=" + account.token + "&id_user=" + account.user_id
    let response = fetch(queryLoan, {
            method: "GET",
            headers: {
                "Accept": "*/*",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/60.0.3112.113 Safari/537.36",
                "Referer": "http://www.la-bibliotheque.com/espace-prive/"
            }
        });
    //ApiUtils.checkStatus(response)
    let responseJson = response.json()
    /*
        Object {
            "auteur": "Saint-Mars, Dominique de 1949-....",
            "datePret": "En prêt jusqu'au 31/10/2014",
            "editeur": "Calligram-C. Gallimard",
            "id": 98700,
            "linkProlongation": "<a class=\"lien-prolongation\" href=\"/osiros/web/aloes_prolongation.php?idProlong=6341790&ajax=1\"><b>Prolongation</b></a>",
            "permalien": "http://www.la-bibliotheque.com/recherche/notice.php?queryosiros=id:o98700",
            "picture": "/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif",
            "resume": "",
            "titre": "Lili part en camp de vacances",
        },
        //<img src="http://www.la-bibliotheque.com/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif" width="250" alt="">
    */
    let currentLoans = responseJson.map(obj => {
        obj.isbn = obj.picture.substr(obj.picture.lastIndexOf('/')+1,13);
        obj.dateMax = obj.datePret.substr(-10);
        obj.user_id = account.user_id
        return obj
    })
    /*
    let currentLoansWithOsirosData = await Promise.all(currentLoans.map(loan=>{
        return this.fetchNotice(loan.id).then((osirosData)=>{
            loan.osirosData = osirosData
            return loan
        })
    }));
    */
    return currentLoansWithOsirosData
}

export const WS = {
  login,
};
