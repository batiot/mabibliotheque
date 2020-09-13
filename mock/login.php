<?php
   ob_start();
   session_start();
?>
<html lang = "en">
   
   <head>
      <title>Tutorialspoint.com</title>
      <link href = "css/bootstrap.min.css" rel = "stylesheet">
      
      <style>
         body {
            padding-top: 40px;
            padding-bottom: 40px;
            background-color: #ADABAB;
         }
         
         .form-signin {
            max-width: 330px;
            padding: 15px;
            margin: 0 auto;
            color: #017572;
         }
         
         .form-signin .form-signin-heading,
         .form-signin .checkbox {
            margin-bottom: 10px;
         }
         
         .form-signin .checkbox {
            font-weight: normal;
         }
         
         .form-signin .form-control {
            position: relative;
            height: auto;
            -webkit-box-sizing: border-box;
            -moz-box-sizing: border-box;
            box-sizing: border-box;
            padding: 10px;
            font-size: 16px;
         }
         
         .form-signin .form-control:focus {
            z-index: 2;
         }
         
         .form-signin input[type="email"] {
            margin-bottom: -1px;
            border-bottom-right-radius: 0;
            border-bottom-left-radius: 0;
            border-color:#017572;
         }
         
         .form-signin input[type="password"] {
            margin-bottom: 10px;
            border-top-left-radius: 0;
            border-top-right-radius: 0;
            border-color:#017572;
         }
         
         h2{
            text-align: center;
            color: #017572;
         }
      </style>
      
   </head>
	
   <body>
      
      <h2>Enter Username and Password</h2> 
      <div class = "container form-signin">
         
         <?php
            $msg = '';
            
            if (isset($_POST['log']) && !empty($_POST['log']) 
               && !empty($_POST['pwd'])) {
				
               if ($_POST['login'] == 'aloes' && $_POST['log'] == '123456'&& $_POST['pwd'] == 'abcd'&& $_POST['wp-submit'] == 'Se connecter') {
                  	$_SESSION['valid'] = true;
                  	$_SESSION['timeout'] = time();
                  	$_SESSION['username'] = '123456';
			setcookie("wordpress_test_cookie","WP+Cookie+check");
			setcookie("wordpress_logged_in_e1bff3392ed053227292beec49c22dd8","971650%7C1482603562%7Cp6jrS7PG3XErLp7E2kTUjbFh8dlpMmrDE7dJdMxoV2F%7C873419b7c4d52ec1383617c97318b8f6e14c7c2fe6b4eb0125a3a6828d533b4e");
			header("Location: ./accueil.php", true, 302);
			exit();
               }else {
                  $_SESSION['valid'] = false;
                  $msg = 'Wrong username or password';
               }
		print_r($_POST);
            }
         ?>
      </div> <!-- /container -->
      
      <div class = "container">
      
         <form class = "form-signin" role = "form"             action = "<?php echo htmlspecialchars($_SERVER['PHP_SELF']);             ?>" method = "post">
            <h4 class = "form-signin-heading"><?php echo $msg; ?></h4>
		<input type = "text" class = "form-control"                name = "login" value = "aloes"                required autofocus></br>
            <input type = "text" class = "form-control"                name = "log" value = "123456"                required autofocus></br>
            <input type = "password" class = "form-control"               name = "pwd" value = "abcd" required>
            <button class = "btn btn-lg btn-primary btn-block" type = "submit"                name = "wp-submit" value="Se connecter">Se connecter</button>
         </form>
			
         Click here to clean <a href = "logout.php" tite = "Logout">Session.
         
      </div> 
      
   </body>
</html>
