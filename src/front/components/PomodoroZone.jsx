import "../styles/pomodoroZone.css";
import { useMemo, useRef, useEffect, useState } from "react";
import { BreakModal } from "./BreakModal";
import useGlobalReducer from "../hooks/useGlobalReducer";
import { TIMER_PRESETS_LIST } from "../store";

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
    const { store, dispatch } = useGlobalReducer();
    const p = store.pomodoro;
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const dropdownRef = useRef(null);

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

    const phaseLabel = useMemo(() => {
        return p.currentPhase === "focus" ? "time to focus!" : "break time";
    }, [p.currentPhase]);

    const startBtnLabel = p.breakSkipped ? "continue break" : p.isRunning ? "pause" : "start";
    const startBtnClass = `pomodoro-start-button${p.isRunning ? " is-running" : ""}${p.breakSkipped ? " is-break-skipped" : ""}`;

    const handleStartPause = () => dispatch({ type: "pomodoro_start_pause" });
    const handleContinueBreak = () => dispatch({ type: "pomodoro_continue_break" });
    const handleSkipBreak = (remainingBreakTime) => dispatch({ type: "pomodoro_skip_break" });
    const handleBreakEnd = () => dispatch({ type: "pomodoro_break_end" });
    const handleRestorePomodoro = () => dispatch({ type: "pomodoro_restore" });
    const handlePresetSelect = (preset) => {
        dispatch({ type: "pomodoro_set_preset", payload: preset });
        setIsMenuOpen(false);
    };

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
                                {TIMER_PRESETS_LIST.map((preset) => (
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
                        data-phase={p.currentPhase}
                    >
                        {formatTotal(p.focusLeft)}
                    </h2>
                    <p className="pomodoro-phase">{phaseLabel}</p>

                    <button
                        className={startBtnClass}
                        onClick={p.breakSkipped ? handleContinueBreak : handleStartPause}
                    >
                        {startBtnLabel}
                    </button>

                    {p.breakSkipped && (
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

            {p.showBreakModal && (
                <BreakModal
                    timeLeft={p.phaseLeft}
                    presetBreak={p.selectedPreset.break}
                    onSkip={handleSkipBreak}
                    onBreakEnd={handleBreakEnd}
                />
            )}
        </>
    );
};