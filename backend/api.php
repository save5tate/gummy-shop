<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: Content-Type");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");

require "db.php";

$method = $_SERVER["REQUEST_METHOD"];

// Handle OPTIONS requests
if ($method == "OPTIONS") {
    exit;
}

/* =========================
   STORES
========================= */

// GET all stores
if ($method == "GET" && isset($_GET["stores"])) {
    $result = $conn->query("SELECT * FROM stores");
    $stores = [];

    while ($row = $result->fetch_assoc()) {
        $stores[] = $row;
    }

    echo json_encode($stores);
    exit;
}

// ADD store
if ($method == "POST" && isset($_GET["add_store"])) {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("INSERT INTO stores (name) VALUES (?)");
    $stmt->bind_param("s", $data["name"]);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}

// DELETE store
if ($method == "DELETE" && isset($_GET["delete_store"])) {
    $id = intval($_GET["delete_store"]);

    $conn->query("DELETE FROM stores WHERE id=$id");

    echo json_encode(["success" => true]);
    exit;
}

if ($method == "GET" && isset($_GET["store_items"])) {
    $store_id = intval($_GET["store_items"]);

    $result = $conn->query("SELECT * FROM items WHERE store_id=$store_id");
    $items = [];

    while ($row = $result->fetch_assoc()) {
        $items[] = $row;
    }

    echo json_encode($items);
    exit;
}
if ($method == "POST" && isset($_GET["add_item"])) {
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("INSERT INTO items (store_id, name, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("isi", $data["store_id"], $data["name"], $data["quantity"]);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}
if ($method == "DELETE" && isset($_GET["delete_item"])) {
    $id = intval($_GET["delete_item"]);

    $conn->query("DELETE FROM items WHERE id=$id");

    echo json_encode(["success" => true]);
    exit;
}
if ($method == "PUT" && isset($_GET["update_item"])) {
    $id = intval($_GET["update_item"]);
    $data = json_decode(file_get_contents("php://input"), true);

    $stmt = $conn->prepare("UPDATE items SET name=?, quantity=?, checked=? WHERE id=?");
    $stmt->bind_param("siii", $data["name"], $data["quantity"], $data["checked"], $id);
    $stmt->execute();

    echo json_encode(["success" => true]);
    exit;
}
?>