import { Outlet } from "react-router-dom"
import ScrollToTop from "../components/ScrollToTop"

export const PublicLayout = () => {
    return (
        <ScrollToTop>
            <Outlet />
        </ScrollToTop>
    )
}