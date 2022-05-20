let id_order = new URL(location.href).searchParams.get("id");

document.getElementById("orderId").textContent = id_order;

localStorage.clear();
