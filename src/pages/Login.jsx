import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithFBase } from "../Helper/firebaseHelper";
import { getDataById } from "../Helper/firebaseHelper";

import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const completLogin = async () => {
    // Check if email and password are filled
    if (email == "" || Password == "") {
      alert("Please Enter email or password");
      return;
    }

    try {
      // Login with Firebase Authentication
      const userData = await loginWithFBase(email, Password);

      // Get additional user data from Firestore
      const userDetails = await getDataById("users", userData.uid);

      // Combine authentication data with Firestore data
      const completeUserData = {
        uid: userData.uid,
        email: userData.email,
        ...userDetails
      };

      // Save user data to Redux store
      dispatch(setUser(completeUserData));

      // Navigate to home page after successful login
      navigate("/");
    } catch (error) {
      console.error("Login error:", error);
      // Show user-friendly error messages
      if (error.code === "auth/user-not-found") {
        alert("No account found with this email. Please sign up first.");
      } else if (error.code === "auth/wrong-password") {
        alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else {
        alert("Login failed: " + error.message);
      }
    }
  };

  return (
    <div style={{ height: 600, width: 1240, backgroundColor: "green" }}>
      <Link to="/Login"></Link>
      <a href="Login"></a>
      <div
        style={{
          height: 600,
          width: 500,
          backgroundColor: "#D9D9D9",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div
          style={{
            height: 471,
            width: 277,
            backgroundColor: "white",
            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.5)",
            marginLeft: 221,
            marginTop: -7,
          }}
        >
          <h2 style={{ textAlign: "center", marginTop: 85 }}>Login</h2>
          <p style={{ textAlign: "center", marginTop: -10 }}>
            Enter your account details
          </p>
          <form action="login.php" method="post"></form>
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="text"
            placeholder="Username"
            style={{
              padding: "10",
              width: 200,
              boarderadius: 5,
              height: 25,
              marginLeft: 37,
            }}
          />
          <input
             onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{
              padding: "10",
              width: 200,
              borderRadius: 5,
              height: 25,
              marginTop: 13,
              marginLeft: 37,
            }}
          />
          <div
            style={{
              float: "right",
              marginRight: 143,
              marginTop: -16,
              display: "flex",
              alignItems: "center",
              color: "black",
              cursor: "pointer",
              justifyContent: "center",
            }}
          >
            <h5>Forgot Password</h5>
          </div>
          <button

           onClick={completLogin}
            style={{
              width: 200,
              height: 40,
              backgroundColor: "green",
              position: "absolute",
              marginTop: 85,
              marginLeft: -202,
              padding: "10px",
              borderRadius: 5,
              textAlign: "center",
              color: "white",
              cursor: "pointer",
            }}
          >
            {" "}
            Login
          </button>
          <div
            style={{
              float: "right",
              marginRight: 123,
              marginTop: 102,
              display: "flex",
              alignItems: "center",
              color: "black",
              cursor: "pointer",
              justifyContent: "center",
            }}
          >
            <h5>Don't have an account</h5>
          </div>

          <button
            style={{
              width: 66,
              height: 23,
              backgroundColor: "green",
              position: "absolute",
              marginTop: 162,
              marginLeft: 170,
              padding: "10px",
              textAlign: "center",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 5,
              color: "white",
              cursor: "pointer",
            }}
          >
            <Link
              to="/Signup"
              style={{ textDecoration: "none", color: "white" }}
            >
              Signup
            </Link>
          </button>
        </div>
      </div>
      <div
        style={{
          height: 432,
          width: 611,
          backgroundColor: "rgb(83 149 18)",
          marginLeft: 500,
          marginTop: -538,
          padding: "20px",
        }}
      >
        <img
          src="https://media.giphy.com/media/IoP0PvbbSWGAM/giphy.gif"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            borderRadius: "12px",
          }}
        />
      </div>
    </div>
  );
}

export default Login;




