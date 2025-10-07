import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSignUp } from "../Helper/firebaseHelper";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";

function Signup() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [Email, setEmail] = useState("");
  const [Password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const completSignUp = async () => {
    // alert ("hello ")
    if (fName == "" || lName == "" || Email == "" || Password == "") {
      alert("Please fill all the fields");
      return;
    }

    try {
      const userData = await handleSignUp(Email, Password, {
        role: "admin",
        fName: fName,
        lName: lName,
      });

      if (userData?.uid) {
        dispatch(setUser(userData));
        // Navigate to dashboard (Home) after successful signup
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error);
      alert("Signup failed: " + error.message);
    }
  };

  return (
    <div style={{ height: 600, width: 1240, backgroundColor: "green" }}>
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
          <h2 style={{ textAlign: "center", marginTop: 85 }}>
            Create new account
          </h2>
          <input
            onChange={(e) => setFName(e.target.value)}
            type="text"
            placeholder="First Name"
            style={{
              padding: "10px",
              width: 93,
              borderRadius: 5,
              border: "1px solid #ddd",
              height: 25,
              marginTop: 13,
              marginLeft: 39,
            }}
          />
          <input
            onChange={(e) => setLName(e.target.value)}
            type="text"
            placeholder="Last Name"
            style={{
              padding: "10px",
              width: 93,
              borderRadius: 5,
              border: "1px solid #ddd",
              height: 25,
              marginTop: 13,
              marginLeft: 5,
            }}
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            style={{
              padding: "10px",
              width: 200,
              borderRadius: 5,
              border: "1px solid #ddd",
              height: 25,
              marginLeft: 37,
              marginTop: 13,
            }}
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            style={{
              padding: "10px",
              width: 200,
              borderRadius: 5,
              border: "1px solid #ddd",
              height: 25,
              marginTop: 13,
              marginLeft: 37,
            }}
          />
          {/* <div style={{ float: 'right', marginRight: 143, marginTop:-16,display: 'flex', alignItems: 'center', color: "black", cursor: 'pointer', justifyContent: 'center' }}>
                        <h5 >Forgot Password</h5></div> */}
          <button
            onClick={completSignUp}
            style={{
              width: 200,
              height: 40,
              backgroundColor: "green",
              position: "absolute",
              marginTop: 70,
              marginLeft: -206,
              padding: "0px 10px",
              borderRadius: 5,
              border: "none",
              justifyContent: "center",
              textAlign: "center",
              color: "white",
              cursor: "pointer",
              fontSize: "14px",
            }}
          >
            Create Account
          </button>{" "}
          <div
            style={{
              float: "right",
              marginRight: 123,
              marginTop: 123,
              display: "flex",
              alignItems: "center",
              color: "black",
              cursor: "pointer",
              justifyContent: "center",
            }}
          >
            <h5>Already have an account</h5>
          </div>
          <button
            style={{
              width: 66,
              height: 23,
              backgroundColor: "green",
              position: "absolute",
              marginTop: 141,
              marginLeft: 170,
              padding: "10px",
              textAlign: "center",
              display: "flex",
              alignContent: "center",
              alignItems: "center",
              borderRadius: 5,
              color: "white",
              cursor: "pointer",
              border: "none",
            }}
          >
            <Link
              to="/"
              style={{ textDecoration: "none", color: "white", fontSize: "12px" }}
            >
              Sign In
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
          alt="Signup Animation"
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

export default Signup;