import {
  USER_LOGIN_LOADING,
  USER_LOGIN_SUCCESSFUL,
  USER_LOGIN_ERROR,
  USER_REGISTRATION_LOADING,
  USER_REGISTRATION_SUCCESSFUL,
  USER_REGISTRATION_ERROR,
  USER_REGISTRATION_VERIFICATION_ERROR,
  USER_REGISTRATION_VERIFICATION_LOADING,
  USER_REGISTRATION_VERIFICATION_SUCCESSFUL,
  USER_REGISTRATION_VERIFICATION_AGAIN_LOADING,
  USER_REGISTRATION_VERIFICATION_AGAIN_SUCCESSFUL,
  USER_REGISTRATION_VERIFICATION_AGAIN_ERROR,
  USER_LOGOUT,
  USER_FORGOT_PASS_LOADING,
  USER_FORGOT_PASS_SUCCESSFUL,
  USER_FORGOT_PASS_ERROR,
  USER_RESET_PASS_LOADING,
  USER_RESET_PASS_SUCCESSFUL,
  USER_RESET_PASS_ERROR,
} from "../constants/userConstants";
import axios from "axios";
import { CART_EMPTY } from "../constants/cartConstants";
import { ORDER_RESET } from "../constants/orderConstants";

export const userLogin = (phone, password, history) => async (dispatch) => {
  dispatch({ type: USER_LOGIN_LOADING });

  try {
    const res = await axios.post("https://admin.veggi365.com/api/user/auth", {
      phone: phone,
      password: password,
    });
    const { data: requiredInfo } = res;

    if (res.data.varification === false) {
      history.push({
        pathname: "/verify-otp",
        state: {
          otpToken: res?.data?.otptoken,
          tempToken: res?.data?.temptoken,
        },
      });
      return;
    }

    // axios token check

    const authAxios = axios.create({
      baseURL: "https://admin.veggi365.com/api",
      headers: {
        // Authorization: `Bearer ${token}`,
        Authorization: `Bearer ${requiredInfo.token} `,
      },
    });

    const { data } = await authAxios.get("/user");

    localStorage.setItem("loggedUser", JSON.stringify(data));
    // localStorage.setItem("userToken", JSON.stringify(token));
    localStorage.setItem("userToken", JSON.stringify());

    dispatch({ type: USER_LOGIN_SUCCESSFUL, payload: JSON.stringify(data) });
  } catch (error) {
    dispatch({
      type: USER_LOGIN_ERROR,
      payload: "invalid credentials",
    });
  }
};

export const userLogout = () => (dispatch) => {
  localStorage.removeItem("userToken");
  localStorage.removeItem("loggedUser");
  localStorage.removeItem("itemsPrice");
  localStorage.removeItem("deliveryPrice");
  localStorage.removeItem("taxPrice");
  localStorage.removeItem("totalPrice");
  localStorage.removeItem("orders");
  JSON.parse(localStorage.getItem("cartUnitData5"))?.map((item) => {
    localStorage.removeItem(`${item}`);
  });

  dispatch({ type: USER_LOGOUT });
  dispatch({ type: CART_EMPTY });
  dispatch({ type: ORDER_RESET });
};

export const userRegister =
  (name, mobile, email, password, history) => async (dispatch) => {
    dispatch({ type: USER_REGISTRATION_LOADING });
    try {
      const { data: registerInfo } = await axios.post(
        "https://admin.veggi365.com/api/user",
        {
          user_name: name,
          user_phone: Number(mobile),
          user_email: email,
          user_password: password,
        }
      );
      console.log("DATA:", registerInfo);

      dispatch({ type: USER_REGISTRATION_SUCCESSFUL, payload: registerInfo });
      history.push({
        pathname: "/verify-otp",
        state: {
          otpToken: registerInfo?.otptoken,
          tempToken: registerInfo?.temptoken,
        },
      });

      const {
        data: { token },
      } = await axios.post("https://admin.veggi365.com/api/user/auth", {
        phone: Number(mobile),
        password: password,
      });

      // axios token check
      const authAxios = axios.create({
        baseURL: "https://admin.veggi365.com/api",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const { data } = await authAxios.get("/user");

      localStorage.setItem("loggedUser", JSON.stringify(data));
      localStorage.setItem("userToken", JSON.stringify(token));

      dispatch({ type: USER_LOGIN_SUCCESSFUL, payload: JSON.stringify(data) });
      //dispatch({ type: USER_LOGIN_SUCCESSFUL, payload: data });
    } catch (error) {
      dispatch({
        type: USER_REGISTRATION_ERROR,
        payload: "user already exists",
      });
    }
  };

export const againOtp = (tempToken, history) => {
  return async (dispatch) => {
    dispatch({ type: USER_REGISTRATION_VERIFICATION_AGAIN_LOADING });
    try {
      const { data } = await axios.post(
        "https://admin.veggi365.com/api/user/resendotp",
        {
          temptoken: tempToken,
        }
      );
      if (data.status === "success") {
        dispatch({
          type: USER_REGISTRATION_VERIFICATION_AGAIN_SUCCESSFUL,
          payload: data.status,
        });
        history.push({
          pathname: "/verify-otp",
          state: {
            otpToken: data?.otptoken,
            tempToken: data?.temptoken,
          },
        });
      } else {
        dispatch({
          type: USER_REGISTRATION_VERIFICATION_AGAIN_ERROR,
          payload: "invalid otp",
        });
      }
    } catch (error) {
      dispatch({
        type: USER_REGISTRATION_VERIFICATION_AGAIN_ERROR,
        payload: "invalid otp",
      });
    }
  };
};

export const resetPassword = (token, password, history) => async (dispatch) => {
  dispatch({ type: USER_RESET_PASS_LOADING });
  try {
    const { data } = await axios.post(
      "https://admin.veggi365.com/api/user/resetpass",
      {
        token: token,
        password: password,
      }
    );
    if (data.status === "success") {
      dispatch({
        type: USER_RESET_PASS_SUCCESSFUL,
        payload: data.status,
      });
      history.push("/login");
    } else {
      dispatch({
        type: USER_RESET_PASS_ERROR,
        payload: "invalid otp",
      });
    }
  } catch (error) {
    dispatch({
      type: USER_RESET_PASS_ERROR,
      payload: "invalid otp",
    });
  }
};

export const forgotpass = (mobileNumber, history) => async (dispatch) => {
  dispatch({ type: USER_FORGOT_PASS_LOADING });
  try {
    const { data } = await axios.post(
      "https://admin.veggi365.com/api/user/forgotpassword",
      {
        phone: mobileNumber,
      }
    );
    if (data.status === "success") {
      dispatch({ type: USER_FORGOT_PASS_SUCCESSFUL });

      history.push({
        pathname: "/verify-otp",
        state: {
          otpToken: data?.otptoken,
          tempToken: data?.temptoken,
        },
      });
    } else {
      dispatch({
        type: USER_FORGOT_PASS_ERROR,
        payload: "invalid otp",
      });
    }
  } catch (error) {
    dispatch({
      type: USER_FORGOT_PASS_ERROR,
      payload: "invalid otp",
    });
  }
};

export const otpVerification =
  (otp = "", otptoken, forgotpassword = false, history) =>
  async (dispatch) => {
    dispatch({ type: USER_REGISTRATION_VERIFICATION_LOADING });
    try {
      if (forgotpassword) {
        const { data } = await axios.post(
          "https://admin.veggi365.com/api/user/verifyotp",
          {
            otp: otp,
            otptoken: otptoken,
          }
        );
        if (data.status === "success") {
          dispatch({
            type: USER_REGISTRATION_VERIFICATION_SUCCESSFUL,
            payload: data.status,
          });
          history.push({
            pathname: "/reset-password",
            state: {
              tempToken: data?.temptoken,
            },
          });
        } else {
          dispatch({
            type: USER_REGISTRATION_VERIFICATION_ERROR,
            payload: "invalid otp",
          });
        }
        return;
      }

      const {
        data: { status, token },
      } = await axios.post("https://admin.veggi365.com/api/user/verifyotp", {
        otptoken: otptoken,
        otp: otp,
      });
      if (status === "success") {
        dispatch({
          type: USER_REGISTRATION_VERIFICATION_SUCCESSFUL,
          payload: status,
        });
        localStorage.setItem("userToken", JSON.stringify(token));

        const authAxios = axios.create({
          baseURL: "https://admin.veggi365.com/api",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const { data } = await authAxios.get("/user");

        localStorage.setItem("loggedUser", JSON.stringify(data));
        localStorage.setItem("userToken", JSON.stringify(token));

        dispatch({
          type: USER_LOGIN_SUCCESSFUL,
          payload: JSON.stringify(data),
        });
        //dispatch({ type: USER_LOGIN_SUCCESSFUL, payload: data });
      }
    } catch (error) {
      dispatch({
        type: USER_REGISTRATION_VERIFICATION_ERROR,
        payload: "invalid otp",
      });
    }
  };

export const userUpdate = (old_pass, new_pass) => async (dispatch) => {
  try {
    const authAxios = axios.create({
      baseURL: "https://admin.veggi365.com/api",
      headers: {
        Authorization: `Bearer ${JSON.parse(
          localStorage.getItem("userToken")
        )}`,
      },
    });

    await authAxios.post("/user/changepass", {
      old_password: old_pass,
      new_password: new_pass,
    });
    localStorage.setItem("updateStatus", true);
    setTimeout(() => {
      dispatch(userLogout());
    }, 100);
    //dispatch({ type: USER_LOGIN_SUCCESSFUL, payload: data });
  } catch (error) {
    localStorage.setItem("updateStatus", false);
  }
};
