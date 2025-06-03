/* eslint-disable react/prop-types */
import Carousel from "./Carousel";
import { useEffect, useRef } from "react";
const HomeHeading = () => {
  const fullText = "Best Insurance";
  const typingSpeed = 150; // Adjust the typing speed
  const pauseBeforeRemove = 1500; // 2 seconds pause before starting removal
  const removalSpeed = 200; // Adjust the removal speed
  const textRef = useRef(null);
  const indexRef = useRef(0);
  const isDeletingRef = useRef(false);

  // typewritter text
  useEffect(() => {
    const updateText = () => {
      // Check if textRef.current is not null
      if (textRef.current) {
        const currentText = isDeletingRef.current
          ? fullText.substring(0, indexRef.current - 1)
          : fullText.substring(0, indexRef.current + 1);
        textRef.current.textContent = currentText;
        indexRef.current = isDeletingRef.current
          ? indexRef.current - 1
          : indexRef.current + 1;
        // Toggle between typing and deleting when reaching the ends
        if (indexRef.current === fullText.length) {
          setTimeout(() => {
            isDeletingRef.current = true;
          }, pauseBeforeRemove);
        } else if (indexRef.current === 0) {
          isDeletingRef.current = false;
        }
      }
    };
    const timer = setInterval(
      updateText,
      isDeletingRef.current ? removalSpeed : typingSpeed
    );
    // Clear the interval when the component is unmounted
    return () => clearInterval(timer);
  }, [fullText]);

  return <Carousel />;
};

export default HomeHeading;
