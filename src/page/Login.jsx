import { useState } from "react";
import axios from "axios";


// Redirect the page
import {useNavigate} from "react-router-dom";

function Login() {
    
    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");


    async function handleLogin(e) {
        e.preventDefault();


        const response = await axios.post(
                "http://localhost:5200/api/auth/login",
                {
                    username : username,
                    password : password
                }
        );

        //print login information in console
        console.log(response.data);


        // Store token in local Storage
        localStorage.setItem(
            "token",
            response.data.token
        );

        navigate("/dashboard");
    }

    return (
        <div>
            
            <h1>TMS - Ticket Management System</h1>

            <form onSubmit={handleLogin}>

                {/* // Username input */}
                <div>
                    <label>Username : </label>

                    <input 
                    type="text"
                    placeholder="Enter Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                     />
                </div>


                {/* // Password input */}
                <div>
                    <label>Password : </label>

                    <input 
                    type="text"
                    placeholder="Enter Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)

                    }
                     />
                    <br></br>
                    {/* // Submit buttony */}
                     <button type="submit">
                        Login
                     </button>

                </div>

            </form>

        </div>
    );
}

export default Login;