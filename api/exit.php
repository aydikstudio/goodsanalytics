<?php
require_once 'session_check.php';
    header('Access-Control-Allow-Origin: *');
        session_start();
        session_destroy();
    
?>