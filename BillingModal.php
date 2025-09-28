<?php 

class 	BillingModal extends CI_Model{
    
   function __construct() {
    parent::__construct();
    
}


// START BILLLING SOFTWARE CODE FROM HERE


 public function search($prompt, $limit = 10, $STORE_CODE)
    // okok
    {
        $this->db->where('store_id', $STORE_CODE);
        $this->db->select('*');
        $this->db->like('mobile',$prompt);
        $this->db->or_like('name',$prompt);
        $this->db->limit($limit);
        $query = $this->db->get("store_customer_list");
        return $query->result();
    }

    public function SIMPLE_QUERY($query) {
	      $query = $this->db->query($query);
	      return $query->result();
	   
	}

    public function SIMPLE_QUERY_GET_ROWS($query) {
    
	      $query = $this->db->query($query);
	      return $query->num_rows();
	   
	}


    public function getRow($table_name, $where, $where_query) {
      
        $this->db->where($where, $where_query);
        $query = $this->db->get($table_name);
        return $query->row();
        
	}

		   public function LoginPartner($mobile,$password)
   
	{
	      
	            $this->db->where('mobile',$mobile);
	            $this->db->where('password',$password);
           $query = $this->db->get('master_admin_login');
	       return $query->row();
	   
	}
		   public function getPartnerByPhone($Mobile)
   
	{
	       $this->db->where('mobile',$Mobile);
          $query = $this->db->get('master_admin_login');
	      return   $query->result();
	   
	}
	
	public function getSumOfNotAvilable($orderID) {
	    $query = $this->db->select_sum("store_customer_purchase_record_products.total_amount")
                  ->where("order_id", $orderID)
                  ->where("avl_status", "0")
                  ->get("store_customer_purchase_record_products");
        return $query->result();
	}
	
	
	public function getSumOfNotAvilableProduct($orderID) {
	    $this->db->where("order_id", $orderID);
	    $this->db->where('not_avl_qty !=',"0");
	    $this->db->where('avl_status !=',"0");
        $query = $this->db->get('store_customer_purchase_record_products');
        return $query->result();
	}
	
	
	
		  public function fetchNewOrders($id)

    {
        // $this->load->database();
        $query = $this->db->query("SELECT * FROM `store_customer_purchase_record` WHERE `id` > '$id' AND order_type != 'Offline' ORDER BY `id` DESC");

        return $query->result();

    }
	
		  public function getLastRow($table_name)

    {
        // $this->load->database();
        $query = $this->db->query("SELECT * FROM $table_name ORDER BY ID DESC LIMIT 1");

        return $query->row();

    }
    
    
		  public function insertData($table_name, $dataa)

    {
        $this->load->database();
        $this->db->insert($table_name, $dataa);

        return $this->db->insert_id();

    }
    
    
    			 public function getNumberOfRow(
    			        $table_name = null,
    			     $collom_name1 = null,
    			     $value1 = null,
    			     $collom_name2 = null,
    			     $value2 = null,
    			     $collom_name3 = null,
    			     $value3 = null)
   
	{
	    
          if($collom_name1!=null && $value1!=null){ $this->db->where($collom_name1,$value1);}
	      if($collom_name2!=null && $value2!=null){ $this->db->where($collom_name2,$value2);}
	      if($collom_name3!=null && $value3!=null){ $this->db->where($collom_name3,$value3);}
           $query = $this->db->get($table_name)->num_rows();;
	    
	     return $query;
	   	  
	   
	}
    
     public function getTableResultsOrderBy(
    			     $table_name = null,
    			     $order_by = null,
    			     $order_value = null,
    			     $collom_name1 = null,
    			     $value1 = null,
    			     $collom_name2 = null,
    			     $value2 = null,
    			     $collom_name3 = null,
    			     $value3 = null
    			     )
   
	{
	    
	  
	  
	      if($collom_name1!=null && $value1!=null){ $this->db->where($collom_name1,$value1);}
	      if($collom_name2!=null && $value2!=null){ $this->db->where($collom_name2,$value2);}
	      if($collom_name3!=null && $value3!=null){ $this->db->where($collom_name3,$value3);}



            $this->db->order_by($order_by, $order_value);
            // $this->db->limit(20);
           $query = $this->db->get($table_name);
	      return $query->result();
	   	  
	   
	}
	
	
	    
   public function recordByMonthYear($table_name,$order_by,$order_value,$collom,$value,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT * FROM $table_name 
        WHERE 
         $collom = '$value' AND
        YEAR(STR_TO_DATE(date, '%d-%m-%Y'))= '$year' AND
        MONTH(STR_TO_DATE(date, '%d-%m-%Y'))= '$month' ORDER BY $order_by $order_value
         ;
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
	
	   public function recordByMonthYearOnline($table_name,$order_by,$order_value,$collom,$value,$collom2,$value2,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT * FROM $table_name 
        WHERE 
         $collom = '$value' AND $collom2 = '$value2' AND
        YEAR(STR_TO_DATE(date, '%d-%m-%Y'))= '$year' AND
        MONTH(STR_TO_DATE(date, '%d-%m-%Y'))= '$month' ORDER BY $order_by $order_value
         ;
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
	
	   public function GroupByRecordByYear($table_name,$order_by,$order_value,$collom,$value,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT YEAR(STR_TO_DATE(date, '%d-%m-%Y')) AS 'year' FROM $table_name 
        WHERE 
         $collom = '$value' GROUP BY YEAR(STR_TO_DATE(date, '%d-%m-%Y')) ORDER BY $order_by $order_value
         ;
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
		   public function GroupByRecordByYearOnline($table_name,$order_by,$order_value,$collom,$value,$collom2,$value2,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT YEAR(STR_TO_DATE(date, '%d-%m-%Y')) AS 'year' FROM $table_name 
        WHERE 
         $collom = '$value' AND $collom2 = '$value2' GROUP BY YEAR(STR_TO_DATE(date, '%d-%m-%Y')) ORDER BY $order_by $order_value
         ;
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
	
			   public function GroupByRecordByMonthOnline($table_name,$order_by,$order_value,$collom,$value,$collom2,$value2,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT MONTH(STR_TO_DATE(date, '%d-%m-%Y')) AS 'month' FROM $table_name 
        WHERE 
         $collom = '$value' AND $collom2 = '$value2' AND YEAR(STR_TO_DATE(date, '%d-%m-%Y')) = '$year' GROUP BY MONTH(STR_TO_DATE(date, '%d-%m-%Y'))   ORDER BY $order_by $order_value
         ;
        
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
	
		   public function GroupByRecordByMonth($table_name,$order_by,$order_value,$collom,$value,$month,$year)
   
	{
	    


        $query =  $this->db->query("SELECT MONTH(STR_TO_DATE(date, '%d-%m-%Y')) AS 'month' FROM $table_name 
        WHERE 
         $collom = '$value' AND YEAR(STR_TO_DATE(date, '%d-%m-%Y')) = '$year' GROUP BY MONTH(STR_TO_DATE(date, '%d-%m-%Y'))   ORDER BY $order_by $order_value
         ;
        
        
");


        return $query->result();
        
	    

      
	     
	   
	}
	
	
	
	     public function getTableResultsGroupBy(
    			     $table_name = null,
    			     $order_by = null,
    			     $order_value = null,
    			     $collom_name1 = null,
    			     $value1 = null,
    			     $collom_name2 = null,
    			     $collom_name3 = null,
    			     $value3 = null
    			     )
   
	{
	    
	  
	  
	      if($collom_name1!=null && $value1!=null){ $this->db->where($collom_name1,$value1);}
	      if($collom_name2!=null && $value2!=null){ $this->db->where($collom_name2,$value2);}
	      if($collom_name3!=null && $value3!=null){ $this->db->where($collom_name3,$value3);}



            $this->db->order_by($order_by, $order_value);
           $query = $this->db->get($table_name);
	      return $query->result();
	   	  
	   
	   	  
	   
	}
	
	
    			 public function getTableResults(
    			     $table_name = null,  $collom_name1 = null,
    			     $value1 = null,
    			     $collom_name2 = null,
    			     $value2 = null,
    			     $collom_name3 = null,
    			     $value3 = null
    			     )
   
	{
	    
	  
	      if($collom_name1!=null && $value1!=null){ $this->db->where($collom_name1,$value1);}
	      if($collom_name2!=null && $value2!=null){ $this->db->where($collom_name2,$value2);}
	      if($collom_name3!=null && $value3!=null){ $this->db->where($collom_name3,$value3);}

	    
           $query = $this->db->get($table_name);
	      return $query->result();
	   	  
	   
	}
    


 			 public function getSumOfCollom(
    			     $table_name = null,
    			     $sum_collom_name = null,
    			     $collom_name1 = null,
    			     $value1 = null,
    			     $collom_name2 = null,
    			     $value2 = null,
    			     $collom_name3 = null,
    			     $value3 = null)
   
	{
	    
          if($collom_name1!=null && $value1!=null){ $this->db->where($collom_name1,$value1);}
	      if($collom_name2!=null && $value2!=null){ $this->db->where($collom_name2,$value2);}
	      if($collom_name3!=null && $value3!=null){ $this->db->where($collom_name3,$value3);}


	   	     
    $this->db->select_sum($sum_collom_name);
    $this->db->from($table_name);
    $query = $this->db->get();
    return $query->row()->$sum_collom_name;   
	   
	}
    
		 public function DeleteFunction1Condition($table,$collom,$value)
   
	{
	  
	        $this->db->where($collom,$value);
            $this -> db ->delete($table);
            return 1;
	   
	}	

	

 public function updateData($tableName,$where, $whereID, $data)

    {

        $table_name = $tableName;
        $this->db->where($where, $whereID);
        $this->db->update($table_name, $data);
        return true;

    }



//  END BILLLING SOFTWARE CODE HERE











				 public function InsertUserToken($userId,$token)
   
	{
	       $table_name = 'tbl_customers';
	       $this->db->where('customers_id',$userId);
             $this->db->update($table_name, array('mobileTokrn' => $token));
            return 1;
	   
	}
	
			   public function userDetails($user_id)
   
	{
	             $this->db->where('customers_id',$user_id);
                $query = $this->db->get('tbl_customers');
	            return $query->result();
	   
	}
	
	

			   public function GetStoreCategory()
   
	{
	      
	        
	            $this->db->where('status',1);
	            $this->db->where('parent_id',0);
                $query = $this->db->get('tbl_categories');
	            return $query->result();
	   
	}
			   public function GetStoreSubCategory()
   
	{
	      
	        
	            $this->db->where('status',1);
	            $this->db->where('parent_id!=',0);
                $query = $this->db->get('tbl_categories');
	            return $query->result();
	   
	}	

				  public function GetStoreBrand()
   
	{
	      
	      
	            $this->db->where('status',1);
                $query = $this->db->get('tbl_brands');
	            return $query->result();
	   
	}
				  public function GetStoreCategoryById($catId)
   
	{
	      
	      
	            $this->db->where('status',1);
	            $this->db->where('parent_id',$catId);
                $query = $this->db->get('tbl_categories');
	            return $query->result();
	   
	}


				   public function AddCart($dataa)
   	{
      $this->db->insert('tbl_cart', $dataa);
      return 1;
	  	}
		
					 public function GetCart($userId)
   
	{
	      
	       $this->db->where('customer_id',$userId);
           $query = $this->db->get('tbl_cart');
	   	   return $query->result();
	   
	}	

    
			 public function AddCartIncrement($userId,$product_id,$qty)
   
	{
	       $table_name = 'tbl_cart';
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
             $this->db->update($table_name, array('quntity' => $qty));
            return 1;
	   
	}
			 public function AddCartRemove($userId,$product_id)
   
	{
	  
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
            $this -> db ->delete('tbl_cart');
            return 1;
	   
	}	

 
 
			 public function cheackCart($userId,$product_id)
   
	{
	      
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
           $query = $this->db->get('tbl_cart');
	   	   return $query->row();
	   
	}
	
	
	
			 public function CartQuntity($userId,$product_id)
   
	{
	      
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
           $query = $this->db->get('tbl_cart')->row()->quntity;
	   	     return $query;
	   
	}	
	
			 public function getUserCart($userId)
   
	{
	      
	       $this->db->where('customer_id',$userId);
           $query = $this->db->get('tbl_cart')->num_rows();;
	    
	     return $query;
	   	  
	   
	}	
			 public function getUserWish($userId)
   
	{
	      
	       $this->db->where('customer_id',$userId);
           $query = $this->db->get('tbl_whishlist')->num_rows();;
	      return $query;
	   	  
	   
	}

			 public function CheackUserCart($userId,$product_id)
   
	{
	      
	       $this->db->where('customer_id',$userId);
	        $this->db->where('product_id',$product_id);
           $query = $this->db->get('tbl_cart')->num_rows();;
	    
	     return $query;
	   	  
	   
	}

			 public function DeleteCart($userId)
   
	{
	  
	       $this->db->where('customer_id',$userId);
            $this -> db ->delete('tbl_cart');
            return 1;
	   
	}	
	
	
					 public function GetWish($userId)
   
	{
	      
	       $this->db->where('customer_id',$userId);
           $query = $this->db->get('tbl_whishlist');
	   	   return $query->result();
	   
	}	

	
			 public function CheackUserWish($userId,$product_id)
   
	{
	      
	       $this->db->where('customer_id',$userId);
	        $this->db->where('product_id',$product_id);
           $query = $this->db->get('tbl_whishlist')->num_rows();;
	      return $query;
	   	  
	   
	}	
	
		public function AddWish($dataa)
 
   	{
   	    
      $this->db->insert('tbl_whishlist', $dataa);
      return 1;
      
	  	}
	
			 public function AddWishRemove($userId,$product_id)
   
	{
	  
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
            $this -> db ->delete('tbl_whishlist');
            return 1;
	   
	}
	
	
			   public function cheackWish($userId,$product_id)
   
	{
	      
	       $this->db->where('customer_id',$userId);
	       $this->db->where('product_id',$product_id);
           $query = $this->db->get('tbl_whishlist');
	   	   return $query->row();
	   
	}	
	
	
				   public function GetStoreProductByCategory($catId)
   
	{
	      
	         
	            $this->db->where('status','1');
	            $this->db->where('quantity>',0);
	            $this->db->where('category_id',$catId);
                $query = $this->db->get('tbl_products');
	            return $query->result();
	            
	   
	}
				   public function GetStoreProductByBrand($brand_id)
   
	{
	      
	         
	            $this->db->where('status','1');
	            $this->db->where('quantity>',0);
	            $this->db->where('brand_id',$brand_id);
                $query = $this->db->get('tbl_products');
	            return $query->result();
	            
	   
	}	


			   public function GetStoreMultiImages($p_id)
   
	{
	      
	        
	            $this->db->where('product_id',$p_id);
                $query = $this->db->get('tbl_product_images');
	            return $query->result();
	   
	}	
	
	
				   public function GetStoreProductById($product_id)
   
	{
	      
	          
	            $this->db->where('id',$product_id);
                $query = $this->db->get('tbl_products');
	            return $query->result();
	   
	}	
	
	
				   public function brandDetails($product_id)
   
	{
	      
	          
	            $this->db->where('id',$product_id);
                $query = $this->db->get('tbl_brands');
	            return $query->result();
	   
	}	
	
	
	
				   public function categoryDetails($product_id)
   
	{
	      
	          
	            $this->db->where('id',$product_id);
                $query = $this->db->get('tbl_categories');
	            return $query->result();
	   
	}	
	
	

				   public function GetAllSaverProduct()
   
	{
	      
	      
	            $this->db->where('status','1');
	            $this->db->where('quantity>',0);
	             $this->db->where('discount!=',0);
	            $this->db->order_by("discount", "DESC");
                $query = $this->db->get('tbl_products');
	            return $query->result();
	   
	}
	
				   public function GetAllProduct()
   
	{
	      
	      
	            $this->db->where('status','1');
	            $this->db->where('quantity>',0);
	            $this->db->order_by("discount", "DESC");
                $query = $this->db->get('tbl_products');
	            return $query->result();
	   
	}
	
					   public function OffersBanner()
   
	{
	      
	      
	            $this->db->where('status','1');
                $query = $this->db->get('tbl_offers');
	            return $query->result();
	   
	}

					   public function SpecialOffersBanner()
   
	{
	      
	      
	            $this->db->where('status','1');
                $query = $this->db->get('tbl_sp_offers');
	            return $query->result();
	   
	}
	
						   public function SpecialOffersCatsBanner()
   
	{
	      
	      
	            $this->db->where('status','1');
                $query = $this->db->get('tbl_sp_offers_cat');
	            return $query->result();
	   
	}

public function fetchCouponById($coupon_id)
   
	{
	      
	      
	              $this->db->where('coupon_id',$coupon_id);
                  $query = $this->db->get('tbl_coupons');
	              return $query->result();
	   
	}
public function CouponAction($coupon)
   
	{
	      
	      
	              $this->db->where('coupon_code',$coupon);
                  $query = $this->db->get('tbl_coupons');
	              return $query->result();
	   
	}

public function CouponCheackUsed($couponId,$UserId)
   
	{
	      
	      
	              $this->db->where('customer_id',$UserId);
	               $this->db->where('coupon_id',$couponId);
                  $query = $this->db->get('tbl_coupon_customers');
	              return $query->result();
	   
	}
	
		
public function FetchDeliveryCharge()
   
	{
	      
	      
	           
                $query = $this->db->get('tbl_delivery_charges');
	            return $query->result();
	   
	}

			 public function UpdateProduct($product_id,$qty)
   
	{
	       $table_name = 'tbl_products';
	       $this->db->where('id',$product_id);
           $this->db->update($table_name, array('quantity' => $qty));
            return 1;
	   
	}
	
	
	
			public function CoponIntery($dataa)
   	{
      $this->db->insert('tbl_coupon_customers', $dataa);
      return 1;
	  	}
	  	
	  	
			public function TemperaryPayment($dataa)
   	{
      $this->db->insert('tbl_online_payment', $dataa);
      return 1;
	  	}

			public function CODPaymentTransation($dataa)
   	{
      $this->db->insert('tbl_order_details', $dataa);
      return 1;
	  	}
			public function CODPaymentDetailsTransation($dataa)
   	{
      $this->db->insert('tbl_order_product_details', $dataa);
      return 1;
	  	}


public function FetchOrders($UserId)
   
	{
	      
	      
	              $this->db->where('customers_id',$UserId);
	                $this->db->order_by("order_id", "DESC");
                  $query = $this->db->get('tbl_order_details');
	              return $query->result();
	   
	}
public function fetchOrderDetailsById($order_no)
   
	{
	      
	      
	          
	              $this->db->where('order_number',$order_no);
                  $query = $this->db->get('tbl_order_details');
	              return $query->result();
	   
	}
	
public function FetchOrdersByON($order_no)
   
	{
	      
	      
	          
	              $this->db->where('order_number',$order_no);
                  $query = $this->db->get('tbl_order_product_details');
	              return $query->result();
	   
	}

 public function CancelOrder($order_number)
   
	{
	     date_default_timezone_set('Asia/Kolkata');
	     $date = date("Y-m-d H:i:s");
	       $table_name = 'tbl_order_details';
	       $this->db->where('order_number',$order_number);
           $this->db->update($table_name, array('Order_status' => 'Cancel','Cancle_date' => $date));
            return 1;
	   
	}	
	
	
	public function fetchPointsById($order_no)
   
	{
	      
	      
	          
	              $this->db->where('order_no',$order_no);
                  $query = $this->db->get('tbl_customer_points');
	              return $query->result();
	   
	}
		
		
		
public function fetchDeliveryInformation($address_id)
   
	{
	      
	      
	          
	              $this->db->where('address_id',$address_id);
                  $query = $this->db->get('tbl_customers_address_book');
	              return $query->result();
	   
	}








}