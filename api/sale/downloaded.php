<?php
$uploaddir = '';
$uploadfile = $uploaddir . basename("sale.xlsx");

if($_FILES['downloadsalefile']) {
    if (move_uploaded_file($_FILES['downloadsalefile']['tmp_name'], $uploadfile)) {
        echo "yes";
    } else {
        echo "Возможная атака с помощью файловой загрузки!\n";
    }
} else {
    echo "Отправлен не файл";
}




?>