import CookieManager from '@react-native-community/cookies';

const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36";

const login = async (cardId, password) => {
  try {
    let clearCookieSuccess = await CookieManager.clearAll(); //clearing cookies stored natively before each request
    console.log('CookieManager.clearAll =>', clearCookieSuccess);

    let res = await fetch(process.env.REACT_APP_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept:          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'User-Agent':          USER_AGENT,
        Origin: 'http://www.la-bibliotheque.com',
        Referer: 'http://www.la-bibliotheque.com/votre-espace/',
      },
      body:        'login=aloes&log=' +        cardId +        '&pwd=' +        password +        '&wp-submit=Se connecter&redirect_to=http://www.la-bibliotheque.com/espace-prive',
    });

    console.log(res.headers.get('content-type'));
    console.log(res.url, process.env.REACT_APP_URL_LOGIN);
    if (res.url == process.env.REACT_APP_URL_LOGIN) {
      // http://www.la-bibliotheque.com/espace-prive/ http://www.la-bibliotheque.com/votre-espace/
      throw new Error('Erreur de saisie, veuillez recommencer');
    }
    //Fill account
    let account = {};
    account.password=password;

    // Get cookies for a url
    let cookies = await CookieManager.get(process.env.REACT_APP_URL_LOGIN);
    const phpSessionId = Object.keys(cookies)
        .filter(key => 'PHPSESSID'==key)
        .reduce((obj, key) => {
          obj[key] = cookies[key];
          return obj;
        }, {});
    console.log('CookieManager.get =>', cookies);
    //console.log('CookieManager.get =>', phpSessionId);
    account.cookie = phpSessionId;

    //else successful login redirect to another url
    let bodyText = await res.text();
    account.cardId = bodyText      .substr(bodyText.indexOf('card_id') + 10, 7)      .replace("'", ''); //card_id: '974920',
    account.userId = bodyText      .substr(bodyText.indexOf('user_id') + 16, 5)      .replace('"', ''); //<input type="hidden" name="user_id" value="5675"/>
    account.token = bodyText.substr(bodyText.indexOf('token=') + 6, 33); // var wbs_url = 'http://www.la-bibliotheque.com/osiros/web/services/ws.pretsEnCours.php?token=osik58c2c9ds8vf1gb56dza5c6132cq6s&id_user=5685';
    //account.tokenValidUntil
    let blockMesInfos = bodyText.substr(      bodyText.indexOf('Mes informations</h1><br><br>') + 50,      310,    );
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
  } catch (error) {
    throw error;
  }
};

const checkStatus =(response) =>{
  if (response.ok) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const fetchAccountLoans = async (account) => {
  let queryLoan =  process.env.REACT_APP_URL_LOAN + '?token=' + account.token + '&id_user=' + account.userId;
  //console.log(queryLoan);
  let response = await fetch(queryLoan, {
    method: 'GET',
    headers: {
      Accept: '*/*',
      'User-Agent': USER_AGENT,
      Referer: 'http://www.la-bibliotheque.com/espace-prive/',
    },
  });
  checkStatus(response)
  let responseJson = await response.json();
  //console.log(responseJson);
  /*
        Object {r
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
  return responseJson.map((obj) => {
    obj.isbn = obj.picture.substr(obj.picture.lastIndexOf('/') + 1, 13);
    const datePattern =  /^(\d{2})\/(\d{2})\/(\d{4})$/;
    const dateMaxString = obj.datePret.substr(-10);
    const [,day, month, year] = datePattern.exec(dateMaxString);
    obj.dateMax = new Date(year,month-1,day);
    obj.picture  = process.env.REACT_APP_URL_PICTURE + obj.picture;
    obj.user_id = account.userId;
    obj.cardId = account.cardId;
    return obj;
  });
};

const fetchRemoteNotice = async (idOsiros) =>{
  let queryNotice = process.env.REACT_APP_URL_NOTICE  + idOsiros;
  //console.log(queryNotice);
  let response = await fetch(queryNotice, {
          method: "GET",
          headers: {
              "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
              "User-Agent": USER_AGENT,
              "Referer": "http://www.la-bibliotheque.com/espace-prive/"
          }
      })
  checkStatus(response)
  let bodyText = await response.text()

  let isbn = bodyText.substr(bodyText.indexOf('BW_id_isbn') + 19, 13); //<input type="hidden" id="BW_id_isbn" value="9782884803359">
  //Request URL: http://www.la-bibliotheque.com/recherche/resultat.php/?type_rech=rs&index%5B%5D=fulltext&bool%5B%5D=&reset=1&value%5B%5D=9782884803359
  const reducer = (accumulator, currentValue) => {
      let pos = currentValue.indexOf("\" content=")
      let propName = currentValue.substring(currentValue.indexOf('=')+2,pos).replace('.','').replace(':','')
      let propValue = currentValue.substring(pos+11,currentValue.length-3)
      accumulator[propName] = propValue;
      return accumulator
  };
  let osirosData ={'isbn':isbn}
  let metas = bodyText
      .match(/<meta (name|property)=(.*?)\/>/g)
      .reduce(reducer,osirosData)
  return osirosData

};


async function fetchNotice(idOsiros) {
  //await AsyncStorage.clear();
  let notice = await this.fetchLocalNotice(idOsiros);
  if(!notice){
      //No local data, pick remote one
      notice = await this.fetchRemoteNotice(idOsiros)
      await this.storeLocalNotice(idOsiros,notice) 
  }
  return notice;
}
async function fetchLocalNotice(idOsiros) {
  let noticeString = await AsyncStorage.getItem(idOsiros.toString());
  return noticeString ? JSON.parse(noticeString):noticeString;
}
async function storeLocalNotice(idOsiros,notice) {
  return await AsyncStorage.setItem(idOsiros.toString(), JSON.stringify(notice));
}

async function logout(urlLogin) {
  //@GET("wp-login.php?action=logout&redirect_to=http%3A%2F%2Fwww.la-bibliotheque.com%2F&_wpnonce=8d6333638c")
  //@GET("pret/logout.php")
  //Observable<String> rxLogout();
}

export const WS = {
  login,fetchAccountLoans,fetchRemoteNotice
};
