import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useDisclosure } from "@chakra-ui/react";

/**
 * Custom hook for A4 printing functionality
 * This centralizes all A4 printing logic and can be used across multiple components
 */
export const useA4Print = () => {
  const componentRefA4 = useRef();
  const { isOpen: isA4Open, onOpen: onA4Open, onClose: onA4Close } = useDisclosure();

  const handlePrintA4 = useReactToPrint({
    content: () => componentRefA4.current,
    pageStyle: `
      @page {
        size: A4;
        margin: 20mm;
      }
      @media print {
        body {
          font-family: Arial, sans-serif;
        }
        .no-print {
          display: none !important;
        }
      }
    `,
  });

  return {
    componentRefA4,
    isA4Open,
    onA4Open,
    onA4Close,
    handlePrintA4,
  };
};

/**
 * A4 Print Button Component
 * Reusable button component for A4 printing
 */
export const A4PrintButton = ({ onClick, className = "btn btn-primary" }) => {
  return (
    <a onClick={onClick} className={className}>
      <i className="ri-printer-line align-bottom me-1"></i> Print A4
    </a>
  );
};

export default useA4Print;