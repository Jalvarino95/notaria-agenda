document.addEventListener("DOMContentLoaded", function () {
    // Inicializa EmailJS
    emailjs.init("OkKCaiZOuHvmgUBLf");

    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    // Configura el atributo "min" para evitar fechas pasadas
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayString = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute("min", todayString);

    // Bloquear domingos y días sin horarios disponibles
    function disableInvalidDates() {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];

        const unavailableDates = new Set();
        appointments.forEach(app => {
            const bookedTimes = appointments.filter(a => a.date === app.date).map(a => a.time);
            if (bookedTimes.length === timeInput.options.length) {
                unavailableDates.add(app.date);
            }
        });

        // Desactivar dinámicamente domingos y días sin citas
        dateInput.addEventListener("input", function () {
            const selectedDate = new Date(dateInput.value);

            // Bloquear domingos
            if (selectedDate.getDay() === 0) {
                alert("No se pueden seleccionar domingos. Por favor, elige otra fecha.");
                dateInput.value = ""; // Resetea si selecciona domingo
                return;
            }

            // Bloquear días sin horarios disponibles
            if (unavailableDates.has(dateInput.value)) {
                alert("Este día ya no tiene horarios disponibles. Por favor, elige otra fecha.");
                dateInput.value = ""; // Resetea si el día está completo
            }
        });
    }

    // Actualizar las horas disponibles para la fecha seleccionada
    function updateAvailableTimes() {
        const selectedDate = dateInput.value;
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const bookedTimes = appointments
            .filter(app => app.date === selectedDate)
            .map(app => app.time);

        // Reiniciar las opciones del selector de horas
        timeInput.innerHTML = `
            <option value="10:00">10:00 AM</option>
            <option value="10:30">10:30 AM</option>
            <option value="11:00">11:00 AM</option>
            <option value="11:30">11:30 AM</option>
            <option value="12:00">12:00 PM</option>
            <option value="12:30">12:30 PM</option>
            <option value="01:00">01:00 PM</option>
            <option value="01:30">01:30 PM</option>
            <option value="02:00">02:00 PM</option>
            <option value="02:30">02:30 PM</option>
            <option value="03:00">03:00 PM</option>
            <option value="03:30">03:30 PM</option>
            <option value="04:00">04:00 PM</option>
        `;

        // Deshabilitar las horas ya reservadas
        Array.from(timeInput.options).forEach(option => {
            if (bookedTimes.includes(option.value)) {
                option.disabled = true;
            }
        });
    }

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

        // Verificar si ya existe la cita para esa fecha y hora
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const isDuplicate = appointments.some(
            app => app.date === date && app.time === time
        );

        if (isDuplicate) {
            alert("La fecha y hora seleccionadas ya están reservadas. Por favor, elige otra.");
            return;
        }

        // Guardar la cita
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert(`Cita agendada exitosamente.\nDetalles:\nNombre: ${name}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`);
        document.getElementById("appointment-form").reset();

        updateAvailableTimes(); // Actualizar las horas disponibles
        disableInvalidDates(); // Bloquear días completos si es necesario
    });

    disableInvalidDates(); // Ejecutar al cargar la página
});

