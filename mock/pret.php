<?php
session_start();
header("Content-Type: application/json");

?>
[
{"titre":"<?php echo $_GET["id_user"]?>AAAA","auteur":"","editeur":"","resume":"","id":<?php echo $_GET["id_user"]?>8,"permalien":"http:\/\/www.la-bibliotheque.com\/recherche\/notice.php?queryosiros=id:o252788","picture":"\/wp-content\/themes\/la_bibliotheque_orange\/images\/ui\/picto5.png","datePret":"En pr\u00eat jusqu'au 04\/01\/2017","linkProlongation":""},
{"titre":"<?php echo $_GET["id_user"]?>BBBB","auteur":"","editeur":"Au Diable Vauvert","resume":"","id":<?php echo $_GET["id_user"]?>9,"permalien":"http:\/\/www.la-bibliotheque.com\/recherche\/notice.php?queryosiros=id:o217868","picture":"\/osiros\/web\/pictures\/9\/7\/8\/2\/8\/4\/2\/9782846269322FS.gif","datePret":"En pr\u00eat jusqu'au <?php echo random_int(1, 28) ?>\/12\/2016","linkProlongation":"<a class=\"lien-prolongation\" href=\"\/osiros\/web\/aloes_prolongation.php?idProlong=6096565&ajax=1\"><b>Prolongation<\/b><\/a>"}
]
