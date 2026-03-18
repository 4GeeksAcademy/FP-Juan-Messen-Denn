
import "../styles/pomodoroZone.css";
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { BreakModal } from "./BreakModal";

const TIMER = [
    { id: 0, label: "1/1 - test",       focus: 1 * 60,  break: 1 * 60,  cycles: 6 },
    { id: 1, label: "20/5 - 1 hour",   focus: 20 * 60, break: 5 * 60,  cycles: 3 },
    { id: 2, label: "30/10 - 2 hours", focus: 30 * 60, break: 10 * 60, cycles: 4 },
    { id: 3, label: "60/15 - 3 hours", focus: 60 * 60, break: 15 * 60, cycles: 3 },
];

const calcFocusTotal = (preset) => preset.focus * preset.cycles;

const formatTotal = (s) => {
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (h > 0) {
        return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
    }
    return `${String(m).padStart(2, "0")}:${String(sec).padStart(2, "0")}`;
};

export const PomodoroZone = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [selectedPreset, setSelectedPreset] = useState(TIMER[1]);
    const [focusLeft, setFocusLeft] = useState(() => calcFocusTotal(TIMER[1]));
    const [phaseLeft, setPhaseLeft] = useState(TIMER[1].focus);
    const [isRunning, setIsRunning] = useState(false);
    const [currentPhase, setCurrentPhase] = useState("focus");
    const [completedFocusSessions, setCompletedFocusSessions] = useState(0);
    const [showBreakModal, setShowBreakModal] = useState(false);
    const [breakSkipped, setBreakSkipped] = useState(false);
    const dropdownRef = useRef(null);

    const resetToPreset = useCallback((preset) => {
        setFocusLeft(calcFocusTotal(preset));
        setPhaseLeft(preset.focus);
        setIsRunning(false);
        setCurrentPhase("focus");
        setCompletedFocusSessions(0);
        setShowBreakModal(false);
        setBreakSkipped(false);
    }, []);

    useEffect(() => {
        resetToPreset(selectedPreset);
    }, [selectedPreset, resetToPreset]);

    useEffect(() => {
        if (!isRunning) return;
        const interval = setInterval(() => {
            setPhaseLeft((prev) => (prev > 1 ? prev - 1 : 0));
            if (currentPhase === "focus") {
                setFocusLeft((prev) => (prev > 1 ? prev - 1 : 0));
            }
        }, 1000);
        return () => clearInterval(interval);
    }, [isRunning, currentPhase]);

    useEffect(() => {
        if (phaseLeft !== 0) return;

        if (currentPhase === "focus") {
            const nextCompleted = completedFocusSessions + 1;
            setCompletedFocusSessions(nextCompleted);

            if (nextCompleted < selectedPreset.cycles) {
                setCurrentPhase("break");
                setPhaseLeft(selectedPreset.break);
                setShowBreakModal(true);
                setBreakSkipped(false);
            } else {
                setIsRunning(false);
            }
        } else {
            setCurrentPhase("focus");
            setPhaseLeft(selectedPreset.focus);
            setShowBreakModal(false);
            setBreakSkipped(false);
        }
    }, [phaseLeft, currentPhase, completedFocusSessions, selectedPreset]);

    useEffect(() => {
        if (!isMenuOpen) return;
        const handleClickOutside = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [isMenuOpen]);

    const handlePresetSelect = (preset) => {
        setSelectedPreset(preset);
        setIsMenuOpen(false);
    };

    const handleStartPause = () => setIsRunning((prev) => !prev);

    const handleSkipBreak = useCallback((remainingBreakTime) => {
        setShowBreakModal(false);
        setIsRunning(false);
        setBreakSkipped(true);
    }, []);

    const handleContinueBreak = () => {
        setCurrentPhase("break");
        setShowBreakModal(true);
        setBreakSkipped(false);
        setIsRunning(true);
    };

    const handleBreakEnd = useCallback(() => {
        setShowBreakModal(false);
        setCurrentPhase("focus");
        setPhaseLeft(selectedPreset.focus);
        setBreakSkipped(false);
    }, [selectedPreset.focus]);

    const handleRestorePomodoro = () => {
        setCurrentPhase("focus");
        setPhaseLeft(selectedPreset.focus);
        setBreakSkipped(false);
        setIsRunning(true);
    };

    const phaseLabel = useMemo(() => {
        return currentPhase === "focus" ? "time to focus!" : "break time";
    }, [currentPhase]);

    const startBtnLabel = breakSkipped ? "continue break" : isRunning ? "pause" : "start";
    const startBtnClass = `pomodoro-start-button${isRunning ? " is-running" : ""}${breakSkipped ? " is-break-skipped" : ""}`;

    return (
        <>
            <div className="pomodoro-card">
                <div className="pomodoro-topbar">
                    <div className="pomodoro-dropdown-wrapper" ref={dropdownRef}>
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
                    <h2
                        className="pomodoro-time"
                        data-phase={currentPhase}
                    >
                        {formatTotal(focusLeft)}
                    </h2>
                    <p className="pomodoro-phase">{phaseLabel}</p>

                    <button
                        className={startBtnClass}
                        onClick={breakSkipped ? handleContinueBreak : handleStartPause}
                    >
                        {startBtnLabel}
                    </button>

                    {breakSkipped && (
                        <button
                            className="pomodoro-restore-btn"
                            onClick={handleRestorePomodoro}
                        >
                            restore pomodoro
                        </button>
                    )}
                </div>

                <div className="pomodoro-player">
                    <div className="pomodoro-progress-line">
                        <span className="pomodoro-progress-dot" />
                    </div>

                    <div className="pomodoro-controls">
                        <button className="pomodoro-control-btn">back</button>
                        <button className="pomodoro-control-btn is-main">pause</button>
                        <button className="pomodoro-control-btn">skip</button>
                    </div>

                    <button
                        className="pomodoro-music-button"
                        onClick={() => window.location.href = "/music-library"}
                    >
                        choose music
                    </button>
                </div>
            </div>

            {showBreakModal && (
                <BreakModal
                    timeLeft={phaseLeft}
                    presetBreak={selectedPreset.break}
                    onSkip={handleSkipBreak}
                    onBreakEnd={handleBreakEnd}
                />
            )}
        </>
    );
};