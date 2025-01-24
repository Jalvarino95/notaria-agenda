document.addEventListener("DOMContentLoaded", function () {
    const tableBody = document.getElementById("appointments-table");
    const filterDate = document.getElementById("filter-date");
    const filterService = document.getElementById("filter-service");
    const applyFilters = document.getElementById("apply-filters");

    // Cargar citas desde Local Storage
    function loadAppointments() {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        renderTable(appointments);
    }

    // Renderizar tabla
    function renderTable(appointments) {
        tableBody.innerHTML = ""; // Limpiar la tabla
        appointments.forEach((appointment, index) => {
            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${appointment.name}</td>
                <td>${appointment.phone}</td>
                <td>${appointment.service}</td>
                <td>${appointment.contact}</td>
                <td>${appointment.date}</td>
                <td>${appointment.time}</td>
                <td>
                    <button class="btn btn-warning btn-sm edit-btn" data-index="${index}">Editar</button>
                    <button class="btn btn-danger btn-sm delete-btn" data-index="${index}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        addEventListeners();
    }

    // Filtros
    applyFilters.addEventListener("click", function () {
        const dateValue = filterDate.value;
        const serviceValue = filterService.value;

        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        if (dateValue) {
            appointments = appointments.filter(app => app.date === dateValue);
        }
        if (serviceValue) {
            appointments = appointments.filter(app => app.service === serviceValue);
        }
        renderTable(appointments);
    });

    // Añadir eventos a los botones
    function addEventListeners() {
        const deleteButtons = document.querySelectorAll(".delete-btn");
        const editButtons = document.querySelectorAll(".edit-btn");

        deleteButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                deleteAppointment(index);
            });
        });

        editButtons.forEach(button => {
            button.addEventListener("click", function () {
                const index = this.dataset.index;
                editAppointment(index);
            });
        });
    }

    // Eliminar cita
    function deleteAppointment(index) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.splice(index, 1);
        localStorage.setItem("appointments", JSON.stringify(appointments));
        loadAppointments();
    }

    // Editar cita (simple ejemplo)
    function editAppointment(index) {
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const appointment = appointments[index];
        const newName = prompt("Editar nombre:", appointment.name);
        if (newName) {
            appointment.name = newName;
            appointments[index] = appointment;
            localStorage.setItem("appointments", JSON.stringify(appointments));
            loadAppointments();
        }
    }

    // Cargar citas al inicio
    loadAppointments();
});
