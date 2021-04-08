<?php
  // $mysqli = new mysqli('localhost', 'aydik', 'aydikxtvgbjystudiogoodsanalytics', 'goodsanalytics');
    $mysqli = new mysqli('localhost', 'mysql', 'mysql', 'goodsanalytics');
  if (mysqli_connect_errno()) {
    echo "Подключение невозможно: ".mysqli_connect_error();
  }
?>