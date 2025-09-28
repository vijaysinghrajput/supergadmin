<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Api extends CI_Controller {

    public function __construct() {
        parent::__construct();
        // Enable CORS for React frontend
        $this->output->set_header('Access-Control-Allow-Origin: *');
        $this->output->set_header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
        $this->output->set_header('Access-Control-Allow-Headers: Content-Type');
        
        if ($this->input->method() === 'options') {
            return;
        }
    }

    public function generate_bill_pdf() {
        try {
            // Get JSON input
            $input = json_decode(file_get_contents('php://input'), true);
            
            if (!$input) {
                $this->output
                    ->set_status_header(400)
                    ->set_content_type('application/json')
                    ->set_output(json_encode(['error' => 'Invalid JSON data']));
                return;
            }

            // Load PDF library
            $this->load->library('pdf_generator');
            
            // Generate PDF
            $pdf_content = $this->pdf_generator->generate_bill_pdf(
                $input['orderID'],
                $input['orderDetails'],
                $input['productData'],
                $input['customerAddress'],
                $input['storeBussiness']
            );

            // Set headers for PDF download
            $this->output
                ->set_content_type('application/pdf')
                ->set_header('Content-Disposition: attachment; filename="Bill-' . $input['orderID'] . '.pdf"')
                ->set_output($pdf_content);

        } catch (Exception $e) {
            $this->output
                ->set_status_header(500)
                ->set_content_type('application/json')
                ->set_output(json_encode(['error' => $e->getMessage()]));
        }
    }
}