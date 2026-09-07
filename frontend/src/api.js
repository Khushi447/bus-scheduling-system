const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api/v1";

export const getAccessToken = () => localStorage.getItem("accessToken");

export const setAuthSession = (data) => {
  if (data?.accessToken) {
    localStorage.setItem("accessToken", data.accessToken);
  }

  if (data?.user) {
    localStorage.setItem("user", JSON.stringify(data.user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("user");
};

export const apiFetch = async (path, options = {}) => {
  const headers = new Headers(options.headers);
  const token = getAccessToken();

  if (options.body && !(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  });
  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = payload.errors
      ?.map((error) => `${error.field}: ${error.message}`)
      .join("; ");
    throw new Error(validationMessage || payload.message || "Request failed");
  }

  return payload;
};
