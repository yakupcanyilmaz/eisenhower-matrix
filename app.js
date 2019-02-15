class DoFirst {
  constructor(id, description, hour) {
    this.id = id;
    this.description = description;
    this.hour = hour;
  }
}
class Schedule {
  constructor(id, description, hour) {
    this.id = id;
    this.description = description;
    this.hour = hour;
  }
}
class Delegate {
  constructor(id, description, hour) {
    this.id = id;
    this.description = description;
    this.hour = hour;
  }
}
class Eliminate {
  constructor(id, description, hour) {
    this.id = id;
    this.description = description;
    this.hour = hour;
  }
}

const data = {
  allTasks: {
    doFirst: [],
    schedule: [],
    delegate: [],
    eliminate: []
  },
  totals: {
    doFirst: 0,
    schedule: 0,
    delegate: 0,
    eliminate: 0
  }
};

// UI CLASS
class UI {
  constructor() {
    this.urgencyInput = document.querySelector(".add-urgency-type");
    this.importanceInput = document.querySelector(".add-importance-type");
    this.descriptionInput = document.querySelector(".add-description");
    this.hourInput = document.querySelector(".add-hour");
    this.doFirstList = document.querySelector(".do-first-list");
    this.scheduleList = document.querySelector(".schedule-list");
    this.delegateList = document.querySelector(".delegate-list");
    this.eliminateList = document.querySelector(".eliminate-list");
    this.doFirstTotalHour = document.querySelector(".do-first-total-hour");
    this.scheduleTotalHour = document.querySelector(".schedule-total-hour");
    this.delegateTotalHour = document.querySelector(".delegate-total-hour");
    this.eliminateTotalHour = document.querySelector(".eliminate-total-hour");
  }

  testing() {
    console.log(data);
  }

  getInput() {
    const urgency = this.urgencyInput.value;
    const importance = this.importanceInput.value;
    let type;
    if (urgency === "urgent" && importance === "important") {
      type = "doFirst";
    } else if (urgency === "urgent" && importance === "not-important") {
      type = "schedule";
    } else if (urgency === "not-urgent" && importance === "important") {
      type = "delegate";
    } else if (urgency === "not-urgent" && importance === "not-important") {
      type = "eliminate";
    }
    return {
      type: type,
      description: this.descriptionInput.value,
      hour: parseFloat(this.hourInput.value)
    };
  }

  createTask(type, description, hour) {
    let newTask, ID;

    if (data.allTasks[type].length > 0) {
      ID = data.allTasks[type][data.allTasks[type].length - 1].id + 1;
    } else {
      ID = 0;
    }

    if (type === "doFirst") {
      newTask = new DoFirst(ID, description, hour);
    } else if (type === "schedule") {
      newTask = new Schedule(ID, description, hour);
    } else if (type === "delegate") {
      newTask = new Delegate(ID, description, hour);
    } else if (type === "eliminate") {
      newTask = new Eliminate(ID, description, hour);
    }

    // Push it into data structure
    data.allTasks[type].push(newTask);

    // Return the new element
    return newTask;
  }

  addTaskToMatrix(task, type) {
    let html, element;

    if (type === "doFirst") {
      element = this.doFirstList;
      html = `
      <div class="item clearfix" id="doFirst-${task.id}">
        <div class="item-description">${task.description}</div>
        <div class="hour">
        <div class="item-hour">${task.hour}</div>
          <div class="item-delete">
            <button class="item-delete-btn">
            <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    } else if (type === "schedule") {
      element = this.scheduleList;
      html = `
      <div class="item clearfix" id="schedule-${task.id}">
        <div class="item-description">${task.description}</div>
        <div class="hour">
        <div class="item-hour">${task.hour}</div>
          <div class="item-delete">
            <button class="item-delete-btn">
            <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    } else if (type === "delegate") {
      element = this.delegateList;
      html = `
      <div class="item clearfix" id="delegate-${task.id}">
        <div class="item-description">${task.description}</div>
        <div class="hour">
        <div class="item-hour">${task.hour}</div>
          <div class="item-delete">
            <button class="item-delete-btn">
            <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
      `;
    } else if (type === "eliminate") {
      element = this.eliminateList;
      html = `
      <div class="item clearfix" id="eliminate-${task.id}">
        <div class="item-description">${task.description}</div>
        <div class="hour">
        <div class="item-hour">${task.hour}</div>
          <div class="item-delete">
            <button class="item-delete-btn">
            <i class="ion-ios-close-outline"></i>
            </button>
          </div>
        </div>
      </div>
    `;
    }
    element.insertAdjacentHTML("beforeend", html);
  }

  calculateTotal(type) {
    let sum = 0;
    data.allTasks[type].forEach(function(cur) {
      sum += cur.hour;
    });
    data.totals[type] = sum;
  }

  getTotals() {
    return {
      doFirstTotal: data.totals.doFirst,
      scheduleTotal: data.totals.schedule,
      delegateTotal: data.totals.delegate,
      eliminateTotal: data.totals.eliminate
    };
  }

  displayTotals() {
    let totals;
    totals = this.getTotals();
    this.doFirstTotalHour.textContent = totals.doFirstTotal;
    this.scheduleTotalHour.textContent = totals.scheduleTotal;
    this.delegateTotalHour.textContent = totals.delegateTotal;
    this.eliminateTotalHour.textContent = totals.eliminateTotal;
  }

  updateTotals() {
    this.calculateTotal("doFirst");
    this.calculateTotal("schedule");
    this.calculateTotal("delegate");
    this.calculateTotal("eliminate");
    this.displayTotals();
  }

  addTask() {
    let input, task;
    input = this.getInput();
    console.log(input);
    if (input.description !== "" && !isNaN(input.hour) && input.hour > 0) {
      task = this.createTask(input.type, input.description, input.hour);
      this.addTaskToMatrix(task, input.type);
      this.clearFields();
    }
  }

  deleteTask(target) {
    let taskID, splitID, type, ID;
    taskID = target.parentNode.parentNode.parentNode.parentNode.id;
    if (taskID) {
      splitID = taskID.split("-");
      type = splitID[0];
      ID = parseInt(splitID[1]);
      console.log(type, ID);
      this.deleteFromData(type, ID);
      this.deleteFromMatrix(taskID);
    }
  }

  deleteFromData(type, id) {
    let ids, index;
    ids = data.allTasks[type].map(function(cur) {
      return cur.id;
    });

    index = ids.indexOf(id);
    console.log(ids);
    console.log(id);
    console.log(index);
    if (index !== -1) {
      data.allTasks[type].splice(index, 1);
    }
  }

  deleteFromMatrix(taskID) {
    let el = document.getElementById(taskID);
    el.parentNode.removeChild(el);
  }

  clearFields() {
    this.descriptionInput.value = "";
    this.hourInput.value = "";
  }
}

document.querySelector(".add-btn").addEventListener("click", function(e) {
  const ui = new UI();

  ui.addTask();
  ui.updateTotals();
  ui.testing();

  e.preventDefault();
});
document
  .querySelector(".matrix-container")
  .addEventListener("click", function(e) {
    const ui = new UI();

    ui.deleteTask(e.target);
    ui.updateTotals();

    e.preventDefault();
  });
