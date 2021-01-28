<?php 
require_once '../config/config.php';
require '../config/settings.php';

if(isset($_GET)) {
    if(isset($_GET['check_name'])) {
        $query = "SELECT COUNT(*) FROM deleted_models where `name`='".$_GET['check_name']."' and `client`=".$client;
        $res = mysqli_query($mysqli, $query);
        $row = mysqli_fetch_row($res);
        $total = $row[0];
        echo $total;
    }


    if(isset($_GET['act_name'])) {
        $query = "SELECT COUNT(*) FROM deleted_models where `name`='".$_GET['act_name']."' and `client`=".$client;
        $res = mysqli_query($mysqli, $query);
        $row = mysqli_fetch_row($res);
        $total = $row[0];

        if($total == 1) {
            $query_del = "DELETE FROM deleted_models WHERE `name`='".$_GET['act_name']."' and `client`=".$client;
            $res_del = mysqli_query($mysqli, $query_del);
            if($res_del) {
                echo 0;
            }
        }

        if($total == 0) {
            $query_add = "INSERT INTO deleted_models (`name`, `client`) VALUES ('".$_GET['act_name']."', '".$client."');";
            $res_add = mysqli_query($mysqli, $query_add);
            if($res_add) {
                echo 1;
            }
        }
    }
}

?>