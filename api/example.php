<?php 
    $password = 'vRRYGSG2JIS$';
    $hash = password_hash($password, PASSWORD_BCRYPT);
    
    echo $hash;
?>