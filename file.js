const dateInput = document.getElementById("attendance-date");
const form = document.getElementById("add-worker-form");
const workerInput = document.getElementById("worker-name");
const workerList = document.getElementById("worker-list");
const attendanceStats = document.getElementById("attendance-stats");

let attendanceData = JSON.parse(localStorage.getItem("attendanceData")) || {};
let selectedDate = "";


dateInput.valueAsDate = new Date();
selectedDate = dateInput.value;


function renderWorkers() {
    workerList.innerHTML = "";
    const workers = attendanceData[selectedDate] || [];
    let presentCount = 0;
    let absentCount = 0;

    workers.forEach((worker, index) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${index + 1}</td>
            <td><img class="worker-avatar" src="https://i.pravatar.cc/50?u=${worker.name}" alt="Avatar"></td>
            <td>${worker.name}</td>
            <td class="${worker.status || 'not-marked'}">${worker.status || "Not Marked"}</td>
            <td><button onclick="markAttendance(${index}, 'present')">✅</button></td>
            <td><button onclick="markAttendance(${index}, 'absent')">❌</button></td>
        `;
        workerList.appendChild(row);

        if(worker.status === "present") presentCount++;
        if(worker.status === "absent") absentCount++;
    });

    attendanceStats.textContent = `Present: ${presentCount} | Absent: ${absentCount}`;
    localStorage.setItem("attendanceData", JSON.stringify(attendanceData));
}


function markAttendance(index, status) {
    attendanceData[selectedDate][index].status = status;
    renderWorkers();
}


form.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = workerInput.value.trim();
    if (!name) return;

    if (!attendanceData[selectedDate]) {
        attendanceData[selectedDate] = [];
    }

    attendanceData[selectedDate].push({ name, status: "" });
    workerInput.value = "";
    renderWorkers();
});

dateInput.addEventListener("change", () => {
    selectedDate = dateInput.value;
    if (!attendanceData[selectedDate]) {
        attendanceData[selectedDate] = [];
    }
    renderWorkers();
});


renderWorkers();
