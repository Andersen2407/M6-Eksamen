const socket = io();

let selectedTaskId = null;

// Get the current user information
async function getCurrentUser() {

    const response =
        await fetch("/auth/me", {
            credentials: "include"
        });

    if (!response.ok) {

        console.error(
            "Failed to get current user"
        );

        return null;
    }

    return await response.json();
}

// Switch between available tasks and my tasks tabs
const availableTab =
    document.getElementById("availableTab");

const progressTab =
    document.getElementById("progressTab");

const availableTasks =
    document.getElementById("availableTasks");

const myTasks =
    document.getElementById("myTasks");

availableTab.onclick = () => {

    availableTab.classList.add("active");

    progressTab.classList.remove("active");

    availableTasks.classList.remove("hidden");

    myTasks.classList.add("hidden");
};

progressTab.onclick = () => {

    progressTab.classList.add("active");

    availableTab.classList.remove("active");

    myTasks.classList.remove("hidden");

    availableTasks.classList.add("hidden");
};

// Load tasks from the server and display them
async function loadTasks() {

    const currentUser =
        await getCurrentUser();

    if (!currentUser) return;

    const response =
        await fetch("/tasks", {
            credentials: "include"
        });

    if (!response.ok) {

        console.error(
            "Failed to load tasks"
        );

        return;
    }

    const tasks =
        await response.json();

    availableTasks.innerHTML = "";

    myTasks.innerHTML = "";

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

        const card =
            document.createElement("div");

        card.classList.add("task-card");

        card.innerHTML = `
            <div class="task-top">

                <div class="priority ${priority}">
                    ${priority.toUpperCase()}
                </div>

                <div class="task-title">
                    ${task.title}
                </div>

            </div>

            <div class="task-info">

                <div>
                    <strong>Afsender:</strong>
                    ${
                        task.created_by_name ||
                        "Novo User" // Ændre dette til det faktiske brugernavn, hvis der kommer flere produktionsmedarbejdere!!!!
                    }
                </div>

                <div>
                    <strong>Adresse:</strong>
                    ${task.address}
                </div>

                <div>
                    <strong>Destination:</strong>
                    ${task.destination}
                </div>

                <div>
                    <strong>Deadline:</strong>
                    ${formatDate(task.deadline)}
                </div>

                <div>
                    <strong>DOT levering:</strong>
                    ${
                        task.dot
                            ? "Ja"
                            : "Nej"
                    }
                </div>

            </div>
        `;

        // Tag opgaven knap for ledige opgaver

        if (task.status === "available") {

            const button =
                document.createElement("button");

            button.innerText =
                "Tag opgaven";

            button.onclick =
                () => claimTask(task.id);

            card.appendChild(button);

            availableTasks
                .appendChild(card);
        }

        // Afslut opgave knap for egene opgaver i gang

        if (
            task.status === "in_progress" &&
            task.assigned_to === currentUser.id
        ) {

            const button =
                document.createElement("button");

            button.innerText =
                "Afslut opgave";

            button.onclick =
                () => openCompleteModal(task.id);

            card.appendChild(button);

            myTasks
                .appendChild(card);
        }
    });
}

// Claim a task

async function claimTask(taskId) {

    const response =
        await fetch(
            `/tasks/${taskId}/claim`,
            {

                method: "PUT",

                credentials: "include"
            }
        );

    if (!response.ok) {

        console.error(
            "Failed to claim task"
        );

        return;
    }

    loadTasks();
}

// Open completion modal

function openCompleteModal(taskId) {

    selectedTaskId = taskId;

    document.getElementById(
        "completeModal"
    ).classList.remove("hidden");
}

document.getElementById("closeModal")
    .onclick = () => {

        document.getElementById(
            "completeModal"
        ).classList.add("hidden");
    };

// Task completion
document.getElementById(
    "submitComplete"
).onclick = async () => {

    const tracking_number =
        document.getElementById(
            "trackingNumber"
        ).value;

    const message =
        document.getElementById(
            "completionMessage"
        ).value;

    const response =
        await fetch(
            `/tasks/${selectedTaskId}/complete`,
            {

                method: "PUT",

                credentials: "include",

                headers: {
                    "Content-Type":
                        "application/json"
                },

                body: JSON.stringify({
                    tracking_number,
                    message
                })
            }
        );

    if (!response.ok) {

        console.error(
            "Failed to complete task"
        );

        return;
    }

    document.getElementById(
        "completeModal"
    ).classList.add("hidden");

    document.getElementById(
        "trackingNumber"
    ).value = "";

    document.getElementById(
        "completionMessage"
    ).value = "";

    loadTasks();
};

// Dato formattering

function formatDate(dateString) {

    const date =
        new Date(dateString);

    return date.toLocaleString(
        "da-DK",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}

loadTasks();

// Listen for real-time updates

socket.on("task_created", loadTasks);

socket.on("task_claimed", loadTasks);

socket.on("task_completed", loadTasks);

socket.on("task_reassigned", loadTasks);