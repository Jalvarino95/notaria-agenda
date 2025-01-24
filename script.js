document.addEventListener("DOMContentLoaded", function () {
    // Inicializa EmailJS
    emailjs.init("OkKCaiZOuHvmgUBLf");

    const timeInput = document.getElementById("time");

    // Cargar citas del Local Storage
    const getAppointments = () => JSON.parse(localStorage.getItem("appointments")) || [];

    // Bloquear domingos y fechas sin horarios disponibles
    const disableDates = () => {
        const appointments = getAppointments();
        const unavailableDates = new Set();

        // Recolectar fechas completamente ocupadas
        const allTimes = [
            "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
            "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00",
        ];

        appointments.forEach(app => {
            const bookedTimes = appointments
                .filter(a => a.date === app.date)
                .map(a => a.time);

            if (bookedTimes.length === allTimes.length) {
                unavailableDates.add(app.date);
            }
        });

        return [...unavailableDates];
    };

    // Configuración de Flatpickr
    flatpickr("#date", {
        minDate: "today",
        disable: [
            function (date) {
                // Bloquear domingos
                return date.getDay() === 0;
            },
            ...disableDates(), // Bloquear fechas sin horarios disponibles
        ],
        onChange: updateAvailableTimes, // Actualizar horas disponibles al cambiar de fecha
    });

    // Actualizar las horas disponibles para la fecha seleccionada
    function updateAvailableTimes(selectedDates, dateStr) {
        const appointments = getAppointments();
        const bookedTimes = appointments
            .filter(app => app.date === dateStr)
            .map(app => app.time);

        // Limpiar y actualizar las opciones del selector de hora
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

        // Verificar duplicados
        const appointments = getAppointments();
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

        // Actualizar Flatpickr y las horas disponibles
        flatpickr("#date", {
            minDate: "today",
            disable: [
                function (date) {
                    return date.getDay() === 0;
                },
                ...disableDates(),
            ],
        });

        updateAvailableTimes(null, date);
    });
});

