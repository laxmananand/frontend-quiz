import React, { useState, useEffect } from "react";
import { FadeLoader } from "react-spinners";
import styles from "./PollCompletion.module.css";
import Confetti from "react-confetti";

const PollCompletion = () => {
  const [loading, setLoading] = useState(true);
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 500);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader color="#474444" />
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      {/* {!loading && <Confetti width={width} height={height} />} */}
      <div className={styles.thankYouContainer}>
        Thank you for participating in the Poll
      </div>
    </div>
  );
};

export default PollCompletion;
