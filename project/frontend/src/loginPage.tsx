import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signIn, signUp } from "./authService.ts";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const navigate = useNavigate();

  const [valid, setValid] = useState({
    hasNumber: false,
    hasSpecialChar: false,
    hasUppercase: false,
    hasLowercase: false,
  });

  const validatePassword = (pwd) => {
    const hasNumber = /\d/.test(pwd);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(pwd);
    const hasUppercase = /[A-Z]/.test(pwd);
    const hasLowercase = /[a-z]/.test(pwd);

    setValid({ hasNumber, hasSpecialChar, hasUppercase, hasLowercase });
  };

  const handleChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    validatePassword(newPassword);
  };

  const isValid = Object.values(valid).every(Boolean);

  const handleSignIn = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      const session = await signIn(email, password);
      console.log("Sign in successful", session);
      if (session && typeof session.AccessToken !== "undefined") {
        sessionStorage.setItem("accessToken", session.AccessToken);
        if (sessionStorage.getItem("accessToken")) {
          window.location.href = "/home";
        } else {
          console.error("Session token was not set properly.");
        }
      } else {
        console.error("SignIn session or AccessToken is undefined.");
      }
    } catch (error) {
      alert(`Sign in failed: ${error}`);
    }
  };

  const handleSignUp = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    try {
      await signUp(email, password);
      navigate("/confirm", { state: { email } });
    } catch (error) {
      alert(`Sign up failed: ${error}`);
    }
  };

  return (
    <div className="shadow-sm card app-container">
      <div className="card-body">
      <h4 className="card-title d-flex justify-content-between">
        <div>
        {isSignUp ? "Sign up to create an account" : "Sign in to your account"}
        </div>
        <button className="btn btn-warning" type="button" onClick={() => setIsSignUp(!isSignUp)}>
          {isSignUp
            ? "Already have an account? Sign In"
            : "Need an account? Sign Up"}
        </button>
      </h4>
      <form className="p-2"onSubmit={isSignUp ? handleSignUp : handleSignIn}>
        <div className="pb-2">
          <input
            className="form-control inputText"
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </div>
        <div className="pb-2">
          <input
            className="form-control inputText"
            id="password"
            type="password"
            value={password}
            onChange={isSignUp? handleChange : (e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </div>
        {isSignUp &&(
          <ul className="text-sm">
            <li style={{ color: valid.hasNumber ? "green" : "red" }}>
              {valid.hasNumber ? "✅" : "❌"} Contains at least 1 number
            </li>
            <li style={{ color: valid.hasSpecialChar ? "green" : "red" }}>
              {valid.hasSpecialChar ? "✅" : "❌"} Contains at least 1 special character
            </li>
            <li style={{ color: valid.hasUppercase ? "green" : "red" }}>
              {valid.hasUppercase ? "✅" : "❌"} Contains at least 1 uppercase letter
            </li>
            <li style={{ color: valid.hasLowercase ? "green" : "red" }}>
              {valid.hasLowercase ? "✅" : "❌"} Contains at least 1 lowercase letter
            </li>
          </ul>
        )}
        {isSignUp && (
          <div className="pb-2">
            <input
              className="form-control inputText"
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              required
            />
          </div>
        )}
        <button className="btn btn-primary" type="submit" disabled={isSignUp? !isValid : false}>{isSignUp ? "Sign Up" : "Sign In"}</button>
      </form>
      </div>
    </div>
  );
};

export default LoginPage;
