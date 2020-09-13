<?php
   session_start();
   unset($_SESSION["username"]);
   unset($_SESSION["password"]);

foreach (getallheaders() as $name => $value) {
    echo "$name: $value\n";
}
   
//?action=logout&redirect_to=http%3A%2F%2Fwww.la-bibliotheque.com%2F&_wpnonce=8d6333638c

   echo 'You have cleaned session';
?>
