<?php
session_start();
require_once '../config/config.php';


$company="";

if(@$_GET['company']) {
    $company = $_GET['company'];
}

if(@$_POST['company']) {
    $company = $_POST['company'];
}


if(isset($_GET)) {

    if(isset($_GET['type'])) {

    $type = $_GET['type'];


    if($type == "item_hypothesis") {
        $query = "SELECT * FROM `hypothesis` WHERE hyp_id=".$_GET['item']." and company='".$company."'  order by hyp_id desc";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }


    if($type == "all_hypothesis") {
        $query = "SELECT * FROM hypothesis WHERE company='".$company."' order by hyp_id desc";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($type == "good_hypothesis") {
        $query = "SELECT * FROM hypothesis WHERE wb_art=".$_GET['item']." and company='".$company."' order by hyp_id desc";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($type == "delete_hypothesis") {
        $query_del = "DELETE FROM hypothesis WHERE hyp_id=".$_GET['item'];
        $res_del = mysqli_query($mysqli, $query_del);
        
        if($res_del) {
            echo 1;
        } else {
            echo 0;
        }
    }



   

            
}


}


if(isset($_POST)) {
    $good = [];
    array_push($good, json_decode(file_get_contents('php://input'), true)['data']);
    $type = json_decode(file_get_contents('php://input'), true)['type'];
    $date =  date("d/m/Y");
    $value = json_decode($good[0], true);

    if(!isset($_SESSION['login'])) {
        $user_login = 'Не указано';
    } else {
        $user_login = $_SESSION['login'];
    }

    
    
    if($type == "add_hypothesis") {
        $query_add = "INSERT INTO `hypothesis`(`wb_art`, `name`, `was_ship`, `was_sale`, `was_date`, `status`, `description`, `user_login`, `company`)
        VALUES ('".$value['wb_art']."', '".$value['name']."', '".$value['postavleno']."', '".$value['prodano']."', '".$date."', 
        '0', '".$value['desc']."','".$user_login."', '".$value['company']."')";
        $res_add = mysqli_query($mysqli, $query_add);
        if($res_add) {
            echo 1;
        } else {
            echo 0;
        }
    }

    if($type == "update_hypothesis") {
        $hip_id = json_decode(file_get_contents('php://input'), true)['hip_id'];
    
            $query = "UPDATE `hypothesis` SET `postavleno`='".$value['postavleno']."',`prodano`='".$value['prodano']."',`date`= '".$date."' , `status`= 1 WHERE hyp_id=".$hip_id;
            $res = mysqli_query($mysqli, $query);
            if($res) {
                echo 1;
            } else {
                echo 0;
            }
        }
    
}



?>