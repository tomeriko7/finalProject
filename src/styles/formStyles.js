const styles = {
  registerContainer: {
    minHeight: "100vh",
    background: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0)), url("https://images.pexels.com/photos/12567701/pexels-photo-12567701.jpeg")`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",  // חשוב להוסיף כדי שהשכבה הטשטוש תהיה יחסית אליו
    overflow: "hidden",    // למנוע גלילה לא רצויה מהטשטוש
    backgroundSize: "cover", // תמלא את הרוחב, תשמור על הגובה המקורי
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
  },
  blurOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.35)", // שכבת לבן שקופה להבהרה עדינה
    backdropFilter: "blur(7px)",                // הטשטוש העיקרי
    WebkitBackdropFilter: "blur(12px)",          // תמיכה לספארי
    zIndex: 0,
    
  },
  contentWrapper: {
    position: "relative",
    zIndex: 1,  // להבטיח שהתוכן יהיה מעל הטשטוש
    width: "100%",
  },
  loginContainer: {
    minHeight: "100vh",
    background: `linear-gradient(to bottom, rgba(255,255,255,0.4), rgba(255,255,255,0)), url("https://images.pexels.com/photos/28704673/pexels-photo-28704673.jpeg")`,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    position: "relative",  // חשוב להוסיף כדי שהשכבה הטשטוש תהיה יחסית אליו
    overflow: "hidden",    // למנוע גלילה לא רצויה מהטשטוש
    backgroundSize: "cover",
backgroundPosition: "center",
backgroundRepeat: "no-repeat",
  },
  contactContainer:{
    minHeight: "50vh",
    background: "linear-gradient(135deg,rgb(255, 255, 255) 0%,rgb(41, 37, 50) 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "20px",
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  card: {
    maxWidth: "600px",
    width: "100%",
    backgroundColor: "rgba(255, 255, 255, 0.74)",
    borderRadius: "16px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.15)",
    padding: "40px",
    margin: "20px auto",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
  },
  title: {
    fontSize: "2rem",
    margin: "0 0 8px 0",
    color: "#333",
    fontWeight: "600",
  },
  subtitle: {
    color: "#666",
    margin: 0,
    fontSize: "16px",
  },
  alert: {
    padding: "12px 16px",
    borderRadius: "8px",
    marginBottom: "24px",
    fontSize: "14px",
  },
  alertSuccess: {
    backgroundColor: "#d4edda",
    color: "#155724",
    border: "1px solid #c3e6cb",
  },
  alertError: {
    backgroundColor: "#f8d7da",
    color: "#721c24",
    border: "1px solid #f5c6cb",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
    direction: "rtl",
    textAlign: "right",
    
  },
  row: {
  display: "flex",
  flexWrap: "wrap",
  justifyContent: "space-between",
  gap: "8px",
},
  field: {
    display: "flex",
    flexDirection: "column",
    flex: 1,
  },
  label: {
    fontSize: "14px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "6px",
  },
  input: {
    padding: "12px 16px",
    border: "2px solid #e1e5e9",
    borderRadius: "8px",
    fontSize: "16px",
    transition: "border-color 0.2s ease",
    outline: "none",
    backgroundColor: "white",
  },
  inputError: {
    borderColor: "#dc3545",
  },
  passwordContainer: {
    position: "relative",
    display: "flex",
    alignItems: "center",
  },
  passwordToggle: {
    position: "absolute",
    right: "12px",
    background: "none",
    border: "none",
    cursor: "pointer",
    fontSize: "16px",
    padding: "4px",
  },
  errorText: {
    fontSize: "12px",
    color: "#dc3545",
    marginTop: "4px",
  },
  section: {
    marginTop: "8px",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "500",
    color: "#333",
    marginBottom: "16px",
    paddingBottom: "8px",
    borderBottom: "1px solid #e1e5e9",
  },
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  checkboxLabel: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "14px",
    color: "#555",
    cursor: "pointer",
  },
  checkbox: {
    width: "18px",
    height: "18px",
    cursor: "pointer",
  },
  submitButton: {
    padding: "14px",
    backgroundColor: "rgb(232 168 14)",
    color: "white",
    border: "none",
    borderRadius: "8px",
    fontSize: "16px",
    fontWeight: "500",
    cursor: "pointer",
    transition: "background-color 0.2s ease",
    marginTop: "8px",
  },
  submitButtonDisabled: {
    backgroundColor: "#ccc",
    cursor: "not-allowed",
  },
  footer: {
    textAlign: "center",
    marginTop: "16px",
    fontSize: "14px",
    color: "#666",
  },
  link: {
    color: "rgb(25, 115, 96)",
    textDecoration: "none",
    fontWeight: "500",
  },
   // סטייל RTL ללייבלים ול־TextField
  rtlInputStyles : {
    textAlign: "right",
    "& fieldset": {
      paddingRight: "8px",
      paddingLeft: 0,
      "& legend": {
        textAlign: "right",
        paddingRight: 0,
        paddingLeft: 2,
        transformOrigin: "top right",
      },
    },
  },
  rtlLabelStyles : {
    right: "25px",
    left: "auto",
    textAlign: "right",
  },
};
export default styles;