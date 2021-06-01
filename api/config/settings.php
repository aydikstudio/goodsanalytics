<?php 

if(@$_GET['company']) {
    $company = $_GET['company'];
}

if(@$_POST['company']) {
    $company = $_POST['company'];
}


if(@$_GET['client']) {
    $client = $_GET['client'];
}

if(@$_POST['client']) {
    $client = $_POST['client'];
}


$symbol = '';
$company = 'ipalievkb';
$client = 'wb';


if ($company == 'juveros' && $client == 'wb') {
    $symbol = '/';
} else if($company == 'ipalievkb' && $client == 'wb') {
    $symbol = '_';
} 
else if($company == 'ipalievkb' && $client == 'ozon') {
    $symbol = '/';
}
?>