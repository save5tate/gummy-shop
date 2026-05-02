<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");

require "db.php";

$method = $_SERVER["REQUEST_METHOD"];
if ($method == "GET" && isset($_GET["stores"])) {
    $result = $conn->query("SELECT * FROM stores");
    $stores = [];

    while ($row = $result->fetch_assoc()) {
        $stores[] = $row;
    }

    echo json_encode($stores);
    exit;
}
if ($method == "POST" && isset($_GET["add_store"])) {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("INSERT INTO stores (name) VALUES (?)");
    $stmt->bind_param("s", $data["name"]);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}
if ($method == "DELETE" && isset($_GET["delete_store"])) {
    $id = $_GET["delete_store"];

    $conn->query("DELETE FROM stores WHERE id=$id");

    echo json_encode(["success" => true]);
    exit;
}
