document.addEventListener("DOMContentLoaded", function () {
    // Inicializa EmailJS
    emailjs.init("OkKCaiZOuHvmgUBLf");

    // Evitar selección de fechas no válidas
    const dateInput = document.getElementById("date");
    const timeInput = document.getElementById("time");

    // Configura el atributo "min" para evitar fechas pasadas
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0");
    const dd = String(today.getDate()).padStart(2, "0");
    const todayString = `${yyyy}-${mm}-${dd}`;
    dateInput.setAttribute("min", todayString);

    // Deshabilitar domingos dinámicamente
    dateInput.addEventListener("input", function () {
        const selectedDate = new Date(dateInput.value);
        if (selectedDate.getDay() === 0) { // 0 es domingo
            alert("No se pueden seleccionar domingos. Por favor, elige otra fecha.");
            dateInput.value = ""; // Resetea el valor si es domingo
        } else {
            updateAvailableTimes();
        }
    });

    // Actualizar horas disponibles al seleccionar una fecha
    function updateAvailableTimes() {
        const selectedDate = dateInput.value;
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const bookedTimes = appointments
            .filter(app => app.date === selectedDate)
            .map(app => app.time);

        // Reiniciar opciones de tiempo
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

        // Deshabilitar horarios ya reservados
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

        // Verificar si la cita ya existe
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const isDuplicate = appointments.some(
            app => app.date === date && app.time === time
        );

        if (isDuplicate) {
            alert("La fecha y hora seleccionadas ya están reservadas. Por favor, elige otra.");
            return;
        }

        // Guardar las citas en Local Storage
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));

        alert(`Cita agendada exitosamente.\nDetalles:\nNombre: ${name}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`);
        document.getElementById("appointment-form").reset();
        updateAvailableTimes(); // Actualizar horas disponibles
    });
});

