import { registerUser } from "../services/registerBS";
import "../styles/registerModal.css";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
export const RegisterModal = ({ onClose, onSwitchToLogin }) => {

    const [error, setError] = useState("");
    const [user, setUser] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

    const handleOverlayClick = (e) => {
        if (e.target === e.currentTarget) onClose();
    };

    const handleChange = (e) => {
        setUser({
            ...user,
            [e.target.name]: e.target.value,
        });
    };

const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user.name || !user.email || !user.password || !user.confirmPassword) {
        setError("All fields are required.");
        return;
    }
    if (user.password !== user.confirmPassword) {
        setError("Passwords do not match.");
        return;
    }
    try {
        await registerUser(user);
        onClose();
        navigate("/home");
    } catch (err) {
        setError(err.message);
    }
};
    useEffect(() => {
        console.log("estos son los datos de user--->", user);
    },[user]);


    return (
        <div className="modal-overlay" onClick={handleOverlayClick}>
            <div className="modal-card">

                <button className="modal-close" onClick={onClose}>✕</button>

                <h2 className="modal-title">register</h2>

                <form className="modal-form" onSubmit={handleSubmit}>
                    <div className="form-group">
                        <input
                            type="text"
                            name="name"
                            placeholder="name"
                            value={user.name}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group">
                        <input
                            type="email"
                            name="email"
                            placeholder="email"
                            value={user.email}
                            onChange={handleChange}
                            className="form-input"
                        />
                    </div>

                    <div className="form-group input-password-wrapper">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="password"
                            value={user.password}
                            onChange={handleChange}
                            className="form-input"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? "●" : "○"}
                        </button>
                    </div>

                    <div className="form-group input-password-wrapper">
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="confirm password"
                            value={user.confirmPassword}
                            onChange={handleChange}
                            className="form-input"
                        />
                        <button
                            type="button"
                            className="toggle-password"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? "●" : "○"}
                        </button>
                    </div>

                    {error && <div className="form-error">{error}</div>}

                    <button type="submit" className="modal-btn-submit">
                        create account
                    </button>
                </form>

                <p className="modal-footer-text">
                    Already have an account?{" "}
                    <span className="modal-link" onClick={onSwitchToLogin}>Log in</span>
                </p>

            </div>
        </div>
    );
};
