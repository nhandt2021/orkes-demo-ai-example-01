import React, { useState, useEffect } from "react";

const TypingEffect = () => {
  const [text, setText] = useState("");
  const [dots, setDots] = useState("");

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev === "..." ? "" : prev + "."));
    }, 500);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const typingText = "Typing";
    let index = 0;

    const interval = setInterval(() => {
      setText((prev) => prev + typingText[index]);
      index++;
      if (index === typingText.length) clearInterval(interval);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return `Someone is typing ${dots}`;
};

export default TypingEffect;
