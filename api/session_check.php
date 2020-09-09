<?php
session_start();


if($_SESSION['name']) {
    echo 0;
} else {
    echo 1;
}





?>