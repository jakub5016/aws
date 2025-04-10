import type React from "react";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { confirmSignUp } from "./authService.ts";

const ConfirmUserPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [confirmationCode, setConfirmationCode] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await confirmSignUp(email, confirmationCode);
      alert("Account confirmed successfully!\nSign in on next page.");
      navigate("/login");
    } catch (error) {
      alert(`Failed to confirm account: ${error}`);
    }
  };

  return (
    <div className="shadow-sm card app-container">
      <div className="card-body">
        <h2 className="card-title">Confirm Account</h2>
        <form onSubmit={handleSubmit}>
          <div className="pb-2">
            <input
              className="form-control"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
            />
          </div>
          <div className="pb-2">
            <input
              className="form-control"
              type="text"
              value={confirmationCode}
              onChange={(e) => setConfirmationCode(e.target.value)}
              placeholder="Confirmation Code"
              required
            />
          </div>
          <button className="btn btn-primary" type="submit">Confirm Account</button>
        </form>
      </div>
    </div>
  );
};

export default ConfirmUserPage;
