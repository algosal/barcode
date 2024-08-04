<?php
// process_sale.php

// Include the database connection file
include 'db_connection.php';

// Receive JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Extract data from JSON
$retailerEmail = $data['retailerEmail'];
$locationSold = $data['locationSold'];
$SalesRevenue = $data['SalesRevenue'];
$FederalTax = $data['FederalTax'];
$StateTax = $data['StateTax'];
$Total = $data['Total'];
$saleDetails = $data['saleDetails'];
$TransactionType = $data['transactionType'];

try {
    // Insert into SalesTransactions
    $stmt = $conn->prepare("INSERT INTO SalesTransactions (retailerEmail, locationSold, SalesRevenue, FederalTax, StateTax, Total, TransactionType) VALUES (?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssdddds", $retailerEmail, $locationSold, $SalesRevenue, $FederalTax, $StateTax, $Total, $TransactionType);

    if ($stmt->execute()) {
        $saleId = $stmt->insert_id;

        // Insert into SalesDetails
        $stmt_details = $conn->prepare("INSERT INTO SalesDetails (productId, ProductName, price, serial, SalesTransactionID) VALUES (?, ?, ?, ?, ?)");
        foreach ($saleDetails as $detail) {
            $productId = $detail['productId'];
            $productName = $detail['productName'];
            $price = $detail['price'];
            $serial = $detail['serial'];

            $stmt_details->bind_param("isdsi", $productId, $productName, $price, $serial, $saleId);
            $stmt_details->execute();

            // Update EmployeeInventory
            $stmt_update = $conn->prepare("UPDATE EmployeeInventory SET quantity = quantity - 1 WHERE employeeEmail = ? AND productId = ? AND serialNumber = ?");
            $stmt_update->bind_param("sis", $retailerEmail, $productId, $serial);
            $stmt_update->execute();
        }
        $stmt_details->close();
        
        echo json_encode(["status" => "success", "message" => "Sale recorded successfully"]);
    } else {
        throw new Exception("Failed to record sale");
    }
} catch (Exception $e) {
    echo json_encode(["status" => "error", "message" => $e->getMessage()]);
}

// Close statements and database connection
$stmt->close();
$conn->close();
?>
