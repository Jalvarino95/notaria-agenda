document.addEventListener("DOMContentLoaded", function () {
    // Inicializar Flatpickr para la fecha
    const dateInput = document.getElementById("date");
    flatpickr(dateInput, {
        dateFormat: "Y-m-d",
        minDate: "today", // Evitar fechas pasadas
        disable: [
            function (date) {
                // Deshabilitar domingos
                return date.getDay() === 0;
            },
        ],
        locale: "es",
        onChange: function (selectedDates, selectedDate) {
            if (selectedDate) {
                updateAvailableTimes(selectedDate);
            }
        },
    });

    const timeSelect = document.getElementById("time");

    // Función para actualizar las horas disponibles según la fecha seleccionada
    function updateAvailableTimes(selectedDate) {
        const appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        const takenTimes = appointments
            .filter(appointment => appointment.date === selectedDate)
            .map(appointment => appointment.time);

        // Todas las horas posibles
        const allTimes = [
            "10:00", "10:30", "11:00", "11:30", "12:00", "12:30",
            "01:00", "01:30", "02:00", "02:30", "03:00", "03:30", "04:00"
        ];

        // Filtrar las horas disponibles
        const availableTimes = allTimes.filter(time => !takenTimes.includes(time));

        // Limpiar el select de horas y actualizarlo
        timeSelect.innerHTML = "";
        availableTimes.forEach(time => {
            const option = document.createElement("option");
            option.value = time;
            option.textContent = time;
            timeSelect.appendChild(option);
        });

        // Mostrar mensaje si no hay horas disponibles
        if (availableTimes.length === 0) {
            const option = document.createElement("option");
            option.value = "";
            option.textContent = "No hay horas disponibles";
            timeSelect.appendChild(option);
            timeSelect.disabled = true;
        } else {
            timeSelect.disabled = false;
        }
    }

    // Manejo del formulario
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

        if (timeSelect.disabled) {
            alert("La hora seleccionada ya no está disponible. Por favor, elige otra.");
            return;
        }

        const appointment = { name, phone, contact, service, date, time };

        // Guardar las citas en Local Storage
        let appointments = JSON.parse(localStorage.getItem("appointments")) || [];
        appointments.push(appointment);
        localStorage.setItem("appointments", JSON.stringify(appointments));
        

        alert(`Cita agendada exitosamente.\nDetalles:\nNombre: ${name}\nTeléfono: ${phone}\nCorreo: ${contact}\nServicio: ${service}\nFecha: ${date}\nHora: ${time}`);
        document.getElementById("appointment-form").reset();

        // Actualizar las horas disponibles después de agendar
        updateAvailableTimes(date);

         // Enviar correo de confirmación usando EmailJS
        emailjs.init("OkKCaiZOuHvmgUBLf"); 
    emailjs.send("service_kzfceqn", "appointment_confirmation", {
        name: appointment.name,
        phone: appointment.phone,
        service: appointment.service,
        contact: appointment.contact,
        date: appointment.date,
        time: appointment.time,
    }).then(
        function (response) {
            console.log("Correo enviado exitosamente:", response.status, response.text);
                alert("Cita agendada y correo enviado exitosamente.");
        },
        function (error) {
            alert("Ocurrió un error al enviar el correo: " + error.text);
            console.error("Error al enviar el correo:", error);
                alert("Ocurrió un error al enviar el correo: " + error.text);
            
        }
    );

    // Reiniciar el formulario
    document.getElementById("appointment-form").reset();
    });
});
