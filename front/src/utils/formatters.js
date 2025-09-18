/**
 * פונקציות עזר לפורמט נתונים שונים
 */

/**
 * פורמט תאריך לתצוגה בעברית
 * @param {string|Date} date - תאריך כמחרוזת או אובייקט Date
 * @returns {string} תאריך מפורמט בעברית
 */
export const formatDate = (date) => {
  if (!date) return '';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  // אם התאריך לא תקין
  if (isNaN(dateObj.getTime())) return '';
  
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  
  return dateObj.toLocaleDateString('he-IL', options);
};

/**
 * פורמט מספר לתצוגה כמחיר
 * @param {number|string} price - המחיר
 * @param {string} currency - סימן המטבע (ברירת מחדל: ₪)
 * @returns {string} מחיר מפורמט
 */
export const formatPrice = (price, currency = '₪') => {
  // אם הערך undefined, null, או סטרינג ריק
  if (price === undefined || price === null || price === '') return `${currency}0.00`;
  
  // המרה למספר אם צריך
  const numericPrice = typeof price === 'string' ? parseFloat(price) : price;
  
  // בדיקה שהומר למספר תקין
  if (isNaN(numericPrice)) return `${currency}0.00`;
  
  // עיגול ל-2 ספרות אחרי הנקודה
  return `${currency}${numericPrice.toFixed(2)}`;
};

/**
 * פורמט מספר טלפון ישראלי
 * @param {string} phone - מספר טלפון
 * @returns {string} מספר טלפון מפורמט
 */
export const formatPhone = (phone) => {
  if (!phone) return '';
  
  // הסרת תווים שאינם ספרות
  const digits = phone.replace(/\D/g, '');
  
  // פורמט לפי אורך המספר
  if (digits.length === 10) {
    // מספר נייד או קווי עם קידומת (05X-XXX-XXXX או 0X-XXX-XXXX)
    return digits.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
  } else if (digits.length === 9) {
    // מספר נייד ללא 0 בהתחלה
    return `0${digits.replace(/(\d{2})(\d{3})(\d{4})/, '$1-$2-$3')}`;
  }
  
  // אם הפורמט לא מוכר, החזר כמו שהוא
  return phone;
};
