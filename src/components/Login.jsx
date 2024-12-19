import React, { useState } from "react";
import axios from "axios";
import { Alert } from "react-bootstrap";

function Login(props) {
    const [cin, setCin] = useState("");
    const [password, setPassword] = useState("");
    const [Forgeted, setForgeted] = useState(false);

    const Submit = async (e) => {
        e.preventDefault();
        try {
            const resp = await axios.post("https://notes.devlop.tech/api/login", {
                cin,
                password,
            });
            console.log(resp.data);
            localStorage.setItem("token", resp.data.token);
            localStorage.setItem("first", resp.data.user.first_name);
            localStorage.setItem("last", resp.data.user.last_name);
            props.setisConect(true);
        } catch (err) {
            console.error("Login error:", err.response ? err.response.data : err.message);
            alert("Login failed. Please check your credentials.");
        }
    };

    const Forget = () => {
        !Forgeted?setForgeted(true):setForgeted(false);
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: "#e9ecef" }}>
            <div className="card p-5 shadow" style={{ width: "30rem", backgroundColor: "#ffffff", color: "#495057", borderRadius: "10px" }}>
                <h3 className="text-center mb-4" style={{ color: "#17a2b8", fontWeight: "bold" }}>Login</h3>
                <form onSubmit={Submit}>
                    <div className="mb-3">
                        <label htmlFor="cin" className="form-label" style={{ fontWeight: "bold" }}>
                            CIN
                        </label>
                        <input
                            type="text"
                            id="cin"
                            className="form-control"
                            value={cin}
                            onChange={(e) => setCin(e.target.value)}
                            required
                            style={{ borderRadius: "5px", padding: "12px" }}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label" style={{ fontWeight: "bold" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            id="password"
                            className="form-control"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ borderRadius: "5px", padding: "12px" }}
                        />
                    </div>
                    <button type="submit" className="btn btn-info w-100" style={{ borderRadius: "5px", padding: "12px", fontWeight: "bold" }}>
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Login;
