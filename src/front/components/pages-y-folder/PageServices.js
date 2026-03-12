const backend_url = import.meta.env.VITE_BACKEND_URL;

export const getPages = async (folderId) => {
  const response = await fetch(`${backend_url}/folders/${folderId}/pages`, {
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  if (!response.ok) return false;
  return await response.json();
};

export const createPage = async (folderId, title, content) => {
  const response = await fetch(`${backend_url}/folders/${folderId}/pages`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, content })
  });
  if (!response.ok) return false;
  return await response.json();
};

export const updatePage = async (id, title, content) => {
  const response = await fetch(`${backend_url}/pages/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    },
    body: JSON.stringify({ title, content })
  });
  if (!response.ok) return false;
  return await response.json();
};

export const deletePage = async (id) => {
  const response = await fetch(`${backend_url}/pages/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
  });
  if (!response.ok) return false;
  return await response.json();
};
