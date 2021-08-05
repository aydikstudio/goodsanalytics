<?php
require 'library/phpQuery.php';


if($_GET['art']) {
    $art = $_GET['art'];
    $url = 'https://www.wildberries.ru/catalog/'.$art.'/detail.aspx';
    $file = file_get_contents($url);
    $doc = phpQuery::newDocument($file);
    $img =  "https:".$doc->find('.j-zoom-photo')->attr('src');
    echo $img;
}


?>