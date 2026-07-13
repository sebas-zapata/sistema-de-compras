// Seleccionar elementos por su ID para ser manipulados dinamicamente
const formularioVenta = document.getElementById('formularioVenta');
const total = document.getElementById('total');
const productoComprado = document.getElementById('producto');
const devueltaTexto = document.getElementById('devuelta');
const cantidadTexto = document.getElementById('cantidad');
const botonPdf = document.getElementById('botonPdf');
const historialDeVentasBoton = document.getElementById('historialDeVentasBoton');
const bodyModalHistorialDeVentas = document.getElementById('bodyModalHistorialDeVentas');
const numeroDeVentas = document.getElementById('numeroDeVentas');
const borrarVentas = document.getElementById('borrarVentas');
const fechaActualModal = document.getElementById('fechaActual');
const botonCalcularTotalAcumulado = document.getElementById('botonCalcularTotalAcumulado');
const fechaCompra = document.getElementById('fechaCompra');
const valorUnitario = document.getElementById('valorUnitario');
const modalFormularioVenta = document.getElementById('staticBackdrop');
const totalApagarFormularioVentas = document.getElementById('totalApagarFormularioVentas');
const cantidadInput = document.getElementById('cantidadVenta');
const valorUnitarioInput = document.getElementById('valorUnitarioVenta');
const totalApagarVenta = document.getElementById('totalApagarVenta');
const devueltaVenta = document.getElementById('devueltaVenta');
const alertaContenedor = document.getElementById('alerta');
const mensajeAlerta = document.getElementById('mensajeAlerta');
const recibo = document.getElementById('recibo');
const toastFacturaPdf = document.getElementById('toastFacturaPdf');
const footerModalHistorialDeVentas = document.getElementById('footerModalHistorialDeVentas');

// Esperar los cambios en tiempo real de los inputs
// Total a pagar
cantidadInput.addEventListener('input', calcularTotalVenta);
valorUnitarioInput.addEventListener('input', calcularTotalVenta);

// Array para almacenar el historial de ventas
const historialDeVentas = [];

// Verificar si existe un localstorage de ventas
const consultarArrayVentas = JSON.parse(localStorage.getItem('ventas'));
if (!consultarArrayVentas) {
    // Crear array en el localstorage para almacenar las ventas
    localStorage.setItem('ventas', JSON.stringify(historialDeVentas));
}

// Dar formato a los valores en peso colombiano
function formatoColombia(valor) {
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(valor);

    // Devolver valor con formato
    return formatoCOP;
};

// Añadir una nueva venta en el localstorage
function localStorageAñadirVentas(venta) {
    const historialActual = JSON.parse(localStorage.getItem('ventas'));
    historialActual.push(venta);
    localStorage.setItem('ventas', JSON.stringify(historialActual));
}

// Conseguir ventas del localstorage
function localStorageConseguirVentas() {
    const ventasActuales = localStorage.getItem('ventas');
    const ventasTotales = JSON.parse(ventasActuales);
    return ventasTotales;
}

// Función para calcular y mostrar el total en tiempo real
function calcularTotalVenta() {
    const cantidadDinamica = parseFloat(cantidadInput.value) || 0;
    const valorUnitarioDinamico = parseFloat(valorUnitarioInput.value) || 0;
    if (cantidadDinamica == "" || valorUnitarioDinamico == "") {
        totalApagarVenta.innerHTML = "";
        return;
    }
    const total = cantidadDinamica * valorUnitarioDinamico;
    totalApagarVenta.innerHTML = "Total: " + formatoColombia(total);
};

// Funcion para mostrar alerta dinamica
function alerta(mensaje) {
    if (mensaje == "correcto") {
        alertaContenedor.classList.remove("d-none");
        alertaContenedor.classList.add("alert-dark");
        mensajeAlerta.innerHTML = "<i class='bi bi-check-circle-fill'></i> Correcto, venta registrada exitosamente.";
    } else if (mensaje == "error") {
        alertaContenedor.classList.remove("d-none");
        alertaContenedor.classList.add("alert-secondary");
        mensajeAlerta.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Error, hubo un problema en la venta.";
    } else if (mensaje == "ventas") {
        alertaContenedor.classList.remove("d-none");
        alertaContenedor.classList.add("alert-secondary");
        mensajeAlerta.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Correcto, se limpiaron todas las ventas acumuladas.";
    }
};

// Generar documento PDF 
document.getElementById('botonPdf').addEventListener('click', function () {
    if (recibo.innerText.trim() === "") {
        const toastBootstrap = bootstrap.Toast.getOrCreateInstance(toastFacturaPdf).show();
        return;
    }

    const boton = this;

    const diseñoOriginal = boton.innerHTML;
    boton.innerHTML = `
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
        Generando PDF...
    `;
    boton.disabled = true;

    setTimeout(() => {
        // 4. Ejecutar la acción de impresión del navegador
        // Opciones de configuración para html2pdf
        const opciones = {
            margin: 10,
            filename: 'recibo.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 }, // Aumenta la resolución
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        // Generar y descargar el PDF
        html2pdf().set(opciones).from(recibo).save();

        // 5. Restaurar el botón a su estado original
        boton.innerHTML = diseñoOriginal;
        boton.disabled = false;
    }, 3000);

});

// Recorrer el array de objetos con todas las ventas realizadas
historialDeVentasBoton.addEventListener('click', () => {
    const ventas = localStorageConseguirVentas();
    const fechaActual = new Date();
    fechaActualModal.innerHTML = fechaActual.toLocaleDateString('es-ES');
    numeroDeVentas.innerHTML = ventas.length;
    bodyModalHistorialDeVentas.innerHTML = "";

    // Tabla dinamica con informacion de las ventas
    bodyModalHistorialDeVentas.innerHTML = `
    <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered text-center">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Cedula Cliente</th>
      <th scope="col">Producto</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Valor Unitario</th>
      <th scope="col">Pago</th>
      <th scope="col">Valor Venta</th>
      <th scope="col">Devuelta Venta</th>
      <th scope="col">Fecha Venta</th>
    </tr>
  </thead>
<tbody>
    ${ventas.length
            ? ventas.map((venta, index) => `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${venta.cedulaCliente}</td>
                    <td>${venta.nombreProducto}</td>
                    <td>${venta.cantidadProducto}</td>
                    <td>${formatoColombia(venta.precioUnitario)}</td>
                    <td>${formatoColombia(venta.valorApagarVenta)}</td>
                    <td class="text-success fw-bolder">${formatoColombia(venta.valorVenta)}</td>
                    <td class="${venta.devueltaVenta > 0 && 'text-danger fw-bolder'}">${venta.devueltaVenta > 0 ? "-" : ""} ${formatoColombia(venta.devueltaVenta)} </td>
                    <td>${venta.horaDeVenta}</td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="9" class="text-center fw-bold">
                        No hay ventas registradas - ${fechaActual.toLocaleDateString('es-ES')}.
                    </td>
                </tr>
            `
        }
</tbody>
</table>
</div>
    `
});

// Borrar todas las ventas, vaciar array
borrarVentas.addEventListener('click', () => {
    const ventasABorrar = localStorageConseguirVentas();
    if (ventasABorrar.length >= 1) {
        bodyModalHistorialDeVentas.innerHTML = "";
        numeroDeVentas.innerHTML = "";
        localStorage.setItem('ventas', JSON.stringify([]));
        alerta('ventas');
    }
});

// Boton para calcular el total final acumulado de las ventas totales
botonCalcularTotalAcumulado.addEventListener('click', () => {
    const ventasACalcular = localStorageConseguirVentas();
    if (ventasACalcular.length !== 0) {
        const totalFinal = ventasACalcular.reduce((acumulador, venta) => acumulador + venta.valorVenta, 0);

        // Verifica si ya existe un h4 con ese texto específico
        const totalAcumuladoExistente = footerModalHistorialDeVentas.querySelector('h5');
        if (!totalAcumuladoExistente) {
            // Si no existe crea el elemento 
            const h5 = document.createElement('h5');
            h5.classList.add('text-dark', 'fw-bolder', 'me-3');
            h5.textContent = "Total Final: " + formatoColombia(totalFinal) + " pesos";
            footerModalHistorialDeVentas.prepend(h5);
            setTimeout(() => {
                h5.remove();
            }, 10000);
        }
    }
})

// Registrar una nueva venta
formularioVenta.addEventListener("submit", (e) => {
    e.preventDefault();

    // Limpiar textos informativos previos
    total.innerHTML = '';
    devueltaTexto.innerHTML = '';
    productoComprado.innerHTML = '';
    cantidadTexto.innerHTML = '';
    fechaCompra.innerHTML = '';
    valorUnitario.innerHTML = '';

    // Capturar y formatear valores de los inputs
    var cedulaCliente = document.getElementById('cedulaCliente').value.trim();
    var producto = document.getElementById('productoVenta').value.trim();
    var cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    var valorUnitarioProducto = parseInt(document.getElementById('valorUnitarioVenta').value) || 0;
    var valorApagar = parseInt(document.getElementById('valorApagarVenta').value) || 0;

    if (cedulaCliente === "" || producto === "" || cantidad <= 0 || valorUnitarioProducto <= 0 || valorApagar <= 0) {
        formularioVenta.classList.add('was-validated');
        return;
    }

    const totalApagar = cantidad * valorUnitarioProducto;
    const fechaActualString = new Date().toLocaleDateString('es-ES');
    const horaActualString = new Date().toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Lógica de estados del pago
    if (valorApagar < totalApagar) {
        const dineroFaltante = totalApagar - valorApagar;
        // Caso A: Dinero insuficiente / pendiente
        total.classList.add("badge", "text-bg-dark", "text-wrap");
        total.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i> Dinero pendiente: " + formatoColombia(dineroFaltante) + " pesos";
        valorUnitario.innerHTML = "<del><i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(valorUnitarioProducto) + " pesos</del>";
        productoComprado.innerHTML = " <del><i class='bi bi-box-seam-fill'></i> Producto: " + producto + "</del>";
        cantidadTexto.innerHTML = "<del><i class='bi bi-stack'></i> Cantidad: " + cantidad + "</del>";
        fechaCompra.innerHTML = "Fecha de compra: " + fechaActualString;
        alerta("error");

    } else {
        // Pago exacto o con devuelta (Comparten casi toda la lógica)
        total.classList.add("badge", "text-bg-dark");
        total.innerHTML = "<i class='bi bi-cash-coin'></i> Total a pagar: " + formatoColombia(totalApagar) + " pesos.";
        valorUnitario.innerHTML = "<i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(valorUnitarioProducto) + " pesos";
        productoComprado.innerHTML = "<i class='bi bi-box-seam-fill'></i> Producto: " + producto;
        cantidadTexto.innerHTML = "<i class='bi bi-stack'></i> Cantidad: " + cantidad;
        fechaCompra.innerHTML = "Fecha de compra: " + fechaActualString;
        totalApagarVenta.innerHTML = "";
        alerta("correcto");


        // Si hay cambio/devuelta, lo agregamos
        if (valorApagar > totalApagar) {
            const devuelta = valorApagar - totalApagar;
            devueltaTexto.innerHTML = "<i class='bi bi-cash'></i> Devuelta: " + formatoColombia(devuelta) + " pesos";
            totalApagarVenta.innerHTML = "";
            alerta("correcto");

        }

        // Crear objeto para añadir al localstorage
        nuevaVenta = {
            cedulaCliente: cedulaCliente,
            nombreProducto: producto,
            precioUnitario: valorUnitarioProducto,
            valorVenta: totalApagar,
            cantidadProducto: cantidad,
            valorApagarVenta: valorApagar,
            devueltaVenta: valorApagar > totalApagar ? valorApagar - totalApagar : 0,
            horaDeVenta: new Date().toLocaleString('es-CO')
        };

        // Llamar la funcion y pasar por argumento el objeto
        localStorageAñadirVentas(nuevaVenta);

        // Limpiar el formulario
        formularioVenta.classList.remove('was-validated');
        formularioVenta.reset();
    }

    // Cerrar modal cuando se registre una nueva venta 
    if (modalFormularioVenta) {
        if (typeof bootstrap !== 'undefined' && bootstrap.Modal) {
            // Intento oficial usando la librería de Bootstrap
            var modalBootstrap = bootstrap.Modal.getOrCreateInstance(modalFormularioVenta);
            modalBootstrap.hide();
        } else {
            // Alternativa automática si falla la librería global: Simula clic en la X de cierre
            var botonCerrarModal = modalFormularioVenta.querySelector('[data-bs-dismiss="modal"]');
            if (botonCerrarModal) botonCerrarModal.click();
        }
    }
});

// Importar popover de bootstrap para los botones del navbar
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]');
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl));
