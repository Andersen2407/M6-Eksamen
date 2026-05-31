const socket = io();

async function loadDashboard() {

    const response =
        await fetch("/tasks");

    const tasks =
        await response.json();

    document.getElementById(
        "availableTasks"
    ).innerHTML = "";

    document.getElementById(
        "progressTasks"
    ).innerHTML = "";

    document.getElementById(
        "completedTasks"
    ).innerHTML = "";

    tasks.forEach(task => {

        const html = `

            <div class="task-card">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <p>${task.status}</p>

            </div>
        `;

        if (task.status === "available") {

            document.getElementById(
                "availableTasks"
            ).innerHTML += html;
        }

        if (task.status === "in_progress") {

            document.getElementById(
                "progressTasks"
            ).innerHTML += html;
        }

        if (task.status === "completed") {

            document.getElementById(
                "completedTasks"
            ).innerHTML += html;
        }
    });
}

socket.on("taskUpdated", () => {

    loadDashboard();
});

loadDashboard();