const fechaInicial = document.querySelector(".fechaInicial");
const fechaFinal = document.querySelector(".fechaFinal");
const error = document.querySelector(".error");
const btnBuscar = document.querySelector(".buscar");

btnBuscar.addEventListener("click", (e) => {    
    e.preventDefault();
    let dataInicial = new Date(fechaInicial.value);
    let dataFinal = new Date(fechaFinal.value);
    if(dataInicial > dataFinal){
        return error.textContent = "La fecha inicial debe ser menor a la fecha final";
    }
    fetchData(fechaInicial.value, fechaFinal.value);
});


// Elemento del cuerpo de la tabla donde se insertarán los datos
const tableBody = document.querySelector('#data-table tbody');
const thead = document.querySelector('#data-table thead tr');

// Función asincrónica para obtener y procesar los datos
async function fetchData(fechaInicial, fechaFinal) {
    try {
        // Obtener los datos de la API
        const response = await fetch(`https://www.banxico.org.mx/SieAPIRest/service/v1/series/SE45266,SE45273,SE45303,SE45306/datos/${fechaInicial}/${fechaFinal}?token=e3a6183cb321c1833d76fb0064557f6221de0a9ae07a8d9cd31561034960526f`);
        const data = await response.json();

        // Limpiar el contenido anterior de la tabla
        tableBody.innerHTML = '';
        thead.innerHTML = '<th>Información complementaria de los flujos financieros de inversión de cartera y otra inversión</th>';  // Añadir el encabezado de título

        // Obtener las fechas únicas para los encabezados de la tabla y ordenarlas
        const dates = new Set();

        // Recorrer cada serie de datos para obtener todas las fechas
        data.bmx.series.forEach(serie => {
            serie.datos.forEach(dato => {
                dates.add(dato.fecha);
            });
        });

        // Convertir el Set a un array, ordenar las fechas de menor a mayor
        const sortedDates = Array.from(dates).sort((a, b) => new Date(a) - new Date(b));

        // Crear los encabezados de columna en la tabla
        sortedDates.forEach(date => {
            const th = document.createElement('th');
            th.textContent = date;
            thead.appendChild(th);
        });

        // Crear una estructura para acumular los totales
        const totals = Array(sortedDates.length).fill(0);

        // Insertar los datos en la tabla en el orden de sortedSeries
        data.bmx.series.forEach(serie => {
            // Eliminar la cadena específica del título
            const cleanedTitle = serie.titulo.replace('Información complementaria de los flujos financieros de inversión de cartera y otra inversión', '').trim();
            const title = `${serie.idSerie} - ${cleanedTitle}`;
            const row = document.createElement('tr');
            row.classList.add('left-align'); // Añadir la clase left-align

            // Crear celda para el título de la serie
            const titleCell = document.createElement('td');
            titleCell.textContent = title;
            row.appendChild(titleCell);

            // Llenar las celdas de valores para cada fecha en el orden de sortedDates
            sortedDates.forEach((date, index) => {
                const value = parseFloat(serie.datos.find(d => d.fecha === date)?.dato.replace(',', '') || '0'); // Convertir a número y eliminar comas si las hubiera
                const valueCell = document.createElement('td');
                valueCell.textContent = value.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Formatear el número con 2 decimales y separador de miles
                valueCell.classList.add('right-align'); // Añadir la clase right-align
                row.appendChild(valueCell);

                // Sumar el valor al total correspondiente
                totals[index] += value;
            });

            // Agregar la fila a la tabla
            tableBody.appendChild(row);
        });

        // Crear la fila de totales
        const totalRow = document.createElement('tr');
        totalRow.classList.add('left-align'); // Añadir la clase left-align

        // Crear la celda del título de la fila de totales
        const totalTitleCell = document.createElement('td');
        totalTitleCell.textContent = 'Cálculo';
        totalRow.appendChild(totalTitleCell);

        // Crear celdas de totales
        totals.forEach(total => {
            const totalCell = document.createElement('td');
            totalCell.textContent = total.toLocaleString('es-MX', { minimumFractionDigits: 2, maximumFractionDigits: 2 }); // Formatear el total con 2 decimales y separador de miles
            totalCell.classList.add('right-align'); // Añadir la clase right-align
            totalRow.appendChild(totalCell);
        });

        // Agregar la fila de totales a la tabla
        tableBody.appendChild(totalRow);

    } catch (error) {
        // Manejar cualquier error que ocurra durante la obtención o procesamiento de datos
        console.error('Error fetching data:', error);
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchData("2023-01-01", "2024-05-25");
});
