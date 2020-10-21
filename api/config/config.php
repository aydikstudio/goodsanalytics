<?php
  // $mysqli = new mysqli('localhost', 'aydik', 'aydikxtvgbjystudiogoodsanalytics', 'goodsanalytics');
    $mysqli = new mysqli('localhost', 'aydik', '12345678', 'goodsanalytics');
  if (mysqli_connect_errno()) {
    echo "Подключение невозможно: ".mysqli_connect_error();
  }
?>