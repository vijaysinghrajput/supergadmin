import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import swal from "sweetalert";
import { BiRupee } from "react-icons/bi";
import {
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  SimpleGrid,
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { toWords } from "number-to-words";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { queryClient } from "../../../App";
import URL from "../../../URL";
import { useA4Print } from "../../../utils/useA4Print";

const cookies = new Cookies();
const adminId = cookies.get("adminId");



export const A4Record = ({ 
  orderID, 
  customer,
  customer_address, 
  isOpen, 
  onClose,
  orderDetails = {},
  customerAddress = {},
  productData = [],
  Store_bussiness_info = {},
  delivery_slots = ""
}) => {
  const toast = useToast();
  const { componentRefA4, handlePrintA4 } = useA4Print();

  const adminStoreId = cookies.get("adminStoreId");

  const handleDownloadPDF = async () => {
    try {

      
      const element = componentRefA4.current;
      
      // Create high-quality canvas
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        width: element.scrollWidth,
        height: element.scrollHeight
      });
      
      const imgData = canvas.toDataURL('image/png', 1.0);
      
      // Create PDF with A4 dimensions
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      const pdfWidth = 210;
      const pdfHeight = 297;
      const imgWidth = pdfWidth;
      const imgHeight = (canvas.height * pdfWidth) / canvas.width;
      
      if (imgHeight <= pdfHeight) {
        // Fits on one page
        pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
      } else {
        // Multiple pages needed
        let yPosition = 0;
        let remainingHeight = imgHeight;
        
        while (remainingHeight > 0) {
          const pageHeight = Math.min(pdfHeight, remainingHeight);
          const sourceY = imgHeight - remainingHeight;
          
          // Create section canvas
          const sectionCanvas = document.createElement('canvas');
          const sectionCtx = sectionCanvas.getContext('2d');
          sectionCanvas.width = canvas.width;
          sectionCanvas.height = (pageHeight * canvas.width) / pdfWidth;
          
          sectionCtx.drawImage(
            canvas,
            0, (sourceY * canvas.width) / pdfWidth,
            canvas.width, sectionCanvas.height,
            0, 0,
            canvas.width, sectionCanvas.height
          );
          
          const sectionData = sectionCanvas.toDataURL('image/png', 1.0);
          
          if (yPosition > 0) pdf.addPage();
          pdf.addImage(sectionData, 'PNG', 0, 0, imgWidth, pageHeight);
          
          remainingHeight -= pageHeight;
          yPosition += pageHeight;
        }
      }
      
      pdf.save(`Bill-${orderID || Date.now()}.pdf`);
      
      getToast({
        title: "Success",
        desc: "PDF downloaded successfully!",
        status: "success"
      });
      
    } catch (error) {
      console.error('PDF generation error:', error);
      getToast({
        title: "Error",
        desc: `Failed to generate PDF: ${error.message}`,
        status: "error"
      });
    }
  };
  const [isDataLoding, setisDataLoding] = useState(false); // Set to false since data is passed as props

  const getToast = (e) => {
    toast({
      title: e.title,
      description: e.desc,
      status: e.status,
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  // Data is now passed as props, no need to fetch

  if (isDataLoding) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>A4 Print Preview</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="d-flex justify-content-center mb-3 no-print" style={{ gap: '15px' }}>
            <Button onClick={handlePrintA4} colorScheme="blue" size="lg">
              Print A4
            </Button>
            <Button onClick={handleDownloadPDF} colorScheme="green" size="lg">
              Download PDF
            </Button>
          </div>
          
          <div ref={componentRefA4} id="a4-print-section">
            <style>
              {`
                @page {
                  margin: 30mm 15mm 25mm 15mm;
                  size: A4;
                }
                
                @page :first {
                  margin: 20mm 15mm 25mm 15mm;
                }
                
                @page :left {
                  margin: 30mm 15mm 25mm 15mm;
                }
                
                @page :right {
                  margin: 30mm 15mm 25mm 15mm;
                }
                
                table {
                  page-break-inside: auto !important;
                  border-collapse: collapse !important;
                  margin-bottom: 25px !important;
                  margin-top: 10px !important;
                }
                
                thead {
                  display: table-header-group !important;
                  page-break-before: avoid !important;
                  page-break-after: avoid !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  margin-top: 15px !important;
                }
                
                tbody {
                  display: table-row-group !important;
                  margin-top: 5px !important;
                }
                
                tr {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  page-break-before: auto !important;
                  page-break-after: auto !important;
                  margin-bottom: 2px !important;
                }
                
                th {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  padding: 12px !important;
                }
                
                td {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  padding: 10px 8px !important;
                }
                
                .repeating-header-table {
                  page-break-inside: auto !important;
                  margin-bottom: 25px !important;
                  margin-top: 15px !important;
                }
                
                .repeating-header-table thead {
                  display: table-header-group !important;
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  margin-top: 20px !important;
                  padding-top: 10px !important;
                }
                
                .repeating-header-table tbody {
                  display: table-row-group !important;
                  margin-top: 5px !important;
                }
                
                /* Ensure content doesn't get cut off at page end */
                .page-break-safe {
                  page-break-inside: avoid !important;
                  break-inside: avoid !important;
                  margin-bottom: 15px !important;
                  margin-top: 15px !important;
                }
                
                /* Specific spacing for page continuation */
                .table-continuation {
                  margin-top: 25px !important;
                  padding-top: 15px !important;
                }
                
                @media print {
                  body { margin: 0 !important; }
                  
                  @page {
                    margin: 30mm 15mm 25mm 15mm !important;
                  }
                  
                  @page :first {
                    margin: 20mm 15mm 25mm 15mm !important;
                  }
                  
                  .repeating-header-table { 
                    page-break-inside: auto !important; 
                    margin-bottom: 25px !important;
                    margin-top: 20px !important;
                  }
                  
                  .repeating-header-table thead { 
                    display: table-header-group !important; 
                    margin-top: 25px !important;
                    padding-top: 15px !important;
                  }
                  
                  .repeating-header-table tbody { 
                    display: table-row-group !important; 
                    margin-top: 10px !important;
                  }
                  
                  .repeating-header-table tr { 
                    page-break-inside: avoid !important; 
                    margin-bottom: 3px !important;
                  }
                  
                  .repeating-header-table th { 
                    page-break-inside: avoid !important; 
                    padding: 15px 12px !important;
                    margin-top: 5px !important;
                  }
                  
                  .repeating-header-table td { 
                    page-break-inside: avoid !important; 
                    padding: 12px 8px !important;
                  }
                  
                  table { 
                    page-break-inside: auto !important; 
                    margin-bottom: 25px !important;
                    margin-top: 20px !important;
                  }
                  
                  thead { 
                    display: table-header-group !important; 
                    margin-top: 25px !important;
                    padding-top: 15px !important;
                  }
                  
                  tbody { 
                    display: table-row-group !important; 
                    margin-top: 10px !important;
                  }
                  
                  tr { 
                    page-break-inside: avoid !important; 
                    margin-bottom: 3px !important;
                  }
                  
                  th { 
                    page-break-inside: avoid !important; 
                    padding: 15px 12px !important;
                    margin-top: 5px !important;
                  }
                  
                  td { 
                    page-break-inside: avoid !important; 
                    padding: 12px 8px !important;
                  }
                  
                  /* Prevent content from being cut at page edges */
                  .page-break-safe {
                    page-break-inside: avoid !important;
                    break-inside: avoid !important;
                    margin-bottom: 20px !important;
                    margin-top: 20px !important;
                  }
                  
                  /* Special spacing for table continuation */
                  .table-continuation {
                    margin-top: 30px !important;
                    padding-top: 20px !important;
                  }
                }
              `}
            </style>
            <div style={{ 
              padding: '5mm 2mm 3mm 2mm', 
              fontFamily: 'Arial, sans-serif',
              backgroundColor: 'white',
              color: 'black',
              fontSize: '22px',
              lineHeight: '1.4',
              fontWeight: '700',
              width: '100%',
              minHeight: '297mm',
              maxWidth: '100%',
              margin: '0',
              boxSizing: 'border-box',
              pageBreakInside: 'auto',
              orphans: '3',
              widows: '3'
            }}>
              {/* Simple Header */}
              <div style={{ marginBottom: '15px', textAlign: 'left' }}>
                <h2 style={{ margin: '0', fontSize: '28px', fontWeight: '800' }}>{customer?.name}</h2>
              </div>

              {/* Products Table */}
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '25px',
                border: '2px solid #000',
                fontSize: '18px',
                fontWeight: '700',
                tableLayout: 'fixed',
                pageBreakInside: 'auto'
              }} 
              className="repeating-header-table page-break-safe table-continuation"
              >
                <thead style={{ 
                  display: 'table-header-group',
                  pageBreakInside: 'avoid',
                  breakInside: 'avoid'
                }}>
                  <tr style={{ 
                    backgroundColor: '#f5f5f5',
                    pageBreakInside: 'avoid',
                    breakInside: 'avoid'
                  }}>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'left', fontSize: '22px', fontWeight: '800', width: '8%' }}>S.No</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'left', fontSize: '22px', fontWeight: '800', width: '35%' }}>Product Name</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800', width: '12%' }}>Size</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800', width: '8%' }}>Qty</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800', width: '12%' }}>MRP</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800', width: '12%' }}>Rate</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '22px', fontWeight: '800', width: '13%' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {productData?.map((item, index) => (
                    <tr key={index} style={{
                      ...(!Number(item.avl_status) ? { textDecoration: 'line-through' } : {}),
                      pageBreakInside: 'avoid',
                      breakInside: 'avoid'
                    }}>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        {index + 1}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '10px 8px', 
                        fontSize: '17px',
                        fontWeight: '700',
                        wordWrap: 'break-word',
                        overflow: 'hidden',
                        minHeight: '25px'
                      }}>
                        {item?.product_name}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        {item.product_size} {item.product_unit}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        {item.quantity} {Number(item.not_avl_qty) ? `-(${item.not_avl_qty}*)` : ""}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        ₹{item.price}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        ₹{item.sale_price}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px 8px', textAlign: 'center', fontSize: '17px', fontWeight: '700', minHeight: '25px' }}>
                        ₹{(Number(item.quantity) - Number(item.not_avl_qty)) * Number(item.sale_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Summary Section with intelligent page breaking */}
              <div style={{ 
                pageBreakInside: 'avoid', 
                marginTop: '30px',
                marginBottom: '25px',
                paddingTop: '15px',
                paddingBottom: '20px'
              }}
              className="page-break-safe"
              >
                {/* Billing Summary */}
                <div style={{ borderTop: '2px solid #000', paddingTop: '15px' }}>
                  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
                    <div style={{ width: '300px', marginRight: '40px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                        <span><strong>Sub Total:</strong></span>
                        <span>₹{orderDetails?.sub_total}</span>
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '18px', fontWeight: 'bold' }}>
                        <span><strong>Discount:</strong></span>
                        <span>- ₹{orderDetails?.discount}</span>
                      </div>
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        marginBottom: '8px',
                        borderTop: '2px solid #000',
                        paddingTop: '8px',
                        fontSize: '20px',
                        fontWeight: 'bold'
                      }}>
                        <span>Total Payment:</span>
                        <span>₹{orderDetails?.total_payment}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom section that should stay together */}
              <div style={{ 
                pageBreakInside: 'avoid', 
                marginTop: '30px',
                marginBottom: '25px',
                paddingTop: '20px',
                paddingBottom: '25px'
              }}>
                {/* Amount in Words */}
                <div style={{ 
                  borderTop: '2px solid #000', 
                  paddingTop: '12px',
                  fontSize: '16px',
                  fontWeight: 'bold',
                  marginBottom: '20px'
                }}>
                  <strong>Amount in Words: </strong>
                  {orderDetails?.total_payment ? 
                    `${toWords(Number(orderDetails.total_payment)).replace(/\b\w/g, l => l.toUpperCase())} Rupees Only` 
                    : 'Zero Rupees Only'
                  }
                </div>

                {/* Signature Section */}
                <div style={{ 
                  marginTop: '40px', 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  fontSize: '16px'
                }}>
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #000', paddingTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                      <strong>Customer Signature</strong>
                    </div>
                    <div style={{ height: '50px' }}></div>
                  </div>
                  
                  <div style={{ width: '45%' }}>
                    <div style={{ borderTop: '2px solid #000', paddingTop: '8px', textAlign: 'center', fontWeight: 'bold' }}>
                      <strong>Authorized Signature</strong>
                    </div>
                    <div style={{ height: '50px' }}></div>
                  </div>
                </div>
              </div>
              </div>

            </div>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default A4Record;