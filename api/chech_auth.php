<?php 
    session_start();
    if(!isset($_SESSION['name'])) {
        exit("Нет доступа");
    }
?>