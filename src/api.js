import axios from "axios";

const api = axios.create({ baseURL: "http://localhost:8000" });

export const getEmployees = (params) =>
  api.get("/employees", { params }).then((res) => res.data);

export const getStats = () => api.get("/stats").then((res) => res.data);

export const createEmployee = (data) =>
  api.post("/employees", data).then((res) => res.data);


export const replaceEmployee = (id, data) =>
  api.put(`/employees/${id}`, data).then((res) => res.data);

export const patchEmployee = (id, data) =>
  api.patch(`/employees/${id}`, data).then((res) => res.data);

export const deleteEmployee = (id) => api.delete(`/employees/${id}`);


export function errorText(err) {
  const detail = err.response?.data?.detail;
  if (typeof detail === "string") return detail;
  if (Array.isArray(detail)) {
    return detail
      .map((d) => `${d.loc.slice(1).join(".")}: ${d.msg}`)
      .join("; ");
  }
  return "Could not reach the server. Is the backend running?";
}
