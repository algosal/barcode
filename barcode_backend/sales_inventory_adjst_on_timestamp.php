<?php
// process_sale.php

// Include the database connection file
include 'db_connection.php';

// Function to log inventory issues
function logInventoryIssue($conn, $retailerEmail, $productId, $serial, $issueType, $salesTransactionId) {
    $stmt_log = $conn->prepare("INSERT INTO InventoryLog (employeeEmail, productId, serialNumber, issueType, salesTransactionId) VALUES (?, ?, ?, ?, ?)");
    $stmt_log->bind_param("sisss", $retailerEmail, $productId, $serial, $issueType, $salesTransactionId);
    $stmt_log->execute();
    $stmt_log->close();
}

// Receive JSON data from POST request
$data = json_decode(file_get_contents('php://input'), true);

// Extract data from JSON
$retailerEmail = $data['retailerEmail'];
$locationSold = $data['locationSold'];
$longitude = $data['longitude'];
$latitude = $data['latitude'];
$SalesRevenue = $data['SalesRevenue'];
$FederalTax = $data['FederalTax'];
$StateTax = $data['StateTax'];
$Total = $data['Total'];
$saleDetails = $data['saleDetails'];
$TransactionType = $data['transactionType'];

try {
    // Insert into SalesTransactions
    $stmt = $conn->prepare("INSERT INTO SalesTransactions (retailerEmail, locationSold, longitude, latitude, SalesRevenue, FederalTax, StateTax, Total, TransactionType) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("ssssdddds", $retailerEmail, $locationSold, $longitude, $latitude, $SalesRevenue, $FederalTax, $StateTax, $Total, $TransactionType);

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

            // Check current inventory quantity
            $stmt_inventory = $conn->prepare("SELECT EmployeeInventoryID, quantity, timestamp FROM EmployeeInventory WHERE employeeEmail = ? AND productId = ? AND quantity > 0 ORDER BY timestamp ASC");
            $stmt_inventory->bind_param("si", $retailerEmail, $productId);
            $stmt_inventory->execute();
            $stmt_inventory->store_result();  // Store the result set to fetch rows

            $totalToDeduct = 1; // Set this to the quantity to be deducted

            if ($stmt_inventory->num_rows > 0) {
                $stmt_inventory->bind_result($inventoryId, $quantity, $timestamp);

                while ($stmt_inventory->fetch() && $totalToDeduct > 0) {
                    $quantityToDeduct = min($quantity, $totalToDeduct);
                    $stmt_update = $conn->prepare("UPDATE EmployeeInventory SET quantity = quantity - ? WHERE EmployeeInventoryID = ?");
                    $stmt_update->bind_param("ii", $quantityToDeduct, $inventoryId);
                    $stmt_update->execute();
                    $stmt_update->close();

                    $totalToDeduct -= $quantityToDeduct;

                    // Log if quantity goes below 2
                    if ($quantity - $quantityToDeduct <= 2 && $quantity - $quantityToDeduct > 0) {
                        logInventoryIssue($conn, $retailerEmail, $productId, $serial, 'is below two', $saleId);
                        $message = "Sale recorded successfully. Inventory for Product ID $productId, Serial Number $serial is below 2.";
                    } else if ($quantity - $quantityToDeduct == 0) {
                        logInventoryIssue($conn, $retailerEmail, $productId, $serial, 'is zero', $saleId);
                        $message = "Sale recorded successfully. Inventory for Product ID $productId, Serial Number $serial is now 0.";
                    } else if ($quantity - $quantityToDeduct < 0) {
                        logInventoryIssue($conn, $retailerEmail, $productId, $serial, 'is negative now, was 0 and sold, how?', $saleId);
                        $message = "Sale recorded successfully. Inventory for Product ID $productId, Serial Number $serial is below 0. This sale cannot be made. This issue will be reported!";
                    } else {
                        $message = "Sale recorded successfully.";
                    }

                    if ($totalToDeduct == 0) {
                        break; // Exit the loop once the required quantity is deducted
                    }
                }
            } else {
                logInventoryIssue($conn, $retailerEmail, $productId, $serial, 'was never issued to the retailer but sold, how?', $saleId);
                $message = "Sale recorded successfully. Inventory for Product ID $productId, Serial Number $serial not found in your issued inventory.";
            }

            $stmt_inventory->close();
        }
        $stmt_details->close();

        echo json_encode(["status" => "success", "message" => $message]);
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
