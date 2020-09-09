<?php
$uploaddir = '';
$uploadfile = $uploaddir . basename("waitinglist.xlsx");

if($_FILES['downloadlistwaitingFile']) {
    if (move_uploaded_file($_FILES['downloadlistwaitingFile']['tmp_name'], $uploadfile)) {
        echo "yes";
    } else {
        echo "Возможная атака с помощью файловой загрузки!\n";
    }
} else {
    echo "Отправлен не файл";
}



?>