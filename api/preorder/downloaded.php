<?php
$uploaddir = '';
$uploadfile = $uploaddir . basename("order.xlsx");

if($_FILES['downloadorderfile']) {
    if (move_uploaded_file($_FILES['downloadorderfile']['tmp_name'], $uploadfile)) {
        echo "yes";
    } else {
        echo "Возможная атака с помощью файловой загрузки!\n";
    }
} else {
    echo "Отправлен не файл";
}



?>