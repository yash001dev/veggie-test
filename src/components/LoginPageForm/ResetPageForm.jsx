import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useHistory } from "react-router-dom";
import { userLogin } from "../../redux/actions/userActions";
import LoadingBox from "../../components/LoadingBox";
import ErrorBox from "../../components/ErrorBox";
import * as yup from "yup";
import "./LoginPageForm.css";
const schema = yup.object().shape({
  Password: yup.string().required().min(3).max(12), //yup.string().email().required()  //yup.number().required()
});

function ResetPageForm(props) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: yupResolver(schema) });

  let history = useHistory();

  const dispatch = useDispatch();
  const { loading, user, error } = useSelector(
    (state) => state.userLoginReducer
  );

  const handleLogin = (data) => {
    dispatch(userLogin(data.PhoneNumber, data.Password,history));
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (Object.keys(user).length) {
      history.push("/");
    }
  }, [history, user]);
  return (
    <div className="LoginPageForm_container common_flex">
      <div className="loginform_container">
        <div className="loginfrom_title common_flex">Reset Password</div>
        {loading && <LoadingBox />}
        {error && <ErrorBox msg={error} />}
        <div className="loginform_form">
          <form onSubmit={handleSubmit(handleLogin)} noValidate>
            <div className="login_form_fields">
              <label htmlFor="P" className="form_label">
                Enter New Password
              </label>
              <input
                type="text"
                name="password"
                id="password"
                style={{marginBottom:"10px"}}
                placeholder="Enter Password"
                className="loginform_input"
                {...register("Password", {
                  required: true,
                })}
              />
              {console.log(errors)}
              <span style={{marginTop:"5px"}} className="error_msg">{errors.Password?.message}</span>
            </div>

            <div
              className="login_form_fields"
              style={{ marginBottom: ".3rem" }}
            >
              <input
                type="submit"
                className="loginform_input_btn common_flex"
                value="Submit"
              />
            </div>
          </form>
        </div>
        
      </div>
    </div>
  );
}

export default ResetPageForm;
