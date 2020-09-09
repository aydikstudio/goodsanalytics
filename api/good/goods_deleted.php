<?php 
require_once '../config/config.php';

if(isset($_GET)) {
        $query = "SELECT name FROM deleted_models";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
}


?>