import { useNavigate } from "react-router-dom";

export const AboutPage = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: "⏱",
            title: "Pomodoro Timer",
            description: "Stay focused with customizable work and break sessions. The Pomodoro technique helps you maintain deep focus and avoid burnout."
        },
        {
            icon: "📝",
            title: "Notes & Pages",
            description: "Write and organize your notes in folders while you work. Keep your ideas close to your timer so you never lose track of your thoughts."
        },
        {
            icon: "🎯",
            title: "Goals",
            description: "Set and track your goals with status labels — Urgent, In Progress, or Done. Stay motivated by seeing your progress at a glance."
        },
        {
            icon: "🎵",
            title: "Ambient Sounds",
            description: "Choose from curated playlists — rain, forest, ocean, city, and more — to create the perfect focus environment for your work sessions."
        }
    ];

    return (
        <div style={{
            maxWidth: "720px",
            margin: "0 auto",
            padding: "2.5rem 1.5rem",
            fontFamily: "'Inter', 'DM Sans', sans-serif"
        }}>
            <button
                onClick={() => navigate("/home")}
                style={{
                    padding: "8px 16px",
                    borderRadius: "8px",
                    border: "1.5px solid var(--color-divider)",
                    background: "transparent",
                    color: "var(--color-text-primary)",
                    cursor: "pointer",
                    fontSize: "0.9rem",
                    marginBottom: "2rem",
                    display: "inline-block"
                }}
            >← Home</button>

            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: "3rem" }}>
                <h1 style={{
                    fontSize: "clamp(2.5rem, 6vw, 3.5rem)",
                    fontWeight: 900,
                    letterSpacing: "-0.02em",
                    color: "var(--color-text-primary)",
                    margin: "0 0 1rem"
                }}>POMIFY</h1>
                <p style={{
                    fontSize: "1.1rem",
                    color: "var(--color-text-secondary)",
                    lineHeight: 1.7,
                    maxWidth: "520px",
                    margin: "0 auto"
                }}>
                    A productivity app designed to help you focus, organize your work, and achieve your goals — all in one place.
                </p>
            </div>

            {/* Features */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "1rem",
                marginBottom: "3rem"
            }}>
                {features.map((f, i) => (
                    <div key={i} style={{
                        background: "var(--color-surface)",
                        borderRadius: "14px",
                        padding: "1.5rem",
                        border: "1px solid var(--color-divider)",
                        boxShadow: "0 2px 12px rgba(0,0,0,0.05)"
                    }}>
                        <div style={{ fontSize: "1.8rem", marginBottom: "0.75rem" }}>{f.icon}</div>
                        <h3 style={{
                            fontSize: "1rem",
                            fontWeight: 700,
                            color: "var(--color-text-primary)",
                            margin: "0 0 0.5rem"
                        }}>{f.title}</h3>
                        <p style={{
                            fontSize: "0.88rem",
                            color: "var(--color-text-secondary)",
                            lineHeight: 1.7,
                            margin: 0
                        }}>{f.description}</p>
                    </div>
                ))}
            </div>

            {/* Team */}
            <div style={{
                background: "var(--color-surface)",
                borderRadius: "14px",
                padding: "2rem",
                border: "1px solid var(--color-divider)",
                textAlign: "center"
            }}>
                <h2 style={{
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "var(--color-text-primary)",
                    margin: "0 0 0.5rem"
                }}>Built by</h2>
                <p style={{
                    fontSize: "1rem",
                    color: "var(--color-text-secondary)",
                    margin: "0 0 1rem"
                }}>Dennielys · Messen · Juan</p>
                <p style={{
                    fontSize: "0.82rem",
                    color: "var(--color-text-secondary)",
                    margin: 0
                }}>© 2026 Pomify — All rights reserved</p>
            </div>
        </div>
    );
};