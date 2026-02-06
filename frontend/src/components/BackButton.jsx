import { useNavigate } from "react-router-dom";

function BackButton() {
  const navigate = useNavigate();

  return (
    <button onClick={() => navigate(-1)} style={styles.btn}>
      ⬅ Back
    </button>
  );
}

const styles = {
  btn: {
    position: "absolute",
    top: "86px",       
    left: "7px",      
    padding: "6px 10px",
    borderRadius: "6px",
    border: "none",
    background: "#b8beca",
    color: "white",
    cursor: "pointer",
    zIndex: 1000,
  },
};

export default BackButton;
