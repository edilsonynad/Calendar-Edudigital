<?php
//Include class to handle the file operation
include 'FileHandler.php';

//Get the json file
$dataFilePath = 'data.json';

// Instanciate the file handler class
$fileHandler = new FileHanlder($dataFilePath);

//Chech witch HTTP method was send from client
if ($_SERVER['REQUEST_METHOD'] === 'GET') {
   
    $scheduledDate = $fileHandler->readJSONFile();

    header('Content-Type: application/json');
    echo json_encode($scheduledDate);

} else if ($_SERVER["REQUEST_METHOD"] == "POST") {

    $updatedScheduledDates = file_get_contents('php://input');
    $result = $fileHandler->addDataToJSONFIle($updatedScheduledDates);

    header('Content-Type: application/json');
    echo json_encode($result);

}else if ($_SERVER["REQUEST_METHOD"] == "DELETE") {

    $deletedScheduledDates = file_get_contents('php://input');
    $result = $fileHandler->deleteJSONFileData($deletedScheduledDates);

    header('Content-Type: application/json');
    echo json_encode($result);
}

?>