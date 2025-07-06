import './styles.css';
import doit from "./doit.svg";

let obj = {};
let currentProjectSelection = "Default";

// === Local Storage ===
function saveToLocalStorage() {
    localStorage.setItem("todoData", JSON.stringify(obj));
}

function loadFromLocalStorage() {
    const data = localStorage.getItem("todoData");
    if (data) {
        obj = JSON.parse(data);
    } else {
        obj = { "Default": [] };
    }
}

function renderProjects() {
    const content = document.querySelector(".content");
    const select = document.getElementById("selectProject");

    content.innerHTML = "";
    select.innerHTML = "";

    Object.keys(obj).forEach(projectName => {
        const div = document.createElement("div");
        div.textContent = projectName;
        div.setAttribute("data-project", projectName);
        div.style.fontSize = "24px";
        div.style.textAlign = "start";
        div.style.marginLeft = "20%";
        div.style.cursor = "pointer";

        div.addEventListener("mouseenter", () => div.style.color = "#ff6f61");
        div.addEventListener("mouseleave", () => div.style.color = "black");

        div.addEventListener("click", () => {
            currentProjectSelection = projectName;
            const taskGrid = document.querySelector(".task-grid");
            taskGrid.innerHTML = "";

            obj[projectName].forEach(task => {
                const card = document.createElement("div");
                card.innerHTML = `<h3>${task.name}</h3>
                    <p>${task.description || ''}</p>
                    <p>Due: ${task.dueDate}</p>
                    <p>Priority: ${task.priority}</p>`;
                taskGrid.appendChild(card);
            });
        });

        content.appendChild(div);

        const option = document.createElement("option");
        option.value = projectName;
        option.textContent = projectName;
        select.appendChild(option);
    });
}

// === Task Class ===
class Task {
    constructor(name, dueDate, priority, completion) {
        this.name = name;
        this.dueDate = dueDate;
        this.priority = priority;
        this.completion = completion;
    }

    changeTaskName(changeName) {
        this.name = changeName;
    }

    completionStatus(changeCompletionStatus) {
        this.completion = changeCompletionStatus;
    }
}

// === DOMContentLoaded Initial Setup ===
document.addEventListener("DOMContentLoaded", () => {
    loadFromLocalStorage();
    renderProjects();
    currentProjectSelection = "Default";

    // === Add Project Button Toggle ===
    let addProjectCounter = 0;
    const button = document.getElementById("addProjecttoContent");
    const form = document.querySelector(".projectFormDiv");
    button.addEventListener("click", (event) => {
        event.preventDefault();
        addProjectCounter++;
        form.style.display = (addProjectCounter > 1) ? "none" : "inline-block";
        if (addProjectCounter > 1) addProjectCounter = 0;
    });

    // === Add Task Button Toggle ===
    let addTaskCounter = 0;
    const taskForm = document.querySelector(".addTaskForm");
    const buttonForTask = document.querySelector(".addTask");
    buttonForTask.addEventListener("click", (event) => {
        event.preventDefault();
        addTaskCounter++;
        taskForm.style.display = (addTaskCounter > 1) ? "none" : "inline-block";
        if (addTaskCounter > 1) addTaskCounter = 0;
    });

    // === Add Project Logic ===
    const buttonForProject = document.getElementById("submitProject");
    const addedToContent = document.querySelector(".content");
    const results = document.getElementById("project");
    const selectProject = document.getElementById("selectProject");

    buttonForProject.addEventListener("click", (event) => {
        event.preventDefault();
        let text = results.value;
        if (!text) return;

        obj[text] = [];
        saveToLocalStorage();
        renderProjects();
        form.style.display = "none";
        addProjectCounter = 0;
    });

    // === Add Task Logic ===
    const submitButton = document.getElementById("addTaskToProject");
    submitButton.addEventListener("click", (event) => {
        event.preventDefault();

        const taskName = document.getElementById("taskName").value;
        const description = document.getElementById("description").value;
        const dueDate = document.getElementById("dueDate").value;
        const priority = document.getElementById("priority").value;

        const newTask = new Task(taskName, dueDate, priority, false);
        obj[currentProjectSelection].push(newTask);
        saveToLocalStorage();

        const taskGrid = document.querySelector(".task-grid");
        taskGrid.innerHTML = "";

        obj[currentProjectSelection].forEach(task => {
            const card = document.createElement("div");
            card.innerHTML = `<h3>${task.name}</h3>
                <p>${task.description || ''}</p>
                <p>Due: ${task.dueDate}</p>
                <p>Priority: ${task.priority}</p>`;
            taskGrid.appendChild(card);
        });

        taskForm.style.display = "none";
        addTaskCounter = 0;
    });

    // === Header Logo ===
    const headerh1 = document.querySelector(".justDoit")
    const sideBarImage1 = document.createElement("img");
    sideBarImage1.src = doit;
    sideBarImage1.style.width = "60px";
    sideBarImage1.style.height = "auto";
    headerh1.style.display = "flex";
    headerh1.style.justifyContent = "center";
    headerh1.style.alignItems = "center";
    headerh1.appendChild(sideBarImage1);
});