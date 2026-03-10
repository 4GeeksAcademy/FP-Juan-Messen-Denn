import { useState } from "react";
import "../styles/welcomePage.css";
import { TypingText } from "../components/TypingText";
import { RegisterModal } from "../components/RegisterModal";
import { LoginModal } from "../components/LoginModal";

export const WelcomePage = () => {
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);


    return (
        <div className="welcome-container">

            <header className="welcome-topbar">
                <span className="welcome-brand">pomify</span>
            </header>

            <main className="welcome-hero">
                <h1 className="welcome-title">
                    <TypingText />
                </h1>

                <div className="welcome-right">
                    <p className="welcome-text">
                        <strong>Pomify </strong> combines a Pomodoro timer, task planning,
                        and focus music to help you stay in the zone-
                       <strong> one focused block at a time. </strong> 
                    </p>
                    <div className="welcome-buttons">
                        <button
                            className="btn-signup"
                            onClick={() => setShowRegister(true)}>

                            Sign up
                        </button>
                        <button
                            className="btn-login"
                            onClick={() => setShowLogin(true)}>

                            Login
                        </button>
                    </div>
                </div>
            </main>

            <footer className="welcome-footer">
                <span>© 2026 Pomify</span>
                <span>Juan. Messen. Denn </span>
            </footer>

            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                />
            )}

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                />
            )}

        </div>
    );
};
