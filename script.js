document.addEventListener("DOMContentLoaded", loadTasks);

function addTask() {
    let input = document.getElementById("taskInput");
    let categorySelect = document.getElementById("categorySelect");
    let userSelect = document.getElementById("userSelect");
    
    let taskText = input.value.trim();
    let category = categorySelect.value;
    let user = userSelect.value;

    if (taskText === "") {
        alert("الرجاء كتابة الطلب أو التذكير أولاً!");
        return;
    }

    createTaskElement(taskText, category, user, false);
    saveTaskToLocalStorage(taskText, category, user, false);

    input.value = "";
    
    confetti({
        particleCount: 60,
        spread: 50,
        origin: { y: 0.7 }
    });

    updateProgress();
}

function createTaskElement(taskText, category, user, isCompleted) {
    let li = document.createElement("li");
    
    let contentSpan = document.createElement("span");
    contentSpan.innerHTML = `<span class="category-tag">${category}</span> <span class="user-tag">${user}</span> ${taskText}`;
    li.appendChild(contentSpan);

    if (isCompleted) {
        li.classList.add("completed");
    }

    li.onclick = function() {
        li.classList.toggle("completed");
        updateTaskStateInLocalStorage(taskText, li.classList.contains("completed"));
        updateProgress();

        if (li.classList.contains("completed")) {
            confetti({
                particleCount: 40,
                spread: 40,
                origin: { y: 0.8 }
            });
        }
    };

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "تم / حذف";
    deleteBtn.className = "delete-btn";
    
    deleteBtn.onclick = function(e) {
        e.stopPropagation();
        li.remove();
        removeTaskFromLocalStorage(taskText);
        updateProgress();
    };

    li.appendChild(deleteBtn);
    document.getElementById("taskList").appendChild(li);
    updateProgress();
}

function updateProgress() {
    let allTasks = document.querySelectorAll("#taskList li");
    let completedTasks = document.querySelectorAll("#taskList li.completed");
    
    let total = allTasks.length;
    let completed = completedTasks.length;

    let percentage = total === 0 ? 0 : Math.round((completed / total) * 100);

    let progressBar = document.getElementById("progressBar");
    let progressText = document.getElementById("progressText");

    if (progressBar && progressText) {
        progressBar.style.width = percentage + "%";
        progressText.textContent = percentage + "%";
    }
}

function saveTaskToLocalStorage(taskText, category, user, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem("familyTasks")) || [];
    tasks.push({ text: taskText, category: category, user: user, completed: isCompleted });
    localStorage.setItem("familyTasks", JSON.stringify(tasks));
}

function loadTasks() {
    let tasks = JSON.parse(localStorage.getItem("familyTasks")) || [];
    tasks.forEach(task => createTaskElement(task.text, task.category || "عام", task.user || "العائلة", task.completed));
    updateProgress();
}

function updateTaskStateInLocalStorage(taskText, isCompleted) {
    let tasks = JSON.parse(localStorage.getItem("familyTasks")) || [];
    tasks.forEach(task => {
        if (task.text === taskText) {
            task.completed = isCompleted;
        }
    });
    localStorage.setItem("familyTasks", JSON.stringify(tasks));
}

function removeTaskFromLocalStorage(taskText) {
    let tasks = JSON.parse(localStorage.getItem("familyTasks")) || [];
    tasks = tasks.filter(t => t.text !== taskText);
    localStorage.setItem("familyTasks", JSON.stringify(tasks));
}

function toggleDarkMode() {
    document.body.classList.toggle("dark-theme");
}

document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});