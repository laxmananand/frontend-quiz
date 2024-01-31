import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import styles from "./Dashboard.module.css";
import TrendingCard from "../../components/trendingCard/TrendingCard";
import DeleteIcon from "../../assets/images/delete-icon.svg";
import EditIcon from "../../assets/images/edit-icon.svg";
import ShareIcon from "../../assets/images/share-icon.svg";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FadeLoader } from "react-spinners";
import Confetti from "react-confetti";
import {
  BACKEND_URL,
  FRONTEND_URL,
} from "../../constants/backend.constant.jsx";

const Dashboard = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);

  const [activeScreen, setActiveScreen] = useState("dashboard");

  const [showModal, setShowModal] = useState(false);
  const handleDeleteIconClick = (quizId) => {
    setQuizIdToDelete(quizId);
    setShowModal(true);
  };
  const [quizIdToDelete, setQuizIdToDelete] = useState(null);

  const handleDelete = () => {
    // Delete the quiz
    axios
      .delete(`${BACKEND_URL}/api/v1/quiz/deletequiz/${quizIdToDelete}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        // Remove the deleted quiz from the state
        setQuizzes(quizzes.filter((quiz) => quiz._id !== quizIdToDelete));
        // Hide the confirmation modal
        setShowModal(false);
      })
      .catch((error) => console.error("Error deleting quiz:", error));
  };

  const handleCancel = () => {
    setShowModal(false);
    setShowQuizPublishedModal(false);
  };

  //for createQuiz Screen
  const [email, setEmail] = useState("");
  const [quizName, setQuizName] = useState("");
  const [quizType, setQuizType] = useState("");
  const handleCancelQuizModal = () => {
    setActiveScreen("dashboard");
  };

  const handleShowQuizQueModal = () => {
    if (quizName && quizType) {
      setShowQuestionModal(true);
      setActiveScreen("dashboard");
    } else {
      alert("Please fill in the Quiz Name and Quiz Type");
    }
  };

  const handleCancelQuizQuestionModal = () => {
    setShowQuestionModal(false);
  };

  //Question Modal -
  //for question numbers
  const [questions, setQuestions] = useState([1]);
  const handleAddQuestion = () => {
    if (questions.length < 5) {
      setQuestions([...questions, { title: "" }]);
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleDeleteQuestion = (index) => {
    if (questions.length > 1) {
      const updatedQuestions = questions.filter((_, i) => i !== index);
      setQuestions(updatedQuestions);

      if (currentQuestionIndex === index) {
        setCurrentQuestionIndex(index > 0 ? index - 1 : 0);
      } else if (currentQuestionIndex > index) {
        setCurrentQuestionIndex(currentQuestionIndex - 1);
      }
    }
    // setCurrentQuestionIndex(index-1)
  };

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  useEffect(() => {
    // Perform side effects here when currentQuestionIndex changes
  }, [currentQuestionIndex]);

  // Update question number change handler to set current question index
  const handleQuestionNoChange = (index) => {
    setCurrentQuestionIndex(index);
  };

  //for questions and options
  const [showQuestionModal, setShowQuestionModal] = useState(false);

  const handleOptionTypeSelect = (index) => {
    setSelectedOptionType(index);
  };

  const [pollQuestion, setPollQuestion] = useState({});
  const handleQuestionTextChange = (e, index) => {
    const updatedQuestions = { ...pollQuestion };
    updatedQuestions[index] = e.target.value;
    setPollQuestion(updatedQuestions);
  };

  const [options, setOptions] = useState(
    Array(5)
      .fill()
      .map(() => [
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
        { text: "", imageURL: "" },
      ])
  );

  const [selectedOptionType, setSelectedOptionType] = useState(0);
  const [ansOption, setAnsOption] = useState({});
  const handleRadioSelect = (index) => {
    const updatedAnsOptions = { ...ansOption };
    updatedAnsOptions[currentQuestionIndex] = index;
    setAnsOption(updatedAnsOptions);
  };

  const [timerType, setTimerType] = useState({});

  const [newQuizId, setNewQuizId] = useState(null);

  const handleTimerTypeSelect = (value) => {
    const updatedTimerTypes = { ...timerType };
    updatedTimerTypes[currentQuestionIndex] = value;
    setTimerType(updatedTimerTypes);
  };

  const handleCreateQuizSubmit = () => {
    // Validate all fields are filled

    const isPollQuestionFilled = pollQuestion[0] !== "";
    const isOptionsFilled = options.some((option) =>
      option.some((item) => item.text !== "" || item.imageURL !== "")
    );
    const isAnsOptionFilled = Object.values(ansOption).some(
      (value) => value !== null
    );
    const isTimerTypeFilled =
      quizType !== "Poll Type"
        ? Object.values(timerType).some((value) => value !== "")
        : true;
    if (!isPollQuestionFilled) {
      alert("Poll question is not filled. Please fill it.");
      return;
    }
    if (selectedOptionType === null) {
      alert("Selected option type is not set. Please set it.");
      return;
    }
    if (!isOptionsFilled) {
      alert("Options are not filled. Please fill it.");
      return;
    }
    if (!isAnsOptionFilled) {
      alert("Answer option is not set. Please set it.");
      return;
    }
    if (!isTimerTypeFilled) {
      alert("Timer type is not set. Please set it.");
      return;
    }

    if (!quizName || !quizType) {
      alert("Please fill in the Quiz Name and Quiz Type");
      return;
    }

    console.log(options);

    const questions = [
      {
        pollQuestion,
        timerType,
        options,
        ansOption,
      },
    ];

    axios
      .post(
        `${BACKEND_URL}/api/v1/quiz/createquiz`,
        { quizName, quizType, questions, email },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
          },
        }
      )
      .then((response) => {
        setNewQuizId(response.data.id);
      })
      .catch((error) => {
        console.error("An error occurred while saving the quiz:", error);
      });

    // delete data in states
    setPollQuestion("");
    setOptions(
      Array(5)
        .fill()
        .map(() => [
          { text: "", imageURL: "" },
          { text: "", imageURL: "" },
          { text: "", imageURL: "" },
          { text: "", imageURL: "" },
        ])
    );
    setAnsOption({});
    setTimerType({});
    setQuizName("");
    setQuizType("");
    setQuestions([1]);
    setCurrentQuestionIndex(0);
    setShowQuizPublishedModal(true);
    setShowQuestionModal(false);
    setNewQuizId(null);
  };

  const handleOptionTextChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions[questionIndex][optionIndex] = {
      ...updatedOptions[questionIndex][optionIndex],
      text: e.target.value,
    };
    setOptions(updatedOptions);
  };

  const handleOptionImageURLChange = (e, questionIndex, optionIndex) => {
    const updatedOptions = [...options];
    updatedOptions[questionIndex][optionIndex] = {
      ...updatedOptions[questionIndex][optionIndex],
      imageURL: e.target.value,
    };
    setOptions(updatedOptions);
  };

  //for analytics tab
  const [quizzes, setQuizzes] = useState([]);
  const [isAnalyticsLoading, setAnalyticsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKEND_URL}/api/v1/quiz/quizzes?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        setQuizzes(response.data.quizzes);
        setTimeout(() => {
          setAnalyticsLoading(false);
        }, 1000);
      })
      .catch((error) => {
        console.error("An error occurred while fetching the quizzes:", error);
      });
  }, [activeScreen, email]);

  //for quiz published modal
  const [showQuizPublishedModal, setShowQuizPublishedModal] = useState(false);

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

  const jwtToken = localStorage.getItem("jwt");
  // console.log("jwt from local storage:", jwtToken);

  axios
    .get(`${BACKEND_URL}/api/v1/auth/isloggedin`, {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
    })
    .then((response) => {
      if (response.data.success) {
        setEmail(response.data.email);
        setIsLoggedIn(response.data.success);
      } else {
        console.log("User is not logged in");
      }
    })
    .catch((error) => {
      console.error("An error occurred:", error);
    });

  const handleLogout = () => {
    axios
      .post(`${BACKEND_URL}/api/v1/auth/logout`, null, {
        headers: {
          Authorization: `Bearer ${jwtToken}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          localStorage.removeItem("jwt"); // Remove JWT from local storage
          navigate("/");
        }
      })
      .catch((error) => {
        console.error("Error during logout:", error);
      });
  };

  const handleShareIconClick = (quizId) => {
    const quizLink = `${FRONTEND_URL}/quiz/${quizId}`;
    navigator.clipboard
      .writeText(quizLink)
      .then(() => {
        // alert("Quiz link copied to clipboard");
      })
      .catch((error) => {
        console.error("Error copying quiz link to clipboard:", error);
      });

    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 1400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  const notifyLinkCopied = () => {
    if (newQuizId) {
      const quizLink = `${FRONTEND_URL}/quiz/${newQuizId}`;
      navigator.clipboard
        .writeText(quizLink)
        .then(() => {
          // The copy operation was successful
        })
        .catch((err) => {
          // The copy operation failed
          console.error("Failed to copy quiz link: ", err);
        });
    }
    toast.success("Link copied to Clipboard", {
      position: "top-right",
      autoClose: 1400,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",
    });
  };

  //for quiz data in dashboard
  const [quizData, setQuizData] = useState(null);
  const [trendingQuizzes, setTrendingQuizzes] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(true);

  useEffect(() => {
    // Fetch data for dashboard main container
    axios
      .get(`${BACKEND_URL}/api/v1/quiz/userData?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        const { quizzes, questions, impressions } = response.data;
        setQuizData({ quizzes, questions, impressions });
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
      });

    // Fetch trending quizzes
    axios
      .get(`${BACKEND_URL}/api/v1/quiz/trendingQuizzes?email=${email}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("jwt")}`,
        },
      })
      .then((response) => {
        setTrendingQuizzes(response.data.quiz);
      })
      .catch((error) => {
        console.error("Error fetching trending quizzes:", error);
      });
  }, [email]);

  useEffect(() => {
    if (quizData !== null && trendingQuizzes) {
      setTimeout(() => {
        setDashboardLoading(false);
      }, 600);
    }
  }, [quizData, trendingQuizzes]);

  return (
    <>
      <div className={styles.mainContainer}>
        <div className={styles.sideBar}>
          <Link to="/dashboard" style={{ textDecoration: "none" }}>
            <div className={styles.logo}>QUIZZIE</div>
          </Link>
          <div className={styles.modesContainer}>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "dashboard" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("dashboard")}
            >
              Dashboard
            </button>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "analytics" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("analytics")}
            >
              Analytics
            </button>
            <button
              className={`${styles.modeBtn} ${
                activeScreen === "createQuiz" ? styles.activeScreen : ""
              }`}
              onClick={() => setActiveScreen("createQuiz")}
            >
              Create Quiz
            </button>
          </div>
          <hr />
          <button
            className={styles.logoutBtn}
            onClick={isLoggedIn ? handleLogout : () => navigate("/")}
          >
            {isLoggedIn ? "LOGOUT" : "LOG IN"}
          </button>
        </div>
        <div className={styles.subContainer}>
          {activeScreen === "dashboard" &&
            (dashboardLoading ? (
              <div className={styles.loaderContainer}>
                <FadeLoader color="#474444" />
              </div>
            ) : (
              <div className={styles.dashboardScreen}>
                <div className={styles.dashboardMainCard}>
                  <div className={styles.totalQuiz}>
                    <div className={styles.dashboardQuizDataNumbers}>
                      {quizData && quizData.quizzes}
                    </div>
                    Quizzes Created
                  </div>
                  <div className={styles.totalQuestions}>
                    <div className={styles.dashboardQuizDataNumbers}>
                      {quizData && quizData.questions}
                    </div>
                    Questions Created
                  </div>
                  <div className={styles.totalImpressions}>
                    <div className={styles.dashboardQuizDataNumbers}>
                      {quizData && quizData.impressions >= 2000
                        ? `${Math.round(
                            quizData.impressions / 2 / 1000
                          ).toFixed(1)}k`
                        : Math.round(quizData.impressions / 2)}
                    </div>{" "}
                    Impressions
                  </div>
                </div>
                <div>
                  <h2>Trending Quiz</h2>
                  <div
                    className={`${styles.trendingQuizCardContainer} ${
                      trendingQuizzes.length > 0 ? "" : styles.firstQuiz
                    }`}
                  >
                    {trendingQuizzes.length > 0 ? (
                      trendingQuizzes.map((quiz) => (
                        <TrendingCard
                          key={quiz._id}
                          quizName={quiz.quizName}
                          impressions={Math.round(quiz.impressions / 2)}
                          creationDate={new Date(quiz.date).toLocaleDateString(
                            "en-US",
                            { day: "2-digit", month: "short", year: "numeric" }
                          )}
                        />
                      ))
                    ) : (
                      <p className={styles.firstQuizPara}>
                        You haven't created any Quiz, Click on Create Quiz to
                        create your first Quiz
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}

          {activeScreen === "analytics" &&
            (isAnalyticsLoading ? (
              <div className={styles.loaderContainer}>
                <FadeLoader color="#474444" />
              </div>
            ) : (
              <div className={styles.analyticsScreen}>
                <h1 className={styles.analyticsHeading}>Quiz Analytics</h1>
                <table className={styles.analyticsTable}>
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Quiz Name</th>
                      <th>Created on</th>
                      <th>Impression</th>
                      <th></th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {quizzes.map((quiz, index) => (
                      <tr key={quiz._id}>
                        <td>{index + 1}</td>
                        <td>{quiz.quizName}</td>
                        <td>{new Date(quiz.date).toLocaleDateString()}</td>
                        <td>{Math.round(quiz.impressions / 2)}</td>
                        <td>
                          <img
                            src={EditIcon}
                            alt=""
                            onClick={() =>
                              alert(
                                "This Feature is under development, Please try again later..."
                              )
                            }
                          />
                          <img
                            src={DeleteIcon}
                            alt=""
                            onClick={() => handleDeleteIconClick(quiz._id)}
                          />
                          <img
                            src={ShareIcon}
                            alt=""
                            onClick={() => handleShareIconClick(quiz._id)}
                          />
                        </td>
                        <td
                          onClick={() => navigate(`/quizanalysis/${quiz._id}`)}
                          style={{
                            cursor: "pointer",
                            textDecoration: "underline",
                          }}
                        >
                          Question Wise Analysis
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ))}
        </div>
        {showModal && (
          <div className={styles.modalOverlay} onClick={handleCancel}>
            <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
              <div className={styles.modalContent}>
                <p
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Are you sure you want to delete?
                </p>
                <div className={styles.buttonContainer}>
                  <button
                    onClick={handleDelete}
                    className={styles.confirmDeleteModalButton}
                  >
                    Confirm Delete
                  </button>
                  <button
                    onClick={handleCancel}
                    className={styles.cancelModalButton}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
        {activeScreen === "createQuiz" && (
          <div className={styles.createQuizScreen}>
            <div className={styles.modalOverlay}>
              <div
                className={styles.modal}
                onClick={(e) => e.stopPropagation()}
              >
                <div className={styles.modalQuizNameContent}>
                  <div>
                    <input
                      type="text"
                      placeholder="Quiz name"
                      value={quizName}
                      onChange={(e) => setQuizName(e.target.value)}
                      className={styles.modalQuizNameInput}
                    />
                  </div>
                  <div className={styles.modalQuizTypeContainer}>
                    <div>Quiz Type</div>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        value="Q & A"
                        checked={quizType === "Q & A"}
                        onChange={() => setQuizType("Q & A")}
                        className={styles.modalRadio}
                      />
                      Q & A
                    </label>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        value="Poll Type"
                        checked={quizType === "Poll Type"}
                        onChange={() => setQuizType("Poll Type")}
                        className={styles.modalRadio}
                      />
                      Poll Type
                    </label>
                  </div>
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handleCancelQuizModal}
                      className={styles.cancelModalButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleShowQuizQueModal}
                      className={styles.confirmQuizNameButton}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {showQuestionModal && (
          <div
            className={styles.questionModalOverlay}
            // onClick={handleCreateQuiz}
          >
            <div
              className={styles.questionModal}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                  className={styles.questionNoContainer}
                >
                  <div
                    style={{
                      display: "flex",
                      gap: ".5rem",
                      alignItems: "center",
                    }}
                  >
                    {questions.map((question, index) => (
                      <div
                        className={`${styles.questionNo} ${
                          index === currentQuestionIndex
                            ? styles.activeQuestionNumber
                            : ""
                        }`}
                        key={index}
                        onClick={() => handleQuestionNoChange(index)}
                      >
                        {index + 1}
                        {index !== 0 && (
                          <span
                            className={styles.crossBtn}
                            onClick={() => handleDeleteQuestion(index)}
                          >
                            x
                          </span>
                        )}
                      </div>
                    ))}
                    {questions.length < 5 && (
                      <div
                        className={styles.addBtn}
                        onClick={handleAddQuestion}
                      >
                        +
                      </div>
                    )}
                  </div>
                  <p>Max 5 Questions</p>
                </div>
                <div className={styles.questionContent}>
                  <div>
                    <input
                      type="text"
                      placeholder="Poll Question"
                      value={pollQuestion[currentQuestionIndex] || ""}
                      onChange={(e) =>
                        handleQuestionTextChange(e, currentQuestionIndex)
                      }
                      className={styles.pollQuestion}
                    />
                  </div>

                  <div
                    className={styles.pollOptionType}
                    style={{ display: "flex" }}
                  >
                    <div style={{ marginRight: "1.5rem" }}>Option Type:</div>
                    <label className={styles.modalLabel}>
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 0}
                        onChange={() => handleOptionTypeSelect(0)}
                      />
                      Text
                    </label>
                    <label
                      className={styles.modalLabel}
                      style={{ marginLeft: ".5rem" }}
                    >
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 1}
                        onChange={() => handleOptionTypeSelect(1)}
                      />
                      Image URL
                    </label>
                    <label
                      className={styles.modalLabel}
                      style={{ marginLeft: ".5rem" }}
                    >
                      <input
                        type="radio"
                        name="optionType"
                        checked={selectedOptionType === 2}
                        onChange={() => handleOptionTypeSelect(2)}
                      />
                      Text and Image URL
                    </label>
                  </div>
                  <div
                    className={styles.pollOptions}
                    style={{ display: "flex", flexDirection: "column" }}
                  >
                    {[0, 1, 2, 3].map((index) => (
                      <div className={styles.modalLabel} key={index}>
                        <input
                          type="radio"
                          name="ansOption"
                          checked={ansOption[currentQuestionIndex] === index}
                          onChange={() => handleRadioSelect(index)}
                        />
                        {selectedOptionType === 0 && (
                          <input
                            type="text"
                            name={`optionText_${index}`}
                            value={options[currentQuestionIndex][index].text}
                            placeholder="Option"
                            onChange={(e) =>
                              handleOptionTextChange(
                                e,
                                currentQuestionIndex,
                                index
                              )
                            }
                            className={`${styles.optionInput} ${
                              ansOption &&
                              ansOption[currentQuestionIndex] === index
                                ? styles.greenBackground
                                : ""
                            }`}
                          />
                        )}
                        {selectedOptionType === 1 && (
                          <input
                            type="url"
                            name={`optionImageURL_${index}`}
                            value={
                              options[currentQuestionIndex][index].imageURL
                            }
                            placeholder="Option Image URL"
                            onChange={(e) =>
                              handleOptionImageURLChange(
                                e,
                                currentQuestionIndex,
                                index
                              )
                            }
                            className={`${styles.optionInput} ${
                              ansOption &&
                              ansOption[currentQuestionIndex] === index
                                ? styles.greenBackground
                                : ""
                            }`}
                          />
                        )}
                        {selectedOptionType === 2 && (
                          <>
                            <input
                              type="text"
                              name={`optionText_${index}`}
                              value={options[currentQuestionIndex][index].text}
                              placeholder="Option"
                              onChange={(e) =>
                                handleOptionTextChange(
                                  e,
                                  currentQuestionIndex,
                                  index
                                )
                              }
                              className={`${styles.optionInput} ${
                                ansOption &&
                                ansOption[currentQuestionIndex] === index
                                  ? styles.greenBackground
                                  : ""
                              }`}
                            />

                            <input
                              type="url"
                              name={`optionImageURL_${index}`}
                              value={
                                options[currentQuestionIndex][index].imageURL
                              }
                              placeholder="Option Image URL"
                              onChange={(e) =>
                                handleOptionImageURLChange(
                                  e,
                                  currentQuestionIndex,
                                  index
                                )
                              }
                              className={`${styles.optionInput} ${
                                ansOption &&
                                ansOption[currentQuestionIndex] === index
                                  ? styles.greenBackground
                                  : ""
                              }`}
                            />
                          </>
                        )}
                      </div>
                    ))}
                  </div>

                  {quizType !== "Poll Type" && (
                    <div
                      className={styles.timerType}
                      style={{ display: "flex" }}
                    >
                      {/* <div style={{ marginRight: "auto" }}>Timer Type:</div> */}
                      {/* <label className={styles.modalLabel}>
                        <input
                          type="radio"
                          name="timerType"
                          value="5 Sec"
                          checked={timerType[currentQuestionIndex] === "5 Sec"}
                          onChange={() => handleTimerTypeSelect("5 Sec")}
                        />{" "}
                        5 Sec
                      </label> */}
                      {/* <label
                        className={styles.modalLabel}
                        style={{ marginLeft: ".5rem" }}
                      >
                        <input
                          type="radio"
                          name="timerType"
                          value="10 Sec"
                          checked={timerType[currentQuestionIndex] === "10 Sec"}
                          onChange={() => handleTimerTypeSelect("10 Sec")}
                        />
                        10 Sec
                      </label> */}
                      {/* <label
                        className={styles.modalLabel}
                        style={{ marginLeft: ".5rem" }}
                      >
                        <input
                          type="radio"
                          name="timerType"
                          value="OFF"
                          checked={timerType[currentQuestionIndex] === "OFF"}
                          onChange={() => handleTimerTypeSelect("OFF")}
                        />{" "}
                        OFF
                      </label> */}
                    </div>
                  )}
                  <div className={styles.buttonContainer}>
                    <button
                      onClick={handleCancelQuizQuestionModal}
                      className={styles.cancelModalButton}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleCreateQuizSubmit}
                      className={styles.confirmCreateQuizButton}
                    >
                      Create Quiz
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
        {showQuizPublishedModal && (
          <div className={styles.modalOverlay} onClick={handleCancel}>
            <Confetti width={width} height={height} />
            <div
              className={styles.modalPublished}
              onClick={(e) => e.stopPropagation()}
            >
              <div className={styles.modalContent}>
                <p
                  style={{
                    fontSize: "1.7rem",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  Congrats your Quiz is <br />
                  Published!
                </p>
                <div className={styles.quizLink}>
                  {newQuizId
                    ? `${FRONTEND_URL}/quiz/${newQuizId}`
                    : "Link loading... "}
                </div>

                <div className={styles.buttonContainer}>
                  <button
                    className={styles.shareLinkBtn}
                    onClick={notifyLinkCopied}
                  >
                    Share
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <ToastContainer />
    </>
  );
};

export default Dashboard;
