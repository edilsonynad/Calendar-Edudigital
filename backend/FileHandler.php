<?php
class FileHanlder {

    private $filePath;

    public function __construct($filePath) {
        $this->filePath = $filePath;
    }

    public function readJSONFile() {
      
        if (file_exists($this->filePath)) {
         
            $fileContent = file_get_contents($this->filePath);
            
            $jsonData = json_decode($fileContent, true);

            return $jsonData;
        } else {
            return ["error" => "File not found"];
        }
    }

    public function addDataToJSONFIle($updatedDate) {
        $data = json_decode($updatedDate, true);

        $existingSchedule = json_decode(file_get_contents($this->filePath), true);
       
        $updatedSchedule['schedule'] = array_merge($existingSchedule['schedule'], $data);

        $json_content = json_encode($updatedSchedule, JSON_PRETTY_PRINT);

        file_put_contents($this->filePath, $json_content);
       
        return ['success' => true, 'message' => 'JSON file updated successfully']; 
    }

    public function deleteJSONFileData($deleteDate){
        $data = json_decode($deleteDate, true);

        $existingSchedule = json_decode(file_get_contents($this->filePath), true);


        foreach($existingSchedule['schedule'] as $key=>$schedule){
            if($schedule['year'] == $data['year']  && $schedule['month'] == $data['month'] && $schedule['day'] == $data['day']){
                unset($existingSchedule['schedule'][$key]);
            }
        }

        $updatedSchedule['schedule'] = array_merge($existingSchedule['schedule'], []);

        $json_content = json_encode($updatedSchedule, JSON_PRETTY_PRINT);

        file_put_contents($this->filePath, $json_content);
       
        return ['success' => true, 'message' => 'Schedule deleted']; 
    }
}
?>