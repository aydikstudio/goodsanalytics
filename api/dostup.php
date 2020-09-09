<?php
session_start();
require_once 'config/config.php';


$_POST = json_decode(file_get_contents('php://input'), true);

if($_POST){
    $name = trim($_POST['login']);
    $password = trim($_POST['password']);
    $query ="SELECT * FROM `users` WHERE `login`='".$name."'";
    $result = mysqli_query($mysqli, $query) or die("Ошибка " . mysqli_error($mysqli)); 
    $result1 = mysqli_fetch_all($result, MYSQLI_ASSOC);
    $check_password = password_verify($password, $result1[0]['password']);
    if($check_password) {
            $_SESSION['login'] = trim($result1[0]['login']);
            $_SESSION['name'] = trim($result1[0]['name']);
            echo  $result1[0]['name'];
    } else {
        echo 0;
    }
} else {
    echo "Ошибка. Попробуйте позже";
}



?>