const socket = io();

async function loadTasks() {

    const response =
        await fetch("/tasks");

    const tasks =
        await response.json();

    const taskList =
        document.getElementById("taskList");

    taskList.innerHTML = "";

    tasks.forEach(task => {

        taskList.innerHTML += `

            <div class="task-card">

                <h3>${task.title}</h3>

                <p>${task.description}</p>

                <p>Status: ${task.status}</p>

                ${
                    task.status === "available"
                    ?
                    `
                    <button
                        onclick="claimTask(${task.id})">
                        Claim
                    </button>
                    `
                    :
                    ""
                }

            </div>
        `;
    });
}

async function claimTask(id) {

    await fetch(`/tasks/${id}/claim`, {

        method: "POST"
    });
}

socket.on("taskUpdated", () => {

    loadTasks();
});

loadTasks();