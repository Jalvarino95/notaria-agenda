document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Flatpickr con restricciones
    flatpickr("#date", {
        dateFormat: "Y-m-d",
        minDate: "today", // Evitar fechas pasadas
        disable: [
            function (date) {
                // Deshabilitar domingos (0 representa domingo)
                return date.getDay() === 0;
            },
        ],
        locale: "es", // Calendario en español
    });

    // Manejo del formulario (incluye el número de teléfono)
    document.getElementById("appointment-form").addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value;
        const phone = document.getElementById("phone").value;
        const contact = document.getElementById("contact").value;
        const service = document.getElementById("service").value;
        const date = document.getElementById("date").value;
        const time = document.getElementById("time").value;

        if (!name || !phone || !contact || !service || !date || !time) {
            alert("Por favor, completa todos los campos.");
            return;
        }

        const appointment = { name, phone, contact, service, date, time };

        // Guardar las citas en Local Storage
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert(`Cita agendada exitosamente.\nDetalles:\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${contact}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`);
        document.getElementById("appointment-form").reset();
    });
});
