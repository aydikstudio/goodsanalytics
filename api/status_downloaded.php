<?php 
    require_once 'config/config.php';


    if(isset($_GET)) {
        if(isset($_GET['name'])) {
            $name = stripslashes(trim($_GET['name']));
            $query ="SELECT `status` FROM `downloaded_status` WHERE `name`='".$name."'";
            $result = mysqli_query($mysqli, $query) or die("Ошибка " . mysqli_error($mysqli)); 
            if($result)
            {
                $row = mysqli_fetch_assoc($result);
                echo $row['status'];
            } else {
                echo "Ошибка";
            }
        }
    }

    
?>
