import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { loginWithFBase } from "../Helper/firebaseHelper";
import { getDataById } from "../Helper/firebaseHelper";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const completLogin = async () => {
    // Check if email and password are filled
    if (email === "" || password === "") {
      alert("Please enter email and password");
      return;
    }

    setIsLoading(true);

    try {
      // Login with Firebase Authentication
      const userData = await loginWithFBase(email, password);

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
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      completLogin();
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#f5f5f5',
      padding: '20px',
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    }}>
      <div style={{
        display: 'flex',
        maxWidth: '1000px',
        width: '100%',
        backgroundColor: 'white',
        borderRadius: '20px',
        boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
        overflow: 'hidden'
      }}>
        {/* Left Side - Login Form */}
        <div style={{
          flex: 1,
          padding: '60px 50px',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          {/* Logo/Brand */}
          <div style={{ marginBottom: '40px' }}>
            <h1 style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#1a202c',
              marginBottom: '8px'
            }}>
              Welcome Back! 👋
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: 0
            }}>
              Login to manage your poultry farm
            </p>
          </div>

          {/* Email Input */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Enter your email"
              style={{
                width: '100%',
                padding: '14px 16px',
                fontSize: '15px',
                border: '2px solid #e2e8f0',
                borderRadius: '10px',
                outline: 'none',
                transition: 'all 0.3s',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = '#6b7280'}
              onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
            />
          </div>

          {/* Password Input */}
          <div style={{ marginBottom: '16px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '600',
              color: '#2d3748',
              marginBottom: '8px'
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your password"
                style={{
                  width: '100%',
                  padding: '14px 16px',
                  paddingRight: '50px',
                  fontSize: '15px',
                  border: '2px solid #e2e8f0',
                  borderRadius: '10px',
                  outline: 'none',
                  transition: 'all 0.3s',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#6b7280'}
                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '20px',
                  color: '#718096'
                }}
              >
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </button>
            </div>
          </div>

          {/* Forgot Password */}
          <div style={{
            textAlign: 'right',
            marginBottom: '28px'
          }}>
            <a href="#" style={{
              fontSize: '14px',
              color: '#6b7280',
              textDecoration: 'none',
              fontWeight: '500'
            }}>
              Forgot Password?
            </a>
          </div>

          {/* Login Button */}
          <button
            onClick={completLogin}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              fontSize: '16px',
              fontWeight: '600',
              color: 'white',
              background: isLoading ? '#d1d5db' : '#4b5563',
              border: 'none',
              borderRadius: '10px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
              marginBottom: '24px'
            }}
            onMouseOver={(e) => {
              if (!isLoading) {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
                e.target.style.background = '#374151';
              }
            }}
            onMouseOut={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
              e.target.style.background = '#4b5563';
            }}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          {/* Sign Up Link */}
          <div style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#718096'
          }}>
            Don't have an account?{' '}
            <Link to="/Signup" style={{
              color: '#4b5563',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign Up
            </Link>
          </div>
        </div>

        {/* Right Side - Image/Illustration */}
        <div style={{
          flex: 1,
          background: '#e5e7eb',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '60px 40px',
          position: 'relative'
        }}>
          <div style={{
            textAlign: 'center',
            color: '#374151'
          }}>
            <div style={{
              fontSize: '80px',
              marginBottom: '30px'
            }}>
              🐔
            </div>
            <h2 style={{
              fontSize: '28px',
              fontWeight: '700',
              marginBottom: '16px',
              lineHeight: '1.3'
            }}>
              Poultry Farm Management
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.9,
              lineHeight: '1.6',
              maxWidth: '350px',
              margin: '0 auto'
            }}>
              Manage your farm efficiently with our comprehensive management system. Track inventory, sales, employees, and more!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;




