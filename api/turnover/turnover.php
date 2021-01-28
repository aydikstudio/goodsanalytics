<?php
// require_once '../config/config.php';
error_reporting(E_ALL);
ini_set('display_errors', 'On');
ini_set("memory_limit","512M");
ini_set('max_execution_time', 1800);
require '../vendor/autoload.php';
require '../library/phpQuery.php';
require '../config/settings.php';
use \PhpOffice\PhpSpreadsheet\Shared\Date;


$file = 'turnover.xlsx'; // файл для получения данных
$excel = \PhpOffice\PhpSpreadsheet\IOFactory::load($file);; // подключить Excel-файл
$excel->setActiveSheetIndex(0); // получить данные из указанного листа

$sheet = $excel->getActiveSheet();

$arr = [];




foreach ($sheet->getRowIterator() as $row) {
    $cellIterator = $row->getCellIterator();
    $arr_index = 0;
    $ready = 0;
    
    foreach ($cellIterator as $cell) {
        $value = $cell->getValue();
        if($cell != "name" && $cell != "phone") {
            if($arr_index == 0) {
                $arr_item["wb_art"] =  $value;
                $arr_index = 1;
            } 
            
            else if ( $arr_index == 1){
                $arr_item["status"] = $value;
                $arr_index = 2;
            }

            else if ( $arr_index == 2){
                $arr_item["days"] = $value;
                $arr_index = 3;
                $arr_index = 0;
                $ready = 1;
            }

        }
        
        if($ready == 1) {
            array_push($arr, $arr_item);
        }
        
        
       
    }

}



 
$result = $arr;


$arr1 = [];

foreach ($result as $row) {
    array_push($arr1, $row);
}

$json = json_fix_cyr(json_encode($arr1));


$filename = '';

if(!empty($company)) {
    $filename = 'turnover_'.$company.'.json';
} else {
    $filename = 'turnover.json';
}

$f_hdl = fopen($filename, 'w');

if(fwrite($f_hdl,$json)) {
echo "yes";
}
fclose($f_hdl);





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



?>