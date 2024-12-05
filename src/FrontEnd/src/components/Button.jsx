import React from 'react'
import PropTypes from "prop-types";
import "../styles/button.css";
import images from '../assets/images'
import '../styles/fonts.css'
function Button({ text="Button", icon={}, border="1px solid #265073", color="#fff", backgroundColor="#265073", onClick=()=>{console.log("Button clicked!")} }) {
  return (
    <button
      className="custom-button"
      style={{
        color: color,
        backgroundColor: backgroundColor,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "10px 15px",
        border: border,
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        fontFamily:"Poppins-Regular",
        width:"125px",
        height:"40px",
      }}
      onClick={onClick}
    >
      <span style={{ marginRight: "10px" }}>{text}</span>
      <span><img src={icon}></img></span>
    </button>
  )
};
//Thiết lập kiểu dữ liệu cho props
Button.propTypes = {
    text: PropTypes.string.isRequired, // Chữ hiển thị trên nút
    icon: PropTypes.string.isRequired, // Biểu tượng (React Node)
    border: PropTypes.string,
    color: PropTypes.string, // Màu chữ
    backgroundColor: PropTypes.string, // Màu nền
    onClick: PropTypes.func, // Sự kiện click
  };
  
  // Giá trị mặc định cho props
  // Button.defaultProps = {
  //   color: "#fff",
  //   backgroundColor: "#007BFF",
  //   onClick: () => console.log("Button clicked!"),
  // };
  export default Button

