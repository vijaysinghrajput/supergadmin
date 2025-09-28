<?php

error_reporting(0);
defined("BASEPATH") or exit("No direct script access allowed");
header("Access-Control-Allow-Origin: *");

class Billing extends CI_Controller
{
    public function __construct()
    {
        header("Access-Control-Allow-Origin: *");
        parent::__construct();
        
                $this->config->load('config'); 

    }

    public function index()
    {
        echo "HELLO START BILLING STARTWARE";
    }
    
    // NOTIFICATION
    
    public function NotificationPrompt($title, $body, $image, $order_number, $token) {
        
        
        $payload = [
    "to" => $token,
    "priority" => "high",
    "notification" => [
        "title" => $title,
        "body" => $body,
        "icon" => "https://superg.in/img/logo.svg",
        "sound" => "notification.mp3",
        "image" => $image,
        "visibility" => 1,
        "channel_id" => "superg",
        "default_vibrate_timings" => true,
        "default_light_settings" => true,
        "vibrate_timings" => ["3000"],
    ],
    "data" => [
        "url" => "https://android.superg.in/order/$order_number",
        "Nick" => "Mario",
        "Room" => "PortugalVSDenmark",
        "badge" => 1,
        "sound" => "1",
        "alert" => "Alert",
    ],
];
                            
                                                         $curl = curl_init();
                            
                            curl_setopt_array($curl, array(
                              CURLOPT_URL => "https://fcm.googleapis.com/fcm/send",
                              CURLOPT_RETURNTRANSFER => true,
                              CURLOPT_ENCODING => "",
                              CURLOPT_MAXREDIRS => 10,
                              CURLOPT_TIMEOUT => 30,
                              CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
                              CURLOPT_CUSTOMREQUEST => "POST",
                              CURLOPT_POSTFIELDS => json_encode($payload),
                              CURLOPT_HTTPHEADER => array(
                                "Accept: application/json",
                                "Accept-Encoding: gzip, deflate",
                                "Content-Type: application/json",
                                "cache-control: no-cache",
                                "Authorization: key=AAAA0R6CVXo:APA91bGvvNSK0WLhfZcSXsqPY-ktiI__pN5GunmHgv-8BAu7VtjHshHVC1WWP2jGTuj4mXo96wOpdzXmSyzaejLSdepe9EtZakZZJqCGeBvFw92GkyHAaLOpxArDmy8YJsCR-3a3QkER"
                              ),
                            ));
                            
                            $response = curl_exec($curl);
                            $err = curl_error($curl);
                            
                            curl_close($curl);
                            
    }

    // START BILLLING SOFTWARE CODE FROM HERE
    
    
       public function storeCategoryDataApi(){
    
    $storeCategoryData = $this->BillingModal->getTableResults(
            "stores_category",
            "store_id",
            $obj["store_id"]
        );
        
         foreach ($storeCategoryData as $row => $value) {
            $getData = $this->BillingModal->getTableResults(
                "stores_category",
                "master_category_id",
                $value->master_category_level
            );
            $arr1 = json_decode(json_encode($getData), true);
            $category_name = $arr1[0]["category_name"];
            $storeCategoryData[$row]->parent_name = $category_name;
        }
        
        
 $storeCategoryData1 = $storeCategoryData;
        if ($storeCategoryData1 == null) {
            $storeCategoryData1 = [];
        }
        
        $data["stores_category"] = $storeCategoryData1;

        echo json_encode($data);
    }
    
    
      public function storeBrandDataApi(){
    
    $storeCategoryData = $this->BillingModal->getTableResults(
            "stores_brands",
            "store_id",
            $obj["store_id"]
        );
        
  
        
        $data["stores_brand"] = $storeCategoryData;

        echo json_encode($data);
    }
    
    
    

    
        public function masterCategoryDataApi(){
    
    $storeCategoryData = $this->BillingModal->getTableResults(
            "master_category",
            "store_id",
            $obj["store_id"]
        );
        
         foreach ($storeCategoryData as $row => $value) {
            $getData = $this->BillingModal->getTableResults(
                "stores_category",
                "master_category_id",
                $value->master_category_level
            );
            $arr1 = json_decode(json_encode($getData), true);
            $category_name = $arr1[0]["category_name"];
            $storeCategoryData[$row]->parent_name = $category_name;
        }
        
        
 $storeCategoryData1 = $storeCategoryData;
        if ($storeCategoryData1 == null) {
            $storeCategoryData1 = [];
        }
        
        $data["master_category"] = $storeCategoryData1;

        echo json_encode($data);
    }
    
    
    
    

    public function reloadStoreProducts()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $storeBrandsData = $this->BillingModal->getTableResults(
            "stores_brands",
            "store_id",
            $obj["store_id"]
        );

        $storeCategoryData = $this->BillingModal->getTableResults(
            "stores_category",
            "store_id",
            $obj["store_id"]
        );

        foreach ($storeCategoryData as $row => $value) {
            $getData = $this->BillingModal->getTableResults(
                "stores_category",
                "master_category_id",
                $value->master_category_level
            );
            $arr1 = json_decode(json_encode($getData), true);
            $category_name = $arr1[0]["category_name"];
            $storeCategoryData[$row]->parent_name = $category_name;
        }

        $storeCategoryData1 = $storeCategoryData;
        if ($storeCategoryData1 == null) {
            $storeCategoryData1 = [];
        }

        $storeProductsData = $this->BillingModal->getTableResults(
            "stores_products",
            "store_id",
            $obj["store_id"]
        );

        foreach ($storeProductsData as $row => $value) {
            $getCategoryData = $this->BillingModal->getTableResults(
                "master_category",
                "id",
                $value->parent_category_id
            );
            $Categoryarr1 = json_decode(json_encode($getCategoryData), true);
            $parent_category_name = $Categoryarr1[0]["category_name"];

            $storeProductsData[
                $row
            ]->parent_category_name = $parent_category_name;

            $getChildCategoryData = $this->BillingModal->getTableResults(
                "master_category",
                "id",
                $value->category_id
            );
            $ChildCategoryarr1 = json_decode(
                json_encode($getChildCategoryData),
                true
            );
            $child_category_name = $ChildCategoryarr1[0]["category_name"];

            $storeProductsData[
                $row
            ]->child_category_name = $child_category_name;

            $getBrandData = $this->BillingModal->getTableResults(
                "master_brands",
                "id",
                $value->brand_id
            );
            $Brandarr1 = json_decode(json_encode($getBrandData), true);
            $brand_name = $Brandarr1[0]["brand_name"];

            $storeProductsData[$row]->brand_name = $brand_name;

            $storeProductsData[$row]->product_full_name =
                $value->product_name .
                " " .
                $value->product_size .
                " " .
                $value->product_unit;
        }

        $storeProductsData1 = $storeProductsData;
        if ($storeProductsData1 == null) {
            $storeProductsData1 = [];
        }

        $data["storeBrandsData"] = $storeBrandsData;
        $data["storeCategoryData"] = $storeCategoryData1;
        $data["storeProductsData"] = $storeProductsData1;

        echo json_encode($data);
    }
    

     public function search() {
         
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        
        $STORE_CODE = $obj['store_id'];
        $limit = $obj["limit"];
        // $offset = $obj["offset"];
        // $totalItems = $obj["totalItems"];
        $prompt = $obj['prompt'];
        
        $response = $this->BillingModal->search($prompt, $limit, $STORE_CODE);
        echo json_encode($response);
    }

    public function fetchData()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        // $dataEmp =  $this->AppModel->fetchMembers($obj['bussiness_id']);
        // $fetchSalaryHistory =  $this->AppModel->fetchSalaryHistory($obj['bussiness_id']);
        // $dataPartner =  $this->AppModel->fetchPartner($obj['bussiness_id']);
        // $sallaryData =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "employee_sallary_details");
        // $getRolesByBussID =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "employee_roles");
        // $getLeadsPricing =  $this->AppModel->fetchData("", "1", "leads_pacage_list");
        // $getLeads =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "leads");
        // $getLeadsOrder =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "lead_order");
        // $getPlots =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "partner_projects");
        // $business_banners =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "business_banners");
        // $reviews =  $this->AppModel->fetchData("bussiness_id", $obj['bussiness_id'], "business_customer_review");

        // $data['employes'] = $dataEmp;
        // $data['partner'] = $dataPartner;
        // $data['sallaryData'] = $sallaryData;
        // $data['salaryHistory'] = $fetchSalaryHistory;
        // $data['roles'] = $getRolesByBussID;
        // $data['leadsPricing'] = $getLeadsPricing;
        // $data['leads'] = $getLeads;
        // $data['leadsOrder'] = $getLeadsOrder;
        // $data['plots'] = $getPlots;
        // $data['business_banners'] = $business_banners;
        // $data['reviews'] = $reviews;

        $storeProductUnits = $this->BillingModal->getTableResults(
            "stores_products_units",
            "store_id",
            $obj["store_id"]
        );
        $storeProductImages = $this->BillingModal->getTableResults(
            "stores_products_images",
            "store_id",
            $obj["store_id"]
        );
        $storeVendorsData = $this->BillingModal->getTableResults(
            "store_vendor_list",
            "store_id",
            $obj["store_id"]
        );
        $store_customer_list = $this->BillingModal->getTableResults(
            "store_customer_list",
            "store_id",
            $obj["store_id"]
        );
        $store_vendor_purchase_record = $this->BillingModal->getTableResults(
            "store_vendor_purchase_record",
            "store_id",
            $obj["store_id"]
        );
        $store_vendor_purchase_record_products = $this->BillingModal->getTableResults(
            "store_vendor_purchase_record_products",
            "store_id",
            $obj["store_id"]
        );

        $store_customer_purchase_record = $this->BillingModal->getTableResults(
            "store_customer_purchase_record",
            "store_id",
            $obj["store_id"]
        );
        $store_customer_purchase_record_products = $this->BillingModal->getTableResults(
            "store_customer_purchase_record_products",
            "store_id",
            $obj["store_id"]
        );

        $store_stock_history = $this->BillingModal->getTableResults(
            "store_stock_history",
            "store_id",
            $obj["store_id"]
        );
        $store_activity_history = $this->BillingModal->getTableResults(
            "stores_activity_record",
            "store_id",
            $obj["store_id"]
        );
        $store_employee_list = $this->BillingModal->getTableResults(
            "master_admin_login",
            "store_id",
            $obj["store_id"]
        );
        $store_login_user = $this->BillingModal->getTableResults(
            "master_admin_login",
            "id",
            $obj["adminId"]
        );

        $masterBrandsData = $this->BillingModal->getTableResults(
            "master_brands"
        );
        $masterCategoryData = $this->BillingModal->getTableResults(
            "master_category"
        );
        $masterProductUnits = $this->BillingModal->getTableResults(
            "master_products_units"
        );
        $masterProductsData = $this->BillingModal->getTableResults(
            "master_products"
        );

        foreach ($masterProductsData as $row => $value) {
            $getBrandData = $this->BillingModal->getTableResults(
                "master_brands",
                "id",
                $value->brand_id
            );
            $Brandarr1 = json_decode(json_encode($getBrandData), true);
            $brand_name = $Brandarr1[0]["brand_name"];
            $masterProductsData[$row]->brand_name = $brand_name;
        }
        $masterProductsData1 = $masterProductsData;
        if ($masterProductsData1 == null) {
            $masterProductsData1 = [];
        }

        foreach ($store_stock_history as $row => $value) {
            $getStaffData = $this->BillingModal->getTableResults(
                "master_admin_login",
                "id",
                $value->staff_id
            );
            $Brandarr1 = json_decode(json_encode($getStaffData), true);
            $staff_name = $Brandarr1[0]["name"];
            $store_stock_history[$row]->staff_name = $staff_name;
        }

        $store_stock_history1 = $store_stock_history;
        if ($store_stock_history1 == null) {
            $store_stock_history1 = [];
        }

        $data["store_stock_history"] = $store_stock_history1;
        $data["store_activity_history"] = $store_activity_history;
        $data["store_employee_list"] = $store_employee_list;
        $data["store_login_user"] = $store_login_user[0];

        $data["store_customer_list"] = $store_customer_list;

        $data["storeProductUnits"] = $storeProductUnits;
        $data["storeProductImages"] = $storeProductImages;
        $data["store_vendor_list"] = $storeVendorsData;
        $data["store_vendor_purchase_record"] = $store_vendor_purchase_record;
        $data[
            "store_vendor_purchase_record_products"
        ] = $store_vendor_purchase_record_products;

        $data[
            "store_customer_purchase_record"
        ] = $store_customer_purchase_record;
        $data[
            "store_customer_purchase_record_products"
        ] = $store_customer_purchase_record_products;

        $data["masterBrandsData"] = $masterBrandsData;
        $data["masterCategoryData"] = $masterCategoryData;
        $data["masterProductsData"] = $masterProductsData1;
        $data["masterProductUnits"] = $masterProductUnits;

        echo json_encode($data);
    }
    
    
    public function notAvilable() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $OrderID = $obj['orderID'];
        $ItemID = $obj['itemID'];
        $notAvilableQTY = $obj['notAvilableQTY'];
        
        $updateData = ["not_avl_qty" => "$notAvilableQTY"];
        
            
            $resultQry = $this->BillingModal->updateData(
                "store_customer_purchase_record_products",
                "id",
                $ItemID,
                $updateData
            );
            
        
        echo json_encode($resultQry);
        
    }

    public function updateSalesRecord() {
        // Add CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
        header('Content-Type: application/json');
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        // Debug log
        error_log("updateSalesRecord called with data: " . print_r($obj, true));

        try {
            // Validate required fields
            if (!isset($obj["orderID"]) || !isset($obj["itemID"]) || !isset($obj["field"]) || !isset($obj["value"])) {
                error_log("Missing required fields in updateSalesRecord");
                echo json_encode(["success" => false, "error" => "Missing required fields"]);
                return;
            }

            $orderID = $obj["orderID"];
            $itemID = $obj["itemID"];
            $field = $obj["field"];
            $value = floatval($obj["value"]);

            // Get current item data
            $currentItem = $this->BillingModal->getTableResults(
                "store_customer_purchase_record_products",
                "id",
                $itemID
            );

            if (empty($currentItem)) {
                echo json_encode(["success" => false, "error" => "Item not found"]);
                return;
            }

            $item = $currentItem[0];
            
            // Prepare update data based on field type
            $updateData = [];
            
            switch ($field) {
                case 'quantity':
                    $newQuantity = max(1, $value); // Minimum 1
                    $updateData["quantity"] = $newQuantity;
                    $updateData["total_amount"] = floatval($item->sale_price) * $newQuantity;
                    break;

                case 'mrp':
                    $newMrp = max(0, $value);
                    $updateData["mrp"] = $newMrp;
                    $updateData["price"] = $newMrp; // Update price to match MRP
                    
                    // Recalculate discount based on current sale_price
                    $currentSalePrice = floatval($item->sale_price);
                    $newDiscount = max(0, $newMrp - $currentSalePrice);
                    $updateData["discount"] = $newDiscount;
                    $updateData["total_amount"] = $currentSalePrice * floatval($item->quantity);
                    break;

                case 'sale_price':
                    $newSalePrice = max(0, $value);
                    $updateData["sale_price"] = $newSalePrice;
                    
                    // Recalculate discount
                    $currentMrp = floatval($item->mrp);
                    $newDiscount = max(0, $currentMrp - $newSalePrice);
                    $updateData["discount"] = $newDiscount;
                    $updateData["total_amount"] = $newSalePrice * floatval($item->quantity);
                    break;

                case 'discount':
                    $newDiscount = max(0, $value);
                    $updateData["discount"] = $newDiscount;
                    
                    // Recalculate sale_price
                    $currentMrp = floatval($item->mrp);
                    $newSalePrice = max(0, $currentMrp - $newDiscount);
                    $updateData["sale_price"] = $newSalePrice;
                    $updateData["total_amount"] = $newSalePrice * floatval($item->quantity);
                    break;

                case 'batch_update':
                    // Handle multiple field updates at once
                    $batchData = $obj["value"];
                    error_log("Batch update data: " . print_r($batchData, true));
                    
                    $updateData["quantity"] = max(1, floatval($batchData["quantity"] ?? $item->quantity));
                    $updateData["mrp"] = max(0, floatval($batchData["mrp"] ?? $item->mrp));
                    $updateData["price"] = $updateData["mrp"];
                    $updateData["sale_price"] = max(0, floatval($batchData["sale_price"] ?? $item->sale_price));
                    $updateData["discount"] = max(0, floatval($batchData["discount"] ?? $item->discount));
                    $updateData["total_amount"] = $updateData["sale_price"] * $updateData["quantity"];
                    break;

                default:
                    echo json_encode(["success" => false, "error" => "Invalid field"]);
                    return;
            }

            // Update the product record
            $result = $this->BillingModal->updateData(
                "store_customer_purchase_record_products",
                "id",
                $itemID,
                $updateData
            );

            if ($result) {
                // Recalculate order totals
                $this->updateOrderTotals($orderID);

                // Update stock if quantity changed
                if (isset($updateData["quantity"])) {
                    $this->updateProductStock($item, $updateData["quantity"]);
                }

                echo json_encode([
                    "success" => true,
                    "message" => "Sales record updated successfully",
                    "updated_data" => $updateData,
                    "item_id" => $itemID
                ]);
            } else {
                echo json_encode(["success" => false, "error" => "Failed to update record"]);
            }

        } catch (Exception $e) {
            error_log("updateSalesRecord exception: " . $e->getMessage());
            echo json_encode(["success" => false, "error" => $e->getMessage()]);
        }
    }

    // Test endpoint to verify API is working
    public function testUpdateAPI() {
        // Add CORS headers
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        header('Access-Control-Allow-Headers: Content-Type, Accept, Authorization');
        header('Content-Type: application/json');
        
        // Handle preflight OPTIONS request
        if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
            http_response_code(200);
            exit();
        }

        echo json_encode([
            "success" => true, 
            "message" => "API is working!", 
            "timestamp" => date("Y-m-d H:i:s")
        ]);
    }

    private function updateOrderTotals($orderID) {
        // Get all products for this order
        $products = $this->BillingModal->getTableResults(
            "store_customer_purchase_record_products",
            "order_id",
            $orderID
        );

        $subTotal = 0;
        $grandTotal = 0;
        $totalDiscount = 0;

        foreach ($products as $product) {
            $quantity = floatval($product->quantity);
            $mrp = floatval($product->mrp);
            $salePrice = floatval($product->sale_price);
            $discount = floatval($product->discount);

            $subTotal += ($mrp * $quantity);
            $grandTotal += ($salePrice * $quantity);
            $totalDiscount += ($discount * $quantity);
        }

        // Update main order record
        $orderUpdateData = [
            "sub_total" => $subTotal,
            "grand_total" => $grandTotal,
            "total_payment" => $grandTotal,
            "discount" => $totalDiscount
        ];

        $this->BillingModal->updateData(
            "store_customer_purchase_record",
            "order_id",
            $orderID,
            $orderUpdateData
        );
    }

    private function updateProductStock($originalItem, $newQuantity) {
        $productId = $originalItem->product_id;
        $originalQuantity = floatval($originalItem->quantity);
        $quantityDifference = $newQuantity - $originalQuantity;

        if ($quantityDifference != 0) {
            // Get current stock
            $productData = $this->BillingModal->getTableResults(
                "stores_products",
                "id",
                $productId
            );

            if (!empty($productData)) {
                $currentStock = floatval($productData[0]->stock_quantity);
                $newStock = $currentStock - $quantityDifference; // Subtract because it's a sale

                // Update stock
                $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $productId,
                    ["stock_quantity" => $newStock]
                );

                // Log stock transaction
                $stockLogData = [
                    "store_id" => $originalItem->store_id,
                    "staff_id" => $originalItem->user_id,
                    "product_name" => $originalItem->product_full_name,
                    "product_id" => $productId,
                    "coming_from" => $quantityDifference > 0 ? "Store" : "Customer",
                    "going_to" => $quantityDifference > 0 ? "Customer" : "Store",
                    "quantity" => abs($quantityDifference),
                    "action" => "Sale Update",
                    "resion" => "Sales record quantity modified",
                    "time" => date("h:i A"),
                    "date" => date("d-m-Y"),
                ];

                $this->BillingModal->insertData("store_stock_history", $stockLogData);
            }
        }
    }

 public function fetchNewOrders()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        //  $res = $this->BillingModal->fetchNewOrders($obj['last_id']);
         // $data['testing'] = $this->BillingModal->fetchNewOrders($obj['last_id']);
        $response = $this->BillingModal->fetchNewOrders($obj['last_id']);
        

        $data['last_id'] = $response[0]->id;
        $data['new_order_length'] = count($response);
        // $data['last_record'] = $response;
       
        //  $data["store_vendor_purchase_record"] = $store_vendor_purchase_record;
         
         

        echo json_encode($data);
        
        
    }
    
    
        
     public function Store_bussiness_info(){
        
        $json = file_get_contents('php://input'); 	
        $obj = json_decode($json,true);
            
            
              $storeProductsData =    $this->BillingModal->getTableResultsOrderBy('partner_bussiness_info','id', 'DESC','store_id',$obj['store_id']);
      
              $data['Store_bussiness_info'] = $storeProductsData[0];
              
              
              
                $master_delivery_area =   $this->BillingModal->getTableResultsOrderBy('master_delivery_area','id', 'DESC');
      
                $data['master_delivery_area'] = $master_delivery_area;
              
                $Store_delivery_area =   $this->BillingModal->getTableResultsOrderBy('store_delivery_area','id', 'DESC','store_id',$obj['store_id']);
      
                $data['store_delivery_area'] = $Store_delivery_area;
                
                
                $master_delivery_slot =    $this->BillingModal->getTableResultsOrderBy('master_delivery_slot','slot_time_start', 'ASC');
      
                $data['master_delivery_slot'] = $master_delivery_slot;
              
                $store_delivery_slot =    $this->BillingModal->getTableResultsOrderBy('delivery_charge_slots_condition','distance_km', 'ASC','store_id',$obj['store_id']);
      
                $data['store_delivery_slot'] = $store_delivery_slot;
                
                $store_coupon_list =    $this->BillingModal->getTableResultsOrderBy('tbl_coupons','coupon_code', 'ASC','store_id',$obj['store_id']);
      
                $data['store_coupon_list'] = $store_coupon_list;
                
                 $store_banner_list =    $this->BillingModal->getTableResultsOrderBy('store_banner','id', 'ASC','store_id',$obj['store_id']);
      
                $data['store_banner_list'] = $store_banner_list;
         
              echo json_encode($data);
            
    }
    
    
    
    
  public function SaleSExtratoreProducts(){
      
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

            $product_list = $obj["product_list"];

        //     $respond =null;

      $totalPay = 0;
      
       foreach ($product_list as $product) {
                $product = (object) $product;
                
            
                


                $productdata = [
                    "store_id" => $obj["store_id"],
                    "customer_mobile" => $obj["customer_mobile"],
                    "order_id" => $obj["order_id"],
                    "user_id" => $obj["user_id"],
                    "product_id" => $product->id,
                    "product_full_name" => $product->product_name." ".$product->product_size." ".$product->product_unit,
                     "product_name" => $product->product_name,
                      "product_size" => $product->product_size,
                       "product_unit" => $product->product_unit,
                    "product_img" => $product->product_image,
                    "quantity" => $product->billing_quantity,
                    "mrp" => $product->price,
                    "price" => $product->price,
                    "sale_price" => $product->sale_price,
                    "discount" => $product->discount_in_rs,
                    "gst" => $product->c_gst + $product->s_gst,
                    "c_gst" => $product->c_gst,
                    "s_gst" => $product->s_gst,
                    "hsn_code" => $product->hsn_code,
                    "total_amount" => $product->amount_total,
                    "parent_category_id" => $product->parent_category_id,
                    "category_id" => $product->category_id,
                    "brand_id" => $product->brand_id,
                    "plateform" => "Store Billing",
                    "date" => $date,
                    "time" => $time,
                    "is_extra_item" => 1,
                    
                ];

                $anyDataProductInsert = $this->BillingModal->insertData(
                    "store_customer_purchase_record_products",
                    $productdata
                );
                
                
                $totalPay = $totalPay+($product->sale_price*$product->billing_quantity);
                
               

                //   insert purchase product transation end

                //   update product stock  start
                $getData = $this->BillingModal->getTableResults(
                    "stores_products",
                    "id",
                    $product->id
                );
                $arr1 = json_decode(json_encode($getData), true);
                $stock_quantity = $arr1[0]["stock_quantity"];
                $newstock_quantity = $stock_quantity;

                $newstock_quantity =
                    $newstock_quantity - $product->billing_quantity;
                $updateproducts = ["stock_quantity" => $newstock_quantity];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $product->id,
                    $updateproducts
                );

                //   update product stock  end

                // insert stock  transation start

                $dataSTOCK_history = [
                    "store_id" => $obj["store_id"],
                    "staff_id" => $obj["user_id"],
                    "product_name" => $product->product_full_name,
                    "product_id" => $product->id,
                    "coming_from" => "Store",
                    "going_to" => "Customer",
                    "quantity" => $product->billing_quantity,
                    "action" => "Sale",
                    "resion" => "Store Billing",
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_stock_history",
                    $dataSTOCK_history
                );

                // insert stock  transation end

                $no++;
            }
            
            $newTotalPayment = $totalPay +  $obj["total_payment"];
            $extra_item_total = $totalPay +  $obj["extra_item_total"];
              $updateManinRow = ["total_payment" => $newTotalPayment,"extra_item_total" => $extra_item_total];

                $resultQry = $this->BillingModal->updateData(
                    "store_customer_purchase_record",
                    "order_id",
                    $obj["order_id"],
                    $updateManinRow
                );
                
                
                

            if ($anyDataProductInsert) {
                $respond["purchase_product_insert"] = true;
            } else {
                $respond["purchase_product_insert"] = false;

            }

        echo json_encode($respond);
        
    }

    
    
    
          
           public function deliveryCondtionData()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
         $store_delivery_slot =    $this->BillingModal->getTableResultsOrderBy('delivery_charge_slots_condition','distance_km', 'ASC','store_id',$obj['store_id'],'distance_km<=',$obj['Distance_KM']);
      
                $data['store_delivery_slot'] = $store_delivery_slot;
                 $data['dis'] = $obj['Distance_KM'];
          
         
         

        echo json_encode($data);
        
        
    }
    
    
    
              public function delivery_slot_list_data()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
         $store_delivery_slot =    $this->BillingModal->getTableResultsOrderBy('store_delivery_slot','s_number', 'ASC','store_id',$obj['store_id'],'slot_id',$obj['SlotId']);
      
                $data['store_delivery_slot_list'] = $store_delivery_slot;
          
         
         

        echo json_encode($data);
        
        
    }
    
                

 public function store_vendor_purchase_record()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
         $store_vendor_purchase_record = $this->BillingModal->getTableResultsOrderBy(
            "store_vendor_purchase_record","id","DESC","store_id",$obj["store_id"]
        );
        
   

        
       
         $data["store_vendor_purchase_record"] = $store_vendor_purchase_record;
         
         

        echo json_encode($data);
        
        
    }
    
    
     public function purchase_history_record()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $storeVendorData = $this->BillingModal->getTableResults("store_vendor_list","id",$obj["vender_id"]);
        $data["vendordata"] = $storeVendorData;
         $store_vendor_purchase_record = $this->BillingModal->getTableResults("store_vendor_purchase_record","order_id",$obj["order_id"]);
        $data["store_vendor_purchase_record"] = $store_vendor_purchase_record;
         $store_vendor_purchase_record_products = $this->BillingModal->getTableResults("store_vendor_purchase_record_products","order_id",$obj["order_id"]);
        $data["store_vendor_purchase_record_products"] = $store_vendor_purchase_record_products;
         

        echo json_encode($data);
        
        
    }
    
    
       public function expiry_history_record()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $storeVendorData = $this->BillingModal->getTableResults("store_vendor_list","id",$obj["vender_id"]);
        $data["vendordata"] = $storeVendorData;
         $store_vendor_purchase_record = $this->BillingModal->getTableResults("store_vendor_expory_record","order_id",$obj["order_id"]);
        $data["store_vendor_purchase_record"] = $store_vendor_purchase_record;
         $store_vendor_purchase_record_products = $this->BillingModal->getTableResults("store_vendor_expory_record_products","order_id",$obj["order_id"]);
        $data["store_vendor_purchase_record_products"] = $store_vendor_purchase_record_products;
         

        echo json_encode($data);
        
        
    }
    
    
    
    
       public function storeProductsDataApi()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        // $storeVendorData = $this->BillingModal->getTableResults("stores_products","store_id",$obj["store_id"]);
        // $data["stores_products"] = $storeVendorData;
        
         $order_details = $this->BillingModal->getTableResultsOrderBy(
            "stores_products",
            "id",
            "DESC",
            "store_id",
            $obj["store_id"]
        );
        
       
        
        $data["stores_products"] = $order_details;
        echo json_encode($data);
        
        
    }
    
    
    
      public function add_banner()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $storeVendorData = $this->BillingModal->getTableResults("stores_category","store_id",$obj["store_id"],"category_level","0",
                null,
                null);
        $data["stores_category"] = $storeVendorData;
         $store_vendor_purchase_record = $this->BillingModal->getTableResults("stores_products","store_id",$obj["store_id"]);
        $data["stores_products"] = $store_vendor_purchase_record;
      
        echo json_encode($data);
        
        
    }
    
    
    
      public function add_product_api()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $storeVendorData = $this->BillingModal->getTableResults("stores_category","store_id",$obj["store_id"]);
        $data["stores_category"] = $storeVendorData;
         $store_vendor_purchase_record = $this->BillingModal->getTableResults("stores_brands","store_id",$obj["store_id"]);
        $data["stores_brands"] = $store_vendor_purchase_record;
        $stores_products_units = $this->BillingModal->getTableResults("stores_products_units","store_id",$obj["store_id"]);
        $data["stores_products_units"] = $stores_products_units;
        
        
      
        echo json_encode($data);
        
        
    }
    
    
public function customer_list_load_paginated()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Content-Type: application/json');
    date_default_timezone_set("Asia/Kolkata");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $json = file_get_contents("php://input");
    $obj = json_decode($json, true);

    $store_id = $obj['store_id'] ?? null;
    $limit = (int)($obj['limit'] ?? 10);
    $offset = (int)($obj['offset'] ?? 0);
    $search = trim($obj['search'] ?? '');

    if (!$store_id) {
        echo json_encode(['status' => false, 'message' => 'Store ID is required.']);
        return;
    }

    $this->db->from('store_customer_list');
    $this->db->where('store_id', $store_id);
    if ($search !== '') {
        $this->db->group_start();
        $this->db->like('name', $search);
        $this->db->or_like('mobile', $search);
        $this->db->or_like('address', $search);
        $this->db->group_end();
    }
    $total_records = $this->db->count_all_results();

    $this->db->from('store_customer_list');
    $this->db->where('store_id', $store_id);
    if ($search !== '') {
        $this->db->group_start();
        $this->db->like('name', $search);
        $this->db->or_like('mobile', $search);
        $this->db->or_like('address', $search);
        $this->db->group_end();
    }
    $this->db->limit($limit, $offset);
    $customers = $this->db->get()->result();

    echo json_encode([
        'status' => true,
        'total' => $total_records,
        'customers' => $customers
    ]);
}

    
       
      public function expense_list_load()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
     
        $stores_products_units = $this->BillingModal->getTableResultsOrderBy("store_expenses",'id','desc',"store_id",$obj["store_id"]);
        $data["store_expense_list"] = $stores_products_units;
        
        
      
        echo json_encode($data);
        
        
    }
    
    
         public function employee_list_load()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
     
        $stores_products_units = $this->BillingModal->getTableResultsOrderBy("store_employee_list",'id','desc',"store_id",$obj["store_id"]);
        $data["store_employee_list"] = $stores_products_units;
        
        
      
        echo json_encode($data);
        
        
    }
    
    
    
         public function customer_list_load()
    {
        
         $json = file_get_contents("php://input");
         $obj = json_decode($json, true);
         
         
           $storeCategoryData =    $this->BillingModal->getTableResultsOrderBy('store_customer_list','id','desc','store_id',$obj['store_id']);
  

           

        foreach ($storeCategoryData as $row => $value )
          
          { $getData =    $this->BillingModal->getTableResults('tbl_customers_address_book','customer_id',$value->id);
            $arr1 = json_decode(json_encode($getData), TRUE);
            $_name =   $arr1[0]['name'];
            $full_address =   $arr1[0]['destination_addresses'];
            
            if($value->login_source=='Store'){
                
                $storeCategoryData[$row]->customer_name= $value->name;
                $storeCategoryData[$row]->full_address=  $value->address." ".$value->city." ".$value->state." ".$value->pin_code;
                
            }
            else{
                
                if($_name== null || $_name =='')
                {
                    $storeCategoryData[$row]->customer_name= 'NA';
                     $storeCategoryData[$row]->full_address= 'NA';
                }
                else
                {
                    $storeCategoryData[$row]->customer_name= $_name;
                    $storeCategoryData[$row]->full_address= $full_address;
                }
                
            }
            
            
            
            
          }

         $storeCategoryData1 =$storeCategoryData; if($storeCategoryData1==null){$storeCategoryData1 = [];}
         
          $data['store_customer_list'] = $storeCategoryData1;
          
          
 
    echo json_encode($data);
        
        
    }
    
    
     public function vendor_list_load()
    {
        
         $json = file_get_contents("php://input");
         $obj = json_decode($json, true);
         
         
           $storeVendorsData =    $this->BillingModal->getTableResults('store_vendor_list','store_id',$obj['store_id']);
  
           $data['store_vendor_list'] = $storeVendorsData;
 
    echo json_encode($data);
        
        
    }
    
    
       public function expiry_list_load()
    {
        
         $json = file_get_contents("php://input");
         $obj = json_decode($json, true);
         
         
           $storeVendorsData =    $this->BillingModal->getTableResults('store_vendor_expory_record','store_id',$obj['store_id']);
  
           $data['store_expiry_list'] = $storeVendorsData;
 
    echo json_encode($data);
        
        
    }
    
    
    
      public function sale_history_online()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        // $obj['store_id']
    $store_id = $obj['store_id'];
    $selectedMonthYear = $obj['selectedMonthYear'];
    $order_status = $obj['order_type'];
    
    if($selectedMonthYear==null)
    {
        date_default_timezone_set("Asia/Kolkata");
        $month = date("m");
        $year = date("Y");
        
    }
    else {
        $dataDate = explode('-', $selectedMonthYear);
        
          $month = $dataDate[0];
          $year =  $dataDate[1];

        
    }

  

    
    
    
                 $onlineSale =   
                 $this->BillingModal->recordByMonthYearOnline('store_customer_purchase_record','id', 'DESC','store_id',$store_id,'order_status',$order_status,$month,$year );
                 
                  $GroupByRecordByYear =   
                 $this->BillingModal->GroupByRecordByYearOnline('store_customer_purchase_record','date', 'ASC','store_id',$store_id,'order_status',$order_status,$month,$year );
             
                 
                 
                     foreach ($onlineSale as $row => $value) {
            $getData = $this->BillingModal->getTableResults(
                "tbl_customers_address_book",
                "address_id",
                $value->customer_address_id
            );
            
            
            $getSlotsData = $this->BillingModal->getTableResults(
                "store_delivery_slot",
                "id",
                $value->delivery_slots
            );


            $arr2 = json_decode(json_encode($getSlotsData), true);
            
             $onlineSale[$row]->delivery_slots = $arr2[0]["slot_time_start"]." ".$arr2[0]["start_time_postfix"]." To ".$arr2[0]["slot_time_end"]." ".$arr2[0]["end_time_postfix"];

            $arr1 = json_decode(json_encode($getData), true);

            $onlineSale[$row]->customer_name = $arr1[0]["name"];
            $onlineSale[$row]->customer_phone = $arr1[0]["phone"];
            $onlineSale[$row]->customer_address =
                $arr1[0]["distance_km"] . " KM " . $arr1[0]["base_address"];
        }
      
                 

                //   $masterProductsData =   
                //  $this->BillingModal->getTableResultsGroupBy('store_customer_purchase_record',
                //  'id', 'DESC',
                //  'store_id',$store_id
                //  );
                 
                 

        
        
         $data["store_customer_purchase_record"] = $onlineSale;
        
        //   $data["month"] = $GroupByRecordByMonth;
         
      
        
        foreach ($GroupByRecordByYear as $row => $value )
          
          { 
              
     
           
                $GroupByRecordByYear[$row]->label= $value->year;
                $GroupByRecordByYear[$row]->code=  $value->year;
                
                $getMonths =    $this->BillingModal->GroupByRecordByMonthOnline('store_customer_purchase_record','date', 'DESC','store_id',$store_id,'order_status',$order_status,02,$value->year );
              
               $arr1 = json_decode(json_encode($getMonths), TRUE);
               $_name =   $arr1[0]['name'];
               
                foreach ($getMonths as $row1 => $value1 )
          
          { 
              
     
           switch ($value1->month) {
  case "1":
    $getMonths[$row1]->label= "January";
    break;
  case "2":
   $getMonths[$row1]->label= "February";
    break;
  case "3":
    $getMonths[$row1]->label= "March";
    break;
    case "4":
    $getMonths[$row1]->label= "April";
    break;
    case "5":
    $getMonths[$row1]->label= "May";
    break;
    case "6":
    $getMonths[$row1]->label= "Hune";
    break;
    case "7":
    $getMonths[$row1]->label= "July";
    break;
    case "8":
    $getMonths[$row1]->label= "August";
    break;
    case "9":
    $getMonths[$row1]->label= "September";
    break;
    case "10":
    $getMonths[$row1]->label= "October";
    break;
    case "11":
    $getMonths[$row1]->label= "November";
    break;
    case "12":
    $getMonths[$row1]->label= "December";
    break;
  
}

                $getMonths[$row1]->value=  $value1->month."-".$value->year;
                $getMonths[$row1]->name=  $value->year;
                
          }
          
            $GroupByRecordByYear[$row]->items =$getMonths; if($GroupByRecordByYear[$row]->items==null){$GroupByRecordByYear[$row]->items = [];}

            

            
            
            
          }
          
          
  $GroupByRecordByYear1 =$GroupByRecordByYear; if($GroupByRecordByYear1==null){$GroupByRecordByYear1 = [];}
  
    $data["sale_year"] = $GroupByRecordByYear;
     $data["month"] = $month;
      $data["year"] = $year;
    
        echo json_encode($data);
        
        // echo "<pre>";
        // print_r($data);
        
        
    }
public function customer_list_with_stats()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Content-Type: application/json');
    date_default_timezone_set("Asia/Kolkata");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $input = json_decode(file_get_contents('php://input'), true);
    $store_id = $input['store_id'] ?? null;
    $filterType = $input['filterType'] ?? 'all';
    $customStartDate = $input['customStartDate'] ?? null;
    $customEndDate = $input['customEndDate'] ?? null;

    if (!$store_id) {
        echo json_encode(['status' => false, 'message' => 'Store ID is required.']);
        return;
    }

    // Build Date Condition
    $dateCondition = "";
    if ($filterType === 'custom' && !empty($customStartDate) && !empty($customEndDate)) {
        $start = date('Y-m-d', strtotime(str_replace('-', '/', $customStartDate)));
        $end = date('Y-m-d', strtotime(str_replace('-', '/', $customEndDate)));
        $dateCondition = " AND DATE(STR_TO_DATE(join_date, '%d-%m-%Y')) BETWEEN '$start' AND '$end'";
    } else {
        switch ($filterType) {
            case 'today':
                $today = date('d-m-Y');
                $dateCondition = " AND join_date = '$today'";
                break;
            case 'yesterday':
                $yesterday = date('d-m-Y', strtotime('-1 day'));
                $dateCondition = " AND join_date = '$yesterday'";
                break;
            case 'this_week':
                $startWeek = date('d-m-Y', strtotime('monday this week'));
                $endWeek = date('d-m-Y', strtotime('sunday this week'));
                $dateCondition = " AND STR_TO_DATE(join_date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$startWeek', '%d-%m-%Y') AND STR_TO_DATE('$endWeek', '%d-%m-%Y')";
                break;
            case 'this_month':
                $monthStart = date('01-m-Y');
                $monthEnd = date('t-m-Y');
                $dateCondition = " AND STR_TO_DATE(join_date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$monthStart', '%d-%m-%Y') AND STR_TO_DATE('$monthEnd', '%d-%m-%Y')";
                break;
            case 'this_year':
                $yearStart = '01-01-' . date('Y');
                $yearEnd = '31-12-' . date('Y');
                $dateCondition = " AND STR_TO_DATE(join_date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$yearStart', '%d-%m-%Y') AND STR_TO_DATE('$yearEnd', '%d-%m-%Y')";
                break;
        }
    }

    // Get Customers
    $customers = $this->db->query("
        SELECT * FROM store_customer_list 
        WHERE store_id = '$store_id' $dateCondition
        ORDER BY STR_TO_DATE(join_date, '%d-%m-%Y') DESC
    ")->result_array();

    foreach ($customers as &$customer) {
        $customer_mobile = trim($customer['mobile']);
        $customer_id = $customer['id'];

        if ($customer_mobile && strtolower($customer_mobile) !== 'na') {
            // Prefer mobile if valid
            $total_orders = $this->db->where('store_id', $store_id)
                                     ->where('customer_mobile', $customer_mobile)
                                     ->count_all_results('store_customer_purchase_record');

            $total_spent = $this->db->select_sum('total_payment')
                                    ->where('store_id', $store_id)
                                    ->where('customer_mobile', $customer_mobile)
                                    ->get('store_customer_purchase_record')
                                    ->row()->total_payment;
        } else {
            // Fallback to customer_id if mobile is NA or blank
            $total_orders = $this->db->where('store_id', $store_id)
                                     ->where('customer_id', $customer_id)
                                     ->count_all_results('store_customer_purchase_record');

            $total_spent = $this->db->select_sum('total_payment')
                                    ->where('store_id', $store_id)
                                    ->where('customer_id', $customer_id)
                                    ->get('store_customer_purchase_record')
                                    ->row()->total_payment;
        }

        $customer['total_orders'] = (int) $total_orders;
        $customer['total_spent'] = (float) $total_spent ?: 0;
    }

    $summary = "Showing " . count($customers) . " customers";
    if ($filterType !== 'all') {
        $summary .= " for " . ucfirst(str_replace('_', ' ', $filterType));
    }

    echo json_encode([
        'status' => true,
        'customers' => $customers,
        'summary' => $summary
    ]);
}

public function sale_history()
{
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Headers: Content-Type, Authorization');
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, DELETE');
    header('Content-Type: application/json');
    date_default_timezone_set("Asia/Kolkata");

    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        http_response_code(200);
        exit();
    }

    $json = file_get_contents("php://input");
    $obj = json_decode($json, true);

    $store_id = $obj['store_id'] ?? null;
    $filterType = $obj['filterType'] ?? null;
    $customStartDate = $obj['customStartDate'] ?? null;
    $customEndDate = $obj['customEndDate'] ?? null;

    if (!$store_id) {
        echo json_encode(['status' => false, 'message' => 'Store ID is required.']);
        return;
    }

    $where = "store_id = '$store_id'";
    $msgHeading = "Showing All Records";

    $today = date('d-m-Y');
    $yesterday = date('d-m-Y', strtotime('-1 day'));
    $weekStart = date('d-m-Y', strtotime('monday this week'));
    $weekEnd = date('d-m-Y', strtotime('sunday this week'));
    $monthStart = date('d-m-Y', strtotime(date('Y-m-01')));
    $monthEnd = date('d-m-Y', strtotime(date('Y-m-t')));
    $currentYear = date('Y');

    switch ($filterType) {
        case 'today':
            $where .= " AND date = '$today'";
            $msgHeading = "Showing Today's Sales";
            break;
        case 'yesterday':
            $where .= " AND date = '$yesterday'";
            $msgHeading = "Showing Yesterday's Sales";
            break;
        case 'this_week':
            $where .= " AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$weekStart', '%d-%m-%Y') AND STR_TO_DATE('$weekEnd', '%d-%m-%Y')";
            $msgHeading = "Showing This Week's Sales";
            break;
        case 'this_month':
            $where .= " AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$monthStart', '%d-%m-%Y') AND STR_TO_DATE('$monthEnd', '%d-%m-%Y')";
            $msgHeading = "Showing This Month's Sales";
            break;
        case 'this_year':
            $where .= " AND YEAR(STR_TO_DATE(date, '%d-%m-%Y')) = '$currentYear'";
            $msgHeading = "Showing This Year's Sales";
            break;
        case 'custom':
            if (!empty($customStartDate) && !empty($customEndDate)) {
                $startDateObj = DateTime::createFromFormat('d-m-Y', $customStartDate);
                $endDateObj = DateTime::createFromFormat('d-m-Y', $customEndDate);

                if ($startDateObj && $endDateObj) {
                    $where .= " AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE('$customStartDate', '%d-%m-%Y') AND STR_TO_DATE('$customEndDate', '%d-%m-%Y')";
                    $msgHeading = "Showing Sales from $customStartDate to $customEndDate";
                } else {
                    echo json_encode([
                        'status' => false,
                        'msg_heading' => 'Invalid custom date format. Please select valid dates.',
                        'store_customer_purchase_record' => []
                    ]);
                    return;
                }
            } else {
                echo json_encode([
                    'status' => false,
                    'msg_heading' => 'Custom Date: Missing start or end date.',
                    'store_customer_purchase_record' => []
                ]);
                return;
            }
            break;
    }

    $result = $this->db->query("SELECT * FROM store_customer_purchase_record WHERE $where ORDER BY id DESC")->result();

    // ✅ Calculate totals based on status Sold or Delivered only
    $total_sales = count($result);
    $total_amount = 0;

    foreach ($result as $row) {
        $status = strtolower(trim($row->order_status));
        if ($status === 'sold' || $status === 'delivered') {
            $total_amount += (float) $row->total_payment;
        }
    }

    echo json_encode([
        'status' => true,
        'msg_heading' => $msgHeading,
        'total_sales' => $total_sales,
        'total_sales_value' => round($total_amount, 2),
        'store_customer_purchase_record' => $result
    ]);
}





 public function InsertPurchaseData()
    {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
         $masterProductsData = $this->BillingModal->getTableResults(
            "stores_products","store_id",
            $obj["store_id"]
        );
        
         $businessInfo = $this->BillingModal->getTableResults(
            "partner_bussiness_info","store_id",
            $obj["store_id"]
        );
        
        $storeVendorData = $this->BillingModal->getTableResults(
            "store_vendor_list","store_id",
            $obj["store_id"]
        );
        
        foreach ($masterProductsData as $row => $value) {
            $masterProductsData[$row]->product_name_search = $value->product_name." [ ".$value->product_size." ".$value->product_unit." ] [ MRP ".$value->price." ] [ Sale ".$value->sale_price." ] ";
        }
        
        $masterProductsData1 = $masterProductsData;
        if ($masterProductsData1 == null) {
            $masterProductsData1 = [];
        }
        
         $data["searchProduct"] = $masterProductsData1;
         $data["partner_bussiness_info"] = $businessInfo[0];
         $data["vendorLists"] = $storeVendorData;
         
         

        echo json_encode($data);
        
        
    }
    
    
  
                
                                   public function testOtp()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
       
             
        date_default_timezone_set("Asia/Kolkata");
        
     
        $phoneNumber = 8052553000;
      
        $otp = rand(1000, 9999);
        
        $apiKey = urlencode('XKRhKpjMT3s-3EuyLstm6CGzsa0trAUSatgKu708XS');

        $sender = urlencode('SKYBLY');

        $message = rawurlencode("Your OTP is " . $otp . " .Please enter for login.Thank You From - SKYABLY");
     

        
        $data = array(
            'apikey' => $apiKey,
            'numbers' => $phoneNumber,
            "sender" => $sender,
            "message" => $message
        );
        
        $ch = curl_init('https://api.textlocal.in/send/');
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        $responseCrul = curl_exec($ch);
        
        echo "<pre>";
        print_r($responseCrul);
        
        
        curl_close($ch);
        
        
        
    }
    
    
    
     
                
                    public function store_banner_list()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
       
         $store_banner_list =    $this->BillingModal->getTableResultsOrderBy('store_banner','id', 'ASC',null,null,'store_id',$obj['store_id']);
      
         $data['store_banner_list'] = $store_banner_list;

        echo json_encode($data);
    }
    

    public function Login()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        $result = $this->BillingModal->LoginPartner(
            $obj["mobile"],
            $obj["password"]
        );

        if ($result > 0) {
            $resultOfPartner = $this->BillingModal->getPartnerByPhone(
                $obj["mobile"]
            );
            $Result["data"] = $resultOfPartner;
            $Result["Login"] = "done";
        } else {
            $Result["Login"] = "NotDone";
        }

        echo json_encode($Result);
    }

    //*** BRAND CODES START ***//

    public function addStoreBanners()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $fname = $_FILES["image"]["name"];
        $tmp_name = $_FILES["image"]["tmp_name"];
        $arr = explode(".", $fname);
        $ext = end($arr);
        $extlower = strtolower($ext);
        $fnewname = md5(rand(1000, 9999)) . "." . $extlower;
        
        $baseUrl = $this->config->item('base_image_url');
        $imgName = $baseUrl . 'banner/' . $fnewname;


        // $imgName =
        //     "https://admin.martpay.in/APP-API/Assets/banner/" . $fnewname;

        $dataBrands = [
            "store_id" => $_POST["store_id"],
             "type" => $_POST["type"],
              "item_Id" => $_POST["item_Id"],
               "name" => $_POST["name"],
            "image" => $imgName,
        ];

        move_uploaded_file(
            $_FILES["image"]["tmp_name"],
            "Assets/banner/" . $fnewname
        );

        $anyData = $this->BillingModal->insertData("store_banner", $dataBrands);

        if ($anyData) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function addStoreBrands()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $brand_Name = preg_replace("/\s+/", " ", $_POST["brand_name"]);

        $fname = $_FILES["brand_feature_image"]["name"];
        $tmp_name = $_FILES["brand_feature_image"]["tmp_name"];
        $arr = explode(".", $fname);
        $ext = end($arr);
        $extlower = strtolower($ext);
        $fnewname = md5(rand(1000, 9999)) . "." . $extlower;
        
        $baseUrl = $this->config->item('base_image_url');
        $imgName = $baseUrl . 'brands/' . $fnewname;

        // $imgName =
        //     "https://admin.martpay.in/APP-API/Assets/brands/" . $fnewname;

        $dataMasterBrands = [
            "brand_type" => $_POST["brand_type"],
            "brand_name" => $brand_Name,
            "brand_image" => $imgName,
            "date" => $date,
        ];

        $masterBrandAvlCheak = $this->BillingModal->getNumberOfRow(
            "master_brands",
            "brand_name",
            $brand_Name,
            "brand_type",
            $_POST["brand_type"],
            null,
            null
        );

        if ($masterBrandAvlCheak > 0) {
            $Result["is_master_brand_alredy"] = 1;
            $getMasterBrandData = $this->BillingModal->getTableResults(
                "master_brands",
                "brand_name",
                $brand_Name,
                "brand_type",
                $_POST["brand_type"],
                null,
                null
            );

            $storeBrandAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_brands",
                "brand_name",
                $brand_Name,
                "brand_type",
                $_POST["brand_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeBrandAvlCheak > 0) {
                $Result["is_brand_alredy"] = 1;
            } else {
                $Result["is_brand_alredy"] = 0;
                $arr1 = json_decode(json_encode($getMasterBrandData), true);
                $master_brand_id = $arr1[0]["id"];
                $master_image = $arr1[0]["brand_image"];
                $master_date = $arr1[0]["date"];

                $dataBrands = [
                    "store_id" => $_POST["store_id"],
                    "master_brand_id" => $master_brand_id,
                    "brand_type" => $_POST["brand_type"],
                    "brand_name" => $brand_Name,
                    "brand_image" => $master_image,
                    "date" => $master_date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_brands",
                    $dataBrands
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }
        } else {
            $Result["is_master_brand_alredy"] = 0;

            move_uploaded_file(
                $_FILES["brand_feature_image"]["tmp_name"],
                "Assets/brands/" . $fnewname
            );
            $anyDataMaster = $this->BillingModal->insertData(
                "master_brands",
                $dataMasterBrands
            );

            $getMasterBrandData = $this->BillingModal->getTableResults(
                "master_brands",
                "brand_name",
                $brand_Name,
                "brand_type",
                $_POST["brand_type"],
                null,
                null
            );

            $storeBrandAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_brands",
                "brand_name",
                $brand_Name,
                "brand_type",
                $_POST["brand_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeBrandAvlCheak > 0) {
                $Result["is_brand_alredy"] = 1;
            } else {
                $Result["is_brand_alredy"] = 0;
                $arr1 = json_decode(json_encode($getMasterBrandData), true);
                $master_brand_id = $arr1[0]["id"];
                $master_image = $arr1[0]["brand_image"];
                $master_date = $arr1[0]["date"];

                $dataBrands = [
                    "store_id" => $_POST["store_id"],
                    "master_brand_id" => $master_brand_id,
                    "brand_type" => $_POST["brand_type"],
                    "brand_name" => $brand_Name,
                    "brand_image" => $master_image,
                    "date" => $master_date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_brands",
                    $dataBrands
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $brand_Name,
                "activity_type" => "ADD",
                "data_type" => "BRAND",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        }

        echo json_encode($Result);
    }



  public function addStoreCategory()
   {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $category_Name = preg_replace("/\s+/", " ", $_POST["category_name"]);

        $fname = $_FILES["category_image"]["name"];
        $tmp_name = $_FILES["category_image"]["tmp_name"];
        $arr = explode(".", $fname);
        $ext = end($arr);
        $extlower = strtolower($ext);
        $fnewname = md5(rand(1000, 9999)) . "." . $extlower;
        
        $baseUrl = $this->config->item('base_image_url');
        $imgName = $baseUrl . 'category/' . $fnewname;
        
        
        // $imgName =
        //     "https://admin.martpay.in/APP-API/Assets/category/" . $fnewname;

        $dataMastercategorys = [
            "category_type" => $_POST["category_type"],
            "category_name" => $category_Name,
            "category_level" => $_POST["category_level"],
            "deceptions" => $_POST["deceptions"],
            "category_image" => $imgName,
            "date" => $date,
        ];

        $mastercategoryAvlCheak = $this->BillingModal->getNumberOfRow(
            "master_category",
            "category_name",
            $category_Name,
            "category_type",
            $_POST["category_type"],
            null,
            null
        );

        if ($mastercategoryAvlCheak > 0) {
            $Result["is_master_category_alredy"] = 1;
            $getMastercategoryData = $this->BillingModal->getTableResults(
                "master_category",
                "category_name",
                $category_Name,
                "category_type",
                $_POST["category_type"],
                null,
                null
                
            );

            $storecategoryAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_category",
                "category_name",
                $category_Name,
                "category_type",
                $_POST["category_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storecategoryAvlCheak > 0) {
                $Result["is_category_alredy"] = 1;
            } else {
                $Result["is_category_alredy"] = 0;
                $arr1 = json_decode(json_encode($getMastercategoryData), true);
                $master_category_id = $arr1[0]["id"];
                $master_image = $arr1[0]["category_image"];
                $master_date = $arr1[0]["date"];
                $category_level = $arr1[0]["category_level"];

                $datacategorys = [
                    "store_id" => $_POST["store_id"],
                    "master_category_id" => $master_category_id,
                    "category_type" => $_POST["category_type"],
                     "master_category_level" => $category_level,
                      "category_level" => $category_level,
                       "deceptions" => $arr1[0]["deceptions"],
          
                    "category_name" => $category_Name,
                    "category_image" => $master_image,
                    "date" => $master_date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_category",
                    $datacategorys
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }
        } else {
            $Result["is_master_category_alredy"] = 0;

            move_uploaded_file(
                $_FILES["category_image"]["tmp_name"],
                "Assets/category/" . $fnewname
            );
            $anyDataMaster = $this->BillingModal->insertData(
                "master_category",
                $dataMastercategorys
            );

            $getMastercategoryData = $this->BillingModal->getTableResults(
                "master_category",
                "category_name",
                $category_Name,
                "category_type",
                $_POST["category_type"],
                null,
                null
            );

            $storecategoryAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_category",
                "category_name",
                $category_Name,
                "category_type",
                $_POST["category_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storecategoryAvlCheak > 0) {
                $Result["is_category_alredy"] = 1;
            } else {
                $Result["is_category_alredy"] = 0;
                $arr1 = json_decode(json_encode($getMastercategoryData), true);
                $master_category_id = $arr1[0]["id"];
                $master_image = $arr1[0]["category_image"];
                $master_date = $arr1[0]["date"];
                  $category_level = $arr1[0]["category_level"];

                $datacategorys = [
                    "store_id" => $_POST["store_id"],
                    "master_category_id" => $master_category_id,
                    "category_type" => $_POST["category_type"],
                     "master_category_level" => $category_level,
                      "category_level" => $category_level,
                       "deceptions" => $arr1[0]["deceptions"],
                      
                    "category_name" => $category_Name,
                    "category_image" => $master_image,
                    "date" => $master_date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_category",
                    $datacategorys
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $category_Name,
                "activity_type" => "ADD",
                "data_type" => "category",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        }

        echo json_encode($Result);
    }




    public function importStoreBrands()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $brandData = $obj["Brands"];

        foreach ($brandData as $Brands) {
            $Brands = (object) $Brands;

            $type = $Brands->brand_type;
            $dataBrands = [
                "store_id" => $obj["store_id"],
                "master_brand_id" => $Brands->id,
                "brand_type" => $Brands->brand_type,
                "brand_name" => $Brands->key,
                "brand_image" => $Brands->brand_image,
                "date" => $Brands->date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_brands",
                $dataBrands
            );

            //  $dataCategory1 = array(
            //                     'store_id' => $obj['store_id'],
            //                     'user_id' =>$obj['adminId'],
            //                     'details' =>$Brands->key,
            //                     'activity_type' =>'IMPORT',
            //                     'data_type'=>'BRAND',
            //                     'time' => $time,
            //                      'date' =>$date,

            //                          );

            //  $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    //*** BRAND CODES END ***//

    public function importStoreDeliveryArea()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $brandData = $obj["area"];

        foreach ($brandData as $Brands) {
            $Brands = (object) $Brands;

            $type = $Brands->brand_type;
            $dataBrands = [
                "store_id" => $obj["store_id"],
                "area" => $Brands->area,
                "city" => $Brands->city,
                "state" => $Brands->state,
            ];

            $anyData = $this->BillingModal->insertData(
                "store_delivery_area",
                $dataBrands
            );

            //  $dataCategory1 = array(
            //                     'store_id' => $obj['store_id'],
            //                     'user_id' =>$obj['adminId'],
            //                     'details' =>$Brands->key,
            //                     'activity_type' =>'IMPORT',
            //                     'data_type'=>'BRAND',
            //                     'time' => $time,
            //                      'date' =>$date,

            //                          );

            //  $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    public function importStoreDeliverySlot()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $brandData = $obj["slot"];

        foreach ($brandData as $Brands) {
            $Brands = (object) $Brands;

            $type = $Brands->brand_type;
            $dataBrands = [
                "store_id" => $obj["store_id"],
                "slot_time_start" => $Brands->slot_time_start,
                "start_time_postfix" => $Brands->start_time_postfix,
                "slot_time_end" => $Brands->slot_time_end,
                "end_time_postfix" => $Brands->end_time_postfix,
                "slot_name" => $Brands->slot_name,
                "s_number" => $Brands->s_number,
            ];

            $anyData = $this->BillingModal->insertData(
                "store_delivery_slot",
                $dataBrands
            );

            //  $dataCategory1 = array(
            //                     'store_id' => $obj['store_id'],
            //                     'user_id' =>$obj['adminId'],
            //                     'details' =>$Brands->key,
            //                     'activity_type' =>'IMPORT',
            //                     'data_type'=>'BRAND',
            //                     'time' => $time,
            //                      'date' =>$date,

            //                          );

            //  $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    //*** CATEGORY CODES START ***//
    public function importStoreCategory()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $categoryData = $obj["Category"];

        foreach ($categoryData as $category) {
            $category = (object) $category;

            $dataCategory = [
                "store_id" => $obj["store_id"],
                "master_category_id" => $category->id,
                "master_category_level" => $category->category_level,
                "category_type" => $category->category_type,
                "category_name" => $category->category_name,
                "hindi_name" => $category->hindi_name,
                "category_image" => $category->category_image,
                "category_level" => $category->category_level,
                "deceptions" => $category->deceptions,
                "date" => $category->date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_category",
                $dataCategory
            );

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $category->category_name,
                "activity_type" => "IMPORT",
                "data_type" => "CATEGORY",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );

            $storeCategoryData = $this->BillingModal->getTableResults(
                "master_category",
                "category_level",
                $category->id
            );

            foreach ($storeCategoryData as $row) {
                $dataCategory1 = [
                    "store_id" => $obj["store_id"],
                    "master_category_id" => $row->id,
                    "master_category_level" => $row->category_level,
                    "category_type" => $row->category_type,
                    "category_name" => $row->category_name,
                    "hindi_name" => $row->hindi_name,
                    "category_image" => $row->category_image,
                    "category_level" => $row->category_level,
                    "deceptions" => $row->deceptions,
                    "date" => $row->date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_category",
                    $dataCategory1
                );

                $dataCategory1 = [
                    "store_id" => $obj["store_id"],
                    "user_id" => $obj["adminId"],
                    "details" => $row->category_name,
                    "activity_type" => "IMPORT",
                    "data_type" => "CATEGORY",
                    "time" => $time,
                    "date" => $date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_activity_record",
                    $dataCategory1
                );
            }
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    public function importStoreChildCategory()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $categoryData = $obj["Category"];

        foreach ($categoryData as $category) {
            $category = (object) $category;

            $dataCategory = [
                "store_id" => $obj["store_id"],
                "master_category_id" => $category->id,
                "master_category_level" => $category->category_level,
                "category_type" => $category->category_type,
                "category_name" => $category->key,
                "category_image" => $category->category_image,
                "category_level" => $category->category_level,
                "deceptions" => $category->deceptions,
                "date" => $category->date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_category",
                $dataCategory
            );

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $category->key,
                "activity_type" => "IMPORT",
                "data_type" => "CATEGORY",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    public function getCategoryParentName()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $master_category_level = $obj["master_category_level"];

        $getData = $this->BillingModal->getTableResults(
            "stores_category",
            "master_category_id",
            $master_category_level
        );

        $arr1 = json_decode(json_encode($getData), true);
        $category_name = $arr1[0]["category_name"];

        $Result["name"] = $category_name;

        echo json_encode($Result);
    }

    //*** CATEGORY CODES END ***//

    //*** PRODUCTS CODES START ***//

    public function UpdateStoreProductsImage()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $product_uniq_slug_name = stripslashes(
            strtolower(preg_replace("#[ -]+#", "-", "New Update Image"))
        );
        $fname = $_FILES["product_new_image"]["name"][0];
        $tmp_name = $_FILES["product_new_image"]["tmp_name"][0];
        $arr = explode(".", $fname);
        $ext = end($arr);
        $extlower = strtolower($ext);
        $fnewname =
            $product_uniq_slug_name . md5(rand(1000, 9999)) . "." . $extlower;
            
        $baseUrl = $this->config->item('base_image_url');
        $imgName = $baseUrl . 'products/' . $fnewname;
        
        
        
        // $imgName =
        //     "https://admin.martpay.in/APP-API/Assets/products/" . $fnewname;

        $dataproducts = ["product_image" => $imgName];
        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            //  $oldimg = $_POST['product_image'];
            //  $newString = str_replace('https://admin.martpay.in/APP-API/Assets/products/', '', $oldimg);

            //  if(!empty($oldimg)){ unlink('Assets/products/'. $newString);}

            move_uploaded_file(
                $_FILES["product_new_image"]["tmp_name"][0],
                "Assets/products/" . $fnewname
            );

            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function UpdateStoreLogo()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $imgName = basename($_FILES["file"]["name"]);
        $tmp_name = basename($_FILES["file"]["tmp_name"]);
        $file_type = pathinfo($imgName, PATHINFO_EXTENSION);

        $data["image"] = date("YmdHis") . "." . $file_type;

        $img = htmlentities(rand(10000, 99999) . $data["image"]);
        
        $baseUrl = $this->config->item('base_image_url');
        $imgName = $baseUrl . 'Logo/' . $img;
        

        // $imgName = "https://admin.martpay.in/APP-API/Assets/Logo/" . $img;

        if ($_POST["logo"]) {
            $updated_data = [
                "logo" => $imgName,
            ];
        } elseif ($_POST["banner"]) {
            $updated_data = [
                "banner" => $imgName,
            ];
        } else {
            $updated_data = [];
        }

        $result = $this->BillingModal->updateData(
            "partner_bussiness_info",
            "store_id",
            $_POST["store_id"],
            $updated_data
        );

        if ($result) {
            $moved = move_uploaded_file(
                $_FILES["file"]["tmp_name"],
                "Assets/Logo/" . $img
            );

           if ($moved) {
    if (!empty($_POST["logo"])) {
        $oldimg = $_POST["old_logo"];
        $basePath = $this->config->item('base_image_url') . "Logo/";
        $newString = str_replace($basePath, "", $oldimg);

        if (!empty($oldimg) && file_exists("Assets/Logo/" . $newString)) {
            unlink("Assets/Logo/" . $newString);
        }
    } elseif (!empty($_POST["banner"])) {
        $old_banner = $_POST["old_banner"];
        $basePath = $this->config->item('base_image_url') . "Logo/";
        $newString1 = str_replace($basePath, "", $old_banner);

        if (!empty($old_banner) && file_exists("Assets/Logo/" . $newString1)) {
            unlink("Assets/Logo/" . $newString1);
        }
    }

    $Result["data"] = $storeCode;
    $Result["msg"]  = "InsertAndMove";
}
 else {
                $Result["data"] = $storeCode;
                $Result["msg"] = "InsertAndNotMove";
            }
        } else {
            $Result["msg"] = "NotInsert";
        }

        echo json_encode($imgName);
    }
    
    
      public function updateSlotConditionValue()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        
 

        $updated_data = [
            "min_order_value" => $_POST["min_order_value"],
            "distance_km" => $_POST["distance_km"],
            "minium_amount_free_del" => $_POST["minium_amount_free_del"],
            "delivery_charge" => $_POST["delivery_charge"],
            "time_hold_slot" => $_POST["time_hold_slot"],
            "today_close_time" => $_POST["today_close_time"],
            
          
        ];

        $result = $this->BillingModal->updateData(
            "delivery_charge_slots_condition",
            "id",
            $_POST["id"],
            $updated_data
        );

        if ($result) {
            $Result["respond"] = true;
        } else {
            $Result["respond"] = false;
        }

        echo json_encode($Result);
    }
    
    
    
  public function updateSlotStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        
         $value = $obj["value"];
         $status = 1;
         if($value=='Open'){
             $status = 1;
         }else {
             $status =0;
         }
        
        

        $updated_data = [
            "status" => $status,
          
        ];

        $result = $this->BillingModal->updateData(
            "store_delivery_slot",
            "id",
            $obj["SlotId"],
            $updated_data
        );

        if ($result) {
            $Result["respond"] = true;
        } else {
            $Result["respond"] = false;
        }

        echo json_encode($Result);
    }


  public function updateSlotId()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        
         $value = $obj["value"];
         $status = 1;
        
           switch ($value) {
               case "1 Hour Slot":
                 $status = 1;
                 break;
               case "2 Hour Slot":
                 $status = 2;
                 break;
               case "3 Hour Slot":
                 $status = 3;
                 break;
               case "4 Hour Slot":
                 $status = 4;
                 break;
               case "6 Hour Slot":
                 $status = 5;
                 break;
               case "8 Hour Slot":
                 $status = 6;
                 break;
               case "12 Hour Slot":
                 $status = 7;
                 break;
               case "1 Day Slot":
                 $status = 8;
                 break;
               
             }
        
        

        $updated_data = [
            "slotting_id" => $status,
          
        ];

        $result = $this->BillingModal->updateData(
            "delivery_charge_slots_condition",
            "id",
            $obj["SlotId"],
            $updated_data
        );

        if ($result) {
            $Result["respond"] = true;
        } else {
            $Result["respond"] = false;
        }

        echo json_encode($Result);
    }


    public function updatePartner()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $date = $obj["date"];

        $updated_data = [
            "buss_name" => $obj["buss_name"],
            "about_us" => $obj["about_us"],
            "tag_line" => $obj["tag_line"],
            "strteet_linn1" => $obj["strteet_linn1"],
            "strteet_linn2" => $obj["strteet_linn2"],
            "area" => $obj["area"],
            "pin_code" => $obj["pin_code"],
            "city" => $obj["city"],
            "state" => $obj["state"],
            "teliphone1" => $obj["teliphone1"],
            "teliphone2" => $obj["teliphone2"],
            "mobile1" => $obj["mobile1"],
            "mobile2" => $obj["mobile2"],
            "company_email" => $obj["company_email"],
            "website" => $obj["website"],
            "google_map_link" => $obj["google_map_link"],
            "facebook" => $obj["facebook"],
            "instagram" => $obj["instagram"],
            "linkedin" => $obj["linkedin"],
            "twitter" => $obj["twitter"],
            "lat" => $obj["lat"],
            "lng" => $obj["lng"],
            "gst_no" => $obj["gst_no"],
            "fassai_no" => $obj["fassai_no"],
            "shiiping" => $obj["shiiping"],
            "returns" => $obj["returns"],
            "terms" => $obj["terms"],
            "privacy" => $obj["privacy"],
            "minimum_order" => $obj["minimum_order"],
            "carry_bag_charge_minimum_qty" =>
                $obj["carry_bag_charge_minimum_qty"],
            "carry_bag_charge" => $obj["carry_bag_charge"],
            "shipping" => $obj["shipping"],
            "charges" => $obj["charges"],
             "not_taking_msg" => $obj["not_taking_msg"],
              "taking_km_distance" => $obj["taking_km_distance"],
        ];

        $result = $this->BillingModal->updateData(
            "partner_bussiness_info",
            "store_id",
            $obj["store_id"],
            $updated_data
        );

        if ($result) {
            $Result["respond"] = true;
        } else {
            $Result["respond"] = false;
        }

        echo json_encode($Result);
    }

    public function addStoreProducts()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $product_name = ucwords(
            preg_replace("/\s+/", " ", $_POST["product_name"])
        );
        $product_full_name = preg_replace(
            "/\s+/",
            " ",
            ucwords($_POST["product_name"]) .
                " " .
                $_POST["product_size"] .
                " " .
                $_POST["product_unit"]
        );

        $replaceand = str_replace("&", " and ", $product_full_name);
        $replaccommo = str_replace(",", " ", $replaceand);
        $replacthird = str_replace("'", " ", $replaccommo);
        $replacthird12 = str_replace("*", " into ", $replacthird);
        $replacthird13 = str_replace("(", "", $replacthird12);
        $replacthird14 = str_replace(")", "", $replacthird13);
        $final_name = str_replace("+", " plus ", $replacthird14);

        $s = $final_name;

        $tr = ["ş", "Ş", "ı", "İ", "ğ", "Ğ", "ü", "Ü", "ö", "Ö", "Ç", "ç"];
        $eng = ["s", "s", "i", "i", "g", "g", "u", "u", "o", "o", "c", "c"];
        $s = str_replace($tr, $eng, $s);
        $s = strtolower($s);
        $s = preg_replace("/&.+?;/", "", $s);
        $s = preg_replace("/[^%a-z0-9 _-]/", "", $s);
        $s = preg_replace("/\s+/", "-", $s);
        $s = preg_replace("|-+|", "-", $s);
        $product_uniq_slug_name = trim($s, "-");

        $fname = $_FILES["product_image"]["name"][0];
        $tmp_name = $_FILES["product_image"]["tmp_name"][0];
        $arr = explode(".", $fname);
        $ext = end($arr);
        $extlower = strtolower($ext);
        $fnewname =
            $product_uniq_slug_name . md5(rand(1000, 9999)) . "." . $extlower;
        $baseImageUrl = $this->config->item('base_image_url');
$imgName = $baseImageUrl . "products/" . $fnewname;

        $dataMasterProducts = [
            "product_name" => ucfirst(strtolower($product_name)),
            "product_full_name" => ucfirst(
                strtolower(
                    $product_name .
                        " " .
                        $_POST["product_size"] .
                        " " .
                        $_POST["product_unit"]
                )
            ),
            "product_uniq_slug_name" => $product_uniq_slug_name,
            "product_image" => $imgName,
            "product_type" => $_POST["product_type"],
            "parent_category_id" => $_POST["parent_category_id"],
            "parent_category_name" => $_POST["parent_category_name"],
            "category_id" => $_POST["category_id"],
            "child_category_name" => $_POST["child_category_name"],
            "brand_id" => $_POST["brand_id"],
            "brand_name" => $_POST["brand_name"],
            "purchase_price" => $_POST["purchase_price"],
            "price" => $_POST["price"],
            "discount_in_percent" => $_POST["discount_in_percent"],
            "discount_in_rs" => $_POST["discount_in_rs"],
            "sale_price" => $_POST["sale_price"],
            "product_size" => $_POST["product_size"],
            "product_unit" => $_POST["product_unit"],
            "product_bar_code" => $_POST["product_bar_code"],
            "deceptions" => $_POST["deceptions"],
            "hsn_code" => $_POST["hsn_code"],
            "i_gst" => $_POST["i_gst"],
            "c_gst" => $_POST["c_gst"],
            "s_gst" => $_POST["s_gst"],
            "margin_in_rs" => $_POST["margin_in_rs"],
            "add_date" => $date,
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "master_products",
            "product_uniq_slug_name",
            $product_uniq_slug_name,
            "product_type",
            $_POST["product_type"],
            null,
            null
        );

        if ($masterproductAvlCheak > 0) {
            $Result["is_master_product_alredy"] = 1;

            $storeproductAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_products",
                "product_uniq_slug_name",
                $product_uniq_slug_name,
                "product_type",
                $_POST["product_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeproductAvlCheak > 0) {
                $Result["is_product_alredy"] = 1;
            } else {
                $Result["is_product_alredy"] = 0;

                $dataproducts = [
                    "store_id" => $_POST["store_id"],
                    "product_name" => ucfirst(strtolower($product_name)),
                    "product_full_name" => ucfirst(
                        strtolower(
                            $product_name .
                                " " .
                                $_POST["product_size"] .
                                " " .
                                $_POST["product_unit"]
                        )
                    ),
                    "product_uniq_slug_name" => $product_uniq_slug_name,
                    "product_image" => $imgName,
                    "product_type" => $_POST["product_type"],
                    "parent_category_id" => $_POST["parent_category_id"],
                    "parent_category_name" => $_POST["parent_category_name"],
                    "category_id" => $_POST["category_id"],
                    "child_category_name" => $_POST["child_category_name"],
                    "brand_id" => $_POST["brand_id"],
                    "brand_name" => $_POST["brand_name"],
                    "purchase_price" => $_POST["purchase_price"],
                    "price" => $_POST["price"],
                    "discount_in_percent" => $_POST["discount_in_percent"],
                    "discount_in_rs" => $_POST["discount_in_rs"],
                    "sale_price" => $_POST["sale_price"],
                    "product_size" => $_POST["product_size"],
                    "product_unit" => $_POST["product_unit"],
                    "product_bar_code" => $_POST["product_bar_code"],
                    "deceptions" => $_POST["deceptions"],
                    "hsn_code" => $_POST["hsn_code"],
                    "i_gst" => $_POST["i_gst"],
                    "c_gst" => $_POST["c_gst"],
                    "s_gst" => $_POST["s_gst"],
                    "margin_in_rs" => $_POST["margin_in_rs"],
                    "add_date" => $date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_products",
                    $dataproducts
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }
        } else {
            $Result["is_master_product_alredy"] = 0;

            move_uploaded_file(
                $_FILES["product_image"]["tmp_name"][0],
                "Assets/products/" . $fnewname
            );
            $anyDataMaster = $this->BillingModal->insertData(
                "master_products",
                $dataMasterProducts
            );

            $count = 1;

            foreach (
                $_FILES["product_image"]["tmp_name"]
                as $key => $tmp_name
            ) {
                if ($key > 0) {
    $file_name = $_FILES["product_image"]["name"][$key];
    $file_tmp = $_FILES["product_image"]["tmp_name"][$key];
    $arr = explode(".", $file_name); // <-- use correct variable here
    $ext = end($arr);
    $extlower = strtolower($ext);
    $fnewname = $product_uniq_slug_name . md5(rand(1000, 9999)) . "." . $extlower;

    // Use base image URL from config
    $baseImageUrl = $this->config->item('base_image_url');
    $imgName = $baseImageUrl . "products/" . $fnewname;

    move_uploaded_file($file_tmp, "Assets/products/" . $fnewname);

    $images = [
        "store_id" => $_POST["store_id"],
        "product_uniq_slug_name" => $product_uniq_slug_name,
        "images" => $imgName,
    ];

    $anyDataImage = $this->BillingModal->insertData("stores_products_images", $images);
}


                $count++;
            }

            $storeproductAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_products",
                "product_uniq_slug_name",
                $product_uniq_slug_name,
                "product_type",
                $_POST["product_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeproductAvlCheak > 0) {
                $Result["is_product_alredy"] = 1;
            } else {
                $Result["is_product_alredy"] = 0;

                $dataproducts = [
                    "store_id" => $_POST["store_id"],
                    "product_name" => ucfirst(strtolower($product_name)),
                    "product_full_name" => ucfirst(
                        strtolower(
                            $product_name .
                                " " .
                                $_POST["product_size"] .
                                " " .
                                $_POST["product_unit"]
                        )
                    ),
                    "product_uniq_slug_name" => $product_uniq_slug_name,
                    "product_image" => $imgName,
                    "product_type" => $_POST["product_type"],
                    "parent_category_id" => $_POST["parent_category_id"],
                    "parent_category_name" => $_POST["parent_category_name"],
                    "category_id" => $_POST["category_id"],
                    "child_category_name" => $_POST["child_category_name"],
                    "brand_id" => $_POST["brand_id"],
                    "brand_name" => $_POST["brand_name"],
                    "purchase_price" => $_POST["purchase_price"],
                    "price" => $_POST["price"],
                    "discount_in_percent" => $_POST["discount_in_percent"],
                    "discount_in_rs" => $_POST["discount_in_rs"],
                    "sale_price" => $_POST["sale_price"],
                    "product_size" => $_POST["product_size"],
                    "product_unit" => $_POST["product_unit"],
                    "product_bar_code" => $_POST["product_bar_code"],
                    "deceptions" => $_POST["deceptions"],
                    "hsn_code" => $_POST["hsn_code"],
                    "i_gst" => $_POST["i_gst"],
                    "c_gst" => $_POST["c_gst"],
                    "s_gst" => $_POST["s_gst"],
                    "margin_in_rs" => $_POST["margin_in_rs"],
                    "add_date" => $date,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_products",
                    $dataproducts
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" =>
                $product_name .
                " " .
                $_POST["product_size"] .
                " " .
                $_POST["product_unit"],
            "activity_type" => "ADD",
            "data_type" => "PRODUCT",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }

    public function importStoreProduct()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $productData = $obj["Product"];

        foreach ($productData as $Products) {
            $Products = (object) $Products;

            $dataProducts = [
                "store_id" => $obj["store_id"],
                "product_name" => $Products->product_name,
                "product_uniq_slug_name" => $Products->product_uniq_slug_name,
                "product_full_name" => $Products->product_full_name,
                "product_image" => $Products->product_image,
                "product_type" => $Products->product_type,
                "parent_category_id" => $Products->parent_category_id,
                "category_id" => $Products->category_id,
                "brand_id" => $Products->brand_id,
                "price" => $Products->price,
                "discount_in_percent" => $Products->discount_in_percent,
                "discount_in_rs" => $Products->discount_in_rs,
                "purchase_price" => $Products->purchase_price,
                "sale_price" => $Products->sale_price,
                "product_size" => $Products->product_size,
                "product_unit" => $Products->product_unit,
                "product_bar_code" => $Products->product_bar_code,
                "deceptions" => $Products->deceptions,
                "hsn_code" => $Products->hsn_code,
                "i_gst" => $Products->i_gst,
                "c_gst" => $Products->c_gst,
                "s_gst" => $Products->s_gst,
                "margin_in_rs" => $Products->margin_in_rs,
                "add_date" => $Products->add_date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_products",
                $dataProducts
            );

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $Products->product_name,
                "activity_type" => "IMPORT",
                "data_type" => "PRODUCT",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        }

        if ($anyData) {
            $respond["success"] = true;
        } else {
            $respond["success"] = false;
        }

        echo json_encode($respond);
    }

    public function changeStoreProductStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "status" => $obj["statusModified"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $obj["product_id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
            
            
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }
    
    
    
       public function updateExpiryStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
             "settlement_date" => $date,
             "settlement_status" => 1,
        ];

        $resultQry = $this->BillingModal->updateData(
            "store_vendor_expory_record",
            "id",
            $obj["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
            
            
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }
    
    
    
    
       public function changeStoreOrderStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");
        
        $status = $obj["order_status"];
        $user_id = $obj["user_id"];
        
        $tokens = $this->BillingModal->getTableResults(
                "store_customer_mobile_token",
                "user_id",
                $user_id
            );

        $dataproducts = [
            "order_status" => $obj["order_status"],
            "new_order_status" => "0"
        ];
        
//         const radios = [
//     { name: "Placed", value: "Placed", variant: "dark" },
//     { name: "Confirmed", value: "Confirmed", variant: "success" },
//     {
//       name: "Preparing for dispatch",
//       value: "Preparing for dispatch",
//       variant: "warning",
//     },
//     { name: "On the way", value: "On the way", variant: "info" },
//     { name: "Delivered", value: "Delivered", variant: "primary" },
//     { name: "Canceled", value: "Canceled", variant: "danger" },
//   ];

     $baseUrl = $this->config->item('base_image_url');

if ($status == "Confirmed") {
    $img = $baseUrl . "notification/order_confirmed.png";
    $title = "Your order has been confirmed";
    $body = "Your order has been confirmed by SuperG.in, Thanks for shopping with us !!";

} else if ($status == "Preparing for dispatch") {
    $img = $baseUrl . "notification/order_prepaire.png";
    $title = "Your order is now preparing for dispatch";
    $body = "Thanks for shopping with us !!";

} else if ($status == "On the way") {
    $img = $baseUrl . "notification/ontheway.png";
    $title = "Your order is on the way";
    $body = "Thanks for shopping with us !!";

} else if ($status == "Delivered") {
    $img = $baseUrl . "notification/delivered.png";
    $title = "Your order has been delivered";
    $body = "Thanks for shopping with us !!";

} else if ($status == "Canceled") {
    $img = $baseUrl . "notification/order_canceled.png";
    $title = "Your order has been canceled";
    $body = "Kindly contact with SuperG.in team !!";

} else {
    $img = "https://www.superg.in/logo.png";
    $title = "SuperG.in";
    $body = "Shop with us";
}


        $resultQry = $this->BillingModal->updateData(
            "store_customer_purchase_record",
            "id",
            $obj["order_id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
            foreach ($tokens as $userToSend) {
                // $this->NotificationPrompt("Your order has been placed", "Wait for order confirmation !!", "https://admin.martpay.in/APP-API/Assets/notification/order_placed.png", $order_number, $userToSend->token);
                $this->NotificationPrompt($title, $body, $img, $obj["order_id"], $userToSend->token);
            }
            $Result["token"] = $tokens;
            
        } else {
            $Result["success"] = false;
            $Result["token"] = $tokens;
        }

        echo json_encode($Result);
    }
    
      public function changeStoreOrderAvlStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "avl_status" => $obj["avl_status"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "store_customer_purchase_record_products",
            "id",
            $obj["product_id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }
    
    
    

    public function changeStoreCouponStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "status" => $obj["statusModified"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "tbl_coupons",
            "coupon_id",
            $obj["coupon_id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function changeStoreBannerStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = ["status" => $obj["statusModified"]];

        $resultQry = $this->BillingModal->updateData(
            "store_banner",
            "id",
            $obj["banner_id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function changeStoreBrandStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = ["status" => $obj["statusModified"]];

        $resultQry = $this->BillingModal->updateData(
            "stores_brands",
            "master_brand_id",
            $obj["master_brand_id"],
            $dataproducts
        );

        if ($resultQry) {
            $store_stock_history = $this->BillingModal->getTableResults(
                "stores_products",
                "brand_id",
                $obj["master_brand_id"]
            );

            foreach ($store_stock_history as $row => $value) {
                $dataproducts1 = [
                    "status" => $obj["statusModified"],
                ];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $value->id,
                    $dataproducts1
                );
            }
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function changeStoreCategoryStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "status" => $obj["statusModified"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_category",
            "master_category_id",
            $obj["master_category_id"],
            $dataproducts
        );

        if ($resultQry) {
            $store_stock_history = $this->BillingModal->getTableResults(
                "stores_products",
                "category_id",
                $obj["master_category_id"]
            );

            foreach ($store_stock_history as $row => $value) {
                $dataproducts1 = [
                    "status" => $obj["statusModified"],
                ];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $value->id,
                    $dataproducts1
                );
            }
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function changeStoreMasterCategoryStatus()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = ["status" => $obj["statusModified"]];
        $resultQry = $this->BillingModal->updateData(
            "stores_category",
            "master_category_id",
            $obj["master_category_id"],
            $dataproducts
        );

        if ($resultQry) {
            $store_stock_history = $this->BillingModal->getTableResults(
                "stores_products",
                "parent_category_id",
                $obj["master_category_id"]
            );

            foreach ($store_stock_history as $row => $value) {
                $dataproducts1 = ["status" => $obj["statusModified"]];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $value->id,
                    $dataproducts1
                );
            }

            $store_stock_history1 = $this->BillingModal->getTableResults(
                "stores_category",
                "master_category_level",
                $obj["master_category_id"]
            );

            foreach ($store_stock_history1 as $row => $value) {
                $dataproducts12 = ["status" => $obj["statusModified"]];
                $resultQry1 = $this->BillingModal->updateData(
                    "stores_category",
                    "master_category_id",
                    $value->master_category_id,
                    $dataproducts12
                );

                if ($resultQry1) {
                    $store_stock_history = $this->BillingModal->getTableResults(
                        "stores_products",
                        "parent_category_id",
                        $value->master_category_id
                    );

                    foreach ($store_stock_history as $row => $value) {
                        $dataproducts132 = ["status" => $obj["statusModified"]];

                        $resultQry = $this->BillingModal->updateData(
                            "stores_products",
                            "id",
                            $value->id,
                            $dataproducts132
                        );
                    }
                }
            }

            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }

    public function deleteStoreDeliveryArea()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        // `stores_activity_record`(`id`, `store_id`, `user_id`, `activity_type`, `details`, `time`, `date`)

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $anyData = $this->BillingModal->DeleteFunction1Condition(
            $obj["table_name"],
            "id",
            $obj["del_id"]
        );

        if ($anyData) {
            $respond["delete"] = true;

            //  $dataCategory1 = array(
            //                         'store_id' => $obj['store_id'],
            //                         'user_id' =>$obj['adminId'],
            //                         'details' =>$obj['product_name'],
            //                         'activity_type' =>'DELETE',
            //                         'data_type'=>'PRODUCT',
            //                         'time' => $time,
            //                          'date' =>$date,

            //                              );

            //      $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);
        } else {
            $respond["delete"] = false;
        }
    }

    public function deleteStoreBanner()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        // `stores_activity_record`(`id`, `store_id`, `user_id`, `activity_type`, `details`, `time`, `date`)

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $anyData = $this->BillingModal->DeleteFunction1Condition(
            "store_banner",
            "id",
            $obj["banner_id"]
        );

     if ($anyData) {
    $oldimg = $obj["old_img"];

    // Get base image URL from config
    $baseImageUrl = $this->config->item('base_image_url');
    $bannerPath = $baseImageUrl . 'banner/';

    // Remove the base image URL from the full image path
    $newString = str_replace($bannerPath, '', $oldimg);

    if (!empty($oldimg)) {
        unlink("Assets/banner/" . $newString);
    }

    $respond["delete"] = true;
}
 else {
            $respond["delete"] = false;
        }

        echo json_encode($respond);
    }

    public function deleteStoreProduct()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        // `stores_activity_record`(`id`, `store_id`, `user_id`, `activity_type`, `details`, `time`, `date`)

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $anyData = $this->BillingModal->DeleteFunction1Condition(
            "stores_products",
            "id",
            $obj["delete_id"]
        );

        if ($anyData) {
            $respond["delete"] = true;

            $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["adminId"],
                "details" => $obj["product_name"],
                "activity_type" => "DELETE",
                "data_type" => "PRODUCT",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        } else {
            $respond["delete"] = false;
        }

        echo json_encode($respond);
    }

    public function UpdateStoreProductsInformation()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "parent_category_id" => $_POST["parent_category_id"],
            "parent_category_name" => $_POST["parent_category_name"],
            "category_id" => $_POST["category_id"],
            "child_category_name" => $_POST["child_category_name"],
            "brand_id" => $_POST["brand_id"],
            "brand_name" => $_POST["brand_name"],
            "product_size" => $_POST["product_size"],
            "product_unit" => $_POST["product_unit"],
            "deceptions" => $_POST["deceptions"],
            "purchase_price" => $_POST["purchase_price"],
            "price" => $_POST["price"],
            "discount_in_percent" => $_POST["discount_in_percent"],
            "discount_in_rs" => $_POST["discount_in_rs"],
            "sale_price" => $_POST["sale_price"],
            "hsn_code" => $_POST["hsn_code"],
            "product_bar_code" => $_POST["product_bar_code"],
            "i_gst" => $_POST["i_gst"],
            "c_gst" => $_POST["c_gst"],
            "s_gst" => $_POST["s_gst"],
            "margin_in_rs" => $_POST["margin_in_rs"],
            "update_date" => $date,
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        echo json_encode($Result);
    }
    
    
    
    public function UpdateStoreProductsPriceStaffApp()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "purchase_price" => $obj["purchase_price"],
            "price" => $obj["price"],
            "discount_in_percent" => $obj["discount_in_percent"],
            "discount_in_rs" => $obj["discount_in_rs"],
            "sale_price" => $obj["sale_price"],
            "product_bar_code" => $obj["product_bar_code"],
            "update_date" => $date,
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $obj["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        // $dataCategory1 = [
        //     "store_id" => $_POST["store_id"],
        //     "user_id" => $_POST["adminId"],
        //     "details" => "Price Change : " . $_POST["product_name"],
        //     "activity_type" => "UPDATE",
        //     "data_type" => "PRODUCT",
        //     "time" => $time,
        //     "date" => $date,
        // ];

        // $anyData = $this->BillingModal->insertData(
        //     "stores_activity_record",
        //     $dataCategory1
        // );

        echo json_encode($Result);
    }
    
    

    public function UpdateStoreProductsPrice()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "purchase_price" => $_POST["purchase_price"],
            "price" => $_POST["price"],
            "discount_in_percent" => $_POST["discount_in_percent"],
            "discount_in_rs" => $_POST["discount_in_rs"],
            "sale_price" => $_POST["sale_price"],
            "hsn_code" => $_POST["hsn_code"],
            "product_bar_code" => $_POST["product_bar_code"],
            "i_gst" => $_POST["i_gst"],
            "c_gst" => $_POST["c_gst"],
            "s_gst" => $_POST["s_gst"],
            "priority" => $_POST["priority"],
            "update_date" => $date,
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => "Price Change : " . $_POST["product_name"],
            "activity_type" => "UPDATE",
            "data_type" => "PRODUCT",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }

    public function UpdateStoreProductsStock()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "stock_quantity" => $_POST["stock_quantity"],
            "stok_warehouse_qty" => $_POST["stok_warehouse_qty"],
            "stock_alert_quantity" => $_POST["stock_alert_quantity"],
            "warehouse_stock_alert_quantity" =>
                $_POST["warehouse_stock_alert_quantity"],
            "update_date" => $date,
        ];

        $resultQry = $this->BillingModal->updateData(
            "stores_products",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" =>
                $_POST["resion_for_update"] .
                " : Stock Change : " .
                $_POST["product_name"],
            "activity_type" => $_POST["action"],
            "data_type" => "PRODUCT",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        $dataSTOCK_history = [
            "store_id" => $_POST["store_id"],
            "staff_id" => $_POST["adminId"],
            "product_name" => $_POST["product_name"],
            "product_id" => $_POST["id"],
            "coming_from" => $_POST["coming_from"],
            "going_to" => $_POST["going_to"],
            "quantity" => $_POST["quantity"],
            "action" => $_POST["action"],
            "resion" => $_POST["resion_for_update"],
            "time" => $time,
            "date" => $date,
        ];

        $store_stock_history = $this->BillingModal->insertData(
            "store_stock_history",
            $dataSTOCK_history
        );

        echo json_encode($Result);
    }

    //*** PRODUCTS CODES END ***//

    public function addStoreDeliveryBoy()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "bike_number" => $_POST["bike_number"],
            "bike_name" => $_POST["bike_name"],
            "join_date" => $date,
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "store_delivery_boy",
            "mobile",
            $_POST["mobile"]
        );

        if ($masterproductAvlCheak > 0) {
            $Result["is_vendor_alredy"] = 1;
        } else {
            $Result["is_vendor_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "store_delivery_boy",
                $dataMasterProducts
            );
        }

        //   $dataCategory1 = array(
        //                                 'store_id' => $_POST['store_id'],
        //                                 'user_id' =>$_POST['adminId'],
        //                                 'details' =>$vendor_name,
        //                                 'activity_type' =>'ADD',
        //                                 'data_type'=>'VENDOR',
        //                                 'time' => $time,
        //                                  'date' =>$date,

        //                                      );

        //              $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);

        echo json_encode($Result);
    }

    public function getCustomerBuyingDetails()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $cus_mobile = $obj["mobile"];
        $name = $obj["name"];
        $store_id = $obj["store_id"];
        
        if($name) {
            $getCustomer = $this->BillingModal->getRow("store_customer_list", "name", $name);
            $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
                "store_customer_list",
                "id",
                $getCustomer->id,
                "store_id",
                $store_id
            );
    
            if ($masterproductAvlCheak > 0) {
                $Result["customer_type"] = "OLD CUSTOMER";
    
                $totalShopingTime = $this->BillingModal->getNumberOfRow(
                    "store_customer_purchase_record",
                    "user_id",
                    $getCustomer->id,
                    "store_id",
                    $store_id
                );
                $Result["no_of_shopping_time"] = $totalShopingTime;
    
                $totalShopingValue = $this->BillingModal->getSumOfCollom(
                    "store_customer_purchase_record",
                    "total_payment",
                     "user_id",
                    $getCustomer->id,
                    "store_id",
                    $store_id
                );
                $Result["shopping_value"] = $totalShopingValue;
                $Result["customer"] = $getCustomer;
            } else {
                $Result["customer_type"] = "NEW CUSTOMER";
                $Result["no_of_shopping_time"] = 0;
                $Result["shopping_value"] = 0;
            }
        } else {
            $getCustomer = $this->BillingModal->getRow("store_customer_list", "mobile", $cus_mobile);
            $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
                "store_customer_list",
                "mobile",
                $cus_mobile,
                "store_id",
                $store_id
            );

        if ($masterproductAvlCheak > 0) {
            $Result["customer_type"] = "OLD CUSTOMER";

            $totalShopingTime = $this->BillingModal->getNumberOfRow(
                "store_customer_purchase_record",
                "customer_mobile",
                $cus_mobile,
                "store_id",
                $store_id
            );
            $Result["no_of_shopping_time"] = $totalShopingTime;

            $totalShopingValue = $this->BillingModal->getSumOfCollom(
                "store_customer_purchase_record",
                "total_payment",
                "customer_mobile",
                $cus_mobile,
                "store_id",
                $store_id
            );
            $Result["shopping_value"] = $totalShopingValue;
            $Result["customer"] = $getCustomer;
        } else {
            $Result["customer_type"] = "NEW CUSTOMER";
            $Result["no_of_shopping_time"] = 0;
            $Result["shopping_value"] = 0;
        }
        }

        

        echo json_encode($Result);
    }

    public function cheakUserUsedCouponApp()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $currentDate = date("Y-m-d");

        $cus_mobile = $obj["mobile"];
        $store_id = $obj["store_id"];
        $coupon_id = $obj["coupon"];

        $data = $this->BillingModal->getTableResults(
            "tbl_coupons",
            "coupon_code",
            $coupon_id,
            "store_id",
            $store_id
        );

        if ($data) {
            $arr = json_decode(json_encode($data), true);
            $start_date = $arr[0]["start_date"];
            $end_date = $arr[0]["end_date"];
            $coupon_id = $arr[0]["coupon_id"];

            if ($end_date < $currentDate) {
                $Result["status"] = "expaird";
            } else {
                $Result["status"] = "vailed";
                $dataaa = $this->BillingModal->getNumberOfRow(
                    "coupon_used_customer",
                    "customer_mobile",
                    $cus_mobile,
                    "coupon_code",
                    $coupon_id,
                    "store_id",
                    $store_id
                );

                if ($dataaa) {
                    $Result["userStatus"] = "used";
                } else {
                    $Result["data"] = $arr;
                }
            }
        } else {
            $Result["status"] = "NoCoupon";
        }

        //           $masterproductAvlCheak = $this->BillingModal->getNumberOfRow('coupon_used_customer','customer_mobile',$cus_mobile,'coupon_code',$coupon_id,'store_id',$store_id);

        //           if($masterproductAvlCheak>0)
        //           {

        //                         $Result['userStatus'] = 'used';

        //           }
        //           else
        //           {

        //               $data = $this->BillingModal->getTableResults('tbl_coupons','coupon_code',$coupon_id,'store_id',$store_id);

        //             $Result['userStatus'] = 0;
        //             $Result['data'] = $data;
        //           }

        //     echo json_encode($Result);
        //   }

        //   public function cheakUserUsedCoupon() {

        //     $json = file_get_contents('php://input');
        //     $obj = json_decode($json,true);

        //           $cus_mobile = $obj['mobile'];
        //           $store_id = $obj['store_id'];
        //           $coupon_id= $obj['coupon_id'];

        //           $masterproductAvlCheak = $this->BillingModal->getNumberOfRow('coupon_used_customer','customer_mobile',$cus_mobile,'coupon_id',$coupon_id,'store_id',$store_id);

        //           if($masterproductAvlCheak>0)
        //           {

        //                         $Result['coupon_used'] = 1;

        //           }
        //           else
        //           {

        //               $data = $this->BillingModal->getTableResults('tbl_coupons','coupon_id',$coupon_id,'store_id',$store_id);

        //             $Result['coupon_used'] = 0;
        //             $Result['coupon_data'] = $data[0];
        //           }

        echo json_encode($Result);
    }

    public function addStoreCouponCode()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "coupon_code" => $_POST["coupon_code"],
            "coupon_type" => $_POST["coupon_type"],
            "coupon_discount" => $_POST["coupon_discount"],
            "minimum_order_amount" => $_POST["minimum_order_amount"],
            "start_date" => $_POST["start_date"],
            "end_date" => $_POST["end_date"],
            "date_added" => $date,
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "tbl_coupons",
            "coupon_code",
            $_POST["coupon_code"]
        );

        if ($masterproductAvlCheak > 0) {
            $Result["is_vendor_alredy"] = 1;
        } else {
            $Result["is_vendor_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "tbl_coupons",
                $dataMasterProducts
            );
        }

        //   $dataCategory1 = array(
        //                                 'store_id' => $_POST['store_id'],
        //                                 'user_id' =>$_POST['adminId'],
        //                                 'details' =>$vendor_name,
        //                                 'activity_type' =>'ADD',
        //                                 'data_type'=>'VENDOR',
        //                                 'time' => $time,
        //                                  'date' =>$date,

        //                                      );

        //              $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);

        echo json_encode($Result);
    }


    //*** VENDOR CODES START ***//
    
    
    
         public function addStoreemployee()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $vendor_name = $_POST["name"];
        

        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "email" => $_POST["email"],
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "address" => $_POST["address"],
            "city" => $_POST["city"],
            "state" => $_POST["state"],
            "roal" => $_POST["roal"],
            "salary" => $_POST["salary"],
            "join_date" => $date,
            "join_time" => $time,
        ];
        
         $dataMasterlogin = [
            "store_id" => $_POST["store_id"],
            "email" => $_POST["email"],
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "password" => 12345,
            "store_type" => $_POST["store_type"],
            "roal" => $_POST["roal"],
            "join_date" => $date,
          
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "store_employee_list",
            "mobile",
            $_POST["mobile"]
        );
        
        

        if ($masterproductAvlCheak > 0) {
            
            $Result["is_employee_alredy"] = 1;
            
        } else {
            $Result["is_employee_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "store_employee_list",
                $dataMasterProducts
            );
            
            $anyDataMaster = $this->BillingModal->insertData(
                "master_admin_login",
                $dataMasterlogin
            );
            
            
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => $vendor_name,
            "activity_type" => "ADD",
            "data_type" => "EMPLOYEE",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }
    
    
        public function addStoreCustomer()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $vendor_name = $_POST["name"];
        

        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "provider" => 'Store',
            "provider_id" => $_POST["mobile"],
            "login_source" => 'Store',
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "address" => $_POST["address"],
            "city" => $_POST["city"],
            "state" => $_POST["state"],
            "pin_code" => $_POST["pin_code"],
            "join_date" => $date,
            "join_time" => $time,
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "store_customer_list",
            "mobile",
            $_POST["mobile"]
        );
        
        

        if ($masterproductAvlCheak > 0) {
            
            if($_POST["mobile"]=='NA' || $_POST["mobile"]=='na')
            {
                $Result["is_customer_alredy"] = 0;

               $anyDataMaster = $this->BillingModal->insertData(
                "store_customer_list",
                $dataMasterProducts
              ); 
            }
            else{
                $Result["is_customer_alredy"] = 1;
            }
            
        } else {
            $Result["is_customer_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "store_customer_list",
                $dataMasterProducts
            );
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => $vendor_name,
            "activity_type" => "ADD",
            "data_type" => "CUSTOMER",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }
    
    
    
        public function addStoreExpenses()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");


        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "type" => $_POST["type"],
            "payment_type" => $_POST["payment_type"],
            "amount" => $_POST["amount"],
            "notes" => $_POST["notes"],
            "date" => $date,
            "time" => $time,
        ];


       $anyDataMaster = $this->BillingModal->insertData(
                "store_expenses",
                $dataMasterProducts
            );

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => $_POST["type"]." Amt : ".$_POST["amount"],
            "activity_type" => "ADD",
            "data_type" => "EXPENSES",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }




    public function addStoreVendor()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $vendor_name = $_POST["name"] . " " . $_POST["firm_name"];

        $dataMasterProducts = [
            "store_id" => $_POST["store_id"],
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "address" => $_POST["address"],
            "firm_name" => $_POST["firm_name"],
            "phone" => $_POST["phone"],
            "contact_roal" => $_POST["contact_roal"],
            "city" => $_POST["city"],
            "pin_code" => $_POST["pin_code"],
            "firm_email" => $_POST["firm_email"],
            "gst_no" => $_POST["gst_no"],
            "fssai_no" => $_POST["fssai_no"],
            "deal_items" => $_POST["deal_items"],
            "add_date" => $date,
        ];

        $masterproductAvlCheak = $this->BillingModal->getNumberOfRow(
            "store_vendor_list",
            "mobile",
            $_POST["mobile"]
        );

        if ($masterproductAvlCheak > 0) {
            $Result["is_vendor_alredy"] = 1;
        } else {
            $Result["is_vendor_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "store_vendor_list",
                $dataMasterProducts
            );
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => $vendor_name,
            "activity_type" => "ADD",
            "data_type" => "VENDOR",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }

    public function deliveryPersoneUpdate()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "bike_name" => $_POST["bike_name"],
            "bike_number" => $_POST["bike_number"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "store_delivery_boy",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        //   $dataCategory1 = array(
        //                                 'store_id' => $_POST['store_id'],
        //                                 'user_id' =>$_POST['adminId'],
        //                                 'details' =>$_POST['firm_name'],
        //                                 'activity_type' =>'UPDATE',
        //                                 'data_type'=>'VENDOR',
        //                                 'time' => $time,
        //                                  'date' =>$date,

        //                                      );

        //              $anyData = $this->BillingModal->insertData("stores_activity_record", $dataCategory1);

        echo json_encode($Result);
    }

    public function vendorUpdate()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $dataproducts = [
            "name" => $_POST["name"],
            "mobile" => $_POST["mobile"],
            "address" => $_POST["address"],
            "firm_name" => $_POST["firm_name"],
            "phone" => $_POST["phone"],
            "contact_roal" => $_POST["contact_roal"],
            "city" => $_POST["city"],
            "pin_code" => $_POST["pin_code"],
            "firm_email" => $_POST["firm_email"],
            "gst_no" => $_POST["gst_no"],
            "fssai_no" => $_POST["fssai_no"],
             "deal_items" => $_POST["deal_items"],
        ];

        $resultQry = $this->BillingModal->updateData(
            "store_vendor_list",
            "id",
            $_POST["id"],
            $dataproducts
        );

        if ($resultQry) {
            $Result["success"] = true;
        } else {
            $Result["success"] = false;
        }

        $dataCategory1 = [
            "store_id" => $_POST["store_id"],
            "user_id" => $_POST["adminId"],
            "details" => $_POST["firm_name"],
            "activity_type" => "UPDATE",
            "data_type" => "VENDOR",
            "time" => $time,
            "date" => $date,
        ];

        $anyData = $this->BillingModal->insertData(
            "stores_activity_record",
            $dataCategory1
        );

        echo json_encode($Result);
    }

    //*** VENDOR CODES END ***//
    
        //*** Expiry CODES START ***//
    public function ExpiryStoreProducts()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");
        $order_id = strtoupper(
            $obj["store_id"] .
                $obj["vendor_id"] .
                $obj["user_id"] .
                date("dmY") .
                date("hiA") .
                rand(10000, 99999)
        );
        
       
        

        $no_of_items = count($obj["product_list"]);
        // insert purchase transation start
        $store_vendor_purchase_record = [
            "store_id" => $obj["store_id"],
            "vendor_id" => $obj["vendor_id"],
            "vendor_firm_name" => $obj["vendor_firm_name"],
            "sale_man_name" => $obj["sale_man_name"],
            "order_id" => $order_id,
            "user_id" => $obj["user_id"],
            "sub_total" => $obj["sub_total"],
           
            "notes" => $obj["notes"],
            "total_payment" => $obj["total_payment"],
           
            "purchaes_date" => $obj["purchaes_date"],
            "stock_location" => $obj["stock_location"],
            "no_of_items" => $no_of_items,
            "date" => $date,
            "time" => $time,
        ];

        $anyDataPurchaseInsert = $this->BillingModal->insertData(
            "store_vendor_expory_record",
            $store_vendor_purchase_record
        );


  
   
            

        if ($anyDataPurchaseInsert) {
            $respond["purchase_insert"] = true;

            // insert purchase product transation start

            $product_list = $obj["product_list"];

            $no = 1;
            foreach ($product_list as $product) {
                $product = (object) $product;

                $productdata = [
                    "store_id" => $obj["store_id"],
                    "vendor_id" => $obj["vendor_id"],
                    "order_id" => $order_id,
                    "user_id" => $obj["user_id"],
                    "product_id" => $product->id,
                    "product_full_name" => $product->product_full_name,
                    "mrp" => $product->mrp,
                    "quantity" => $product->billing_quantity,
                    "price" => $product->purchase_price,
                    "rate" => $product->rate,
                    "net_amount" => $product->net_amount,
                    "total_amount" => $product->amount_total,
                    "date" => $date,
                    "time" => $time,
                ];

                $anyDataProductInsert = $this->BillingModal->insertData(
                    "store_vendor_expory_record_products",
                    $productdata
                );

                //   insert purchase product transation end

                //   update product stock  start
                $getData = $this->BillingModal->getTableResults(
                    "stores_products",
                    "id",
                    $product->id
                );
                $arr1 = json_decode(json_encode($getData), true);
                $stock_quantity = $arr1[0]["stock_quantity"];
                $stok_warehouse_qty = $arr1[0]["stok_warehouse_qty"];
                $newstock_quantity = $stock_quantity;
                $newstok_warehouse_qty = $stok_warehouse_qty;

                if ($obj["stock_location"] == "Warehouse") {
                    $newstok_warehouse_qty =
                        $newstok_warehouse_qty - $product->billing_quantity;
                } else {
                    $newstock_quantity =
                        $newstock_quantity - $product->billing_quantity;
                }

                $updateproducts = [
                    "stock_quantity" => $newstock_quantity,
                    "stok_warehouse_qty" => $newstok_warehouse_qty,
                    "update_date" => $date,
                ];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $product->id,
                    $updateproducts
                );

                //   update product stock  end

                // insert stock  transation start

                $dataSTOCK_history = [
                    "store_id" => $obj["store_id"],
                    "staff_id" => $obj["user_id"],
                    "product_name" => $product->product_full_name,
                    "product_id" => $product->id,
                    "coming_from" => $obj["stock_location"],
                    "going_to" => $obj["vendor_firm_name"],
                    "quantity" => $product->billing_quantity,
                    "action" => "Expiry",
                    "resion" => "Return",
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_stock_history",
                    $dataSTOCK_history
                );

                // insert stock  transation end
                
                
                
                
                

                $no++;
            }

            if ($anyDataProductInsert) {
                $respond["purchase_product_insert"] = true;
            } else {
                $respond["purchase_product_insert"] = false;
            }
        } else {
            $respond["purchase_insert"] = false;
        }

        echo json_encode($respond);
    }

    //*** PURCHASE CODES END ***//

    //*** PURCHASE CODES START ***//
    public function purchaseStoreProducts()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");
        $order_id = strtoupper(
            $obj["store_id"] .
                $obj["vendor_id"] .
                $obj["user_id"] .
                date("dmY") .
                date("hiA") .
                rand(10000, 99999)
        );

        $no_of_items = count($obj["product_list"]);
        // insert purchase transation start
        $store_vendor_purchase_record = [
            "store_id" => $obj["store_id"],
            "vendor_id" => $obj["vendor_id"],
            "vendor_firm_name" => $obj["vendor_firm_name"],
            "sale_man_name" => $obj["sale_man_name"],
            "order_id" => $order_id,
            "user_id" => $obj["user_id"],
            "sub_total" => $obj["sub_total"],
            "i_gst" => $obj["i_gst"],
            "s_gst" => $obj["s_gst"],
            "c_gst" => $obj["c_gst"],
            "extra_charge" => $obj["extra_charge"],
            "discount" => $obj["discount"],
             "discount_cd" => $obj["discount_cd"],
            "notes" => $obj["notes"],
            "total_payment" => $obj["total_payment"],
            "amount_paid" => $obj["amount_paid"],
            "outstanding" => $obj["outstanding"],
            "payment_mode" => $obj["payment_mode"],
            "purchaes_date" => $obj["purchaes_date"],
            "stock_location" => $obj["stock_location"],
            "no_of_items" => $no_of_items,
            "date" => $date,
            "time" => $time,
        ];

        $anyDataPurchaseInsert = $this->BillingModal->insertData(
            "store_vendor_purchase_record",
            $store_vendor_purchase_record
        );


               // insert outstanding  transation start
if($obj["outstanding"]>=1)
{
       $store_vendor_outstanding_transation = [
                    "store_id" => $obj["store_id"],
                    "user_id" => $obj["user_id"],
                    "vendor_id" => $obj["vendor_id"],
                    "mobile" => $obj["vendor_mobile"],
                    "order_id" => $order_id,
                    "amount" => $obj["outstanding"],
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_vendor_credit_transation",
                    $store_vendor_outstanding_transation
                );
                
                
      //   update outstanding Amount   start
                $getOutStandingData = $this->BillingModal->getTableResults(
                    "store_vendor_list",
                    "id",
                    $obj["vendor_id"]
                );
                $arr1Dabit = json_decode(json_encode($getData), true);
                $dabit_Value = $arr1Dabit[0]["value_credit"];
                $newDabitValue = $dabit_Value + $obj["outstanding"];
                

                $updateVendorOutstanding = [
                    "value_credit" => $newDabitValue ];

                $resultQryOutStanding = $this->BillingModal->updateData(
                    "store_vendor_list",
                    "id",
                    $obj["vendor_id"],
                    $updateVendorOutstanding
                );

                //   update outstanding Amount  end
                
}

             
                // insert outstanding  transation end
                
                
                
        // insert purchase transation end
        
         $dataExpensses = [
            "store_id" => $obj["store_id"],
            "user_id" => $obj["user_id"],
            "type" => 'Purchase',
            "payment_type" => $obj["payment_mode"],
            "amount" => $obj["total_payment"],
            "notes" => $order_id,
            "date" => $date,
            "time" => $time,
        ];


       $anyDataMaster = $this->BillingModal->insertData(
                "store_expenses",
                $dataExpensses
            );
            
            
            

        if ($anyDataPurchaseInsert) {
            $respond["purchase_insert"] = true;

            // insert purchase product transation start

            $product_list = $obj["product_list"];

            $no = 1;
            foreach ($product_list as $product) {
                $product = (object) $product;

                $productdata = [
                    "store_id" => $obj["store_id"],
                    "vendor_id" => $obj["vendor_id"],
                    "order_id" => $order_id,
                    "user_id" => $obj["user_id"],
                    "product_id" => $product->id,
                    "product_full_name" => $product->product_full_name,
                    "mrp" => $product->mrp,
                    "quantity" => $product->billing_quantity,
                    "price" => $product->purchase_price,
                    "discount" => $product->discount_in_percent,
                    "gst" => $product->c_gst + $product->s_gst,
                    "c_gst" => $product->c_gst,
                    "s_gst" => $product->s_gst,
                    "rate" => $product->rate,
                    "net_amount" => $product->net_amount,
                    "hsn_code" => $product->hsn_code,
                    "total_amount" => $product->amount_total,
                    "date" => $date,
                    "time" => $time,
                ];

                $anyDataProductInsert = $this->BillingModal->insertData(
                    "store_vendor_purchase_record_products",
                    $productdata
                );

                //   insert purchase product transation end

                //   update product stock  start
                $getData = $this->BillingModal->getTableResults(
                    "stores_products",
                    "id",
                    $product->id
                );
                $arr1 = json_decode(json_encode($getData), true);
                $stock_quantity = $arr1[0]["stock_quantity"];
                $stok_warehouse_qty = $arr1[0]["stok_warehouse_qty"];
                $newstock_quantity = $stock_quantity;
                $newstok_warehouse_qty = $stok_warehouse_qty;

                if ($obj["stock_location"] == "Warehouse") {
                    $newstok_warehouse_qty =
                        $newstok_warehouse_qty + $product->billing_quantity;
                } else {
                    $newstock_quantity =
                        $newstock_quantity + $product->billing_quantity;
                }

                $updateproducts = [
                    "stock_quantity" => $newstock_quantity,
                    "stok_warehouse_qty" => $newstok_warehouse_qty,
                    "purchase_price" => $product->purchase_price,
                    "hsn_code" => $product->hsn_code,
                    "i_gst" => $product->c_gst + $product->s_gst,
                    "c_gst" => $product->c_gst,
                    "s_gst" => $product->s_gst,
                    "purchase_price" => $product->purchase_price,
                    "update_date" => $date,
                ];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $product->id,
                    $updateproducts
                );

                //   update product stock  end

                // insert stock  transation start

                $dataSTOCK_history = [
                    "store_id" => $obj["store_id"],
                    "staff_id" => $obj["user_id"],
                    "product_name" => $product->product_full_name,
                    "product_id" => $product->id,
                    "coming_from" => $obj["vendor_firm_name"],
                    "going_to" => $obj["stock_location"],
                    "quantity" => $product->billing_quantity,
                    "action" => "Purchase",
                    "resion" => "Buy",
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_stock_history",
                    $dataSTOCK_history
                );

                // insert stock  transation end
                
                
                
                
                

                $no++;
            }

            if ($anyDataProductInsert) {
                $respond["purchase_product_insert"] = true;
            } else {
                $respond["purchase_product_insert"] = false;
            }
        } else {
            $respond["purchase_insert"] = false;
        }

        echo json_encode($respond);
    }

    //*** PURCHASE CODES END ***//

    //*** SALE CODES START ***//

    public function getOnlineOrder()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $onlineSale = $this->BillingModal->getTableResultsOrderBy(
            "store_customer_purchase_record",
            "id",
            "DESC",
            "order_type",
            "online",
            "store_id",
            $obj["store_id"],
            "order_status",
            $obj["order_status"]
        );

        foreach ($onlineSale as $row => $value) {
            $getData = $this->BillingModal->getTableResults(
                "tbl_customers_address_book",
                "address_id",
                $value->customer_address_id
            );
            
            
            $getSlotsData = $this->BillingModal->getTableResults(
                "store_delivery_slot",
                "id",
                $value->delivery_slots
            );


            $arr2 = json_decode(json_encode($getSlotsData), true);
            
             $onlineSale[$row]->delivery_slots = $arr2[0]["slot_time_start"]." ".$arr2[0]["start_time_postfix"]." To ".$arr2[0]["slot_time_end"]." ".$arr2[0]["end_time_postfix"];

            $arr1 = json_decode(json_encode($getData), true);

            $onlineSale[$row]->customer_name = $arr1[0]["name"];
            $onlineSale[$row]->customer_phone = $arr1[0]["phone"];
            $onlineSale[$row]->customer_address =
                $arr1[0]["distance_km"] . " KM " . $arr1[0]["base_address"];
        }
        
        $lastRecord = $this->BillingModal->getLastRow("store_customer_purchase_record");
        $orders_with_status_1 = $this->BillingModal->getNumberOfRow("store_customer_purchase_record", "new_order_status", "1");

        $onlineSaleData = $onlineSale;
        if ($onlineSaleData == null) {
            $onlineSaleData = [];
        }

        $data["online_order"] = $onlineSaleData;
        $data["last_record"] = $lastRecord;
        $data["new_orders"] = $orders_with_status_1;
        
        

        echo json_encode($data);
    }



    public function getProductBySubcategory()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $order_details = $this->BillingModal->getTableResultsOrderBy(
            "stores_products",
            "id",
            "DESC",
            "category_id",
            $obj["subcatID"]
        );
        $data["products"] = $order_details;
        
        

        echo json_encode($data);
    }




    public function getOnlineOrderDetails()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $order_details = $this->BillingModal->getTableResultsOrderBy(
            "store_customer_purchase_record",
            "id",
            "DESC",
            "order_id",
            $obj["orderID"]
        );
        $data["order_details"] = $order_details[0];
        
         $arr1 = json_decode(json_encode($order_details), true);
        
        $slots_id = $arr1[0]['delivery_slots'];
        
        
            $getSlotsData = $this->BillingModal->getTableResults(
                "store_delivery_slot",
                "id",$slots_id);


            $arr2 = json_decode(json_encode($getSlotsData), true);
            
             $data["delivery_slots"]  = $arr2[0]["slot_time_start"]." ".$arr2[0]["start_time_postfix"]." To ".$arr2[0]["slot_time_end"]." ".$arr2[0]["end_time_postfix"];

        
        

        $getSum = $this->BillingModal->getSumOfNotAvilable($obj["orderID"]);
        $getSumProd = $this->BillingModal->getSumOfNotAvilableProduct($obj["orderID"]);
        $getSumOfProducts = 0;
        
        foreach ($getSumProd as $product) {
            
            if((int)$product->not_avl_qty > (int)$product->quantity) {
                $qty = (int)$product->quantity;
            // $getSumOfProducts ="if ------ $product->not_avl_qty ------ $product->quantity";
            } else {
            // $getSumOfProducts = "else -------$product->not_avl_qty ------ $product->quantity";
                $qty = (int)$product->not_avl_qty;
            }
            
            
            
            $getSumOfProducts += $qty * (int)$product->sale_price;
            
        }
        
        $order_products_details = $this->BillingModal->getTableResults(
            "store_customer_purchase_record_products",
            "order_id",
            $obj["orderID"]
        );
        
        $data["order_products_details"] = $order_products_details;

        $customer_address_details = $this->BillingModal->getTableResults(
            "tbl_customers_address_book",
            "address_id",
            $obj["customer_address"]
        );
        $data["customer_address_details"] = $customer_address_details[0];
        
        
           $businessInfo = $this->BillingModal->getTableResults(
            "partner_bussiness_info","store_id",
            $obj["store_id"]
        );
        
        
        // Get orderID from object
$orderID = $obj["orderID"];

// Step 1: Get customer_id from purchase record
$this->db->select('customer_id');
$this->db->from('store_customer_purchase_record');
$this->db->where('order_id', $orderID);
$query = $this->db->get();

if ($query->num_rows() > 0) {
    $customer_id = $query->row()->customer_id;

    // Step 2: Get full customer details
    $this->db->select('*');
    $this->db->from('store_customer_list');
    $this->db->where('id', $customer_id);
    $customerQuery = $this->db->get();

    if ($customerQuery->num_rows() > 0) {
        $data["customer_details"] = $customerQuery->row_array();  // ✅ store in data array
    } else {
        $data["customer_details"] = [];
    }
} else {
    $data["customer_details"] = [];
}

        
        $updatedData = ["new_order_status" => "0"];
        
        $resultQry = $this->BillingModal->updateData(
                    "store_customer_purchase_record",
                    "order_id",
                    $obj["orderID"],
                    $updatedData
                );
        
          $data["Store_bussiness_info"] = $businessInfo[0];
          
          $data['sumOfNotAvilable'] = (int)$getSum[0]->total_amount;
          $data['getSumOfProductNotAvilable'] = $getSumOfProducts;
          $data['seenResponse'] = $resultQry;
        
        

        echo json_encode($data);
    }

    public function SaleStoreProducts()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");
        $order_id = strtoupper(uniqid());

        $no_of_items = count($obj["product_list"]);
        // insert purchase transation start

        $amount_paid;
        if ($obj["amount_paid"] == null) {
            $amount_paid = 0;
        } else {
            $amount_paid = $obj["amount_paid"];
        }

        $store_vendor_purchase_record = [
            "store_id" => $obj["store_id"],
            "customer_mobile" => $obj["customer_mobile"],
            "order_id" => $order_id,
             "customer_id" => $obj["customer_id"],
            "user_id" => $obj["user_id"],
            "sub_total" => $obj["sub_total"],
            "i_gst" => $obj["i_gst"],
            "s_gst" => $obj["s_gst"],
            "c_gst" => $obj["c_gst"],
            "extra_charge" => $obj["extra_charge"],
            "discount" => $obj["discount"],
            "total_payment" => $obj["total_payment"],
            "grand_total" => $obj["total_payment"],
            "amount_paid" => $amount_paid,
            "outstanding" => $obj["outstanding"],
            "payment_mode" => $obj["payment_mode"],
            "purchaes_date" => date('Y-m-d H:i:s'),
            "stock_location" => $obj["stock_location"],
            "plateform" => "Store Billing",
            "no_of_items" => $no_of_items,
            "is_coupon_applied" => $obj["is_coupon_applied"],
            "coupon_discount_value" => $obj["coupon_discount_value"],
            "coupon_code" => $obj["coupon_code"],
            "coupon_id" => $obj["coupon_id"],
            "new_order_status" => "0",
            "date" => $date,
            "time" => $time,
        ];

        if ($obj["customer_type"] == "NEW CUSTOMER") {
            $Customerdataa = [
                "store_id" => $obj["store_id"],
                "provider" => "Store",
                "provider_id" => $obj["customer_mobile"],
                "login_source" => "Store",
                "mobile" => $obj["customer_mobile"],
                "join_date" => $date,
                "join_time" => $time,
            ];
            $customerAddData = $this->BillingModal->insertData(
                "store_customer_list",
                $Customerdataa
            );
        }

        $anyDataPurchaseInsert = $this->BillingModal->insertData(
            "store_customer_purchase_record",
            $store_vendor_purchase_record
        );
        
        
                     // insert outstanding  transation start
if($obj["outstanding"]>=1)
{
    

       $store_vendor_outstanding_transation = [
                    "store_id" => $obj["store_id"],
                    "user_id" => $obj["user_id"],
                    "customer_id" => $obj["customer_id"],
                    "mobile" => $obj["customer_mobile"],
                    "order_id" => $order_id,
                    "amount" => $obj["outstanding"],
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_customer_outstanding_transation",
                    $store_vendor_outstanding_transation
                );
                
                
      //   update outstanding Amount   start
                $getOutStandingData = $this->BillingModal->getTableResults(
                    "store_customer_list",
                    "id",
                    $obj["customer_id"]
                );
                $arr1Dabit = json_decode(json_encode($getData), true);
                $dabit_Value = $arr1Dabit[0]["dabit_value"];
                $newDabitValue = $dabit_Value + $obj["outstanding"];
                

                $updateVendorOutstanding = [
                    "dabit_value" => $newDabitValue ];

                $resultQryOutStanding = $this->BillingModal->updateData(
                    "store_customer_list",
                    "id",
                    $obj["customer_id"],
                    $updateVendorOutstanding
                );

                //   update outstanding Amount  end
                
}


        

        // insert purchase transation end

        if ($anyDataPurchaseInsert) {
            $respond["purchase_insert"] = true;
            $respond["inserted_row"] = $this->BillingModal->getRow("store_customer_purchase_record","id",$anyDataPurchaseInsert);

            // insert purchase product transation start

            $product_list = $obj["product_list"];

            $no = 1;

            foreach ($product_list as $product) {
                $product = (object) $product;
                
            
                


                $productdata = [
                    "store_id" => $obj["store_id"],
                    "customer_mobile" => $obj["customer_mobile"],
                    "order_id" => $order_id,
                    "user_id" => $obj["user_id"],
                    "product_id" => $product->id,
                    "product_full_name" => $product->product_name." ".$product->product_size." ".$product->product_unit,
                     "product_name" => $product->product_name,
                      "product_size" => $product->product_size,
                       "product_unit" => $product->product_unit,
                    "product_img" => $product->product_image,
                    "quantity" => $product->billing_quantity,
                    "mrp" => $product->price,
                    "price" => $product->price,
                    "sale_price" => $product->sale_price,
                    "discount" => $product->discount_in_rs,
                    "gst" => $product->c_gst + $product->s_gst,
                    "c_gst" => $product->c_gst,
                    "s_gst" => $product->s_gst,
                    "hsn_code" => $product->hsn_code,
                    "total_amount" => $product->amount_total,
                    "parent_category_id" => $product->parent_category_id,
                    "category_id" => $product->category_id,
                    "brand_id" => $product->brand_id,
                    "plateform" => "Store Billing",
                    "date" => $date,
                    "time" => $time,
                ];

                $anyDataProductInsert = $this->BillingModal->insertData(
                    "store_customer_purchase_record_products",
                    $productdata
                );

                //   insert purchase product transation end

                //   update product stock  start
                $getData = $this->BillingModal->getTableResults(
                    "stores_products",
                    "id",
                    $product->id
                );
                $arr1 = json_decode(json_encode($getData), true);
                $stock_quantity = $arr1[0]["stock_quantity"];
                $newstock_quantity = $stock_quantity;

                $newstock_quantity =
                    $newstock_quantity - $product->billing_quantity;
                $updateproducts = ["stock_quantity" => $newstock_quantity];

                $resultQry = $this->BillingModal->updateData(
                    "stores_products",
                    "id",
                    $product->id,
                    $updateproducts
                );

                //   update product stock  end

                // insert stock  transation start

                $dataSTOCK_history = [
                    "store_id" => $obj["store_id"],
                    "staff_id" => $obj["user_id"],
                    "product_name" => $product->product_full_name,
                    "product_id" => $product->id,
                    "coming_from" => "Store",
                    "going_to" => "Customer",
                    "quantity" => $product->billing_quantity,
                    "action" => "Sale",
                    "resion" => "Store Billing",
                    "time" => $time,
                    "date" => $date,
                ];

                $store_stock_history = $this->BillingModal->insertData(
                    "store_stock_history",
                    $dataSTOCK_history
                );

                // insert stock  transation end

                $no++;
            }

            if ($anyDataProductInsert) {
                $respond["purchase_product_insert"] = true;
            } else {
                $respond["purchase_product_insert"] = false;
            }
        } else {
            $respond["purchase_insert"] = false;
        }

        echo json_encode($respond);
    }
    
    public function deleteLastSaleRow() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
         date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");
        
        
        $id = $obj['id'];
        
        $getRow = $this->BillingModal->getRow("store_customer_purchase_record","id", $id);
        
        $deleted = $this->BillingModal->DeleteFunction1Condition(
            "store_customer_purchase_record",
            "order_id",
            $getRow->order_id
        );
        
        $deletedProducts = $this->BillingModal->DeleteFunction1Condition(
            "store_customer_purchase_record_products",
            "order_id",
            $getRow->order_id
        );
        
        
          $dataCategory1 = [
                "store_id" => $obj["store_id"],
                "user_id" => $obj["user_id"],
                "details" => $getRow->order_id." Plateform ".$getRow->plateform." Total Bill ".$getRow->total_payment." Bill Date : ".$getRow->date,
                "activity_type" => "DELETE",
                "data_type" => "SALE",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
            
            
            
        if($deleted && $deletedProducts) {
            $response['deleted'] = true;
        } else {
            $response['deleted'] = false;
        }
        
        echo json_encode($response);
        
    }
    

    //*** SALE CODES END ***//

    //*** UNIT CODES START ***//

    public function addStoreUnits()
    {
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        date_default_timezone_set("Asia/Kolkata");
        $date = date("d-m-Y");
        $time = date("h:i A");

        $unit_name = preg_replace("/\s+/", " ", $_POST["unit_name"]);

        $dataMasterBrands = [
            "unit_type" => $_POST["unit_type"],
            "unit_name" => $unit_name,
        ];

        $masterBrandAvlCheak = $this->BillingModal->getNumberOfRow(
            "master_products_units",
            "unit_name",
            $unit_name,
            "unit_type",
            $_POST["unit_type"],
            null,
            null
        );

        if ($masterBrandAvlCheak > 0) {
            $Result["is_master_brand_alredy"] = 1;
            $getMasterBrandData = $this->BillingModal->getTableResults(
                "master_products_units",
                "unit_name",
                $unit_name,
                "unit_type",
                $_POST["unit_type"],
                null,
                null
            );

            $storeBrandAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_products_units",
                "unit_name",
                $unit_name,
                "unit_type",
                $_POST["unit_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeBrandAvlCheak > 0) {
                $Result["is_brand_alredy"] = 1;
            } else {
                $Result["is_brand_alredy"] = 0;

                $dataBrands = [
                    "store_id" => $_POST["store_id"],
                    "unit_type" => $_POST["unit_type"],
                    "unit_name" => $unit_name,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_products_units",
                    $dataBrands
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }
        } else {
            $Result["is_master_brand_alredy"] = 0;

            $anyDataMaster = $this->BillingModal->insertData(
                "master_products_units",
                $dataMasterBrands
            );

            $getMasterBrandData = $this->BillingModal->getTableResults(
                "master_products_units",
                "unit_name",
                $unit_name,
                "unit_type",
                $_POST["unit_type"],
                null,
                null
            );

            $storeBrandAvlCheak = $this->BillingModal->getNumberOfRow(
                "stores_products_units",
                "unit_name",
                $unit_name,
                "unit_type",
                $_POST["unit_type"],
                "store_id",
                $_POST["store_id"]
            );

            if ($storeBrandAvlCheak > 0) {
                $Result["is_brand_alredy"] = 1;
            } else {
                $Result["is_brand_alredy"] = 0;

                $dataBrands = [
                    "store_id" => $_POST["store_id"],

                    "unit_type" => $_POST["unit_type"],
                    "unit_name" => $unit_name,
                ];

                $anyData = $this->BillingModal->insertData(
                    "stores_products_units",
                    $dataBrands
                );

                if ($anyData) {
                    $Result["success"] = true;
                } else {
                    $Result["success"] = false;
                }
            }

            $dataCategory1 = [
                "store_id" => $_POST["store_id"],
                "user_id" => $_POST["adminId"],
                "details" => $unit_name,
                "activity_type" => "ADD",
                "data_type" => "UNIT",
                "time" => $time,
                "date" => $date,
            ];

            $anyData = $this->BillingModal->insertData(
                "stores_activity_record",
                $dataCategory1
            );
        }

        echo json_encode($Result);
    }

    //*** UNIT CODES END ***//
    
    
    // 
    
    public function VendorList() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);
        
        $storeVendorData = $this->BillingModal->getTableResults(
            "store_vendor_list","store_id",
            $obj["store_id"]
        );
        
        // $data["vendorLists"] = $storeVendorData;
        
        echo json_encode($storeVendorData);
        
    }
    
    public function CustomerList() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $store_customer_list = $this->BillingModal->getTableResults(
            "store_customer_list",
            "store_id",
            $obj["store_id"]
        );
        
        echo json_encode($store_customer_list);
        
    }
    
    
    public function BrandList() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $storeBrandsData = $this->BillingModal->getTableResults(
            "stores_brands",
            "store_id",
            $obj["store_id"]
        );
        
        // $data["vendorLists"] = $storeVendorData;
        
        echo json_encode($storeBrandsData);
        
    }
    
    public function CouponList() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        $Coupons = $this->BillingModal->getTableResults(
            "tbl_coupons",
            "store_id",
            $obj["store_id"]
        );
        
        // $data["vendorLists"] = $storeVendorData;
        
        echo json_encode($Coupons);
        
    }
    
    public function MasterDatas(){
        
        $json = file_get_contents('php://input'); 	
        $obj = json_decode($json,true);
        
        $masterBrandsData =    $this->ReloadModal->getTableResults('master_brands','id', 'DESC');
        $masterCategoryData =   $this->ReloadModal->getTableResults('master_category','id', 'DESC');
        $masterProductUnits =   $this->ReloadModal->getTableResults('master_products_units','id', 'DESC');
        $masterProductsData =   $this->ReloadModal->getTableResults('master_products','id', 'DESC');
            
        $data['masterBrandsData'] =   $masterBrandsData;
        $data['masterCategoryData'] = $masterCategoryData;
        $data['masterProductsData'] = $masterProductsData;
        $data['masterProductUnits'] = $masterProductUnits;

        echo json_encode($data);
    
    }
    
    
    
    // public function DashboardReports() {
        
    //     $json = file_get_contents("php://input");
    //     $obj = json_decode($json, true);
        
    //     $fake_unix_time = (int)time();
    //     $months = [1,2,3,4,5,6,7,8,9,10,11,12];
    //     $YEAR = 2024;
        
    //     $dataByMonths = [];
    //     $dataByWithoutMonths = [];
    //     $dataBycategorySellings = [];
    //     $dataBycategorySellingsName = [];
    //     $dataBycategorySellingsCount = [];
    //     $dataTopSellingProducts = [];
        
    //     // for year or month vise;
        
    //     $topSellingsProducts = $this->BillingModal->SIMPLE_QUERY("SELECT * FROM store_customer_purchase_record_products GROUP BY product_id");
        
    //     foreach ($topSellingsProducts as $tsp) {
    //         if($productId = $tsp->product_id != null) {
    //             $productId = $tsp->product_id;
    //             $rowByMonth = $this->BillingModal->SIMPLE_QUERY("SELECT SUM(quantity) AS sums FROM store_customer_purchase_record_products WHERE product_id = $productId" );
    //             $tsp->totalCount = $rowByMonth[0]->sums;
    //         } else {
    //             $tsp->totalCount = "Data not clear";
    //         }
    //         $dataTopSellingProducts[] = $tsp;
    //     }
        
    //     foreach ($months as $month) {
    //         $rowByMonth = $this->BillingModal->SIMPLE_QUERY_GET_ROWS("SELECT * FROM `store_customer_purchase_record` WHERE MONTH(purchaes_date) = $month  AND YEAR(purchaes_date) = $YEAR");
    //         $dataByMonths[] = [$month => $rowByMonth];
    //         array_push($dataByWithoutMonths, $rowByMonth);
    //         // $dataByWithoutMonths.push($rowByMonth);
    //     }

    //     $orderedNumRows = $this->BillingModal->getNumberOfRow(
    //         "store_customer_purchase_record",
    //          "store_id",
    //         $obj["store_id"],
    //          "ordered_date_unix <",
    //         "$fake_unix_time"
    //     );
        
    //     $fetchAllCategorys = $this->BillingModal->getTableResults(
    //         "stores_category",
    //          "store_id",
    //         $obj["store_id"],
    //          "master_category_level",
    //         "0"
    //     );
        
    //     foreach ($fetchAllCategorys as $cat) {
    //         $numberOfProductsSold = $this->BillingModal->getNumberOfRow(
    //             "store_customer_purchase_record_products",
    //              "store_id",
    //             $obj["store_id"],
    //              "parent_category_id",
    //             $cat->master_category_id
    //         );
    //         $dataBycategorySellings[] = [$cat->category_name => $numberOfProductsSold];
    //         $dataBycategorySellingsName[] = $cat->category_name;
    //         $dataBycategorySellingsCount[] = $numberOfProductsSold;
    //         // array_push($dataBycategorySellings, $rowByMonth);
    //     }
        
    //     $store_customer_list = $this->BillingModal->getNumberOfRow(
    //         "store_customer_list",
    //         "store_id",
    //         $obj["store_id"]
    //     );
        
    //     $totalAmount = $this->BillingModal->getSumOfCollom("store_customer_purchase_record", "total_payment");
        
    //     $data['totalOrdersCount'] = (int)$orderedNumRows;
    //     $data['totalCustomersCount'] = (int)$store_customer_list;
    //     $data['totalEarning'] = (int)$totalAmount;
    //     $data['byMonths'] = $dataByMonths;
    //     $data['ordersByWithoutMonths'] = $dataByWithoutMonths;
    //     $data['saleByCategorys'] = $dataBycategorySellings;
    //     $data['saleByCategorysName'] = $dataBycategorySellingsName;
    //     $data['saleByCategorysCount'] = $dataBycategorySellingsCount;
    //     $data['topSellingsProducts'] = $topSellingsProducts;
    //     $data['topSellingProducts'] = $dataTopSellingProducts;
        
    //     echo json_encode($data);
        
    // }
    
     /**
     * Main public function to generate and output the dashboard report as JSON.
     * It fetches data for KPIs, trends, comparisons, composition, and recent activities.
     */
    public function DashboardReports()
    {
        // --- CORS Headers ---
        // Allow requests from any origin. For production, you should restrict this to your frontend's actual domain.
        header("Access-Control-Allow-Origin: *"); 
        // Allow specific headers required for the request.
        header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
        // Specify the methods allowed when accessing the resource.
        header("Access-Control-Allow-Methods: POST, GET, OPTIONS");

        // Handle the browser's preflight 'OPTIONS' request.
        if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
            // Send the headers and exit script execution.
            exit(0);
        }
        // --- End CORS Headers ---
        
        // Set JSON response header
        header('Content-Type: application/json');
        
        try {
            // Get store_id from the POST request body
            $input = json_decode(file_get_contents('php://input'), true);
            $store_id = $input['store_id'] ?? null;
            
            if (!$store_id) {
                http_response_code(400); // Bad Request
                echo json_encode(['error' => 'Store ID is required']);
                return;
            }
            
            // Define date ranges for current and previous month comparisons
            // $current_date = date('Y-m-d');
            // $current_month_start = date('Y-m-01');
            // $previous_month_start = date('Y-m-01', strtotime('-1 month'));
            // $previous_month_end = date('Y-m-t', strtotime('-1 month'));
            
            $current_date = $input['start_date'] ?? date('d-m-Y');
            $current_month_end = $input['end_date'] ?? date('d-m-Y', strtotime('-30 days'));
            $end = new DateTime($current_month_end);
            $prev = new DateTime($current_date);
            $diff = $end->diff($prev)->days;
            $diff2 = $end->diff($prev)->days*2;
            $previous_month_start = $input['start_date'] ? date('d-m-Y', strtotime("-$diff days", strtotime($input['start_date']))) : date('d-m-Y', strtotime("-$diff days"));
            $previous_month_end = $input['end_date'] ? date('d-m-Y', strtotime("-$diff days", strtotime($input['end_date']))) : date('d-m-Y', strtotime("-$diff2 days"));
            // date('d-m-Y', strtotime('-30 days', strtotime($input['start_date'])));
            
            // $current_date = $input['start_date'] ?? date('d-m-Y');
            // $current_month_end = $input['end_date'] ?? date('d-m-Y', strtotime('-30 days'));
            // $previous_month_start =  $input['start_date'] ? date('d-m-Y', strtotime('$input["start_date"] -30 days')) : date('d-m-Y', strtotime('-30 days'));
            // $previous_month_end = $input['end_date'] ? date('d-m-Y', strtotime('$input["end_date"] -30 days')) : date('d-m-Y', strtotime('-60 days'));
            
            

            
            // Assemble all dashboard data from private helper methods
            $dashboard_data = [
                'kpis' => $this->getKPIData($store_id, $current_date, $current_month_end, $previous_month_start, $previous_month_end),
                // 'kpis' => $this->getKPIData($store_id, $current_month_start, $current_date, $previous_month_start, $previous_month_end),
                'stats' => $this->getStoreStatistics($store_id),
                'trends' => $this->getTrendData($store_id),
                'comparisons' => $this->getComparisonData($store_id),
                'composition' => $this->getCompositionData($store_id),
                'recent_activities' => $this->getRecentActivities($store_id),
                'best_selling_products' => $this->getBestSellingProducts($store_id, $current_date, $current_month_end, 20),
                // '$previous_month_start' => $previous_month_start,
                // '$previous_month_end' => $previous_month_end
            ];
            
            echo json_encode($dashboard_data);
            
        } catch (Exception $e) {
            http_response_code(500); // Internal Server Error
            echo json_encode(['error' => $e->getMessage()]);
        }
    }
    
    public function getStoreStatistics($store_id)
    {
    
        try {
    
            if (!$store_id) {
                echo json_encode(['status' => false, 'message' => 'Store ID is required']);
                return;
            }
    
            // 1️⃣ Total Products
            $total_products = $this->db->query("
                SELECT COUNT(*) as total 
                FROM stores_products 
                WHERE store_id = ? AND status = 1
            ", [$store_id])->row()->total;
            
            // 1️⃣ Total Brands
            $total_brands = $this->db->query("
                SELECT COUNT(*) as total 
                FROM stores_brands 
                WHERE store_id = ?
            ", [$store_id])->row()->total;
            
            // 1️⃣ Total Vendors
            $total_vendors = $this->db->query("
                SELECT COUNT(*) as total 
                FROM store_vendor_list 
                WHERE store_id = ?
            ", [$store_id])->row()->total;
    
            // 2️⃣ Total Categories (where master_category_level = 0 or NULL → Top Level Categories)
            $total_categories = $this->db->query("
                SELECT COUNT(*) as total 
                FROM stores_category 
                WHERE store_id = ? AND (master_category_level IS NULL OR master_category_level = 0) AND status = 1
            ", [$store_id])->row()->total;
    
            // 3️⃣ Total Subcategories (where master_category_level > 0 → Subcategories)
            $total_subcategories = $this->db->query("
                SELECT COUNT(*) as total 
                FROM stores_category 
                WHERE store_id = ? AND master_category_level > 0 AND status = 1
            ", [$store_id])->row()->total;
    
            // 4️⃣ Total Customers
            $total_customers = $this->db->query("
                SELECT COUNT(*) as total 
                FROM store_customer_list 
                WHERE store_id = ?
            ", [$store_id])->row()->total;
            
            // Offline Revenue
            $offline_revenue = $this->db->query("
                SELECT COALESCE(SUM(total_payment), 0) as revenue 
                FROM store_customer_purchase_record 
                WHERE store_id = ? AND plateform = ?
            ", [$store_id, "Store Billing"])->row()->revenue;
            
            // Online Revenue
            $online_revenue = $this->db->query("
                SELECT COALESCE(SUM(total_payment), 0) as revenue 
                FROM store_customer_purchase_record 
                WHERE store_id = ? AND plateform != ?
            ", [$store_id, "Store Billing"])->row()->revenue;
    
            // Final Response
            return [
                    'totalProducts' => intval($total_products),
                    'totalCategories' => intval($total_categories),
                    'totalSubcategories' => intval($total_subcategories),
                    'totalCustomers' => intval($total_customers),
                    'totalBrands' => intval($total_brands),
                    'totalVendors' => intval($total_vendors),
                    'offlineRevenue' => intval($offline_revenue),
                    'onlineRevenue' => intval($online_revenue)
                ];
    
        } catch (Exception $e) {
            echo json_encode(['status' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
        }
    }

    
    /**
     * Get Best Selling Products in a date range
     *
     * @param string $store_id
     * @param string $start_date (format: d-m-Y)
     * @param string $end_date (format: d-m-Y)
     * @param int $limit (optional) - number of top products to return
     * @return array
     */
    private function getBestSellingProducts($store_id, $start_date, $end_date, $limit = 10)
    {
        $query = $this->db->query("
            SELECT 
                p.*, 
                SUM(CAST(p.quantity AS UNSIGNED)) as total_qty_sold
            FROM store_customer_purchase_record_products p
            LEFT JOIN store_customer_purchase_record o 
                ON o.order_id = p.order_id
            WHERE p.store_id = ?
            AND STR_TO_DATE(o.date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
            GROUP BY p.product_id
            ORDER BY total_qty_sold DESC
            LIMIT ?
        ", [$store_id, $start_date, $end_date, $limit]);
    
        return $query->result_array();
    }

    
    /**
     * Calculates Key Performance Indicators (KPIs) for the dashboard based on the provided SQL schema.
     *
     * @param string $store_id The ID of the store.
     * @param string $current_start Start date for the current period.
     * @param string $current_end End date for the current period.
     * @param string $previous_start Start date for the previous period.
     * @param string $previous_end End date for the previous period.
     * @return array An array of KPI data.
     */
    private function getKPIData($store_id, $current_start, $current_end, $previous_start, $previous_end)
    {
        // --- Total Revenue ---
        // CORRECTED: Using `total_payment` as per the database schema.
        $current_revenue = $this->db->query("
            SELECT COALESCE(SUM(total_payment), 0) as revenue 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $current_start, $current_end])->row()->revenue;
        
        $previous_revenue = $this->db->query("
            SELECT COALESCE(SUM(total_payment), 0) as revenue 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $previous_start, $previous_end])->row()->revenue;
        
        // --- Conversions (based on sales) ---
        $current_conversions = $this->db->query("
            SELECT COUNT(*) as conversions 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $current_start, $current_end])->row()->conversions;
        
        // --- Number of Orders ---
        $current_orders = $this->db->query("
            SELECT COUNT(*) as total_orders 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $current_start, $current_end])->row()->total_orders;
    
        $previous_orders = $this->db->query("
            SELECT COUNT(*) as total_orders 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $previous_start, $previous_end])->row()->total_orders;
        
        // --- Number of New Customers ---
        $current_customers = $this->db->query("
            SELECT COUNT(DISTINCT customer_id) as total_customers 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $current_start, $current_end])->row()->total_customers;
    
        $previous_customers = $this->db->query("
            SELECT COUNT(DISTINCT customer_id) as total_customers 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $previous_start, $previous_end])->row()->total_customers;

        
        // NOTE: Conversion Rate KPI requires a `website_analytics` table to track visitors.
        $current_visitors = 0; // Placeholder
        $current_conversion_rate = $current_visitors > 0 ? ($current_conversions / $current_visitors) * 100 : 0;
        
        // NOTE: Website Traffic KPI also requires a `website_analytics` table.
        $current_traffic = 0; // Placeholder
        
        // --- Active Users (customers who made a purchase in the last 30 days) ---
        $active_users = $this->db->query("
            SELECT COUNT(DISTINCT customer_id) as users 
            FROM store_customer_purchase_record 
            WHERE store_id = ? AND STR_TO_DATE(date, '%d-%m-%Y') >= DATE_SUB(NOW(), INTERVAL 30 DAY)
        ", [$store_id])->row()->users;
        
        // NOTE: Leads KPI requires a `leads` table.
        $current_leads = 0; // Placeholder
        
        // NOTE: Cost Per Acquisition (CPA) KPI requires a `marketing_expenses` table.
        $marketing_spend = 0; // Placeholder
        $cpa = $current_conversions > 0 ? $marketing_spend / $current_conversions : 0;
        
        // --- Churn Rate (Customers who haven't purchased in the last 90 days) ---
        $total_customers = $this->db->query("
            SELECT COUNT(DISTINCT provider_id) as total 
            FROM store_customer_list 
            WHERE store_id = ? AND STR_TO_DATE(join_date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $current_start, $current_end])->row()->total;
        
        $previous_total_customers = $this->db->query("
            SELECT COUNT(DISTINCT provider_id) as total 
            FROM store_customer_list 
            WHERE store_id = ? AND STR_TO_DATE(join_date, '%d-%m-%Y') BETWEEN STR_TO_DATE(?, '%d-%m-%Y') AND STR_TO_DATE(?, '%d-%m-%Y')
        ", [$store_id, $previous_start, $previous_end])->row()->total;
        
        $churned_customers = $this->db->query("
            SELECT COUNT(DISTINCT s1.customer_id) as churned 
            FROM store_customer_purchase_record s1 
            WHERE s1.store_id = ? 
            AND NOT EXISTS (
                SELECT 1 FROM store_customer_purchase_record s2 
                WHERE s2.customer_id = s1.customer_id 
                AND s2.store_id = ?
                AND STR_TO_DATE(s2.date, '%d-%m-%Y') >= DATE_SUB(?, INTERVAL 90 DAY)
            )
        ", [$store_id, $store_id, $current_end])->row()->churned;
        
        $churn_rate = $total_customers > 0 ? ($churned_customers / $total_customers) * 100 : 0;
        
        // NOTE: Net Promoter Score (NPS) KPI requires a `customer_reviews` table.
        $nps = 0; // Placeholder
        
        // Assemble the final KPI data array
        return [
            'totalRevenue' => [
                'current' => floatval($current_revenue),
                'previous' => floatval($previous_revenue),
                'change' => $previous_revenue > 0 ? (($current_revenue - $previous_revenue) / $previous_revenue) * 100 : ($current_revenue > 0 ? 100 : 0)
            ],
             'totalOrders' => [
                'current' => intval($current_orders),
                'previous' => intval($previous_orders),
                'change' => $previous_orders > 0 ? (($current_orders - $previous_orders) / $previous_orders) * 100 : ($current_orders > 0 ? 100 : 0)
            ],
            'totalCustomers' => [
                'current' => intval($total_customers),
                'previous' => intval($previous_total_customers),
                'change' => $previous_total_customers > 0 ? (($current_customers - $previous_total_customers) / $previous_total_customers) * 100 : ($current_customers > 0 ? 100 : 0)
            ],
            'conversionRate' => ['current' => round($current_conversion_rate, 2), 'previous' => 0, 'change' => 0],
            'websiteTraffic' => ['current' => intval($current_traffic), 'previous' => 0, 'change' => 0],
            'leads' => ['current' => intval($current_leads), 'previous' => 0, 'change' => 0],
            'cpa' => ['current' => round($cpa, 2), 'previous' => 0, 'change' => 0],
            'activeUsers' => ['current' => intval($active_users), 'previous' => 0, 'change' => 0],
            'churnRate' => ['current' => round($churn_rate, 2), 'previous' => 0, 'change' => 0],
            'nps' => ['current' => round($nps, 1), 'previous' => 0, 'change' => 0]
        ];
    }
    
    /**
     * Fetches trend data (revenue, orders, customers) for the last 12 months.
     *
     * @param string $store_id The ID of the store.
     * @return array An array of trend data.
     */
    private function getTrendData($store_id)
    {
        // CORRECTED: Using `total_payment` as per the database schema.
        $trend_data = $this->db->query("
            SELECT 
                DATE_FORMAT(STR_TO_DATE(date, '%d-%m-%Y'), '%Y-%m') as month,
                SUM(total_payment) as revenue,
                COUNT(DISTINCT order_id) as orders,
                COUNT(DISTINCT customer_id) as customers
            FROM store_customer_purchase_record 
            WHERE store_id = ? 
            AND STR_TO_DATE(date, '%d-%m-%Y') >= DATE_SUB(NOW(), INTERVAL 12 MONTH)
            GROUP BY DATE_FORMAT(STR_TO_DATE(date, '%d-%m-%Y'), '%Y-%m')
            ORDER BY month;
        ", [$store_id])->result_array();
        
        $revenue_array = array_map('floatval', array_column($trend_data, 'revenue'));
        $orders_array = array_map('intval', array_column($trend_data, 'orders'));
        $customers_array = array_map('intval', array_column($trend_data, 'customers'));
        $labels_array = array_column($trend_data, 'month');
        
        $total_revenue = array_sum($revenue_array);
        $total_orders = array_sum($orders_array);
        $total_customers = array_sum($customers_array);
        
        // Prepare data for charting
        return [
            'revenue' => $revenue_array,
            'orders' => $orders_array,
            'customers' => $customers_array,
            'labels' => $labels_array,
            'totalRevenue' => round($total_revenue, 2),
            'totalOrders' => $total_orders,
            'totalCustomers' => $total_customers
        ];
    }
    
    /**
     * Fetches comparison data, such as revenue by product category.
     *
     * @param string $store_id The ID of the store.
     * @return array An array of comparison data.
     */
    private function getComparisonData($store_id)
    {
        // --- Revenue by Product Category for the last 30 days ---
        $revenue_by_category = $this->db->query("
            SELECT 
                mc.category_name,
                SUM(srp.quantity * srp.price) as revenue
            FROM store_customer_purchase_record s
            JOIN store_customer_purchase_record_products srp ON s.order_id = srp.order_id
            JOIN stores_products mp ON srp.product_id = mp.id
            JOIN stores_category mc ON mp.category_id = mc.id
            WHERE s.store_id = ? 
            AND STR_TO_DATE(s.date, '%d-%m-%Y') >= DATE_SUB(NOW(), INTERVAL 30 DAY)
            GROUP BY mc.id, mc.category_name
            ORDER BY revenue DESC
            LIMIT 10
        ", [$store_id])->result_array();

        // NOTE: Marketing Channel Performance requires a `marketing_channel` column in the sales table.
        $channel_performance = []; // Placeholder
        
        return [
            'revenueByCategory' => $revenue_by_category,
            'channelPerformance' => $channel_performance
        ];
    }
    
    /**
     * Fetches data composition, such as customer demographics.
     *
     * @param string $store_id The ID of the store.
     * @return array An array of composition data.
     */
    private function getCompositionData($store_id)
    {
        // NOTE: Traffic Sources composition requires a `website_analytics` table.
        $traffic_sources = []; // Placeholder

        // NOTE: Customer Demographics (Age) requires an `age` column in the customer table.
        $demographics = []; // Placeholder
        
        return [
            'trafficSources' => $traffic_sources,
            'demographics' => $demographics
        ];
    }
    
    /**
     * Fetches recent activities, such as the last 10 sales.
     *
     * @param string $store_id The ID of the store.
     * @return array An array of recent activities.
     */
    private function getRecentActivities($store_id)
    { 
        // CORRECTED: Using `master_customer` table and `customer_name` column for customer details.
        $recent_sales = $this->db->query("
            SELECT 
                s.order_id as id,
                s.total_payment,
                s.date as sale_date,
                c.provider_id as customer_name
            FROM store_customer_purchase_record s
            LEFT JOIN store_customer_list c ON s.customer_id = c.id
            WHERE s.store_id = ?
            ORDER BY STR_TO_DATE(date, '%d-%m-%Y') DESC, id DESC
            LIMIT 10
        ", [$store_id])->result_array();
        
        return [
            'recentSales' => $recent_sales
        ];
    }
    
     public function testingP() {
        
        $json = file_get_contents("php://input");
        $obj = json_decode($json, true);

        
        
        echo json_encode($obj);
        
    }
    
    // public function SendNotification () {
        
    //     $serviceAccount = json_decode(file_get_contents(__DIR__ . '/service-account.json'), true);
        
    //     $projectId = $serviceAccount['project_id'];
    //     $privateKey = $serviceAccount['private_key'];
    //     $clientEmail = $serviceAccount['client_email'];
        
    //     $now = time();
    //     $exp = $now + 3600; // 1 hour
        
    //     // JWT Header & Claims
    //     $header = [
    //         'alg' => 'RS256',
    //         'typ' => 'JWT'
    //     ];
    //     $claims = [
    //         'iss' => $clientEmail,
    //         'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
    //         'aud' => 'https://oauth2.googleapis.com/token',
    //         'iat' => $now,
    //         'exp' => $exp
    //     ];
        
    //     // Helper to base64url encode
    //     function base64url_encode($data) {
    //         return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
    //     }
        
    //     // Build JWT (Header.Payload)
    //     $jwtHeader = base64url_encode(json_encode($header));
    //     $jwtPayload = base64url_encode(json_encode($claims));
    //     $jwtToSign = $jwtHeader . '.' . $jwtPayload;
        
    //     // Sign the JWT using OpenSSL
    //     openssl_sign($jwtToSign, $signature, $privateKey, 'sha256WithRSAEncryption');
    //     $jwtSignature = base64url_encode($signature);
        
    //     // Full JWT
    //     $jwt = $jwtToSign . '.' . $jwtSignature;
        
    //     // Step 1: Get Access Token using JWT
    //     $tokenResponse = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
    //         'http' => [
    //             'method'  => 'POST',
    //             'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
    //             'content' => http_build_query([
    //                 'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    //                 'assertion'  => $jwt
    //             ])
    //         ]
    //     ]));
        
    //     $tokenData = json_decode($tokenResponse, true);
    //     $accessToken = $tokenData['access_token'] ?? null;
        
    //     if (!$accessToken) {
    //         die("Failed to get access token.");
    //     }
        
    //     // Step 2: Send FCM Notification
        
    //     $notification = [
    //         'message' => [
    //             'token' => "foozKQqBRWyd-3bez2Wk76:APA91bFnwSaSYwE_PAZGl1k6amPQqP6LIj_-sj9Wi0q4Bo0eUJgMJ1Lx3fCYpY-a0xvfYWiRNgmTFLpZFetTC8jIKzfbuvdtgk1dYjyrGdwPo1dRgNVEgYI",
    //             'notification' => [
    //                 'title' => 'Hello from Pure PHP',
    //                 'body' => 'This is a notification without any package!',
    //             ],
    //             // "priority" => "high",
    //             // "notification" => [
    //             //     "title" => $title,
    //             //     "body" => $body,
    //             //     "icon" => "https://superg.in/img/logo.svg",
    //             //     "sound" => "notification.mp3",
    //             //     "image" => $image,
    //             //     "visibility" => 1,
    //             //     "channel_id" => "superg",
    //             //     "default_vibrate_timings" => true,
    //             //     "default_light_settings" => true,
    //             //     "vibrate_timings" => ["3000"],
    //             // ],
    //             // "data" => [
    //             //     "url" => "https://android.superg.in/order/$order_number",
    //             //     "Nick" => "Mario",
    //             //     "Room" => "PortugalVSDenmark",
    //             //     "badge" => 1,
    //             //     "sound" => "1",
    //             //     "alert" => "Alert",
    //             // ],
    //         ],
    //     ];
        
    //     $headers = [
    //         "Authorization: Bearer " . $accessToken,
    //         "Content-Type: application/json"
    //     ];
        
    //     $ch = curl_init();
    //     curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send");
    //     curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    //     curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
    //     curl_setopt($ch, CURLOPT_POST, true);
    //     curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notification));
    //     $result = curl_exec($ch);
    //     curl_close($ch);
        
    //     return $result;


    // }
    
//     public function SendNotification($title, $body, $image, $order_number, $token) {
//             try {
//                 // Load service account
//                 $serviceAccountPath = __DIR__ . '/service-account.json';
//                 if (!file_exists($serviceAccountPath)) {
//                     return json_encode(['status' => false, 'error' => 'Service account JSON file not found.']);
//                 }
        
//                 $serviceAccount = json_decode(file_get_contents($serviceAccountPath), true);
        
//                 if (!$serviceAccount) {
//                     return json_encode(['status' => false, 'error' => 'Invalid service account JSON.']);
//                 }
        
//                 $projectId = $serviceAccount['project_id'] ?? null;
//                 $privateKey = $serviceAccount['private_key'] ?? null;
//                 $clientEmail = $serviceAccount['client_email'] ?? null;
        
//                 if (!$projectId || !$privateKey || !$clientEmail) {
//                     return json_encode(['status' => false, 'error' => 'Incomplete service account details.']);
//                 }
        
//                 $now = time();
//                 $exp = $now + 3600; // 1 hour
        
//                 $header = [
//                     'alg' => 'RS256',
//                     'typ' => 'JWT'
//                 ];
//                 $claims = [
//                     'iss' => $clientEmail,
//                     'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
//                     'aud' => 'https://oauth2.googleapis.com/token',
//                     'iat' => $now,
//                     'exp' => $exp
//                 ];
        
//                 function base64url_encode($data) {
//                     return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
//                 }
        
//                 $jwtHeader = base64url_encode(json_encode($header));
//                 $jwtPayload = base64url_encode(json_encode($claims));
//                 $jwtToSign = $jwtHeader . '.' . $jwtPayload;
        
//                 // Sign JWT
//                 if (!openssl_sign($jwtToSign, $signature, $privateKey, 'sha256WithRSAEncryption')) {
//                     return json_encode(['status' => false, 'error' => 'Failed to sign JWT token.']);
//                 }
        
//                 $jwtSignature = base64url_encode($signature);
//                 $jwt = $jwtToSign . '.' . $jwtSignature;
        
//                 // Get Access Token
//                 $tokenResponse = @file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
//                     'http' => [
//                         'method'  => 'POST',
//                         'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
//                         'content' => http_build_query([
//                             'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
//                             'assertion'  => $jwt
//                         ])
//                     ]
//                 ]));
        
//                 if (!$tokenResponse) {
//                     return json_encode(['status' => false, 'error' => 'Failed to retrieve access token from Google.']);
//                 }
        
//                 $tokenData = json_decode($tokenResponse, true);
//                 $accessToken = $tokenData['access_token'] ?? null;
        
//                 if (!$accessToken) {
//                     return json_encode(['status' => false, 'error' => 'Access token missing or invalid.']);
//                 }
        
//                 // Notification Payload
//                 $notification = [
//                     'message' => [
//                         'token' => $token,
//                         "notification" => [
//                             "title" => $title,
//                             "body" => $body,
//                             "image" => $image,
//                         ],
//                         "data" => [
//                             "url" => "https://android.superg.in/order/$order_number",
//                         ],
//                         'android' => [
//                             'priority' => 'HIGH', // 'NORMAL' or 'HIGH'
//                             'notification' => [
//                                 'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
//                                 'color' => '#FF0000',
//                                 'sound' => 'notification.mp3',
//                                 'tag' => 'promo',
//                             ],
//                         ],
//                     ],
//                 ];
        
//                 $headers = [
//                     "Authorization: Bearer " . $accessToken,
//                     "Content-Type: application/json"
//                 ];
        
//                 $ch = curl_init();
//                 curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send");
//                 curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
//                 curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
//                 curl_setopt($ch, CURLOPT_POST, true);
//                 curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notification));
//                 $result = curl_exec($ch);
        
//                 if (curl_errno($ch)) {
//                     $error = curl_error($ch);
//                     curl_close($ch);
//                     return json_encode(['status' => false, 'error' => 'cURL Error: ' . $error]);
//                 }
        
//                 $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
//                 curl_close($ch);
        
//                 if ($httpCode != 200) {
//                     return json_encode(['status' => false, 'http_code' => $httpCode, 'response' => $result]);
//                 }
        
//                 return json_encode(['status' => true, 'message' => 'Notification sent successfully.', 'response' => json_decode($result, true)]);
        
//             } catch (Exception $e) {
//                 return json_encode(['status' => false, 'error' => 'Exception: ' . $e->getMessage()]);
//             }
//         }

    
//     public function updateOrderStatus()
//     {  
//          // Allow requests from any origin. For production, you should restrict this to your frontend's actual domain.
//         header("Access-Control-Allow-Origin: *"); 
//         // Allow specific headers required for the request.
//         header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
//         // Specify the methods allowed when accessing the resource.
//         // header("Access-Control-Allow-Methods: POST, GET, OPTIONS");
//         header('Content-Type: application/json');
//         try {
//             $input = json_decode(file_get_contents('php://input'), true);
//             $store_id = $input['store_id'] ?? null;
//             $order_id = $input['order_id'] ?? null;
//             $new_status = $input['order_status'] ?? null;
    
//             // Allowed statuses
//             $allowed_statuses = [
//                 "Placed",
//                 "Confirmed",
//                 "Preparing for dispatch",
//                 "On the way",
//                 "Delivered",
//                 "Canceled"
//             ];
    
//             // Validate inputs
//             if (!$store_id || !$order_id || !$new_status) {
//                 echo json_encode(['status' => false, 'message' => 'Missing required parameters.']);
//                 return;
//             }
    
//             if (!in_array($new_status, $allowed_statuses)) {
//                 echo json_encode(['status' => false, 'message' => 'Invalid order status.']);
//                 return;
//             }
    
//             // Update query
//             $this->db->where('store_id', $store_id);
//             $this->db->where('order_id', $order_id);
//             $update = $this->db->update('store_customer_purchase_record', [
//                 'order_status' => $new_status
//             ]);
    
//             if ($update) {
                
//                  $baseUrl = $this->config->item('base_image_url');

//                 if ($new_status == "Confirmed") {
//                     $img = $baseUrl . "notification/order_confirmed.png";
//                     $title = "Your order has been confirmed";
//                     $body = "Your order has been confirmed by SuperG.in, Thanks for shopping with us !!";
                
//                 } else if ($new_status == "Preparing for dispatch") {
//                     $img = $baseUrl . "notification/order_prepaire.png";
//                     $title = "Your order is now preparing for dispatch";
//                     $body = "Thanks for shopping with us !!";
                
//                 } else if ($new_status == "On the way") {
//                     $img = $baseUrl . "notification/ontheway.png";
//                     $title = "Your order is on the way";
//                     $body = "Thanks for shopping with us !!";
                
//                 } else if ($new_status == "Delivered") {
//                     $img = $baseUrl . "notification/delivered.png";
//                     $title = "Your order has been delivered";
//                     $body = "Thanks for shopping with us !!";
                
//                 } else if ($new_status == "Canceled") {
//                     $img = $baseUrl . "notification/order_canceled.png";
//                     $title = "Your order has been canceled";
//                     $body = "Kindly contact with SuperG.in team !!";
                
//                 } else {
//                     $img = "https://www.superg.in/logo.png";
//                     $title = "SuperG.in";
//                     $body = "Shop with us";
//                 }
                
//                 $tokens = $this->BillingModal->getTableResults(
//                             "store_customer_mobile_token",
//                             "user_id",
//                             "2"
//                         );
                        
//                       $errors = [];
// $success = [];
                        
//                         // in foreach loop below
//                     // $this->NotificationPrompt($title, $body, $img, $obj["order_id"], $userToSend->token);
//                     // $new_noti = $this->SendNotification($title, $body, $img, $obj["order_id"], $userToSend->token);
//                     // $this->SendNotification($title, $body, $img, $input["order_id"], 'foozKQqBRWyd-3bez2Wk76:APA91bFnwSaSYwE_PAZGl1k6amPQqP6LIj_-sj9Wi0q4Bo0eUJgMJ1Lx3fCYpY-a0xvfYWiRNgmTFLpZFetTC8jIKzfbuvdtgk1dYjyrGdwPo1dRgNVEgYI');
                  
                  
//                 foreach ($tokens as $userToSend) {
                    
//                     $res = $this->SendNotification($title, $body, $img, $input['order_id'], $userToSend->token);
//                     $res = json_decode($resJson, true);  // Decode the JSON response into an array

//                     if (!empty($res['status']) && $res['status'] === true) {
//                         $success[] = [
//                             'token' => $userToSend->token,
//                             'response' => $res
//                         ];
//                     } else {
//                         $errors[] = [
//                             'token' => $userToSend->token,
//                             'error' => $res['error'] ?? $res['response'] ?? 'Unknown error',
//                             'full_response' => $res
//                         ];
//                     }
                    
//                     usleep(3000000);
                    
//                 }
                
                            
//                 echo json_encode(['status' => true, 'message' => 'Order status updated successfully.', "token" => $tokens, "notificationErrors" => $errors]);
//             } else {
//                 echo json_encode(['status' => false, 'message' => 'Failed to update order status.']);
//             }
    
//         } catch (Exception $e) {
//             echo json_encode(['status' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
//         }
//     }

        public function SendNotification($title, $body, $image, $order_number, $deviceToken, $accessToken, $projectId) {
            try {
                $notification = [
                    'message' => [
                        'token' => $deviceToken,
                        'notification' => [
                            'title' => $title,
                            'body' => $body,
                            'image' => $image,
                        ],
                        'data' => [
                            'url' => "https://android.superg.in/order/$order_number",
                        ],
                        'android' => [
                            'priority' => 'HIGH',
                            'notification' => [
                                'click_action' => 'FLUTTER_NOTIFICATION_CLICK',
                                'color' => '#FF0000',
                                'sound' => 'notification.mp3',
                                'tag' => 'promo',
                            ],
                        ],
                    ],
                ];
        
                $headers = [
                    "Authorization: Bearer " . $accessToken,
                    "Content-Type: application/json"
                ];
        
                $ch = curl_init();
                curl_setopt($ch, CURLOPT_URL, "https://fcm.googleapis.com/v1/projects/{$projectId}/messages:send");
                curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
                curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
                curl_setopt($ch, CURLOPT_POST, true);
                curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($notification));
                $result = curl_exec($ch);
        
                if (curl_errno($ch)) {
                    $error = curl_error($ch);
                    curl_close($ch);
                    return ['status' => false, 'error' => 'cURL Error: ' . $error];
                }
        
                $httpCode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
                curl_close($ch);
        
                if ($httpCode != 200) {
                    return ['status' => false, 'http_code' => $httpCode, 'response' => $result];
                }
        
                return ['status' => true, 'response' => json_decode($result, true)];
        
            } catch (Exception $e) {
                return ['status' => false, 'error' => 'Exception: ' . $e->getMessage()];
            }
        }
        
        public function getFirebaseAccessTokenAndProjectId() {
            $serviceAccountPath = __DIR__ . '/service-account.json';
            if (!file_exists($serviceAccountPath)) return [false, false];
        
            $serviceAccount = json_decode(file_get_contents($serviceAccountPath), true);
            if (!$serviceAccount) return [false, false];
        
            $privateKey = $serviceAccount['private_key'];
            $clientEmail = $serviceAccount['client_email'];
            $projectId = $serviceAccount['project_id'];
        
            $now = time();
            $exp = $now + 3600;
        
            $header = ['alg' => 'RS256', 'typ' => 'JWT'];
            $claims = [
                'iss' => $clientEmail,
                'scope' => 'https://www.googleapis.com/auth/firebase.messaging',
                'aud' => 'https://oauth2.googleapis.com/token',
                'iat' => $now,
                'exp' => $exp
            ];
        
            $jwtHeader = rtrim(strtr(base64_encode(json_encode($header)), '+/', '-_'), '=');
            $jwtPayload = rtrim(strtr(base64_encode(json_encode($claims)), '+/', '-_'), '=');
            $jwtToSign = $jwtHeader . '.' . $jwtPayload;
        
            openssl_sign($jwtToSign, $signature, $privateKey, 'sha256WithRSAEncryption');
            $jwtSignature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');
            $jwt = $jwtToSign . '.' . $jwtSignature;
        
            $tokenResponse = file_get_contents('https://oauth2.googleapis.com/token', false, stream_context_create([
                'http' => [
                    'method'  => 'POST',
                    'header'  => "Content-type: application/x-www-form-urlencoded\r\n",
                    'content' => http_build_query([
                        'grant_type' => 'urn:ietf:params:oauth:grant-type:jwt-bearer',
                        'assertion'  => $jwt
                    ])
                ]
            ]));
        
            $tokenData = json_decode($tokenResponse, true);
            $accessToken = $tokenData['access_token'] ?? false;
        
            return [$accessToken, $projectId];
        }
        
        public function updateOrderStatus() {
            header("Access-Control-Allow-Origin: *"); 
            header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");
            header('Content-Type: application/json');
        
            try {
                $input = json_decode(file_get_contents('php://input'), true);
                $store_id = $input['store_id'] ?? null;
                $order_id = $input['order_id'] ?? null;
                $this->db->where('order_id', $order_id);
                
                $this->db->limit(1);
                $query = $this->db->get('store_customer_purchase_record');
                $result = $query->row_array();
                
                $user_id = $result['user_id'] ?? null;
                $new_status = $input['order_status'] ?? null;
        
                $allowed_statuses = ["Placed", "Confirmed", "Preparing for dispatch", "On the way", "Delivered", "Canceled"];
        
                if (!$store_id || !$order_id || !$new_status || !in_array($new_status, $allowed_statuses)) {
                    echo json_encode(['status' => false, 'message' => 'Invalid or missing parameters.']);
                    return;
                }
        
                $this->db->where('store_id', $store_id);
                $this->db->where('order_id', $order_id);
                $update = $this->db->update('store_customer_purchase_record', ['order_status' => $new_status]);
        
                if (!$update) {
                    echo json_encode(['status' => false, 'message' => 'Failed to update order status.']);
                    return;
                }
        
                $baseUrl = $this->config->item('base_image_url');
                switch ($new_status) {
                    case "Confirmed":
                        $img = $baseUrl . "notification/order_confirmed.png";
                        $title = "Your order has been confirmed";
                        $body = "Your order has been confirmed by SuperG.in, Thanks for shopping with us !!";
                        break;
                    case "Preparing for dispatch":
                        $img = $baseUrl . "notification/order_prepaire.png";
                        $title = "Your order is now preparing for dispatch";
                        $body = "Thanks for shopping with us !!";
                        break;
                    case "On the way":
                        $img = $baseUrl . "notification/ontheway.png";
                        $title = "Your order is on the way";
                        $body = "Thanks for shopping with us !!";
                        break;
                    case "Delivered":
                        $img = $baseUrl . "notification/delivered.png";
                        $title = "Your order has been delivered";
                        $body = "Thanks for shopping with us !!";
                        break;
                    case "Canceled":
                        $img = $baseUrl . "notification/order_canceled.png";
                        $title = "Your order has been canceled";
                        $body = "Kindly contact with SuperG.in team !!";
                        break;
                    default:
                        $img = $baseUrl . "notification/default.png";
                        $title = "SuperG.in";
                        $body = "Shop with us";
                }
        
                $tokens = $this->BillingModal->getTableResults("store_customer_mobile_token", "user_id", $user_id);
        
                list($accessToken, $projectId) = $this->getFirebaseAccessTokenAndProjectId();
        
                if (!$accessToken || !$projectId) {
                    echo json_encode(['status' => false, 'message' => 'Failed to generate Firebase token.']);
                    return;
                }
        
                $errors = [];
                $success = [];
        
                foreach ($tokens as $userToSend) {
                    $res = $this->SendNotification($title, $body, $img, $order_id, $userToSend->token, $accessToken, $projectId);
        
                    if (!empty($res['status'])) {
                        $success[] = $res;
                    } else {
                        $errors[] = $res;
                    }
        
                    // usleep(300000);  // Small delay to avoid any rate limits
                }
        
                echo json_encode(['status' => true, 'message' => 'Order status updated.', 'success' => $success, 'errors' => $errors]);
        
            } catch (Exception $e) {
                echo json_encode(['status' => false, 'message' => 'Server Error: ' . $e->getMessage()]);
            }
        }


    
    // JUST TO FORMAT DATE IN REAL MYSQL FORMAT...
    
    // public function alterTableThings() {
    //     $json = file_get_contents("php://input");
    //     $obj = json_decode($json, true);
        
    //     $masterBrandsData = $this->ReloadModal->getTableResults('store_customer_purchase_record');
        
    //     foreach ($masterBrandsData as $row) {
            
    //         $str = $row->purchaes_date;
    //         $ok = explode("/", $str);
    //         $rev = array_reverse($ok);
    //         $newDate = join("-",$rev);
            
    //         $updateData = ["purchaes_date" => "$newDate"];
        
    //         $resultQry = $this->BillingModal->updateData(
    //             "store_customer_purchase_record",
    //             "id",
    //             $row->id,
    //             $updateData
    //         );
            
    //         echo "1";
    //     }
        
        
    // }
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    
    // 

    //  END BILLLING SOFTWARE CODE HERE
}
?>
