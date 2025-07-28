export const getAllPromos = async () => {
  const res = await fetch("http://localhost:4000/api/promocodes", {
    method: "GET",
    credentials: "include", // 👈 ESSENTIEL
  });
  const data = await res.json();
  return data;
};

export const createPromo = async (promo) => {
  const res = await fetch("http://localhost:4000/api/promocodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include", // 👈
    body: JSON.stringify(promo),
  });
  const data = await res.json();
  return data;
};

export const togglePromo = async (id) => {
  const res = await fetch(`http://localhost:4000/api/promocodes/toggle/${id}`, {
    method: "PATCH",
    credentials: "include", // 👈
  });
  const data = await res.json();
  return data;
};

export const deletePromo = async (id) => {
  const res = await fetch(`http://localhost:4000/api/promocodes/${id}`, {
    method: "DELETE",
    credentials: "include", // 👈
  });
  const data = await res.json();
  return data;
};
