import CookieManager from '@react-native-community/cookies';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36';

const login = async (cardId, password) => {
  try {
    let clearCookieBeforeSuccess = await CookieManager.clearAll(); //clearing cookies stored natively before each request
    //console.log('CookieManager.clearAll =>', clearCookieBeforeSuccess);

    let res = await fetch(process.env.REACT_APP_URL_LOGIN, {
      method: 'POST',
      headers: {
        'Content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
        'User-Agent': USER_AGENT,
        Origin: 'http://www.la-bibliotheque.com',
        Referer: 'http://www.la-bibliotheque.com/votre-espace/',
      },
      body:
        'login=aloes&log=' +
        cardId +
        '&pwd=' +
        password +
        '&wp-submit=Se connecter&redirect_to=http://www.la-bibliotheque.com/espace-prive',
    });

    //console.log(res.headers.get('content-type'));
    //console.log(res.url, process.env.REACT_APP_URL_LOGIN);
    if (res.url == process.env.REACT_APP_URL_LOGIN) {
      // http://www.la-bibliotheque.com/espace-prive/ http://www.la-bibliotheque.com/votre-espace/
      throw new Error('Erreur de saisie, veuillez recommencer');
    }
    //Fill account
    let account = {};
    account.password = password;

    // Get cookies for a url
    let cookies = await CookieManager.get(process.env.REACT_APP_URL_LOGIN);
    const phpSessionId = Object.keys(cookies)
      .filter((key) => 'PHPSESSID' == key)
      .reduce((obj, key) => {
        obj[key] = cookies[key];
        return obj;
      }, {});
    //console.log('CookieManager.get =>', cookies);
    //console.log('CookieManager.get =>', phpSessionId);
    account.cookie = phpSessionId;
    //Une fois le cookie utile sauvegardé, on vide les cookie
    let clearCookieAfterSuccess = await CookieManager.clearAll(); 

    //else successful login redirect to another url
    let bodyText = await res.text();
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
  } catch (error) {
    throw error;
  }
};

const checkStatus = (response) => {
  if (response.ok) {
    return response;
  } else {
    let error = new Error(response.statusText);
    error.response = response;
    throw error;
  }
};

const fetchAccountLoans = async (account) => {
  let queryLoan =
    process.env.REACT_APP_URL_LOAN +
    '?token=' +
    account.token +
    '&id_user=' +
    account.userId;
  //console.log(queryLoan);

  try {
    let clearCookieSuccess = await CookieManager.clearAll(); //clearing cookies stored natively before each request
    //mais au final, il n'y en pas besoin car le ws utilise seulement le token en param
    //console.log("account.cookie",account.cookie["PHPSESSID"]);
    //let setCookieSuccess = await CookieManager.set('http://ovh.batiot.com',account.cookie["PHPSESSID"]);
    let response = await fetch(queryLoan, {
      method: 'GET',
      headers: {
        Accept: '*/*',
        'User-Agent': USER_AGENT,
        Referer: 'http://www.la-bibliotheque.com/espace-prive/',
      },
    });
    checkStatus(response);
    let responseJson = await response.json();
    //console.log('responseJson'+responseJson);
    /*
          Object {r
              "auteur": "Saint-Mars, Dominique de 1949-....",
              "datePret": "En prêt jusqu'au 31/10/2014",
              "editeur": "Calligram-C. Gallimard",
              "id": 98700,
              "linkProlongation": "<a class=\"lien-prolongation\" href=\"/osiros/web/aloes_prolongation.php?idProlong=6341790&ajax=1\"><b>Prolongation</b></a>",
              "linkProlongation":""
              "permalien": "http://www.la-bibliotheque.com/recherche/notice.php?queryosiros=id:o98700",
              "picture": "/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif",
              "resume": "",
              "titre": "Lili part en camp de vacances",
          },
          //<img src="http://www.la-bibliotheque.com/osiros/web/pictures/9/7/8/2/8/8/8/9782884803359FS.gif" width="250" alt="">
      */
    return responseJson.map((obj) => {
      obj.isbn = obj.picture.substr(obj.picture.lastIndexOf('/') + 1, 13);
      const datePattern = /(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
      const dateMaxString = obj.datePret.substr(-10);
      const [, day, month, year] = datePattern.exec(dateMaxString);
      obj.dateMax = new Date(year, month - 1, day).toString();
      obj.picture = process.env.REACT_APP_URL_PICTURE + obj.picture;
      obj.user_id = account.userId;
      obj.cardId = account.cardId;
      let idProlong = obj.linkProlongation.match(/idProlong=(\d*?)&ajax/);
      if (idProlong){
        obj.idProlong = idProlong[1]
      }else{
        obj.idProlong=null;
      }
      return obj;
    });
  } catch (error) {
    console.log(error)
    throw error;
  }
};

const fetchRemoteNotice = async (idOsiros) => {
  let queryNotice = process.env.REACT_APP_URL_NOTICE + idOsiros;
  //console.log(queryNotice);
  //les notices sont en public
  //let clearCookieSuccess = await CookieManager.clearAll(); 
  let response = await fetch(queryNotice, {
    method: 'GET',
    headers: {
      Accept:
        'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8',
      'User-Agent': USER_AGENT,
      Referer: 'http://www.la-bibliotheque.com/espace-prive/',
    },
  });
  checkStatus(response);
  let bodyText = await response.text();

  let isbn = bodyText.substr(bodyText.indexOf('BW_id_isbn') + 19, 13); //<input type="hidden" id="BW_id_isbn" value="9782884803359">
  //Request URL: http://www.la-bibliotheque.com/recherche/resultat.php/?type_rech=rs&index%5B%5D=fulltext&bool%5B%5D=&reset=1&value%5B%5D=9782884803359
  const noticeDataReducer = (accumulator, currentValue) => {
    let pos = currentValue.indexOf('" content=');
    let propName = currentValue
      .substring(currentValue.indexOf('=') + 2, pos)
      .replace('.', '')
      .replace(':', '');
    let propValue = currentValue.substring(pos + 11, currentValue.length - 3);
    accumulator[propName] = propValue;
    return accumulator;
  };
  let notice = {isbn: isbn};
  let metas = bodyText
    .match(/<meta (name|property)=(.*?)\/>/g)
    .reduce(noticeDataReducer, notice);

  let typeDocument = bodyText.match(
    /<span class="notice_description_titre">Type de document :<\/span>(.*?)<br \/>/,
  );
  if (typeDocument) notice.typeDocument = typeDocument[1].trim();

  let emplacement = bodyText.match(
    /<span class="notice_description_titre">Emplacement :<\/span>(.*?)<br \/>/,
  );
  if (emplacement) notice.emplacement = emplacement[1].trim();

  let section = bodyText.match(
    /<span class="notice_description_titre">Section :<\/span>(.*?)<br \/>/,
  );
  if (section) notice.section = section[1].trim();

  let numColl = bodyText.match(
    /<span class="notice_description_titre">Numéro collection :<\/span><br \/>(.*?)<br \/>/,
  );
  if (numColl) notice.numColl = numColl[1].trim();

  //<span class="notice_description_titre">Type de document :</span> Jeu<br />
  //<span class="notice_description_titre">Emplacement :</span> JEUX A REGLES<br />
  //<span class="notice_description_titre">Date de publication :</span><br />2018<br />
  //<span class="notice_description_titre">Nombres de joueurs :</span><br />2 à 4<br />
  //<span class="notice_description_titre">Section :</span> Jeunesse<br />

  //<span class="notice_description_titre">Type de document :</span> Bande dessinée Jeunesse<br />
  //<span class="notice_description_titre">Emplacement :</span> BD JEUNESSE<br />
  //<span class="notice_description_titre">Section :</span> Jeunesse<br />
  //<span class="notice_description_titre">Exemplaires :</span><br />
  //  <ul class="dispo-status" style="margin: 0 0 0 12px;">
  //    <li class="non-dispo"><span style="color:black; font-size:16px;">Charles Gautier-Hermeland (retour le 29/09/2020)</span></li>
  //    <li class="non-dispo"><span style="color:black; font-size:16px;">Gao Xingjian - Sillon (retour le 24/10/2020)</span></li>
  //    <li class="dispo"><span style="color:black;">Gao Xingjian - Sillon</span></li>
  //  </ul>
  //</span>

  //<span class="notice_description_titre">Type de document :</span> Livre<br />

  //<span class="notice_description_titre">Collection :</span><br /><a href="resultat.php?queryosiros=titre_col:(&quot;Glouton&quot;)">Glouton</a><br />
  //<span class="notice_description_titre">Numéro collection :</span><br />1<br />

  //<a href="resultat.php?queryosiros=titre_col:(&quot;Pocket+jeunesse&quot;)">Pocket jeunesse</a><br />
  //<a href="resultat.php?queryosiros=titre_col:(&quot;La+guerre+des+clans&quot;)">La guerre des clans</a><br />
  //<span class="notice_description_titre">Numéro collection :</span><br />livre 2<br />

  //<meta name="DC.Subject" content="Romans Fantastique"/>
  //<meta name="DC.Subject" content="Personnages animaliers"/>

  //notice.title = DC.Title =Titre
  //notice.description  = DC.Description = résumé
  //notice.DC.Creator = Auteur
  return notice;
};

async function fetchNotice(idOsiros) {
  //await AsyncStorage.clear();
  let notice = await this.fetchLocalNotice(idOsiros);
  if (!notice) {
    //No local data, pick remote one
    notice = await this.fetchRemoteNotice(idOsiros);
    await this.storeLocalNotice(idOsiros, notice);
  }
  return notice;
}
async function fetchLocalNotice(idOsiros) {
  let noticeString = await AsyncStorage.getItem(idOsiros.toString());
  return noticeString ? JSON.parse(noticeString) : noticeString;
}
async function storeLocalNotice(idOsiros, notice) {
  return await AsyncStorage.setItem(
    idOsiros.toString(),
    JSON.stringify(notice),
  );
}

async function prolongation(idProlong) {
  let queryProlongation = process.env.REACT_APP_URL_PROLONGATION + idProlong;
  //console.log(queryProlongation);
    //let clearCookieSuccess = await CookieManager.clearAll(); 
  //mais au final, il n'y en pas besoin car le ws utilise seulement le token en param
  let response = await fetch(queryProlongation, {
    method: 'GET',
    headers: {
      Accept:'*/*',
      'User-Agent': USER_AGENT,
      Referer: 'http://www.la-bibliotheque.com/espace-prive/#section_prets_en_cours',
    },
  });
  checkStatus(response);
  let responseJson = await response.json();
  console.log(responseJson);//{"ALOES_MSG":"OK, 1 prolongation(s) effectu\u00e9e(s)."} {"ALOES_MSG":"Aucune prolongation effectu\u00e9e !"}
  return (responseJson.ALOES_MSG == "OK, 1 prolongation(s) effectu\u00e9e(s).");
}


async function logout(urlLogin) {
  //@GET("wp-login.php?action=logout&redirect_to=http%3A%2F%2Fwww.la-bibliotheque.com%2F&_wpnonce=8d6333638c")
  //@GET("pret/logout.php")
  //Observable<String> rxLogout();
}

export const WS = {
  login,
  fetchAccountLoans,
  fetchRemoteNotice,
  prolongation
};
