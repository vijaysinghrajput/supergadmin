// AI Translation utility using backend proxy
import URLDomain from '../URL';

// Backend translation proxy endpoint
const TRANSLATION_API_URL = `${URLDomain}/APP-API/Billing/translateText`;

// Supported languages
export const SUPPORTED_LANGUAGES = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिंदी' },
  { code: 'bn', name: 'Bangla', nativeName: 'বাংলা' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ' }
];

// Cache for translations to avoid repeated API calls
const translationCache = new Map();

/**
 * Get cache key for a translation request
 */
const getCacheKey = (text, targetLang) => {
  return `${text}_${targetLang}`;
};

/**
 * Translate text using backend proxy
 */
export const translateText = async (text, targetLanguage = 'hi') => {
  // If target language is English, return as is
  if (targetLanguage === 'en' || !text) {
    return text;
  }

  // Check cache first
  const cacheKey = getCacheKey(text, targetLanguage);
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const targetLangInfo = SUPPORTED_LANGUAGES.find(lang => lang.code === targetLanguage);
  const targetLangName = targetLangInfo ? targetLangInfo.name : 'Hindi';

  try {
    // Call backend proxy instead of DeepSeek API directly
    const response = await fetch(TRANSLATION_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        text: text,
        targetLanguage: targetLangName
      })
    });

    if (!response.ok) {
      console.error('Translation API error:', response.status);
      return text; // Return original text on error
    }

    const data = await response.json();
    
    if (data.success && data.translatedText) {
      const translatedText = data.translatedText;
      
      // Cache the translation
      translationCache.set(cacheKey, translatedText);
      
      return translatedText;
    } else {
      console.error('Translation failed:', data.error);
      return text;
    }
  } catch (error) {
    console.error('Translation error:', error);
    return text; // Return original text on error
  }
};

/**
 * Translate multiple texts in batch
 */
export const translateBatch = async (texts, targetLanguage = 'hi') => {
  if (targetLanguage === 'en') {
    return texts;
  }

  const promises = texts.map(text => translateText(text, targetLanguage));
  return await Promise.all(promises);
};

/**
 * Translate product data including product names
 */
export const translateProductData = async (products, targetLanguage = 'hi') => {
  if (targetLanguage === 'en' || !products || products.length === 0) {
    return products;
  }

  try {
    // Extract all product names
    const productNames = products.map(p => p.product_name);
    
    // Translate all product names in batch
    const translatedNames = await translateBatch(productNames, targetLanguage);
    
    // Return products with translated names
    return products.map((product, index) => ({
      ...product,
      product_name: translatedNames[index] || product.product_name
    }));
  } catch (error) {
    console.error('Error translating product data:', error);
    return products;
  }
};

/**
 * Get translation for common labels used in invoice
 */
export const getInvoiceLabels = async (targetLanguage = 'hi') => {
  if (targetLanguage === 'en') {
    return {
      serialNo: 'S.No',
      productName: 'Product Name',
      size: 'Size',
      quantity: 'Qty',
      mrp: 'MRP',
      rate: 'Rate',
      amount: 'Amount',
      subTotal: 'Sub Total',
      discount: 'Discount',
      totalPayment: 'Total Payment',
      amountInWords: 'Amount in Words',
      rupeesOnly: 'Rupees Only',
      customerSignature: 'Customer Signature',
      authorizedSignature: 'Authorized Signature'
    };
  }

  const labels = {
    serialNo: 'S.No',
    productName: 'Product Name',
    size: 'Size',
    quantity: 'Qty',
    mrp: 'MRP',
    rate: 'Rate',
    amount: 'Amount',
    subTotal: 'Sub Total',
    discount: 'Discount',
    totalPayment: 'Total Payment',
    amountInWords: 'Amount in Words',
    rupeesOnly: 'Rupees Only',
    customerSignature: 'Customer Signature',
    authorizedSignature: 'Authorized Signature'
  };

  try {
    const translatedLabels = await translateBatch(Object.values(labels), targetLanguage);
    
    return {
      serialNo: translatedLabels[0] || labels.serialNo,
      productName: translatedLabels[1] || labels.productName,
      size: translatedLabels[2] || labels.size,
      quantity: translatedLabels[3] || labels.quantity,
      mrp: translatedLabels[4] || labels.mrp,
      rate: translatedLabels[5] || labels.rate,
      amount: translatedLabels[6] || labels.amount,
      subTotal: translatedLabels[7] || labels.subTotal,
      discount: translatedLabels[8] || labels.discount,
      totalPayment: translatedLabels[9] || labels.totalPayment,
      amountInWords: translatedLabels[10] || labels.amountInWords,
      rupeesOnly: translatedLabels[11] || labels.rupeesOnly,
      customerSignature: translatedLabels[12] || labels.customerSignature,
      authorizedSignature: translatedLabels[13] || labels.authorizedSignature
    };
  } catch (error) {
    console.error('Error translating labels:', error);
    return labels;
  }
};

/**
 * Clear translation cache
 */
export const clearTranslationCache = () => {
  translationCache.clear();
};
