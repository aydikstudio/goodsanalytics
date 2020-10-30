<?php 
require_once '../config/config.php';

$company="";

if(@$_GET['company']) {
    $company = $_GET['company'];
}

if(@$_POST['company']) {
    $company = $_POST['company'];
}


if(isset($_GET)) {
    if($_GET['type'] == 'shipment' ) {
        $query = "SELECT * FROM shipment where `name`='".$_GET['name']."' and `company` = '".$company."' ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($_GET['type'] == 'sale' ) {
        $query = "SELECT * FROM sale where `name`='".$_GET['name']."' and `company` = '".$company."' ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($_GET['type'] == 'return' ) {
        $query = "SELECT * FROM returned where `name`='".$_GET['name']."' and `company` = '".$company."' ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }


    if($_GET['type'] == 'all_shipment' ) {
        $query = "SELECT DISTINCT `date` FROM shipment where`company` = '".$company."'  ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($_GET['type'] == 'all_sale' ) {
        $query = "SELECT DISTINCT `date` FROM sale where `company` = '".$company."' ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($_GET['type'] == 'all_return' ) {
        $query = "SELECT DISTINCT `date` FROM returned where  `company` = '".$company."'  ORDER BY date";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }



    if($_GET['type'] == 'delete_shipment' ) {
        $query = "DELETE FROM `shipment` WHERE `date`='".$_GET['date']."'";
        $res = mysqli_query($mysqli, $query);
        echo "yes";
    }



    if($_GET['type'] == 'delete_sale' ) {
        $query = "DELETE FROM `sale` WHERE `date`='".$_GET['date']."'";
        $res = mysqli_query($mysqli, $query);
        echo "yes";
    }

    if($_GET['type'] == 'delete_return' ) {
        $query = "DELETE FROM `returned` WHERE `date`='".$_GET['date']."'";
        $res = mysqli_query($mysqli, $query);
        echo "yes";
    }
    

    }


?>