// common.js
export function createSection(title, clave) {
    return `
            <h3 id=${clave}>${title}</h3>
            <p id="first-data-${clave}">Cargando...</p>
    `;
}

export async function fetchData(url, processData, codigo, clave, allData) {
    try {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                Accept: "application/json",
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        processData(data, codigo, clave, allData);
    } catch (error) {
        console.log("Error fetching data ", error);
    }
}
