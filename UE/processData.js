export function processData(data, codigo, clave, allData) {
  // Extrae las observaciones de la serie de datos usando el código proporcionado.
  let valor = data.dataSets[0].series[`${codigo}`].observations;
  // Extrae las fechas 
  let fecha = data.structure.dimensions.observation[0].values;
  console.log(fecha)
  let valorArray = Object.entries(valor).reverse();
  // Invierte el array de fechas.
  fecha = fecha.reverse();
  
  let dataArray = fecha.map((f, index) => ({
    fecha: f.id,
    valor: valorArray[index][1][0],
  }));

  // Toma el primer dato del array de datos combinados.
  let firstData = dataArray[0];
  // Almacena solo el primer dato en el objeto allData usando la clave proporcionada.
  allData[clave] = firstData;

  // Selecciona el elemento HTML donde se mostrará el primer dato.
  let firstDataElement = document.getElementById(`first-data-${clave}`);
  // Establece el contenido HTML del elemento con la fecha y el valor del primer dato.
  firstDataElement.innerHTML = `<span><strong>Fecha: </strong>${firstData.fecha}</span> <span><strong>Valor: </strong>${firstData.valor}</span>`;
}
