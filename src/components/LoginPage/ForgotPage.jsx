import React from "react";
import LoginPageCover from "../LoginPageCover/LoginPageCover";

import LoginPageNav from "../LoginPageNav/LoginPageNav";
import "./LoginPage.css";
import ForgotPageForm from "../LoginPageForm/ForgotPageForm";

function ForgotPage() {
  localStorage.removeItem("updateStatus");
  return (
    <div className="Loginpage_container">
      <div className="loginpage_navbar">
        <LoginPageNav ProductionUrl="login" />
      </div>
      <div className="loginpage_content">
        <div className="loginpage_cover">
          <LoginPageCover ProductionUrl="login" />
        </div>
        <div className="loginpg_form_container">
          <ForgotPageForm />
        </div>
      </div>
    </div>
  );
}

export default ForgotPage;
