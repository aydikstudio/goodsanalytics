<?php
$uploaddir = '';
$uploadfile = $uploaddir . basename("turnover.xlsx");

if($_FILES['downloadTurnOverFile']) {
    if (move_uploaded_file($_FILES['downloadTurnOverFile']['tmp_name'], $uploadfile)) {
        echo "yes";
    } else {
        echo "Возможная атака с помощью файловой загрузки!\n";
    }
} else {
    echo "Отправлен не файл";
}



?>