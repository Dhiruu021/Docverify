import { useState, useEffect } from "react";
import "./TypeWriter.css";

function TypeWriter({ text, speed = 100, className = "" }) {
  const [displayText, setDisplayText] = useState("");
  const [showCursor, setShowCursor] = useState(true);

  useEffect(() => {
    let index = 0;
    setDisplayText("");
    
    const typeInterval = setInterval(() => {
      if (index < text.length) {
        setDisplayText(text.slice(0, index + 1));
        index++;
      } else {
        clearInterval(typeInterval);
      }
    }, speed);

    return () => clearInterval(typeInterval);
  }, [text, speed]);

  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 500);

    return () => clearInterval(cursorInterval);
  }, []);

  return (
    <span className={`typewriter ${className}`}>
      {displayText}
      <span className={`cursor ${showCursor ? "visible" : ""}`}>|</span>
    </span>
  );
}

export default TypeWriter;
