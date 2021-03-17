<?php 
require '../config/config.php';
require '../config/settings.php';

if(isset($_GET)) {
        $query = "SELECT `name` FROM `deleted_models` WHERE `client`='".$client."' and `company`='".$company."'";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
}


?>