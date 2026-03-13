import "../styles/pomodoroZone.css";
import { useEffect, useMemo, useState } from "react";

const TIMER = [
    { id: 1, label: "20/5 - 1 hour", focus: 20 * 60, break: 5 * 60, cycles: 3 },
    { id: 2, label: "30/10 - 2 hours", focus: 30 * 60, break: 10 * 60, cycles: 4 },
    { id: 3, label: "60/15 - 3 hours", focus: 60 * 60, break: 15 * 60, cycles: 3 }
];

const BREAK_MESSAGES = [
    "Stand up and stretch your shoulders.",
    "Drink water and rest your eyes.",
    "Walk for a minute and breathe deeply.",
    "Relax your jaw, neck, and hands.",
    "A short break now helps you focus better later."
];

const formatoTiempo = (totalSeconds) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
};

export const PomodoroZone = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(TIMER[1]);
    const [timeLeft, setTimeLeft] = useState(TIMER[1].focus);
    const [isRunning, setIsRunning] = useState(false);
    const [currentPhase, setCurrentPhase] = useState("focus");
    const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
    const [showBreakModal, setShowBreakModal] = useState(false);
    const [currentBreakMessage, setCurrentBreakMessage] = useState(BREAK_MESSAGES[0]);

    useEffect(() => {
        setTimeLeft(selectedPreset.focus);
        setIsRunning(false);
        setCurrentPhase("focus");
        setCompletedFocusSessions(0);
        setShowBreakModal(false);
    }, [selectedPreset]);

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setTimeLeft((prev) => (prev > 1 ? prev - 1 : 0));
        }, 1000);

        return () => clearInterval(interval);
    }, [isRunning]);

    useEffect(() => {
        if (timeLeft !== 0) return;

        if (currentPhase === "focus") {
            const nextCompleted = completedFocusSessions + 1;
            setCompletedFocusSessions(nextCompleted);

            if (nextCompleted < selectedPreset.cycles) {
                setCurrentPhase("break");
                setTimeLeft(selectedPreset.break);
                setShowBreakModal(true);
                setCurrentBreakMessage(
                    BREAK_MESSAGES[Math.floor(Math.random() * BREAK_MESSAGES.length)]
                );
            } else {
                setIsRunning(false);
            }
        } else {
            setCurrentPhase("focus");
            setTimeLeft(selectedPreset.focus);
            setShowBreakModal(false);
        }
    }, [timeLeft, currentPhase, completedFocusSessions, selectedPreset]);

    const handlePresetSelect = (preset) => {
        setSelectedPreset(preset);
        setIsMenuOpen(false);
    };

    const handleStartPause = () => {
        setIsRunning(!isRunning);
    };

    const phaseLabel = useMemo(() => {
        return currentPhase === "focus" ? "time to focus!" : "break time";
    }, [currentPhase]);

    return (
        <>
            <div className="pomodoro-card">
                <div className="pomodoro-topbar">
                    <div className="pomodoro-dropdown-wrapper">
                        <button
                            className="pomodoro-time-button"
                            onClick={() => setIsMenuOpen(!isMenuOpen)}
                        >
                            Time
                        </button>

                        {isMenuOpen && (
                            <div className="pomodoro-dropdown">
                                {TIMER.map((preset) => (
                                    <button
                                        key={preset.id}
                                        className="pomodoro-dropdown-item"
                                        onClick={() => handlePresetSelect(preset)}
                                    >
                                        {preset.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="pomodoro-timer-block">
                    <h2 className="pomodoro-time">{formatoTiempo(timeLeft)}</h2>
                    <p className="pomodoro-phase">{phaseLabel}</p>

                    <button className="pomodoro-start-button" onClick={handleStartPause}>
                        {isRunning ? "pause" : "start"}
                    </button>
                </div>

                <div className="pomodoro-player">
                    <div className="pomodoro-progress-line">
                        <span className="pomodoro-progress-dot" />
                    </div>

                    <div className="pomodoro-controls">
                        <button className="pomodoro-control-btn">
                            regresar
                        </button>
                        <button className="pomodoro-control-btn is-main">
                            pausar
                        </button>
                        <button className="pomodoro-control-btn">
                            skip
                        </button>
                    </div>

                    <button
                        className="pomodoro-music-button"
                        onClick={() => window.location.href = "/music-library"}
                    >
                        elegir música
                    </button>
                </div>
            </div>

            {showBreakModal && (
                <div className="break-overlay">
                    <div className="break-card">
                        <button
                            className="break-close"
                            onClick={() => setShowBreakModal(false)}
                        >
                            ✕
                        </button>
                        <p className="break-label">break time</p>
                        <h3 className="break-time">{formatoTiempo(timeLeft)}</h3>
                        <p className="break-message">{currentBreakMessage}</p>
                    </div>
                </div>
            )}
        </>
    );
};
