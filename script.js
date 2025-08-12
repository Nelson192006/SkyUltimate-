const API_URL = "https://inspiring-cache-v3wsk9.csb.app/";
let selectedRole = "customer";

// Splash screen delay
setTimeout(() => {
  document.getElementById("initialLoader").style.display = "none";
  document.getElementById("mainContainer").style.display = "block";
}, 1500);

// Role switching
document.querySelectorAll("#roleTabs button").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll("#roleTabs button").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    selectedRole = btn.dataset.role;
    document.getElementById("agentExtra").style.display = (selectedRole === "agent") ? "block" : "none";
  });
});

// Toggle Login/Register
document.getElementById("toggleLogin").addEventListener("click", () => {
  const regForm = document.getElementById("registerForm");
  const logForm = document.getElementById("loginForm");
  const toggle = document.getElementById("toggleLogin");
  
  if (regForm.style.display !== "none") {
    regForm.style.display = "none";
    logForm.style.display = "block";
    toggle.innerText = "Don't have an account? Register";
  } else {
    regForm.style.display = "block";
    logForm.style.display = "none";
    toggle.innerText = "Already have an account? Login";
  }
});

// Password strength
document.getElementById("password").addEventListener("input", e => {
  const val = e.target.value;
  const strength = document.getElementById("passwordStrength");
  if (val.length < 6) {
    strength.innerText = "Weak";
    strength.style.color = "red";
  } else if (val.match(/[A-Z]/) && val.match(/[0-9]/)) {
    strength.innerText = "Strong";
    strength.style.color = "green";
  } else {
    strength.innerText = "Medium";
    strength.style.color = "orange";
  }
});

// Registration submit
document.getElementById("registerForm").addEventListener("submit", async e => {
  e.preventDefault();
  
  const payload = {
    role: selectedRole,
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    phone: document.getElementById("phone").value,
  };

  if (selectedRole === "agent") {
    payload.address = document.getElementById("address").value;
    payload.bankName = document.getElementById("bankName").value;
    payload.accountName = document.getElementById("accountName").value;
    payload.accountNumber = document.getElementById("accountNumber").value;
    payload.routingNumber = document.getElementById("routingNumber").value;
  }

  try {
    const res = await fetch(`${API_URL}register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    showMessage(data.message || "Registered successfully", "success");

    // Remove super admin tab after first registration
    if (selectedRole === "superadmin") {
      document.getElementById("superAdminTab").remove();
    }
  } catch (err) {
    showMessage("Registration failed", "error");
  }
});

// Login submit
document.getElementById("loginForm").addEventListener("submit", async e => {
  e.preventDefault();
  const payload = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  try {
    const res = await fetch(`${API_URL}login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    showMessage(data.message || "Login successful", "success");
  } catch (err) {
    showMessage("Login failed", "error");
  }
});

// Popup message function
function showMessage(msg, type) {
  const div = document.createElement("div");
  div.className = `msg ${type}`;
  div.innerText = msg;
  document.body.appendChild(div);
  setTimeout(() => div.remove(), 3000);
                               }
