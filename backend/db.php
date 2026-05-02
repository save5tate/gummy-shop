<?php
$conn = new mysqli("localhost", "root", "", "shopping_app");
if ($conn->connect_error) {
    die("Connection failed");
}
?>