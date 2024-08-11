<?php
include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] == 'POST') {
    $username = htmlspecialchars(strip_tags($_POST['username']));
    $email = htmlspecialchars(strip_tags($_POST['email']));
    $password = password_hash($_POST['password'], PASSWORD_BCRYPT);

    $query = "INSERT INTO users (username, email, password) VALUES (:username, :email, :password)";
    $stmt = $db->prepare($query);

    $stmt->bindParam(':username', $username);
    $stmt->bindParam(':email', $email);
    $stmt->bindParam(':password', $password);

    if ($stmt->execute()) {
        echo "Utilisateur enregistré avec succès.";
    } else {
        echo "Échec de l'inscription.";
    }
}
