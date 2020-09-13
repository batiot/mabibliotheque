<?php
// open the file in a binary mode
$name = './9782884803359FS.gif';
$fp = fopen($name, 'rb');

// send the right headers
header("Content-Type: image/gif");
header("Content-Length: " . filesize($name));

// dump the picture and stop the script
fpassthru($fp);
exit;
?>
