import { useState } from "react";
import axios from "axios";
import "./login.css";


// Redirect the page
import {useNavigate} from "react-router-dom";

function Login() {
    
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");


    async function handleLogin(e) {

    e.preventDefault();

    // Clear previous error
    setErrorMessage("");

    // Username validation
    if (!username.trim()) {
        setErrorMessage("Please enter username");
        return;
    }

    // Password validation
    if (!password.trim()) {
        setErrorMessage("Please enter password");
        return;
    }

    setLoading(true);

    try {

        const response = await axios.post(
            "http://localhost:5200/api/auth/login",
            {
                username: username,
                password: password
            }
        );

        console.log(response.data);

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        navigate("/dashboard");

    } catch (error) {

        console.log("Login Error : ", error);

        setErrorMessage(
            error.response?.data?.message ||
            "Login Error. Please try again"
        );

    } finally {

        setLoading(false);

    }
}

    return (
        <div className="login-page">
            
            <div className="login-card">

                <div className="login-header">

                    <h1>TMS</h1>
                    <p>Ticket Management System</p>

                </div>

                    <form onSubmit={handleLogin}>

                        {/* // Username input */}
                        <div className="input-group">

                            <label>Username</label>

                                <input 
                                    type="text"
                                    placeholder="Enter Username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                />
                        </div>


                        {/* // Password input */}
                        <div className="input-group">

                            <label>Password</label>

                                <div className="password-input">

                                <input 
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter Password"
                                    value={password}    
                                    onChange={(e) => setPassword(e.target.value)}
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                >
                                    {showPassword ? "" : ""}
                                </button>
                        </div>
                        </div>

                        {errorMessage && (
                            <p className="login-error">
                        {errorMessage}
                            </p>
                            )}
                        
                            {/* // Submit buttony */}
                            <button 
                                type="submit"
                                disabled={loading}
                                className="login-button"
                            >
                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                            Logging in...
                                    </>
                                ) : (
                                    "Login"
                                )}
                            </button>

                        </form>

                    </div>

                </div>
            );

        }

export default Login;