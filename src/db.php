<?php
$host = 'localhost'; // Dirección del servidor de base de datos
$db = 'mkscctv_control_vacaciones'; // Nombre de la base de datos
$user = 'mkscctv'; // Usuario de la base de datos
$pass = 'A}q+I9,7$,l4'; // Contraseña de la base de datos

try {
    $conn = new PDO("mysql:host=$host;dbname=$db;charset=utf8", $user, $pass);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die("Error de conexión: " . $e->getMessage());
}
?>
