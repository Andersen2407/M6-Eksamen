const form = document.getElementById("loginForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const email = document.getElementById("email").value;

    const password = document.getElementById("password").value;

    const response = await fetch("/auth/login", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            email,
            password
        })
    });

    const data = await response.json();

    if (!response.ok) {

        document.getElementById("errorMessage")
            .innerText = data.error;

        return;
    }

    // Redirect based on role
    switch (data.user.role) {

        case "admin":
            window.location.href = "/admin";
            break;

        case "warehouse_worker":
            window.location.href = "/mobile";
            break;

        case "novo_worker":
            window.location.href = "/task";
            break;

        default:
            window.location.href = "/";
    }
});