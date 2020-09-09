<?php
// require_once '../config/config.php';
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set("memory_limit","512M");
ini_set('max_execution_time', 1800);
require '../vendor/autoload.php';
require '../library/phpQuery.php';
use \PhpOffice\PhpSpreadsheet\Shared\Date;


$file = 'sale.xlsx'; // файл для получения данных
$excel = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);; // подключить Excel-файл
$excel->setActiveSheetIndex(0); // получить данные из указанного листа

$sheet = $excel->getActiveSheet();

// $query ="UPDATE `downloaded_status` SET `status`=1 WHERE `name`= 'sale'";
// $result = mysqli_query($mysqli, $query) or die("Ошибка " . mysqli_error($mysqli)); 
// if(!$result) {
//     echo "Ошибка";
// }

$arr = [];



foreach ($sheet->getRowIterator() as $row) {
    $cellIterator = $row->getCellIterator();
    $arr_index = 0;
    $ready = 0;
    
    foreach ($cellIterator as $cell) {
        $value = $cell->getValue();
        if($cell != "name" && $cell != "phone") {
            if($arr_index == 0) {
                $arr_item["id"] =  strstr($value, '/', true);
                $arr_index = 1;
            } 
            
            else if ( $arr_index == 1){
                $arr_item["postavleno"] = $value;
                $arr_index = 2;
            }

            else if ( $arr_index == 2){
                $arr_item["prodano"] = $value;
                $arr_index = 3;
            }
            else if ( $arr_index == 3){
                $arr_item["wb_art"] = $value;
                $arr_index = 4;
            }

            else if ( $arr_index == 4){
                $arr_item["category"] = $value;
                $arr_index = 5;
            }

            else if ( $arr_index == 5){
                $arr_item["returned_whosaler"] = $value;
                $arr_index = 6;
            }

            else if ( $arr_index == 6){
                $arr_item["returned_from_client"] = $value;
                $arr_index = 7;
            }

            else if ( $arr_index == 7){
                $arr_item["order"] = $value;
                $arr_index = 0;
                $ready = 1;
            }

        }
        
        if($ready == 1) {
            array_push($arr, $arr_item);
        }
        
        
       
    }

}



 
$result = group_cell($arr);


$arr1 = [];

foreach ($result as $row) {
    array_push($arr1, $row);
}

$json = json_fix_cyr(json_encode($arr1));


$filename = 'sale.json';
$f_hdl = fopen($filename, 'w');

if(fwrite($f_hdl,$json)) {
//     $query ="UPDATE `downloaded_status` SET `status`=0 WHERE `name`= 'sale'";
// $result = mysqli_query($mysqli, $query) or die("Ошибка " . mysqli_error($mysqli)); 
// if(!$result) {
//     echo "Ошибка";
// }

echo "yes";
}
fclose($f_hdl);



function group_cell($arr) {
    $aggregated = [];
    $aggregated['date'] = ['date' => date("d.m.Y")];
    
    foreach ($arr as $row) {
        $id = $row['id'];
        $postavleno = $row['postavleno'];
        $prodano = $row['prodano'];
        $wb_art = $row['wb_art'];
        $category = $row['category'];
        $returned_whosaler = $row['returned_whosaler'];
        $returned_from_client = $row['returned_from_client'];
        $order = $row['order'];
        $url = 'https://www.wildberries.ru/catalog/'.$wb_art.'/detail.aspx';
        $file = file_get_contents($url);
       
    
        if (!@array_key_exists($id, $aggregated)) {
            $wb_retail = parser_wb_retailprice($file);
            $wb_weigth = parser_wb_weigth($file);
            if(!empty($wb_retail) && !empty($wb_weigth)) {
                $wb_price_of_gramm = $wb_retail/$wb_weigth;
            } 
            
            if(empty($wb_retail)) {
                $wb_retail = "Нет в наличии";
                $wb_price_of_gramm = "Нет в наличии";
            }

            $aggregated[$id] = [
                'name' => trim($id),
               'postavleno' => trim($postavleno),
               'prodano' => trim($prodano),
               'returned_whosaler' => trim($returned_whosaler),
               'returned_from_client' => trim($returned_from_client),
               'order' => trim($order),
               'pp' => trim(round($prodano/$postavleno, 2)*100),
               'wb_art' => trim($wb_art),
               'category' => trim($category),
               'wb_retail' => trim($wb_retail),
               'wb_weigth' => trim($wb_weigth),
               "wb_price_of_gramm" => trim(ceil($wb_price_of_gramm)),
               'wb_vstavka' => trim(parser_wb_vstavka($file)),
               "wb_metall" => trim(parser_wb_metall($file)),
               "wb_sizes" =>parser_wb_no_sizes($file),
               "wb_all_sizes" =>parser_wb_all_sizes($file),
               "desc" => parser_wb_desc($file),
               "wb_reiting" => parser_wb_reiting($file)
            ];
    
            continue;
        }

        $aggregated[$id]['order'] += $order;
        $aggregated[$id]['returned_whosaler'] += $returned_whosaler;
        $aggregated[$id]['returned_from_client'] += $returned_from_client;
        $aggregated[$id]['postavleno'] += $postavleno;
        $aggregated[$id]['prodano'] += $prodano;
        $aggregated[$id]['pp'] = trim(round($aggregated[$id]['prodano']/$aggregated[$id]['postavleno'], 2)*100);
    }

    
    return $aggregated;


}

function json_fix_cyr($json_str) {
    $cyr_chars = array (
        '\u0430' => 'а', '\u0410' => 'А',
        '\u0431' => 'б', '\u0411' => 'Б',
        '\u0432' => 'в', '\u0412' => 'В',
        '\u0433' => 'г', '\u0413' => 'Г',
        '\u0434' => 'д', '\u0414' => 'Д',
        '\u0435' => 'е', '\u0415' => 'Е',
        '\u0451' => 'ё', '\u0401' => 'Ё',
        '\u0436' => 'ж', '\u0416' => 'Ж',
        '\u0437' => 'з', '\u0417' => 'З',
        '\u0438' => 'и', '\u0418' => 'И',
        '\u0439' => 'й', '\u0419' => 'Й',
        '\u043a' => 'к', '\u041a' => 'К',
        '\u043b' => 'л', '\u041b' => 'Л',
        '\u043c' => 'м', '\u041c' => 'М',
        '\u043d' => 'н', '\u041d' => 'Н',
        '\u043e' => 'о', '\u041e' => 'О',
        '\u043f' => 'п', '\u041f' => 'П',
        '\u0440' => 'р', '\u0420' => 'Р',
        '\u0441' => 'с', '\u0421' => 'С',
        '\u0442' => 'т', '\u0422' => 'Т',
        '\u0443' => 'у', '\u0423' => 'У',
        '\u0444' => 'ф', '\u0424' => 'Ф',
        '\u0445' => 'х', '\u0425' => 'Х',
        '\u0446' => 'ц', '\u0426' => 'Ц',
        '\u0447' => 'ч', '\u0427' => 'Ч',
        '\u0448' => 'ш', '\u0428' => 'Ш',
        '\u0449' => 'щ', '\u0429' => 'Щ',
        '\u044a' => 'ъ', '\u042a' => 'Ъ',
        '\u044b' => 'ы', '\u042b' => 'Ы',
        '\u044c' => 'ь', '\u042c' => 'Ь',
        '\u044d' => 'э', '\u042d' => 'Э',
        '\u044e' => 'ю', '\u042e' => 'Ю',
        '\u044f' => 'я', '\u042f' => 'Я',
 
        '\r' => '',
        '\n' => '<br />',
        '\t' => '',
        '\/' => '/',
        '₽'=> ''
    );
 
    foreach ($cyr_chars as $cyr_char_key => $cyr_char) {
        $json_str = str_replace($cyr_char_key, $cyr_char, $json_str);
    }
    return $json_str;
}


function parser_wb_retailprice($file) {
$doc = phpQuery::newDocument($file);
$price_wb = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.final-cost')->text()));
return $price_wb;
}

function parser_wb_weigth($file) {
    $doc = phpQuery::newDocument($file);
    $weigth = trim(str_replace("г", " ", json_fix_cyr($doc->find('.params .pp:contains("Минимальный вес") span:eq(3)')->text())));
    
    return $weigth;
}

function parser_wb_vstavka($file) {
    $doc = phpQuery::newDocument($file);
    $vstavka = json_fix_cyr($doc->find('.params .pp:contains("Вставка") span:eq(3)')->text());
    if(empty($vstavka)) {
        $vstavka = 'Нет вставки';
    }
    return $vstavka;
}


function parser_wb_metall($file) {
    $doc = phpQuery::newDocument($file);
    $metall = json_fix_cyr($doc->find('.params .pp:contains("Состав ювелирного изделия") span:eq(3)')->text());
    if(empty($metall)) {
        $metall = 'Не указан металл';
    }

    if(strpos($metall, 'золото')) {
        $metall = 'золото';
    }
    return $metall;
}



function parser_wb_no_sizes($file) {
    $doc = phpQuery::newDocument($file);
    $sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-sold-out span')->text()))); 
    $sizes = array_diff($sizes, array(''));
    if(count($sizes) == 0) {
        $sizes = "Все в наличии";
    } else if($sizes[0] == 0) {
        $sizes = "У данного изделия нет размеров";
    }
    return $sizes;
}

function parser_wb_reiting($file) {
    $doc = phpQuery::newDocument($file);
    $reiting_wb = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.stars-line-lg')->text()));
    if(count($reiting_wb) == 0) {
        $reiting_wb = "Нет рейтинга";
    }
    return $reiting_wb;
}


function parser_wb_all_sizes($file) {
    $doc = phpQuery::newDocument($file);
    $sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-size span')->text()))); 
    $sizes = array_diff($sizes, array(''));
     if($sizes[0] == 0) {
        $sizes = "У данного изделия нет размеров";
    }
    return $sizes;
}

function parser_wb_desc($file) {
    $doc = phpQuery::newDocument($file);
    $desc =  json_fix_cyr($doc->find('.description-text p')->text());
    if(count($desc) == 0) {
        $desc = "Нет описания";
    } 
    return $desc;
}


?>