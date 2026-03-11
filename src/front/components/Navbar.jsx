import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { LoginModal } from "./LoginModal";
import { RegisterModal } from "./RegisterModal";

export const Navbar = () => {
    const location = useLocation();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [showRegister, setShowRegister] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token);
    }, [location]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsLoggedIn(false);
        window.location.href = "/";
    };

    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link to="/">
                    <span className="navbar-brand mb-0 h1 text-danger">Back Home</span>
                </Link>

                <button
                    className="navbar-toggler"
                    type="button"
                    onClick={() => setIsOpen(!isOpen)}
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className={`collapse navbar-collapse ${isOpen ? "show" : ""}`}>
                    <ul className="navbar-nav me-auto mb-2 mb-lg-0"></ul>

                    <div className="d-flex flex-column flex-lg-row gap-2 ms-auto">
                        {isLoggedIn && (
                            <Link to="/folders" onClick={() => setIsOpen(false)}>
                                <button className="btn btn-outline-light w-100">📁 mis carpetas</button>
                            </Link>
                        )}

                        {isLoggedIn ? (
                            <>
                                <Link to="/profile" onClick={() => setIsOpen(false)}>
                                    <button className="btn btn-outline-light w-100">profile</button>
                                </Link>
                                <button className="btn btn-outline-light w-100" onClick={handleLogout}>
                                    logout
                                </button>
                            </>
                        ) : (
                            <>
                                <button className="btn btn-outline-light w-100" onClick={() => { setShowRegister(true); setIsOpen(false); }}>
                                    register
                                </button>
                                <button className="btn btn-outline-light w-100" onClick={() => { setShowLogin(true); setIsOpen(false); }}>
                                    login
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {showLogin && (
                <LoginModal
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => { setShowLogin(false); setShowRegister(true); }}
                />
            )}

            {showRegister && (
                <RegisterModal
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => { setShowRegister(false); setShowLogin(true); }}
                />
            )}
        </nav>
    );
};
