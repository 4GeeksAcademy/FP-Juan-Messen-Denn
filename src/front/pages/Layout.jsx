import { Outlet } from "react-router-dom/dist"
import ScrollToTop from "../components/ScrollToTop"
import { Navbar } from "../components/Navbar"
import { Footer } from "../components/Footer"

export const Layout = () => {
    const isMobile = window.innerWidth <= 767;

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
    )
}
