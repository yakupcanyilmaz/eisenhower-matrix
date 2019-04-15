const data = {
  tasks: {
    doFirst: [],
    schedule: [],
    delegate: [],
    eliminate: []
  },
  totalHours: {
    doFirst: 0,
    schedule: 0,
    delegate: 0,
    eliminate: 0
  }
};

// Task Class
class Task {
  constructor(type, id, desc, hour) {
    this.type = type;
    this.id = id;
    this.desc = desc;
    this.hour = hour;
  }
}

// UI CLASS
class UI {
  constructor() {
    this.urgencyInput = document.querySelector(".add-urgency-type");
    this.importanceInput = document.querySelector(".add-importance-type");
    this.descriptionInput = document.querySelector(".add-description");
    this.hourInput = document.querySelector(".add-hour");
    this.doFirstTotalHours = document.querySelector(".doFirst-total-hours");
    this.scheduleTotalHours = document.querySelector(".schedule-total-hours");
    this.delegateTotalHours = document.querySelector(".delegate-total-hours");
    this.eliminateTotalHours = document.querySelector(".eliminate-total-hours");
  }

  getTask() {
    const task = new Task();

    const urgency = this.urgencyInput.value;
    const importance = this.importanceInput.value;

    if (urgency === "urgent" && importance === "important") {
      task.type = "doFirst";
    } else if (urgency === "urgent" && importance === "not-important") {
      task.type = "schedule";
    } else if (urgency === "not-urgent" && importance === "important") {
      task.type = "delegate";
    } else if (urgency === "not-urgent" && importance === "not-important") {
      task.type = "eliminate";
    }

    task.desc = this.descriptionInput.value;
    task.hour = parseFloat(this.hourInput.value);

    if (data.tasks[task.type].length > 0) {
      task.id = data.tasks[task.type][data.tasks[task.type].length - 1].id + 1;
    } else {
      task.id = 0;
    }

    return task;
  }

  addTask() {
    const newTask = this.getTask();

    // Add task to data
    data.tasks[newTask.type].push(newTask);

    // Add task to matrix
    let html, element;

    element = document.querySelector(`.${newTask.type}-list`);
    html = `
      <div class="item clearfix" id="${newTask.type}-${newTask.id}">
        <div class="item-description">${newTask.desc}</div>
        <div class="hour">
        <div class="item-hour">${newTask.hour}</div>
          <div class="item-delete">
            <button class="item-delete-btn">
            <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
      `;

    element.insertAdjacentHTML("beforeend", html);
    this.clearFields();
  }

  getTotalHours() {
    let sum = 0;
    const type = this.getTask().type;
    data.tasks[type].forEach(function(cur) {
      sum += cur.hour;
    });
    data.totalHours[type] = sum;
    return data.totalHours;
  }

  updateTotalHours() {
    const totalHours = this.getTotalHours();
    this.doFirstTotalHours.textContent = totalHours.doFirst;
    this.scheduleTotalHours.textContent = totalHours.schedule;
    this.delegateTotalHours.textContent = totalHours.delegate;
    this.eliminateTotalHours.textContent = totalHours.eliminate;
  }

  deleteTask(target) {
    let taskID, splitID, type, ID;
    taskID = target.parentNode.parentNode.parentNode.parentNode.id;

    if (taskID) {
      splitID = taskID.split("-");

      type = splitID[0];
      ID = parseInt(splitID[1]);

      this.deleteFromData(type, ID);
      this.deleteFromMatrix(taskID);
    }
    this.clearFields();
  }

  deleteFromData(type, id) {
    let ids, index;
    ids = data.tasks[type].map(function(cur) {
      return cur.id;
    });

    index = ids.indexOf(id);

    if (index !== -1) {
      data.tasks[type].splice(index, 1);
    }
  }

  deleteFromMatrix(taskID) {
    let el = document.getElementById(taskID);
    el.parentNode.removeChild(el);
  }

  showAlert(message, className) {
    const div = document.createElement("div");
    div.className = `alert ${className}`;
    div.appendChild(document.createTextNode(message));
    const container = document.querySelector("#matrix");
    const form = document.querySelector(".matrix-container");
    container.insertBefore(div, form);

    // Timeout after 3 sec
    setTimeout(function() {
      document.querySelector(".alert").remove();
    }, 3000);
  }

  clearFields() {
    this.descriptionInput.value = "";
    this.hourInput.value = "";
  }
}

function eventListeners() {
  const addButton = document.querySelector(".add-btn");
  const matrix = document.querySelector(".matrix-container");

  const ui = new UI();

  addButton.addEventListener("click", function(e) {
    // Validate
    if (
      ui.descriptionInput.value === "" ||
      Math.sign(parseFloat(ui.hourInput.value)) === -1
    ) {
      // Error alert
      ui.showAlert("Please enter valid value", "error");
    } else {
      ui.addTask();
      ui.updateTotalHours();
    }
    e.preventDefault();
  });

  matrix.addEventListener("click", function(e) {
    ui.deleteTask(e.target);
    ui.updateTotalHours();

    e.preventDefault();
  });
}

document.addEventListener("DOMContentLoaded", function() {
  eventListeners();
});
