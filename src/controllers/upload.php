<?php
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST' && isset($_FILES['photo']) && isset($_FILES['video'])) {
    $userId = 1; // Utilisez l'ID utilisateur en session
    $photo = $_FILES['photo']['name'];
    $video = $_FILES['video']['name'];

    move_uploaded_file($_FILES['photo']['tmp_name'], "../public/uploads/" . $photo);
    move_uploaded_file($_FILES['video']['tmp_name'], "../public/uploads/" . $video);

    $query = "INSERT INTO media (user_id, photo, video) VALUES (:user_id, :photo, :video)";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':user_id', $userId);
    $stmt->bindParam(':photo', $photo);
    $stmt->bindParam(':video', $video);

    if ($stmt->execute()) {
        echo "Fichiers uploadés avec succès.";
    } else {
        echo "Échec de l'upload.";
    }
}
