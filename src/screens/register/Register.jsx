import React, { useState, useEffect } from "react";
import styles from "./Register.module.css";
import { FadeLoader } from "react-spinners";
import { useNavigate } from "react-router-dom";
//import dotenv from "dotenv";
import { BACKEND_URL } from "../../constants/backend.constant.jsx";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loginErrorMessage, setLoginErrorMessage] = useState("");
  const [signupErrorMessage, setSignupErrorMessage] = useState("");

  const [isSignUpLoading, setIsSignUpLoading] = useState(false);
  const [isLoginLoading, setIsLoginLoading] = useState(false);

  const [activeMode, setActiveMode] = useState("signup");

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmitSignUpForm = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      setSignupErrorMessage("Passwords do not match");
      setFormData({
        ...formData,
        password: "",
        confirmPassword: "",
      });
      return;
    }

    setIsSignUpLoading(true);

    fetch(`${BACKEND_URL}/api/v1/auth/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "FAIL") {
          setSignupErrorMessage(data.message);
          setIsSignUpLoading(false);
        } else {
          localStorage.setItem("jwt", data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleSubmitLoginForm = (e) => {
    e.preventDefault();
    setIsLoginLoading(true);
    // console.log("fucntion started");
    fetch(`${BACKEND_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        if (data.status === "FAIL") {
          setLoginErrorMessage(data.message);
          console.log(data.message);
          setIsLoginLoading(false);
          setFormData({
            ...formData,
            password: "",
          });
        } else {
          localStorage.setItem("jwt", data.token);
          navigate("/dashboard");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    console.log("fucntion stopped");
  };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
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
    <>
      <div className={styles.mainContainer}>
        <div className={styles.subContainer}>
          <div className={styles.logo}>QUIZZIE</div>
          <div className={styles.modeSwitch}>
            <button
              className={`${styles.signUpMode} ${
                activeMode === "signup" ? styles.activeMode : ""
              }`}
              onClick={() => setActiveMode("signup")}
            >
              Sign Up
            </button>
            <button
              className={`${styles.logInMode} ${
                activeMode === "login" ? styles.activeMode : ""
              }`}
              onClick={() => setActiveMode("login")}
            >
              Log In
            </button>
          </div>

          {activeMode === "signup" && (
            <div className={styles.signUpFormContainer}>
              <form
                action={`${BACKEND_URL}/api/v1/auth/signup`}
                method="POST"
                onSubmit={handleSubmitSignUpForm}
                className={styles.formContainer}
              >
                <div className={styles.formAttribute}>
                  <label htmlFor="name" className={styles.formLabel}>
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formAttribute}>
                  <label htmlFor="email" className={styles.formLabel}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formAttribute}>
                  {" "}
                  <label htmlFor="password" className={styles.formLabel}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>
                <div className={styles.formAttribute}>
                  <label htmlFor="confirmPassword" className={styles.formLabel}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>
                {signupErrorMessage && (
                  <div className={styles.errorMessageLabel}>
                    {signupErrorMessage}
                  </div>
                )}
                <button
                  type="submit"
                  className={styles.signUpBtn}
                  onClick={handleSubmitSignUpForm}
                >
                  {isSignUpLoading ? "Loading..." : "Sign Up"}
                </button>
              </form>
            </div>
          )}

          {activeMode === "login" && (
            <div className={styles.logInFormContainer}>
              <form
                action={`${BACKEND_URL}/api/v1/auth/login`}
                method="POST"
                onSubmit={handleSubmitLoginForm}
                className={styles.formContainer}
              >
                <div className={styles.formAttribute}>
                  {" "}
                  <label htmlFor="email" className={styles.formLabel}>
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                <div className={styles.formAttribute}>
                  <label htmlFor="password" className={styles.formLabel}>
                    Password
                  </label>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className={styles.formInput}
                  />
                </div>

                {loginErrorMessage && (
                  <div className={styles.errorMessageLabel}>
                    {loginErrorMessage}
                  </div>
                )}

                <button type="submit" className={styles.signUpBtn}>
                  {isLoginLoading ? "Loading..." : "Log In"}
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Register;
