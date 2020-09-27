<?php
   ob_start();
   session_start();
?>
 var wbs_url = 'http://www.la-bibliotheque.com/osiros/web/services/ws.pretsEnCours.php?token=osik58c2c9ds8vf1gb56dza5c6132cq6s&id_user=<?php echo $_SESSION["username"]?>';

	  <input type="hidden" name="user_id" value="<?php echo $_SESSION["username"]?>"/>
     <section id="section_infos_emprunteur" class="section_prets" style="background-color:white; ">
     <h1 class="SQtitle2 SQblack">Mes informations</h1><br><br>
     <div class="pret_liste">
     <p>M. BOISSIER Maguy</p>
     <p><b>Numéro de carte : </><?php echo $_SESSION["username"]?></p>
     <p><b>Date de réabonnement à La Bibliothèque : </b>17/07/2017</p>
     </div>

     user_id: '<?php echo $_SESSION["username"]?>',
     card_id: '<?php echo $_SESSION["username"]?>',


     </section>
