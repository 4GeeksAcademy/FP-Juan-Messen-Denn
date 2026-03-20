import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Goals.css";

import {
  getGoals,
  createGoal,
  updateGoal,
  deleteGoal
} from "./GoalsService";

export const Goals = () => {
  const [goals, setGoals] = useState([]);
  const [newGoal, setNewGoal] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [selectedGoal, setSelectedGoal] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadGoals();

    const handleRefresh = () => loadGoals();
    window.addEventListener("goals:updated", handleRefresh);
    document.addEventListener("visibilitychange", () => {
      if (!document.hidden) loadGoals();
    });
    return () => {
      window.removeEventListener("goals:updated", handleRefresh);
    };
  }, []);

  const loadGoals = async () => {
    const data = await getGoals();
    if (data) setGoals(data.filter(g => g));
  };

  const handleCreateGoal = async () => {
    if (!newGoal.trim()) return;
    const data = await createGoal(newGoal, newGoal);
    if (!data?.goal) return;
    setNewGoal("");
    await loadGoals();
  };

  const startEditing = (goal) => {
    setEditingId(goal.id);
    setEditingText(goal.title);
  };

  const saveEdit = async (id) => {
    if (!editingText.trim()) return;
    const data = await updateGoal(id, { title: editingText });
    if (!data?.goal) return;
    setGoals(goals.map(g => (g.id === id ? data.goal : g)));
    setEditingId(null);
    setEditingText("");
  };

  const handleDelete = async (id) => {
    await deleteGoal(id);
    setGoals(goals.filter(g => g.id !== id));
    if (selectedGoal === id) setSelectedGoal(null);
  };

  const changeStatus = async (id, status) => {
    const data = await updateGoal(id, { status });
    if (!data?.goal) return;
    setGoals(goals.map(g => (g.id === id ? data.goal : g)));
  };

  const stats = {
    urgent: goals.filter(g => g.status === "urgent").length,
    progress: goals.filter(g => g.status === "progress").length,
    done: goals.filter(g => g.status === "done").length
  };

  const total = goals.length || 1;

  return (
    <div className="goals-page">

      <button
        onClick={() => navigate("/home")}
        style={{
          margin: "0 0 1rem 0",
          padding: "8px 16px",
          borderRadius: "8px",
          border: "1.5px solid var(--color-divider)",
          background: "transparent",
          color: "var(--color-text-primary)",
          cursor: "pointer",
          fontSize: "0.9rem"
        }}
      >
        ← Back to home
      </button>

      <h1 className="goals-title">Your Goals</h1>

      <div className="goals-layout">

        {/* LEFT COLUMN */}
        <div className="goals-column">

          <div className="goal-create">
            <input
              className="goal-input"
              placeholder="Create a new goal..."
              value={newGoal}
              onChange={(e) => setNewGoal(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleCreateGoal()}
            />
            <button className="btn-primary" onClick={handleCreateGoal}>
              Add
            </button>
          </div>

          {goals.map(goal => (
            <div key={goal.id} className="goal-card">

              <div className="goal-header">
                <div className="goal-left">
                  {editingId === goal.id ? (
                    <input
                      className="edit-input"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onBlur={() => saveEdit(goal.id)}
                      onKeyDown={(e) => e.key === "Enter" && saveEdit(goal.id)}
                      autoFocus
                    />
                  ) : (
                    <h3 onDoubleClick={() => startEditing(goal)}>
                      {goal.title}
                    </h3>
                  )}
                </div>

                <div
                  className={`checkbox ${selectedGoal === goal.id ? "checked" : ""}`}
                  onClick={() =>
                    setSelectedGoal(selectedGoal === goal.id ? null : goal.id)
                  }
                />
              </div>

              <div className={`goal-status-wrapper ${selectedGoal === goal.id ? "show" : ""}`}>
                <div className="goal-status">
                  <button
                    className={`status-btn urgent ${goal.status === "urgent" ? "active" : ""}`}
                    onClick={() => changeStatus(goal.id, "urgent")}
                  >
                    Urgent
                  </button>
                  <button
                    className={`status-btn progress ${goal.status === "progress" ? "active" : ""}`}
                    onClick={() => changeStatus(goal.id, "progress")}
                  >
                    In Progress
                  </button>
                  <button
                    className={`status-btn done ${goal.status === "done" ? "active" : ""}`}
                    onClick={() => changeStatus(goal.id, "done")}
                  >
                    Done
                  </button>
                </div>
              </div>

              <div className="goal-actions">
                <button onClick={() => startEditing(goal)}>✏</button>
                <button onClick={() => handleDelete(goal.id)}>🗑</button>
              </div>

            </div>
          ))}

        </div>

        {/* RIGHT COLUMN */}
        <div className="chart-column">
          <div className="chart-card">
            <div
              className="pie"
              style={{
                background: `
                  conic-gradient(
                    #e63946 0% ${(stats.urgent / total) * 100}%,
                    #a8dadc ${(stats.urgent / total) * 100}% ${((stats.urgent + stats.progress) / total) * 100}%,
                    #457b9d ${((stats.urgent + stats.progress) / total) * 100}% 100%
                  )
                `
              }}
            />
            <div className="legend">
              <span>Urgent: {stats.urgent}</span>
              <span>Progress: {stats.progress}</span>
              <span>Done: {stats.done}</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};