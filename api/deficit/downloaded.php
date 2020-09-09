<?php
$uploaddir = '';
$uploadfile = $uploaddir . basename("deficit.xlsx");

if($_FILES['downloaddeficitFile']) {
    if (move_uploaded_file($_FILES['downloaddeficitFile']['tmp_name'], $uploadfile)) {
        echo "yes";
    } else {
        echo "Возможная атака с помощью файловой загрузки!\n";
    }
} else {
    echo "Отправлен не файл";
}



?>