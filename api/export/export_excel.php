<?php 
require '../vendor/autoload.php';
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;

            $time = time() + (7 * 24 * 60 * 60);
            $microtime = microtime();
            $name_file = 'export_'.$time.'.xlsx';
            $good = [];
            $data_header = [];
            array_push($good, json_decode(file_get_contents('php://input'), true)['data']);
            array_push($data_header, json_decode(file_get_contents('php://input'), true)['data_header']);
    
            $value = json_decode($good[0], true);
            $data_header_value = json_decode($data_header[0], true);
    
            $spreadsheet = new Spreadsheet();
            $sheet = $spreadsheet->getActiveSheet();
            $alphabet = array(
                'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R',
                'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'
            );
    
    
    
             for ($i = 0; $i < count($data_header_value); $i++) {
                    $sheet->setCellValue($alphabet[$i]."1",  $data_header_value[$i]['name']);
                }
    
            $item = 2;
            $data_header_value_count = count($data_header_value);
            for ($i = 0; $i < count($value); $i++) {
                    for ($a = 0; $a < count($data_header_value); $a++) {
                        $new_value = $value[$i][$data_header_value[$a]['type']];
                        if(is_array($new_value)) {
                            $new_value = implode(",", $new_value);
                        }
                        $sheet->setCellValue($alphabet[$a].$item,  $new_value);
                    }
                $item++;
            }
            
            
            $writer = new Xlsx($spreadsheet);
            $writer->save("files/".$name_file);
            echo $name_file;

        
?>