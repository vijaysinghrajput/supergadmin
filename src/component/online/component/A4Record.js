import { useContext, useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { BiRupee } from "react-icons/bi";
import { useToast } from "@chakra-ui/react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from "@chakra-ui/react";
import { toWords } from "number-to-words";

import { useQuery } from "react-query";
import Cookies from "universal-cookie";
import { SimpleGrid } from "@chakra-ui/react";

import { queryClient } from "../../../App";

import {
  Box,
  Button,
  Flex,
  Text,
  useDisclosure,
} from "@chakra-ui/react";

import swal from "sweetalert";
import URL from "../../../URL";
import { useA4Print } from "../../../utils/useA4Print";

const cookies = new Cookies();
const adminId = cookies.get("adminId");

export const A4Record = ({ 
  orderID, 
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
          <div className="d-flex justify-content-center mb-3 no-print">
            <Button onClick={handlePrintA4} colorScheme="blue" size="lg">
              Print A4
            </Button>
          </div>
          
          <div ref={componentRefA4} id="a4-print-section">
            <div style={{ 
              padding: '15px', 
              fontFamily: 'Arial, sans-serif',
              backgroundColor: 'white',
              color: 'black',
              fontSize: '16px',
              lineHeight: '1.5',
              fontWeight: '600'
            }}>
              {/* Simple Header */}
              <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                <h2 style={{ margin: '0', fontSize: '28px', fontWeight: 'bold' }}>BILL TO --</h2>
              </div>

              {/* Products Table */}
              <table style={{ 
                width: '100%', 
                borderCollapse: 'collapse', 
                marginBottom: '20px',
                border: '2px solid #000',
                fontSize: '15px',
                fontWeight: '600'
              }}>
                <thead>
                  <tr style={{ backgroundColor: '#f5f5f5' }}>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'left', fontSize: '15px', fontWeight: 'bold' }}>S.No</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'left', fontSize: '15px', width: '40%', fontWeight: 'bold' }}>Product Name</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>Size</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>Qty</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>MRP</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>Rate</th>
                    <th style={{ border: '1px solid #000', padding: '12px', textAlign: 'center', fontSize: '15px', fontWeight: 'bold' }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {productData?.map((item, index) => (
                    <tr key={index} style={
                      !Number(item.avl_status) ? { textDecoration: 'line-through' } : {}
                    }>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        {index + 1}
                      </td>
                      <td style={{ 
                        border: '1px solid #000', 
                        padding: '10px', 
                        fontSize: '15px',
                        fontWeight: '600',
                        wordWrap: 'break-word',
                        maxWidth: '200px'
                      }}>
                        {item?.product_name}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        {item.product_size} {item.product_unit}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        {item.quantity} {Number(item.not_avl_qty) ? `-(${item.not_avl_qty}*)` : ""}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        ₹{item.price}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        ₹{item.sale_price}
                      </td>
                      <td style={{ border: '1px solid #000', padding: '10px', textAlign: 'center', fontSize: '15px', fontWeight: '600' }}>
                        ₹{(Number(item.quantity) - Number(item.not_avl_qty)) * Number(item.sale_price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Billing Summary */}
              <div style={{ marginTop: '20px', borderTop: '2px solid #000', paddingTop: '15px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', width: '50%', marginLeft: 'auto' }}>
                  <div style={{ textAlign: 'right', width: '100%' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                      <span><strong>Sub Total:</strong></span>
                      <span>₹{orderDetails?.sub_total}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '16px', fontWeight: 'bold' }}>
                      <span><strong>Discount:</strong></span>
                      <span>- ₹{orderDetails?.discount}</span>
                    </div>
                    <div style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      marginBottom: '8px',
                      borderTop: '2px solid #000',
                      paddingTop: '8px',
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }}>
                      <span>Total Payment:</span>
                      <span>₹{orderDetails?.total_payment}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Amount in Words */}
              <div style={{ 
                marginTop: '15px', 
                borderTop: '2px solid #000', 
                paddingTop: '12px',
                fontSize: '16px',
                fontWeight: 'bold'
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
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default A4Record;