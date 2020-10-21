<?php
session_start();
require_once '../config/config.php';
require '../vendor/autoload.php';
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set("memory_limit","512M");
ini_set('max_execution_time', 1800);

use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

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
    
    if($type == "item_order_name") {
        $query = "SELECT * FROM `order` WHERE `name`='".$_GET['name']."' and company='".$company."' ORDER BY `order_id` DESC";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($type == "item_order") {
        $query = "SELECT * FROM `order` WHERE order_id=".$_GET['item']." and company='".$company."'";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }


    if($type == "number_order") {
        $query = "SELECT * FROM `order` WHERE `number_order`=".$_GET['name']." and company='".$company."'";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }

    if($type == "all_orders") {
        $query = "SELECT DISTINCT `number_order`, `user_login`, `status_order`, `date` FROM `order` WHERE company='".$company."'  ORDER BY 'status_order' DESC";
        $res = mysqli_query($mysqli, $query);
        $data = array();
        

        while ($result =  mysqli_fetch_assoc($res)) {
           $data[] = $result;
        }
        echo json_encode($data);
    }


    if($type == "update_status") {
        if ($_GET['status'] == 'delete') {
            $query = "DELETE FROM `order` WHERE `number_order`=".$_GET['number_order'];
            unlink('files/'.$_GET['number_order'].'.xls');
            $res = mysqli_query($mysqli, $query);
            echo 0;
        } else {
            $query = "UPDATE `order` SET `status_order`='".$_GET['status']."' WHERE `number_order`=".$_GET['number_order'];
            $res = mysqli_query($mysqli, $query);
            echo 1;
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

    

    if($type == "add_order") {
        $company1 = json_decode(file_get_contents('php://input'), true)['company'];
        $order_id = rand(100, 50000);
        if(!isset($_SESSION['login'])) {
            $user_login = 'Не указано';
        } else {
            $user_login = $_SESSION['login'];
        }
        for ($i = 0; $i < count($value); $i++) {
            $query_add = "INSERT INTO `order`(`name`, `order_count`, `number_order`, `comment`, `status_order`, `user_login`, `company`)
            VALUES ('".$value[$i]['name']."', '".$value[$i]['order_count']."', '".$order_id."', '".$value[$i]['comment']."', 0, '".$user_login."', '".$company1."')";
            mysqli_query($mysqli, $query_add);
        }

        $subject = 'Заказ №'.$order_id.'на модерации. Проверьте';

        $message = '
        <html>
        <head>
        <title>Заказ на модерации</title>
        </head>
        <body>
        <p>Заказ №'.$order_id.'на модерации. Проверьте</p>
        </body>
        </html>
        ';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= "Content-type: text/html; charset=utf-8 \r\n";

        mail('kbaliev55@gmail.com', $subject, $message, $headers);
        mail('aydikstudio@gmail.com', $subject, $message, $headers);
        echo 1;
    }


    if($type == "edit_order") {

        $number_order = json_decode(file_get_contents('php://input'), true)['number_order'];
        $company1 = json_decode(file_get_contents('php://input'), true)['company'];

        $query = "DELETE FROM `order` WHERE `number_order`=".$number_order;
        $res = mysqli_query($mysqli, $query);
      
        if(!isset($_SESSION['login'])) {
            $user_login = 'Не указано';
        } else {
            $user_login = $_SESSION['login'];
        }
        for ($i = 0; $i < count($value); $i++) {
            $query_add = "INSERT INTO `order`(`name`, `order_count`, `number_order`, `comment`, `status_order`, `user_login`, `company`)
            VALUES ('".$value[$i]['name']."', '".$value[$i]['order_count']."', '".$number_order."', '".$value[$i]['comment']."', 0, '".$user_login."', '".$company1."')";
            mysqli_query($mysqli, $query_add);
        }

        $subject = 'Заказ №'.$number_order.'на модерации. Проверьте';

        $message = '
        <html>
        <head>
        <title>Заказ на модерации</title>
        </head>
        <body>
        <p>Заказ №'.$number_order.'на модерации. Проверьте</p>
        </body>
        </html>
        ';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= "Content-type: text/html; charset=utf-8 \r\n";

        mail('kbaliev55@gmail.com', $subject, $message, $headers);

        echo 1;
    }

    if($type == "aprove_order") {
        $number_order = json_decode(file_get_contents('php://input'), true)['number_order'];
        $date =  date("d.m.Y");
        $query = "UPDATE `order` SET `status_order`=1, `date`='".$date."' WHERE `number_order`=".$number_order;
        $res = mysqli_query($mysqli, $query);

        $query = "SELECT `name` FROM `users` WHERE `login`='".$value[0]['user_login']."'";
        $res = mysqli_query($mysqli, $query);
        $result =  mysqli_fetch_assoc($res);


        $spreadsheet = new Spreadsheet();
        $sheet = $spreadsheet->getActiveSheet();
        $sheet->setCellValue('A1', 'Номер заказа:');
        $sheet->setCellValue('B1', $number_order."_".$company);
        $sheet->setCellValue('A2', 'Автор:');
        $sheet->setCellValue('B2',  $result['name']);
        $sheet->setCellValue('A3', 'Дата:');
        $sheet->setCellValue('B3',  $date);
        $sheet->setCellValue('A5', 'Артикул');
        $sheet->setCellValue('B5', 'Артикул WB');
        $sheet->setCellValue('C5', 'Поставлено');
        $sheet->setCellValue('D5', 'Продано');
        $sheet->setCellValue('E5', 'ПП');
        $sheet->setCellValue('F5', 'Кол-во');
        $sheet->setCellValue('G5', 'Комментарий');
        

        $item = 6;

        for ($i = 0; $i < count($value); $i++) {
            $sheet->setCellValue('A'.$item, $value[$i]['name']);
            $sheet->setCellValue('B'.$item, $value[$i]['wb_art']);
            $sheet->setCellValue('C'.$item, $value[$i]['postavleno']);
            $sheet->setCellValue('D'.$item, $value[$i]['prodano']);
            $sheet->setCellValue('E'.$item, $value[$i]['pp']);
            $sheet->setCellValue('F'.$item, $value[$i]['order_count']);
            $sheet->setCellValue('G'.$item, $value[$i]['comment']);
            $item++;
        }

        

        $writer = new Xlsx($spreadsheet);
        $writer->save('files/'.$number_order.'.xlsx');
       
        $to = ''; 

        $subject = 'Новый заказ для "Вайлдберриз" №'.$number_order.' от автора '.$result['name'].'';

        $message = '
        <html>
        <head>
        <title>Новый заказ для "Вайлдберриз" №'.$number_order.' от автора '.$result['name'].'</title>
        </head>
        <body>
        <p><a href="https://goodsanalytics.aydikstudio.ru/api/order/files/'.$number_order.'.xlsx">Ссылка на заказ</a></p>
        </body>
        </html>
        ';

        $headers  = 'MIME-Version: 1.0' . "\r\n";
        $headers .= "Content-type: text/html; charset=utf-8 \r\n";

        mail('gold-vas@mail.ru', $subject, $message, $headers);
        mail('aydikstudio@mail.ru', $subject, $message, $headers);
        echo 1;
        
    }
    
}





?>