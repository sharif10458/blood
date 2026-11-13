export const api = async (path, opt = {}, token) => {
  const r = await fetch(import.meta.env.VITE_API_URL + '/api' + path, {
    ...opt, headers: { 'Content-Type': 'application/json', ...(token && { Authorization: 'Bearer ' + token }) } });
  if (!r.ok) throw new Error(r.status);
  return r.json();
};
