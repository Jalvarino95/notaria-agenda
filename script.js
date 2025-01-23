document.addEventListener("DOMContentLoaded", function () {
    // Inicializa EmailJS
    emailjs.init("OkKCaiZOuHvmgUBLf");

    // Configura Flatpickr para el campo de fecha
    const dateInput = document.getElementById("date");
    flatpickr(dateInput, {
        minDate: "today", // Evita fechas pasadas
        dateFormat: "Y-m-d", // Formato de fecha (año-mes-día)
        disable: [
            function (date) {
                // Deshabilitar domingos (0 es domingo)
                return date.getDay() === 0;
            },
        ],
        locale: {
            firstDayOfWeek: 1, // Hacer que la semana empiece en lunes
        },
    });

    // Manejo del formulario
    document.getElementById("appointment-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const service = document.getElementById("service").value;
        const contact = document.getElementById("contact").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        if (!name || !service || !contact || !date || !time) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const appointment = { name, service, contact, date, time };

        // Guardar las citas en Local Storage
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert(`Cita agendada exitosamente.\nDetalles:\nNombre: ${name}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`);
        document.getElementById("appointment-form").reset();
    });
});
