import React from "react";
import ImpressionsIcon from "../../assets/images/impressions.svg";
import styles from "./TrendingCard.module.css";

const TrendingCard = ({ quizName, impressions, creationDate }) => {
  return (
    <>
      <div className={styles.trendingQuizCard}>
        <div style={{ display: "flex", alignItems: "center" }}>
          <div className={styles.quizName}>{quizName}</div>
          <div className={styles.impressions}>{impressions}</div>
          <img src={ImpressionsIcon} alt="" />
        </div>
        <div className={styles.creationDate}>Created on : {creationDate}</div>
      </div>
    </>
  );
};

export default TrendingCard;
