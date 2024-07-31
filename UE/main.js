import { createSection, fetchData } from "./common.js";
import { dataApi } from "./datosApi.js";
import { processData } from "./processData.js";

const datos = document.querySelector('.datos');
let allData = {};

function Main() {
  // Obtiene la fecha actual y la formatea en el formato YYYY-MM-DD.
  const now = new Date();
  const formattedDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  // Itera sobre cada clave y valor en el objeto dataApi.
  for (const [clave, valor] of Object.entries(dataApi)) {
    // Crea un nuevo elemento div para cada sección.
    const section = document.createElement('div');
    section.innerHTML = createSection(valor[2], clave);
    // Añade la sección creada.
    datos.appendChild(section);

    // Llama a la función fetchData para obtener datos de la API.
    fetchData(
      `${valor[0]}?startPeriod=2022-01-01&endPeriod=${formattedDate}`, // URL de la API con el período de fechas.
      processData, // Función para procesar los datos obtenidos.
      valor[1], // Parámetero adicional que se pasa a fetchData.
      clave, // Clave actual que se está iterando.
      allData // Objeto donde se almacenarán todos los datos obtenidos.
    );
  }
}

// Llama a la función principal para iniciar el proceso.
Main();

// Añade un evento de clic al botón con el ID 'export-btn' para exportar los datos a un archivo Excel.
document.getElementById('export-btn').addEventListener('click', () => {
  // Crea un nuevo libro de trabajo Excel.
  const workbook = XLSX.utils.book_new();

  // Itera sobre cada clave y primer dato en el objeto allData.
  for (const [clave, firstData] of Object.entries(allData)) {
    // Crea los datos de la hoja de cálculo .
    const worksheetData = [
      ["Fecha", "Valor"], // Encabezados de las columnas.
      [firstData.fecha, firstData.valor] // Primeros datos de la hoja de cálculo.
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
    // Añade la hoja de cálculo al libro de trabajo.
    XLSX.utils.book_append_sheet(workbook, worksheet, clave);
  }

  // archivo llamado 'datos.xlsx'.
  XLSX.writeFile(workbook, 'datos.xlsx');
});
