// public/js/main.js

// Configuración del API
const API_URL = "http://localhost:3000";

// Función genérica para realizar solicitudes fetch con manejo de errores
async function fetchAPI(endpoint, method = "GET", body = null) {
    try {
        const options = {
            method,
            headers: body ? { "Content-Type": "application/json" } : {}
        };
        
        if (body) {
            options.body = JSON.stringify(body);
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.error);
        }
        
        return data;
    } catch (error) {
        console.error(`❌ Error en operación ${method} ${endpoint}:`, error);
        alert(`❌ Error: ${error.message}`);
        throw error;
    }
}

// Cargar fiados cuando se carga la página
document.addEventListener("DOMContentLoaded", cargarFiados);

// ==================== GESTIÓN DE CLIENTES ====================

/**
 * Registra un nuevo cliente
 */
async function agregarCliente() {
    const nombre = document.getElementById("nombreCliente").value;
    const telefono = document.getElementById("telefonoCliente").value;
    
    if (!nombre) {
        alert("❌ El nombre del cliente es obligatorio");
        return;
    }

    try {
        await fetchAPI("/clientes", "POST", { nombre, telefono });
        alert("✅ Cliente registrado correctamente");
        document.getElementById("nombreCliente").value = "";
        document.getElementById("telefonoCliente").value = "";
    } catch (error) {
        // El error ya se maneja en fetchAPI
    }
}

// ==================== GESTIÓN DE FIADOS ====================

/**
 * Carga todos los fiados desde el servidor
 */
async function cargarFiados() {
    try {
        const data = await fetchAPI("/fiados");
        actualizarListaFiados(data);
    } catch (error) {
        // El error ya se maneja en fetchAPI
    }
}

/**
 * Actualiza la lista de fiados en el DOM
 * @param {Array} fiados - Lista de fiados a mostrar
 */
function actualizarListaFiados(fiados) {
    const lista = document.getElementById("listaFiados");
    lista.innerHTML = "";

    fiados.forEach(fiado => {
        const fechaFormato = new Date(fiado.fecha_hora).toLocaleString();
        const item = document.createElement("li");
        item.innerHTML = `${fiado.cliente} - $${fiado.saldo} (${fiado.descripcion}) 
            <br>📅 Fecha: ${fechaFormato}  
            <button onclick="eliminarFiado(${fiado.id})">❌ Eliminar</button>`;
        lista.appendChild(item);
    });
}

/**
 * Agrega un nuevo fiado
 */
async function agregarFiado() {
    const cliente = document.getElementById("cliente").value;
    const monto = document.getElementById("monto").value;
    const descripcion = document.getElementById("descripcion").value;
    
    if (!cliente || !monto) {
        alert("❌ Cliente y monto son obligatorios");
        return;
    }

    try {
        await fetchAPI("/fiados", "POST", { cliente, monto, descripcion });
        alert("✅ Fiado registrado correctamente");
        
        // Limpiar los campos de entrada
        document.getElementById("cliente").value = "";
        document.getElementById("monto").value = "";
        document.getElementById("descripcion").value = "";
        
        // Actualizar la lista
        cargarFiados();
    } catch (error) {
        // El error ya se maneja en fetchAPI
    }
}

/**
 * Elimina un fiado por su ID
 * @param {number} id - ID del fiado a eliminar
 */
async function eliminarFiado(id) {
    try {
        await fetchAPI(`/fiados/${id}`, "DELETE");
        cargarFiados(); // Recargar la lista después de eliminar
    } catch (error) {
        // El error ya se maneja en fetchAPI
    }
}

/**
 * Elimina múltiples fiados
 * @param {Array} ids - Array de IDs de fiados a eliminar
 */
async function eliminarTodosFiados(ids) {
    if (confirm("¿Está seguro que desea eliminar todos estos fiados?")) {
        try {
            // Eliminar cada fiado de forma secuencial
            for (const id of ids) {
                await fetchAPI(`/fiados/${id}`, "DELETE");
            }
            alert("✅ Todos los fiados seleccionados han sido eliminados");
            cargarFiados();
        } catch (error) {
            // El error ya se maneja en fetchAPI
        }
    }
}

/**
 * Filtra los fiados por cliente
 */
async function filtrarFiados() {
    const clienteBuscado = document.getElementById("filtroCliente").value.toLowerCase();
    let totalFiados = 0;
    
    try {
        const data = await fetchAPI("/fiados");
        const lista = document.getElementById("listaFiados");
        lista.innerHTML = "";
        
        let fiadosFiltrados = [];
        
        data.forEach(fiado => {
            if (fiado.cliente.toLowerCase().includes(clienteBuscado)) {
                const fechaFormato = new Date(fiado.fecha_hora).toLocaleString();
                const item = document.createElement("li");
                
                item.innerHTML = `${fiado.cliente} - $${fiado.saldo} (${fiado.descripcion}) 
                    <br>📅 Fecha: ${fechaFormato}  
                    <button onclick="eliminarFiado(${fiado.id})">❌ Eliminar</button>`;
                lista.appendChild(item);
                
                totalFiados += parseFloat(fiado.saldo);
                fiadosFiltrados.push(fiado.id);
            }
        });
        
        // Mostrar el total
        const totalItem = document.createElement("li");
        totalItem.innerHTML = `<strong>Total: $${totalFiados.toFixed(2)}</strong>`;
        lista.appendChild(totalItem);
        
        // Agregar botón "Eliminar todo" si hay resultados
        if (fiadosFiltrados.length > 0) {
            const eliminarTodoBtn = document.createElement("button");
            eliminarTodoBtn.textContent = "🗑️ Eliminar todo";
            eliminarTodoBtn.onclick = () => eliminarTodosFiados(fiadosFiltrados);
            lista.appendChild(eliminarTodoBtn);
        }
    } catch (error) {
        // El error ya se maneja en fetchAPI
    }
}

// ==================== EXPORTACIÓN PDF ====================

/**
 * Exporta todos los fiados a PDF
 */
function exportarPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    
    doc.setFontSize(14);
    doc.text("Lista de Fiados", 10, 10);
    
    let y = 20;
    document.querySelectorAll("#listaFiados li").forEach((fiado, index) => {
        doc.text(`${index + 1}. ${fiado.innerText}`, 10, y);
        y += 10;
    });
    
    doc.save("fiados.pdf");
}

/**
 * Exporta los fiados filtrados por cliente a PDF
 */
function exportarPDFCliente() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const clienteBuscado = document.getElementById("filtroCliente").value;
    
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text(`Fiados de ${clienteBuscado}`, 10, 15);
    
    let columns = ["#", "Cliente", "Descripción", "Monto", "Fecha"];
    let data = [];
    let totalFiados = 0;
    
    document.querySelectorAll("#listaFiados li").forEach((fiado, index) => {
        const texto = Array.from(fiado.childNodes)
            .filter(node => node.nodeType === Node.TEXT_NODE)
            .map(node => node.textContent.trim())
            .join(" ");  
        
        const match = texto.match(/^(.*?) - \$([\d.]+) \((.*?)\)\s*📅 Fecha: (.+)/);
        
        if (match) {
            const cliente = match[1].trim();
            const monto = parseFloat(match[2].trim());
            const descripcion = match[3].trim();
            const fecha = match[4].replace("Eliminar", "").trim();
            
            data.push([index + 1, cliente, descripcion, monto.toFixed(2), fecha]);
            totalFiados += monto;
        }
    });
    
    doc.autoTable({
        startY: 25,
        head: [columns],
        body: data,
        theme: "grid"
    });
    
    // Agregar el total acumulado
    doc.autoTable({
        startY: doc.autoTable.previous.finalY + 10,
        head: [["Total acumulado"]],
        body: [[`$${totalFiados.toFixed(2)}`]],
        theme: "grid"
    });
    
    // Agregar el recuadro informativo
    const finalY = doc.autoTable.previous.finalY + 20;
    doc.setFontSize(16);
    doc.text("Alias: taqui.esquina", 105, finalY, { align: "center" });
    doc.text("Titular: Marisol Otilia López Atoche", 105, finalY + 8, { align: "center" });
    doc.text("Cuenta: Mercado Pago", 105, finalY + 16, { align: "center" });
    doc.text("Celular: 3532 436498", 105, finalY + 24, { align: "center" });
    
    doc.save(`fiados_${clienteBuscado}.pdf`);
}
