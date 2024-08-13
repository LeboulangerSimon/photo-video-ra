<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header('Content-Type: application/json');

$targetDir = "uploads/";

// Générer un nom de fichier unique pour chaque upload
$imageName = uniqid() . "_" . basename($_FILES["image"]["name"]);
$videoName = uniqid() . "_" . basename($_FILES["video"]["name"]);

$imageFile = $targetDir . $imageName;
$videoFile = $targetDir . $videoName;

// Déplacement des fichiers vers le dossier uploads
if (move_uploaded_file($_FILES["image"]["tmp_name"], $imageFile) && move_uploaded_file($_FILES["video"]["tmp_name"], $videoFile)) {
    echo json_encode([
        "success" => true,
        "image" => $imageName,
        "video" => $videoName
    ]);
} else {
    echo json_encode([
        "success" => false,
        "error" => "Failed to move uploaded files"
    ]);
}
?>
