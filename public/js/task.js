async function createTask() {

    const task = {

        title:
            document.getElementById("title").value,

        description:
            document.getElementById("description").value
    };

    await fetch("/tasks/create", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify(task)
    });

    alert("Task created");
}