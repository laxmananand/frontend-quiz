import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import styles from "./QuizAnalysis.module.css";
import { FadeLoader } from "react-spinners";
import { BACKEND_URL } from "../../constants/backend.constant.jsx";

const QuizAnalysis = () => {
  const { quizId } = useParams();
  const [quiz, setQuiz] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/V1/quiz/${quizId}`)
      .then((response) => {
        setQuiz(response.data);
      })
      .catch((error) => console.error("Error fetching quiz:", error));
  }, [quizId]);

  if (!quiz) {
    return (
      <div className={styles.loaderContainer}>
        <FadeLoader color="#474444" />
      </div>
    );
  }

  return (
    <div className={styles.mainContainer}>
      <div className={styles.header}>{quiz.quizName} Question Analysis</div>
      {Object.values(quiz.questions[0].pollQuestion).map((question, index) => {
        const totalAttempts = Math.round(quiz.impressions / 2);
        const correctAttempts =
          (quiz.correctAnswers && quiz.correctAnswers[index]) || 0;
        const incorrectAttempts = totalAttempts - correctAttempts;

        return (
          <div key={index} className={styles.questionAnalysisContainer}>
            <div className={styles.question}>
              Q.{index + 1} {question}
            </div>
            <div className={styles.boxes}>
              <div className={styles.totalAttemptsBox}>
                <div>{totalAttempts}</div>People Attempted the Question
              </div>
              <div className={styles.correctAttemptsBox}>
                <div>{correctAttempts}</div>People Attempted Correctly
              </div>
              <div className={styles.incorrectAttemptsBox}>
                <div>{incorrectAttempts}</div>People Attempted Incorrectly
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default QuizAnalysis;
