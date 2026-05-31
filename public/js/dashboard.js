const socket = io();

// Opdatering af live clock

function updateClock() {

    const now = new Date();

    document.getElementById("liveClock")
        .innerText =
            `Opdateret: ${now.toLocaleTimeString()}`;
}

setInterval(updateClock, 1000);

updateClock();

// Notifikationer om nye opgaver og statusændringer

function addNotification(message) {

    const container =
        document.getElementById("notifications");

    const div =
        document.createElement("div");

    div.classList.add("notification");

    div.innerText = message;

    container.prepend(div);

    // Keep max 5 notifications
    while (container.children.length > 5) {

        container.removeChild(
            container.lastChild
        );
    }
}

// Load tasks from the server and display them

async function loadTasks() {

    const response = await fetch("/tasks", {
        credentials: "include"
    });

    if (!response.ok) {

        console.error(
            "Failed to load tasks"
        );

        return;
    }

    const tasks = await response.json();

    if (!Array.isArray(tasks)) {

        console.error(
            "Invalid task response"
        );

        return;
    }

    const availableContainer =
        document.getElementById("availableTasks");

    const progressContainer =
        document.getElementById("inProgressTasks");

    const completedContainer =
        document.getElementById("completedTasks");

    availableContainer.innerHTML = "";
    progressContainer.innerHTML = "";
    completedContainer.innerHTML = "";

    let availableCount = 0;
    let progressCount = 0;

    tasks.forEach(task => {

        let priority = "green";

        if (task.dot) {

            priority = "red";

        } else if (task.deadline) {

            const deadline =
                new Date(task.deadline);

            const now =
                new Date();

            const hoursLeft =
                (deadline - now) /
                (1000 * 60 * 60);

            if (hoursLeft < 4) {

                priority = "red";

            } else if (hoursLeft < 24) {

                priority = "yellow";
            }
        }

        // Available tasks sektion

        if (task.status === "available") {

            availableCount++;

            const row =
                document.createElement("div");

            row.classList.add("task-row");

            row.innerHTML = `
                <div class="priority ${priority}">
                    ${priority.toUpperCase()}
                </div>

                <div>
                    ${task.title}
                </div>

                <div>
                    ${
                        task.created_by_name ||
                        "Novo User"
                    }
                </div>

                <div>
                    ${task.destination}
                </div>

                <div>
                    ${formatDate(task.deadline)}
                </div>

                <div>
                    ${
                        task.dot
                            ? "Ja"
                            : "Nej"
                    }
                </div>
            `;

            availableContainer
                .appendChild(row);
        }

        // In Progress tasks sektion

        if (task.status === "in_progress") {

            progressCount++;

            const row =
                document.createElement("div");

            row.classList.add("completed-row");

            row.innerHTML = `
                <div>

                    <strong>
                        ${task.title}
                    </strong>

                    <p>
                        ${task.assigned_name || "Unknown"}
                    </p>

                </div>

                <div>

                    <p>I gang</p>

                    <small>
                        ${formatDate(task.deadline)}
                    </small>

                </div>
            `;

            progressContainer
                .appendChild(row);
        }

        // Completed tasks sektion

        if (task.status === "completed") {

            const row =
                document.createElement("div");

            row.classList.add("completed-row");

            row.innerHTML = `
                <div>

                    ${task.title}

                </div>

                <div>

                    ${
                        task.assigned_name ||
                        "Unknown"
                    }

                </div>

                <div>

                    ${
                        task.completed_at
                            ? formatTime(task.completed_at)
                            : "-"
                    }

                </div>
            `;

            completedContainer
                .appendChild(row);
        }
    });

    document.getElementById(
        "sidebarAvailableCount"
    ).innerText = availableCount;

    document.getElementById(
        "sidebarProgressCount"
    ).innerText = progressCount;
}

// Worker workload

async function loadWorkload() {

    const response =
        await fetch("/admin/workload", {
            credentials: "include"
        });

    if (!response.ok) {

        console.error(
            "Failed to load workload"
        );

        return;
    }

    const workers =
        await response.json();

    const container =
        document.getElementById("workers");

    container.innerHTML = "";

    workers.forEach(worker => {

        const row =
            document.createElement("div");

        row.classList.add("worker-row");

        const percentage =
            Math.min(
                worker.active_tasks * 25,
                100
            );

        row.innerHTML = `
            <div class="worker-top">

                <span>
                    ${worker.name}
                </span>

                <span>
                    ${worker.active_tasks} opgaver
                </span>

            </div>

            <div class="progress-bar">

                <div
                    class="progress-fill"
                    style="
                        width:
                        ${percentage}%;
                    "
                ></div>

            </div>
        `;

        container.appendChild(row);
    });
}

// Dato formattering

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleString(
        "da-DK",
        {
            day: "2-digit",
            month: "2-digit",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

function formatTime(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleTimeString(
        "da-DK",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

// Load og opdatere dashboard data

async function refreshDashboard() {

    await loadTasks();

    await loadWorkload();
}

refreshDashboard();

// Listen for real-time updates

socket.on("task_created", () => {

    addNotification(
        "Ny opgave oprettet"
    );

    refreshDashboard();
});

socket.on("task_claimed", () => {

    addNotification(
        "En opgave blev påbegyndt"
    );

    refreshDashboard();
});

socket.on("task_completed", () => {

    addNotification(
        "En opgave blev afsluttet"
    );

    refreshDashboard();
});

socket.on("task_reassigned", () => {

    addNotification(
        "En opgave blev flyttet"
    );

    refreshDashboard();
});