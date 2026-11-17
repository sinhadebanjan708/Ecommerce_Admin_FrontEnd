import {  logoutService , sendLoginOTP , checkExsistingUser,verifyLoginOTP } from "../services/auth.service";
// import { showAlert } from "../slices/alertSlice";
import {
//   loginRequest,
//   checkUserImage,
  loginSuccess,
  checkUserAvailable,
//   loginFailure,
  logout,
//   toggleSidebar,
//   setPublicKey,
} from "../slices/authSlice";
import {
  globalLoaderOpen,
  globalLoaderClose,
} from "../slices/globalSlice";
// import JSEncrypt from "jsencrypt";
// import { globalLoaderOpen, globalLoaderClose } from "../slices/globalSlice";


export const userLoginOTP = (email) => async (dispatch) => {
//   dispatch(loginRequest());
//   dispatch(globalLoaderOpen());

  try {
    //     // ==========================================
    //     // STEP 1 : Get Public Key from Login Service
    //     // ==========================================

    //     const response = await authService.getPublicKey();

    //     const publicKey = response.data;

    //     // ==========================================
    //     // STEP 2 : Convert Base64 Key to PEM Format
    //     // JSEncrypt expects PEM format
    //     // ==========================================

    //     const pemPublicKey = `-----BEGIN PUBLIC KEY-----
    // ${publicKey}
    // -----END PUBLIC KEY-----`;

    //     // ==========================================
    //     // STEP 3 : Encrypt Password
    //     // ==========================================

    //     const encrypt = new JSEncrypt();

    //     encrypt.setPublicKey(pemPublicKey);

    //     const encryptedPassword = encrypt.encrypt(data.password);

    //     if (!encryptedPassword) {
    //       throw new Error("Password encryption failed");
    //     }

    //     // ==========================================
    //     // STEP 4 : Create Login Payload
    //     // ==========================================

    //     const loginPayload = {
    //       ...data,
    //       password: encryptedPassword,
    //     };

    //     // ==========================================
    //     // STEP 5 : Call Existing Login API
    //     // ==========================================

    //     const loginResponse = await authService.login(loginPayload);

    //     dispatch(loginSuccess(loginResponse));

    //     dispatch(
    //       showAlert({
    //         type: "success",
    //         title: "Login Successful",
    //         message: `Welcome back, ${loginResponse.employee?.employeeName || ""}!`,
    //       })
    //     );

    //     return {
    //       success: true,
    //       data: loginResponse,
    //     };

    // response shape: { employee: {...}, menus: [...] }
    const response = await sendLoginOTP(email);

    dispatch(loginSuccess(response));
    // dispatch(
    //   showAlert({
    //     type: "success",
    //     title: "Login Successful",
    //     message: `Welcome back, ${response.employee?.employeeName || ""}!`,
    //   }),
    // );

    return { success: true, data: response };
  } catch (err) {
    // err shape from API: { timestamp, status, error, message }
    const message = err?.message || "Login failed";

    // dispatch(loginFailure(message));
    // dispatch(
    //   showAlert({
    //     type: "error",
    //     title: err?.error || "Login Failed",
    //     message,
    //   }),
    // );

    return { success: false, message };
  } finally {
    // dispatch(globalLoaderClose());
  }
};

export const userLogout = () => {
  return (dispatch) => {
    logoutService()
      .then((res) => {
        dispatch(logout());
        // dispatch(
        //   showAlert({
        //     type: "success",
        //     title: "Logged Out Successfully",
        //   }),
        // );
      })
      .catch((err) => {
        console.log("error_message", err.message);
      });
  };
};

export const verifyLoginotp = (email, otp) => async (dispatch) => {
  try {

    // response shape: { employee: {...}, menus: [...] }
    const response = await verifyLoginOTP(email, otp);

    dispatch(loginSuccess(response));
    // dispatch(
    //   showAlert({
    //     type: "success",
    //     title: "Login Successful",
    //     message: `Welcome back, ${response.employee?.employeeName || ""}!`,
    //   }),
    // );

    return { success: true, data: response };
  } catch (err) {
    // err shape from API: { timestamp, status, error, message }
    const message = err?.message || "Login failed";

    // dispatch(loginFailure(message));
    // dispatch(
    //   showAlert({
    //     type: "error",
    //     title: err?.error || "Login Failed",
    //     message,
    //   }),
    // );

    return { success: false, message };
  } finally {
    // dispatch(globalLoaderClose());
  }
};

export const checkAvailableUser = (emailId) => {
  return async (dispatch) => {
    try {
      const response = await checkExsistingUser(emailId);

      const message = response?.message;

      dispatch(checkUserAvailable(message));

      return {
        success: true,
        message,
        data: response,
      };

    } catch (err) {
      const message = err?.message || "Unable to verify user";

      console.log("error_message", message);

      return {
        success: false,
        message,
      };
    }
  };
};

export const checkUserAndSendOTP = (
  emailId,
  checkUserFunction = checkAvailableUser
) => {
  return async (dispatch) => {
    try {
      // STEP 1: Open Global Loader
      dispatch(globalLoaderOpen());

      // STEP 2: Check whether the user exists
      const userResult = await dispatch(
        checkUserFunction(emailId)
      );

      console.log("Available user:", userResult);

      // STEP 3: Validate user response
      if (
        !userResult?.success ||
        userResult?.message !== "Welcome Admin"
      ) {
        return {
          success: false,
          message: userResult?.message || "User verification failed",
        };
      }

      // STEP 4: Generate and send OTP
      const otpResult = await dispatch(
        userLoginOTP(emailId)
      );

      // STEP 5: Validate OTP response
      if (!otpResult?.success) {
        return otpResult;
      }

      return {
        success: true,
        message: "OTP sent successfully",
        data: otpResult.data,
      };

    } catch (error) {
      console.error("checkUserAndSendOTP error:", error);

      return {
        success: false,
        message: error?.message || "Something went wrong",
      };

    } finally {
      // STEP 6: Always close Global Loader
      dispatch(globalLoaderClose());
    }
  };
};