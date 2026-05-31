function setDefaultDeadline() {

    const now = new Date();

    // Round to nearest hour
    now.setMinutes(0);
    now.setSeconds(0);
    now.setMilliseconds(0);

    // Add 1 hour
    now.setHours(now.getHours() + 3);

    // Format for datetime-local
    const formatted =
        now.toISOString().slice(0, 16);

    document.getElementById("deadline")
        .value = formatted;
}

setDefaultDeadline();

const form = document.getElementById("taskForm");

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const task = {

        title:
            document.getElementById("title").value,

        address:
            document.getElementById("address").value,

        description:
            `
            Adresse:
            ${document.getElementById("address").value}

            ${document.getElementById("description").value}
            `,

        deadline:
            document.getElementById("deadline").value,

        destination:
            document.getElementById("destination").value,

        dot:
            document.getElementById("dot").checked
    };

    const response = await fetch("/tasks", {

        method: "POST",

        credentials: "include",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(task)
    });

    const data = await response.json();

    const message =
        document.getElementById("message");

    if (!response.ok) {

        message.innerText =
            data.error || "Failed to create task";

        message.style.color = "red";

        return;
    }

    message.innerText =
        "Task created successfully";

    message.style.color = "lightgreen";

    form.reset();
});