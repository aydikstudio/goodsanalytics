<?php
// require '../config/config.php';
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set("memory_limit","512M");
ini_set('max_execution_time', 1800);
require '../vendor/autoload.php';
require '../library/phpQuery.php';
require '../config/settings.php';

use \PhpOffice\PhpSpreadsheet\Shared\Date;
use JonnyW\PhantomJs\Client;

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




if(@$_GET['company']) {
    $GLOBALS['company'] = $_GET['company'];
}

if(@$_POST['company']) {
    $GLOBALS['company'] = $_POST['company'];
}


if(@$_GET['client']) {
    $GLOBALS['client'] = $_GET['client'];
}

if(@$_POST['client']) {
    $GLOBALS['client'] = $_POST['client'];
}


$GLOBALS['company']=$company;
$GLOBALS['client']=$client;




if($client=="wb") {

foreach ($sheet->getRowIterator() as $row) {
    $cellIterator = $row->getCellIterator();
    $arr_index = 0;
    $ready = 0;
    
    foreach ($cellIterator as $cell) {
        $value = $cell->getValue();
        if($cell != "name" && $cell != "phone") {
            if($arr_index == 0) {
                $arr_item["id"] =  strstr($value, $symbol, true);
                $arr_index = 1;
            } 
            
            else if ( $arr_index == 1){
                $arr_item["wb_art"] = $value;
                $arr_index = 2;
            }

            else if ( $arr_index == 2){
                $arr_item["category"] = $value;
                $arr_index = 3;
                
            }

            else if ( $arr_index == 3){
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



 
$result = group_cell_wb($arr);


$arr1 = [];

foreach ($result as $row) {
    array_push($arr1, $row);
}

$json = json_fix_cyr(json_encode($arr1));

$filename = 'sale.json';

if(!empty($company)) {
    echo "OK";
    $filename = 'sale_'.$client.'_'.$company.'.json';
} else {
    echo "NO";
    $filename = 'sale.json';
}

$f_hdl = fopen($filename, 'w');

if(fwrite($f_hdl,$json)) {
echo "yes";
}

fclose($f_hdl);




}
else if ($client== 'ozon') {
    foreach ($sheet->getRowIterator() as $row) {
        $cellIterator = $row->getCellIterator();
        $arr_index = 0;
        $ready = 0;
        
        foreach ($cellIterator as $cell) {
            $value = $cell->getValue();
            if($cell != "name" && $cell != "phone") {
                if($arr_index == 0) {
                    $arr_item["id"] =  $value;
                    $arr_index = 1;
                } 
                
                else if ( $arr_index == 1){
                    $arr_item["wb_art"] = $value;
                    $arr_index = 2;
                }
    
                else if ( $arr_index == 2){
                    $arr_item["category"] = $value;
                    $arr_index = 3;
                    
                }

                else if ( $arr_index == 3){
                    $arr_item["count"] = $value;
                    $arr_index = 4;                   
                }
    
                else if ( $arr_index == 4){
                    $arr_item["wb_retail"] = $value;
                    $arr_index = 0;
                    $ready = 1;                  
                }
            }
            
            if($ready == 1) {
                array_push($arr, $arr_item);
            }
            
            
           
        }
    
    }
    
    
    
     
    $result = group_cell_ozon($arr);
    
    
    $arr1 = [];
    
    foreach ($result as $row) {
        array_push($arr1, $row);
    }
    
    $json = json_fix_cyr(json_encode($arr1));
    
    $filename = 'sale.json';
    
    if(!empty($company)) {
        $filename = 'sale_'.$client.'_'.$company.'.json';
    } else {
        $filename = 'sale.json';
    }
    
    $f_hdl = fopen($filename, 'w');
    
    if(fwrite($f_hdl,$json)) {
    echo "yes";
    }
    fclose($f_hdl);
    
    
}


function group_cell_wb($arr) {
    $aggregated = [];
    $aggregated['date'] = ['date' => date("d.m.Y")];

    foreach ($arr as $row) {
        $id = $row['id'];
        $wb_art = $row['wb_art'];
        $category = $row['category'];
        $order = $row['order'];
       $pp = 0;
       $postavleno = count_summ('shipment', $id);
       $prodano = count_summ('sale', $id);
       $returned = count_summ('returned', $id);
       $ostatok = $postavleno-$prodano-$returned;
      
       
    
        if (!@array_key_exists($id, $aggregated)) {
         
            $wb_vstavka = '';
       $wb_metall = '';
       $wb_no_sizes = '';
       $wb_all_sizes = '';
       $desc = '';
       $wb_reiting = '';
       $wb_retail = '';
       $weigth = '';
       
            $url = 'https://www.wildberries.ru/catalog/'.$wb_art.'/detail.aspx';
            $file = file_get_contents($url);
       $doc = phpQuery::newDocument($file);
    
    $wb_retail = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.final-cost')->text()));
    
    $weigth = trim(str_replace("г", " ", json_fix_cyr($doc->find('.params .pp:contains("Минимальный вес") span:eq(3)')->text())));
    
    $wb_vstavka = json_fix_cyr($doc->find('.params .pp:contains("Вставка") span:eq(3)')->text());
        if(empty($wb_vstavka)) {
            $wb_vstavka = 'Нет вставки';
        }
    
        $wb_metall = json_fix_cyr($doc->find('.params .pp:contains("Состав ювелирного изделия") span:eq(3)')->text());
        if(empty($wb_metall)) {
            $wb_metall = 'Не указан металл';
        }
    
        if(strpos($wb_metall, 'золото')) {
            $wb_metall = 'золото';
        }
    
        $wb_no_sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-sold-out span')->text()))); 
        $wb_no_sizes = array_diff($wb_no_sizes, array(''));
        if(count($wb_no_sizes) == 0) {
            $wb_no_sizes = "Все в наличии";
        } else if($wb_no_sizes[0] == 0) {
            $wb_no_sizes = "У данного изделия нет размеров";
        } else {
            $wb_no_sizes = $wb_no_sizes;
        }
    
        $wb_reiting = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.stars-line-lg')->text()));
        if(count($wb_reiting) == 0) {
            $wb_reiting = "Нет рейтинга";
        }
    
        $desc =  json_fix_cyr($doc->find('.description-text p')->text());
        if(count($desc) == 0) {
            $desc = "Нет описания";
        } 

        $wb_all_sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-size span')->text()))); 
        $wb_all_sizes = array_diff($wb_all_sizes, array(''));
     if($wb_all_sizes[0] == 0) {
        $wb_all_sizes = "У данного изделия нет размеров";
    }

    
            if(!empty($wb_retail) && !empty($weigth)) {
                $wb_price_of_gramm = $wb_retail/$weigth;
            } 
            
            if(empty($wb_retail)) {
                $wb_retail = "Нет в наличии";
                $wb_price_of_gramm = "Нет в наличии";
            }

            
            

            if($postavleno > 0) {
                $pp = trim(round($prodano/$postavleno, 2)*100);
            }

            $aggregated[$id] = [
                'name' => trim($id),
               'postavleno' => @trim($postavleno),
               'prodano' => @trim($prodano),
               'order' => trim($order),
               'pp' => $pp,
               'wb_art' => trim($wb_art),
               'category' => trim($category),
               'wb_retail' => trim($wb_retail),
               'wb_weigth' => trim($weigth),
               "wb_price_of_gramm" => trim(ceil($wb_price_of_gramm)),
               'wb_vstavka' => trim($wb_vstavka),
               "wb_metall" => trim($wb_metall),
               "wb_no_sizes" => $wb_no_sizes,
               "wb_all_sizes" => $wb_all_sizes,
               "desc" => trim($desc),
               "ostatok" => trim($ostatok),
               "wb_reiting" => trim($wb_reiting)
            ];
    
            continue;
        }
        $aggregated[$id]['pp'] = 0;

        if($aggregated[$id]['postavleno'] > 0 )
 {
    $aggregated[$id]['pp'] = trim(round($aggregated[$id]['prodano']/$aggregated[$id]['postavleno'], 2)*100);
 }        
    }

    
    return $aggregated;


}


function group_cell_ozon($arr) {




    $aggregated = [];
    $aggregated['date'] = ['date' => date("d.m.Y")];
    $wb_all_sizes = [];
    $wb_no_sizes = [];
    foreach ($arr as $row) {
        $id = $row['id'];
        $items = [];
        $item_id = explode("/", $id);
        $wb_art = $row['wb_art'];
        $category = $row['category'];
        $wb_retail = $row['wb_retail'];
        $count = $row['count'];
       $pp = 0;
       $postavleno = count_summ('shipment', $item_id[0]);
       $prodano = count_summ('sale', $item_id[0]);
       $returned = count_summ('returned', $item_id[0]);
       $ostatok = $postavleno-$prodano-$returned;
       
       if($count > 0) {
        $wb_all_sizes[$item_id[0]][]= $item_id[1];
    } else {
        $wb_no_sizes[$item_id[0]][]= $item_id[1];
    }


       
    
        if (!@array_key_exists($item_id[0], $aggregated)) {
            $url = 'https://www.ozon.ru/context/detail/id/'.$wb_art.'/';
            $file = file_get_contents($url);
            $doc = phpQuery::newDocument($file);
            if($postavleno > 0) {
                $pp = trim(round($prodano/$postavleno, 2)*100);
            }

            $url_1 = $doc->find('.ao5')->attr('src');

            $aggregated[$item_id[0]] = [
                'name' => trim($item_id[0]),
               'postavleno' => @trim($postavleno),
               'prodano' => @trim($prodano),
               'pp' => $pp,
               'wb_art' => trim($wb_art),
               'category' => trim($category),
               'wb_retail' => trim($wb_retail),
               "ostatok" => trim($ostatok),
               "url" => $url_1
            ];
    
            continue;
        }


        if(@count($wb_no_sizes[$item_id[0]]) > 0) {
            $aggregated[$item_id[0]]["wb_no_sizes"] = $wb_no_sizes[$item_id[0]];
        } else {
            $aggregated[$item_id[0]]["wb_no_sizes"] = [];
        }

        if(@count($wb_all_sizes[$item_id[0]]) > 0) {
            $aggregated[$item_id[0]]["wb_all_sizes"] = $wb_all_sizes[$item_id[0]];
        } else {
            $aggregated[$item_id[0]]["wb_all_sizes"] = [];
        }
     
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


function count_summ($table, $art) {
        $mysqli = new mysqli('localhost', 'aydik', '12345678', 'goodsanalytics');
        $query = "SELECT  SUM(count) FROM $table WHERE `name`='".$art."' and `company`='".$GLOBALS['company']."' and `client` = '".$GLOBALS['client']."'";
        $res = mysqli_query($mysqli, $query);
        $result =  mysqli_fetch_assoc($res);
        $count = 0;
        if((int)$result['SUM(count)'] !== null || (int)$result['SUM(count)'] != 0) {
            $count = (int)$result['SUM(count)'];
        } else {
            $count = 0;
        }

        return  $count;
        
}
// function parser_wb($file) {

//     $doc = phpQuery::newDocument($file);
    
//     $wb_retail = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.final-cost')->text()));
    
//     $weigth = trim(str_replace("г", " ", json_fix_cyr($doc->find('.params .pp:contains("Минимальный вес") span:eq(3)')->text())));
    
//     $wb_vstavka = json_fix_cyr($doc->find('.params .pp:contains("Вставка") span:eq(3)')->text());
//         if(empty($wb_vstavka)) {
//             $wb_vstavka = 'Нет вставки';
//         }
    
//         $wb_metall = json_fix_cyr($doc->find('.params .pp:contains("Состав ювелирного изделия") span:eq(3)')->text());
//         if(empty($wb_metall)) {
//             $wb_metall = 'Не указан металл';
//         }
    
//         if(strpos($wb_metall, 'золото')) {
//             $wb_metall = 'золото';
//         }
    
//         $wb_no_sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-sold-out span')->text()))); 
//         $wb_no_sizes = array_diff($wb_no_sizes, array(''));
//         if(count($wb_no_sizes) == 0) {
//             $wb_no_sizes = "Все в наличии";
//         } else if($wb_no_sizes[0] == 0) {
//             $wb_no_sizes = "У данного изделия нет размеров";
//         }
    
//         $wb_reiting = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.stars-line-lg')->text()));
//         if(count($wb_reiting) == 0) {
//             $wb_reiting = "Нет рейтинга";
//         }
    
//         $desc =  json_fix_cyr($doc->find('.description-text p')->text());
//         if(count($desc) == 0) {
//             $desc = "Нет описания";
//         } 
        
//     }

// function parser_wb_retailprice($file) {
// $doc = phpQuery::newDocument($file);
// $price_wb = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.final-cost')->text()));
// return $price_wb;
// }

// function parser_wb_weigth($file) {
//     $doc = phpQuery::newDocument($file);
//     $weigth = trim(str_replace("г", " ", json_fix_cyr($doc->find('.params .pp:contains("Минимальный вес") span:eq(3)')->text())));
    
//     return $weigth;
// }

// function parser_wb_vstavka($file) {
//     $doc = phpQuery::newDocument($file);
//     $vstavka = json_fix_cyr($doc->find('.params .pp:contains("Вставка") span:eq(3)')->text());
//     if(empty($vstavka)) {
//         $vstavka = 'Нет вставки';
//     }
//     return $vstavka;
// }


// function parser_wb_metall($file) {
//     $doc = phpQuery::newDocument($file);
//     $metall = json_fix_cyr($doc->find('.params .pp:contains("Состав ювелирного изделия") span:eq(3)')->text());
//     if(empty($metall)) {
//         $metall = 'Не указан металл';
//     }

//     if(strpos($metall, 'золото')) {
//         $metall = 'золото';
//     }
//     return $metall;
// }



// function parser_wb_no_sizes($file) {
//     $doc = phpQuery::newDocument($file);
//     $sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-sold-out span')->text()))); 
//     $sizes = array_diff($sizes, array(''));
//     if(count($sizes) == 0) {
//         $sizes = "Все в наличии";
//     } else if($sizes[0] == 0) {
//         $sizes = "У данного изделия нет размеров";
//     }
//     return $sizes;
// }

// function parser_wb_reiting($file) {
//     $doc = phpQuery::newDocument($file);
//     $reiting_wb = preg_replace("/[^x\d|*\.]/", "",json_fix_cyr($doc->find('.stars-line-lg')->text()));
//     if(count($reiting_wb) == 0) {
//         $reiting_wb = "Нет рейтинга";
//     }
//     return $reiting_wb;
// }


// function parser_wb_all_sizes($file) {
//     $doc = phpQuery::newDocument($file);
//     $sizes =  explode(", ", preg_replace("/[^x\d|*\.]/", ",",json_fix_cyr($doc->find('.j-size span')->text()))); 
//     $sizes = array_diff($sizes, array(''));
//      if($sizes[0] == 0) {
//         $sizes = "У данного изделия нет размеров";
//     }
//     return $sizes;
// }

// function parser_wb_desc($file) {
//     $doc = phpQuery::newDocument($file);
//     $desc =  json_fix_cyr($doc->find('.description-text p')->text());
//     if(count($desc) == 0) {
//         $desc = "Нет описания";
//     } 
//     return $desc;
// }




?>