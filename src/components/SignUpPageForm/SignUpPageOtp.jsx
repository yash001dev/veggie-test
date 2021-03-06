import React from 'react';
import {useForm} from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch,useSelector } from 'react-redux';
import {Link} from 'react-router-dom';
import LoadingBox from '../LoadingBox';
import ErrorBox from '../ErrorBox';
import { useHistory } from 'react-router-dom';
import * as yup from "yup";
import  {againOtp, otpVerification} from '../../redux/actions/userActions';
import "./SignUpPageForm.css";
import { useEffect } from 'react';
import LoginPageNav from './../LoginPageNav/LoginPageNav';
import LoginPageCover from './../LoginPageCover/LoginPageCover';
import { useState } from 'react';

function SignUpPageOtp(props) {
    const {register, handleSubmit,formState:{errors}}=useForm();
    let history = useHistory();
    const dispatch = useDispatch();
    
    console.log("history:",history);
    if(!history.location?.state?.otpToken){
        history.push('/login');
    }
    // const {loading}=useSelector((state) => state.userVerificationReducer);

    const handleOtp=(data='')=>{
        dispatch(otpVerification(
        data.OTP,
        history.location?.state?.otpToken??'',
        history,
        history.location?.state?.forgotpassword??false));
    };

    const handleResend=()=>{
        console.log("Handle Resend");
        dispatch(againOtp(history.location?.state?.tempToken,history))
    }

    useEffect(() => {
    window.scrollTo(0, 0);
    },[]);

    return(
        <div className="Loginpage_container">
        <div className="loginpage_navbar">
            <LoginPageNav ProductionUrl="signup" />
        </div>
        <div className="loginpage_content">
            <div className="loginpage_cover">
                <LoginPageCover ProductionUrl="signup" />
             </div>
        <div className="loginpg_form_container">
        <div className="LoginPageForm_container common_flex" style={{maxWidth:"600px"}}>
            <div className="signupform_container">
                <div className="loginfrom_title common_flex">
                    Verify User
                </div>
                {/* {loading && <LoadingBox />} */}
                {/* {newUser && <ErrorBox msg={newUser} />} */}
                <form onSubmit={handleSubmit(handleOtp)}> 
                    <div className="signupform_field">
                        <div className="sec1">
                            <div className="login_form_fields">
                                <label htmlFor="OTP" className="form_label">
                                    OTP
                                </label>
                                <input
                                    type="text"
                                    name="OTP"
                                    id="OTP"
                                    placeholder="Enter OTP"
                                    className="Signupform_input"
                                    {...register("OTP",{
                                        required: "OTP is required",    
                                        minLength:6,
                                        maxLength:6,
                                    })}
                                />
                                <button className="aboutbtn" onClick={handleResend}>Resend OTP</button>
                                <span className="error_msg">{errors.OTP && "Invalid otp"}</span>
                            </div>
                        </div>
                    </div>

                    <div className="login_form_fields"
                    style={{marginBottom:".3rem"}}
                    >
                        <input
                            type="submit"
                            className="signupform_input_btn common_flex"
                            value="Submit"
                        />
                    </div>
                </form>
            </div>
        </div>
        </div>
        </div>
        </div>
    )
}

export default SignUpPageOtp;