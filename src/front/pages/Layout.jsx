import { useEffect } from "react";
import { Outlet } from "react-router-dom/dist";
import ScrollToTop from "../components/ScrollToTop";
import { Navbar } from "../components/Navbar";
import { Footer } from "../components/Footer";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { getProfile } from "../services/loginBS";

export const Layout = () => {
    const { dispatch } = useGlobalReducer();
    const isMobile = window.innerWidth <= 767;

    useEffect(() => {
        const loadUser = async () => {
            const token = localStorage.getItem("token");
            if (!token) return;
            const user = await getProfile();
            if (user) {
                dispatch({ type: "set_user", payload: user });
            } else {
                localStorage.removeItem("token");
                dispatch({ type: "logout" });
            }
        };
        loadUser();
    }, []);

    return (
        <ScrollToTop>
            <div style={{
                display: "flex",
                flexDirection: "column",
                height: isMobile ? "auto" : "100vh",
                overflow: isMobile ? "visible" : "hidden",
                minHeight: "100vh"
            }}>
                <Navbar />
                <main style={{
                    flex: 1,
                    overflow: isMobile ? "auto" : "hidden",
                    minHeight: 0
                }}>
                    <Outlet />
                </main>
                <Footer />
            </div>
        </ScrollToTop>
    );
};