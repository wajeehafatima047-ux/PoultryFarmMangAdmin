import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleSignUp } from "../Helper/firebaseHelper";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/Slices/HomeDataSlice";

function Signup() {
  const [fName, setFName] = useState("");
  const [lName, setLName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const completSignUp = async () => {
    // Validate all fields
    if (fName === "" || lName === "" || email === "" || password === "") {
      alert("Please fill all the fields");
      return;
    }

    // Password strength validation
    if (password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    setIsLoading(true);

    try {
      const userData = await handleSignUp(email, password, {
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
      if (error.code === "auth/email-already-in-use") {
        alert("This email is already registered. Please login instead.");
      } else if (error.code === "auth/invalid-email") {
        alert("Invalid email address.");
      } else if (error.code === "auth/weak-password") {
        alert("Password is too weak. Please use a stronger password.");
      } else {
        alert("Signup failed: " + error.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      completSignUp();
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
        {/* Left Side - Signup Form */}
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
              Create Account 🚀
            </h1>
            <p style={{
              fontSize: '16px',
              color: '#718096',
              margin: 0
            }}>
              Sign up to start managing your poultry farm
            </p>
          </div>

          {/* Name Inputs */}
          <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                First Name
              </label>
              <input
                type="text"
                value={fName}
                onChange={(e) => setFName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="John"
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
            <div style={{ flex: 1 }}>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '600',
                color: '#2d3748',
                marginBottom: '8px'
              }}>
                Last Name
              </label>
              <input
                type="text"
                value={lName}
                onChange={(e) => setLName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Doe"
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
          <div style={{ marginBottom: '28px' }}>
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
                placeholder="Create a password (min 6 characters)"
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

          {/* Signup Button */}
          <button
            onClick={completSignUp}
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
            {isLoading ? 'Creating Account...' : 'Create Account'}
          </button>

          {/* Login Link */}
          <div style={{
            textAlign: 'center',
            fontSize: '15px',
            color: '#718096'
          }}>
            Already have an account?{' '}
            <Link to="/" style={{
              color: '#4b5563',
              textDecoration: 'none',
              fontWeight: '600'
            }}>
              Sign In
            </Link>
          </div>
        </div>

        {/* Right Side - Illustration */}
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
              Join Our Platform
            </h2>
            <p style={{
              fontSize: '16px',
              opacity: 0.9,
              lineHeight: '1.6',
              maxWidth: '350px',
              margin: '0 auto',
              marginBottom: '30px'
            }}>
              Get started with the most comprehensive poultry farm management system. Track everything in one place!
            </p>
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '20px',
              fontSize: '14px',
              color: '#6b7280'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>📊</div>
                <div>Analytics</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>💰</div>
                <div>Finance</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>👥</div>
                <div>Team</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;