import "../styles/home.css"
import { PomodoroZone } from "../components/PomodoroZone";
import { PagesZone } from "../components/PagesZone";

export const Home = () => {
    return (
        <div className="home-layout">


            <section className="home-left">
                <PomodoroZone />
            </section>

            <div className="home-divider" />


            <section className="home-right">
                <PagesZone />
            </section>

        </div>
    );
};