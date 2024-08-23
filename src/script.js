/*

function validarFecha(fecha) {
    const meses = {
        "jan": 0, "ene": 0, "feb": 1, "mar": 2, "apr": 3, "abr": 3, "may": 4, "jun": 5, 
        "jul": 6, "aug": 7, "ago": 7, "sep": 8, "oct": 9, "nov": 10, "dec": 11, "dic": 11
    };

    const regex = /^(\d{1,2})([a-zA-Z]{3})(\d{4})$/;
    const match = fecha.match(regex);

    if (!match) {
        return false; // Formato no válido
    }

    const dia = parseInt(match[1], 10);
    const mes = match[2].toLowerCase();
    const anio = parseInt(match[3], 10);

    if (!meses.hasOwnProperty(mes)) {
        return false; // Mes no válido
    }

    const fechaObj = new Date(anio, meses[mes], dia);

    if (fechaObj.getDate() !== dia || fechaObj.getMonth() !== meses[mes] || fechaObj.getFullYear() !== anio) {
        return false; // Fecha no válida
    }

    return true; // Fecha válida
}

function esFinDeSemana(fecha) {
    const diaSemana = fecha.getDay(); // 0: domingo, 6: sábado
    return diaSemana === 0 || diaSemana === 6;
}

function procesarFechas(fechasStr) {
    const fechasArray = fechasStr.toLowerCase().split(',').map(fecha => fecha.trim());

    for (let fecha of fechasArray) {
        if (!validarFecha(fecha)) {
            return null;
        }
    }

    return fechasArray.map(fechaStr => {
        const [dia, mes, anio] = [parseInt(fechaStr.substring(0, 2)), fechaStr.substring(2, 5), parseInt(fechaStr.substring(5))];
        return new Date(${mes} ${dia}, ${anio});
    });
}
    */



function procesarFechas(fechasStr) {
    const fechasArray = fechasStr.toLowerCase().split(',').map(fecha => fecha.trim());
    const regexFecha = /^\d{2}(jan|jun|feb|mar|abr|apr|may|jun|jul|aug|ago|sep|oct|nov|dec|dic)\d{4}$/;

    for (let fecha of fechasArray) {
        if (!regexFecha.test(fecha)) {
            return null;
        }
    }

    return fechasArray.map(fechaStr => {
        const [dia, mes, anio] = [parseInt(fechaStr.substring(0, 2)), fechaStr.substring(2, 5), parseInt(fechaStr.substring(5))];
        return new Date(`${mes} ${dia}, ${anio}`);
    });
}

function esFinDeSemana(fecha) {
    const diaSemana = fecha.getDay(); // 0: domingo, 6: sábado
    return diaSemana === 0 || diaSemana === 6;
}

function calcularPrecioTotal(fechasArray, tipoCliente) {
    const hoteles = [
        {
            nombre: 'Lakewood',
            calificacion: 3,
            tarifas: {
                semana: tipoCliente === 'Regular' ? 110 : 80,
                finDeSemana: tipoCliente === 'Regular' ? 90 : 80
            }
        },
        {
            nombre: 'Bridgewood',
            calificacion: 4,
            tarifas: {
                semana: tipoCliente === 'Regular' ? 160 : 110,
                finDeSemana: tipoCliente === 'Regular' ? 60 : 50
            }
        },
        {
            nombre: 'Ridgewood',
            calificacion: 5,
            tarifas: {
                semana: tipoCliente === 'Regular' ? 220 : 100,
                finDeSemana: tipoCliente === 'Regular' ? 150 : 40
            }
        }
    ];

    hoteles.forEach(hotel => {
        hotel.precioTotal = 0;
        fechasArray.forEach(fecha => {
            const esFinde = esFinDeSemana(fecha);
            hotel.precioTotal += esFinde ? hotel.tarifas.finDeSemana : hotel.tarifas.semana;
        });
    });

    let hotelMasBarato = hoteles[0];
    for (let i = 1; i < hoteles.length; i++) {
        const hotel = hoteles[i];
        if (hotel.precioTotal < hotelMasBarato.precioTotal ||
            (hotel.precioTotal === hotelMasBarato.precioTotal && hotel.calificacion > hotelMasBarato.calificacion)) {
            hotelMasBarato = hotel;
        }
    }

    return hotelMasBarato;
}

document.getElementById('reservation-form').addEventListener('submit', function (e) {
    e.preventDefault();

    const fechasIngresadas = document.getElementById('dates').value;
    const fechasValidadas = procesarFechas(fechasIngresadas);

    if (!fechasValidadas) {
        alert("Una o más fechas son inválidas. Por favor, ingrese fechas válidas en el formato ddMmmYYYY en el mes se debe colocar las 3 primeras letras (ej: 16Mar2009,17Apr2024,18Ago2024).");
        return;
    }

    const customerType = document.querySelector('input[name="customer-type"]:checked').value;

    const hotelMasBarato = calcularPrecioTotal(fechasValidadas, customerType);

    document.querySelectorAll('.hotel-card').forEach(card => card.classList.remove('highlight'));
    document.getElementById(hotelMasBarato.nombre).classList.add('highlight');
    document.getElementById(`${hotelMasBarato.nombre}-price`).innerText = `Precio Total: $${hotelMasBarato.precioTotal}`;
});