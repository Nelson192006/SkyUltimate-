document.addEventListener("DOMContentLoaded", () => {
  const splash = document.getElementById("splash-screen");
  const authContainer = document.getElementById("auth-container");
  const tabs = document.querySelectorAll(".tab");
  const formFields = document.getElementById("form-fields");
  const superAdminTab = document.getElementById("superadmin-tab");
  const form = document.getElementById("auth-form");

  const apiBase = "https://inspiring-cache-v3wsk9.csb.app/";
  let superAdminRegistered = false;

  // Splash screen timeout
  setTimeout(() => {
    splash.style.display = "none";
    authContainer.classList.remove("hidden");
  }, 3000);

  // Tab switching
  tabs.forEach(tab => {
    tab.addEventListener("click", () => {
      tabs.forEach(t => t.classList.remove("active"));
      tab.classList.add("active");
      renderForm(tab.dataset.role);
    });
  });

  // Form rendering
  function renderForm(role) {
    formFields.innerHTML = "";

    if (role === "customer") {
      formFields.innerHTML = `
        <input name="name" type="text" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="password" type="password" placeholder="Password" required />
        <input name="phone" type="tel" placeholder="Mobile Number" required />
      `;
    } else if (role === "agent") {
      formFields.innerHTML = `
        <input name="name" type="text" placeholder="Full Name" required />
        <input name="email" type="email" placeholder="Email Address" required />
        <input name="phone" type="tel" placeholder="Phone Number" required />
        <input name="address" type="text" placeholder="Address" required />
        <input name="idDoc" type="file" required />
        <input name="bankName" type="text" placeholder="Bank Name" required />
        <input name="accountHolder" type="text" placeholder="Account Holder Name" required />
        <input name="accountNumber" type="text" placeholder="Account Number" required />
        <input name="routingNumber" type="text" placeholder="Routing Number" required />
      `;
    } else if (role === "superadmin") {
      if (superAdminRegistered) {
        superAdminTab.style.display = "none";
        renderForm("customer");
        return;
      }
      formFields.innerHTML = `
        <input name="email" type="email" placeholder="Super Admin Email" required />
        <input name="password" type="password" placeholder="Create Password" required />
      `;
    }
  }

  // Initial form load
  renderForm("customer");

  // Form submission
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const role = document.querySelector(".tab.active").dataset.role;
    const data = new FormData(form);
    const payload = Object.fromEntries(data.entries());

    try {
      const res = await fetch(`${apiBase}${role}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const result = await res.json();
      alert(`Success: ${result.message}`);
      if (role === "superadmin") {
        superAdminRegistered = true;
        superAdminTab.style.display = "none";
      }
    } catch (err) {
      alert("Error during registration.");
    }
  });
});
