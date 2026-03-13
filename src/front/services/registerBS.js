const backend_url = import.meta.env.VITE_BACKEND_URL;
export const registerUser = async (user) => {
    const response = await fetch(`${backend_url}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(user),
    });
    if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || "Error al registrarse");
    }
    const data = await response.json();
    
    if (data.token) localStorage.setItem("token", data.token);
    
    return data;
};
