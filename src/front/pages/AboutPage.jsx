import { useNavigate } from "react-router-dom";
import "../styles/aboutPage.css"


const features = [
    {
        badge: "Focus",
        icon: "⏱",
        title: "Pomodoro Timer",
        description:
            "Work in focused sprints and short breaks using the proven Pomodoro technique. Pomify keeps track of your sessions so you stay in flow without burning out. Customize your work and break intervals to match your rhythm.",
        image: "/screenshots/pomodoro-zone.png",
        alt: "Pomify Pomodoro timer interface",
    },
    {
        badge: "Notes",
        icon: "📝",
        title: "Pages & Notes",
        description:
            "Write, edit, and organise your notes while you work — no context switching. Keep ideas, meeting notes, or research right next to your timer inside collapsible pages so nothing slips through the cracks.",
        image: "/screenshots/pages-zone.png",
        alt: "Pomify notes and pages interface",
        reverse: true,
    },
    {
        badge: "Playlists",
        icon: "🎵",
        title: "Ambient Sounds",
        description:
            "Pick a curated soundscape — rain, forest, ocean, café, lo-fi — and let it fade into the background while you work. The music player lives in the app so you never have to leave your flow to change the track.",
        image: "/screenshots/music-zone.png",
        alt: "Pomify ambient sounds and music player",
    },
    {
        badge: "Folders",
        icon: "📁",
        title: "Folders",
        description:
            "Group your pages and notes into folders to keep your workspace tidy. Whether you organise by project, subject, or client — Pomify gives you the structure so you can focus on the work, not the filing.",
        image: "/screenshots/folders-zone.png",
        alt: "Pomify folders and organisation interface",
        reverse: true,
    },
    {
        badge: "Goals",
        icon: "🎯",
        title: "Your Goals",
        description:
        "Create your goals and keep them moving by updating their status to urgent, in progress, or done. Add new ones or remove them whenever you like. Best of all, your goals are always in sight, easily accessible from the navbar.",
        image: "/screenshots/goals-zone.png",
        alt: "Pomify folders and organisation interface",
        reverse: true,
    },
];

export const AboutPage = () => {
    const navigate = useNavigate();

    return (
        <div className="about-page">

            <button className="about-back-btn" onClick={() => navigate("/home")}>
                ← Home
            </button>

            <div className="about-hero">
                <h1 className="about-hero-title">POMIFY</h1>
                <p className="about-hero-tagline">
                    A productivity app designed to help you focus, organise your work,
                    and reach your goals — all in one place.
                </p>
                <p className="about-hero-sub">
                    Everything you need for a focused work session, nothing you don't.
                </p>
            </div>

            <hr className="about-divider" />

            {features.map((feature, index) => (
                <div
                    key={index}
                    className={`about-feature-row${feature.reverse ? " reverse" : ""}`}
                >
                    {/* Screenshot */}
                    {feature.image ? (
                        <div className="about-feature-img-wrap">
                            <img
                                src={feature.image}
                                alt={feature.alt}
                                onError={(e) => {
                                    // If image not found, swap to placeholder
                                    e.currentTarget.parentElement.style.display = "none";
                                    e.currentTarget.parentElement.nextSibling?.style
                                        ? null
                                        : null;
                                }}
                            />
                        </div>
                    ) : (
                        <div className="about-feature-img-placeholder">
                            {feature.icon}
                        </div>
                    )}

                    <div className="about-feature-text">
                        <span className="about-feature-badge">{feature.badge}</span>
                        <h3 className="about-feature-title">{feature.title}</h3>
                        <p className="about-feature-desc">{feature.description}</p>
                    </div>
                </div>
            ))}

            <div className="about-cta-wrap">
                <button className="about-cta-btn" onClick={() => navigate("/home")}>
                    Go to the app →
                </button>
            </div>

            <div className="about-footer">
                <p className="about-footer-built">Built by</p>
                <p className="about-footer-names">Dennielys · Messen · Juan</p>
                <p className="about-footer-copy">© 2026 Pomify — All rights reserved</p>
            </div>

        </div>
    );
};