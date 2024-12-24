import React, { useState } from "react";
import {useNavigate, useParams} from "react-router-dom";
import axios from "axios";

function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:5246/api/Auth/Login/", {
                email,
                password,
            });

            const token = response.data;

            if (token) {
                localStorage.setItem("token", token);
                console.log("Токен сохранен:", token);
                navigate("/");
            } else {
                setError("Неверный логин или пароль. Попробуйте еще раз.");
                console.log("Ошибка при логине:", error);
            }
        } catch (error) {
            console.log("Ошибка при логине:", error);
        }
    };

    return (
        <div>
            <h2>Login</h2>
            <input
                type="text"
                placeholder="Login"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
        </div>
    );
}

export default Login;