// Seleccionar elementos por su ID para ser manipulados dinamicamente
const formularioVenta = document.getElementById('formularioVenta');
const total = document.getElementById('total');
const productoComprado = document.getElementById('producto');
const devueltaTexto = document.getElementById('devuelta');
const cantidadTexto = document.getElementById('cantidad');
const cedulaClienteRecibo = document.getElementById('cedulaClienteRecibo');
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
const recibo = document.getElementById('recibo');
const toast = document.getElementById('toast');
const modalHistorialDeVentas = document.getElementById('modalHistorialDeVentas');
const instanciaModalHistorialDeVentas = bootstrap.Modal.getInstance(modalHistorialDeVentas);
const footerModalHistorialDeVentas = document.getElementById('footerModalHistorialDeVentas');
const valorApagarRecibo = document.getElementById('valorApagarRecibo');
const textoToast = document.getElementById('textoToast');
const totales = document.getElementById('totales');
const confirmarBorrarHistorialDeVentas = document.getElementById('confirmarBorrarHistorialDeVentas');
const instanciaToastConfirmacion = new bootstrap.Toast(confirmarBorrarHistorialDeVentas);
const botonBorrarVentas = document.getElementById('borrarVentas');
const btnConfirmarToast = document.getElementById('btnConfirmarToast');

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
    const toastMensaje = bootstrap.Toast.getOrCreateInstance(toast).show();
    switch (mensaje) {
        case "correcto":
            textoToast.innerHTML = "<i class='bi bi-check-circle-fill'></i> Correcto, venta registrada exitosamente.";
            break;
        case "error":
            textoToast.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Error, hubo un problema en la venta.";
            break;
        case "ventas":
            textoToast.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Correcto, se limpiaron todas las ventas acumuladas.";
            break;
        case "facturaNegada":
            textoToast.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Error, No hay recibo de venta disponible.";
            break;
        case "facturaAceptada":
            textoToast.innerHTML = "<i class='bi bi-check-circle-fill'></i> Correcto, factura generada exitosamente.";
            break;
        default:
            textoToast.innerHTML = "<i class='bi bi-exclamation-circle-fill'></i> Upss, parece que esta acción no esta disponible.";
            break;
    }
};

// Generar documento PDF 
document.getElementById('botonPdf').addEventListener('click', function () {
    if (recibo.innerText.trim() === "") {
        alerta("facturaNegada");
        return;
    }

    const boton = this;
    const diseñoOriginal = boton.innerHTML;

    // Mostrar spinner de carga
    boton.innerHTML = `
            <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
            Generando PDF...
        `;
    boton.disabled = true;

    // --- MAREO DE DATOS DINÁMICOS DESDE TU RECIBO ---
    // Generar un número de factura aleatorio o basado en la fecha para control
    const numFactura = "FAC-" + Math.floor(100000 + Math.random() * 900000);
    document.getElementById('pdf-numero').innerText = numFactura;

    // Traspaso de textos directos
    document.getElementById('pdf-fecha').innerText = document.getElementById('fechaCompra').innerText || new Date().toLocaleString();
    cedulaClienteFactura = document.getElementById('cedulaClienteRecibo').innerText;
    document.getElementById('pdf-cedula-cliente').innerText = cedulaClienteFactura !== "" ? cedulaClienteFactura : "No Registrado";
    document.getElementById('pdf-producto-nombre').innerText = document.getElementById('producto').innerText;
    document.getElementById('pdf-producto-cant').innerText = document.getElementById('cantidad').innerText || "1";
    document.getElementById('pdf-producto-unitario').innerText = document.getElementById('valorUnitario').innerText || "$0";
    document.getElementById('pdf-producto-total').innerText = document.getElementById('total').innerText || "$0";

    // Traspaso de bloque financiero de cierre
    document.getElementById('pdf-subtotal').innerText = document.getElementById('total').innerText || "$0";
    document.getElementById('pdf-pago').innerText = document.getElementById('valorApagarRecibo').innerText || "$0";
    document.getElementById('pdf-devuelta').innerText = document.getElementById('devuelta').innerText || "$0";
    // ------------------------------------------------

    // Seleccionar la plantilla oculta estructurada
    const plantillaFactura = document.getElementById('plantilla-factura-pdf');

    setTimeout(() => {
        const opciones = {
            margin: 15,
            filename: `Factura_${numFactura}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            pagebreak: { mode: 'avoid' }
        };

        // Compilar el PDF
        html2pdf().set(opciones).from(plantillaFactura).save().then(() => {
            // Restaurar interfaz
            boton.innerHTML = diseñoOriginal;
            boton.disabled = false;
            alerta("facturaAceptada");
        });

    }, 1500);
});

// Recorrer el array de objetos con todas las ventas realizadas
historialDeVentasBoton.addEventListener('click', () => {
    const ventas = localStorageConseguirVentas();
    const fechaActual = new Date();
    fechaActualModal.innerHTML = fechaActual.toLocaleDateString('es-ES');
    numeroDeVentas.innerHTML = ventas.length;
    bodyModalHistorialDeVentas.innerHTML = "";

    if (ventas.length <= 0) {
        botonBorrarVentas.classList.add('d-none');
        botonCalcularTotalAcumulado.classList.add('d-none');
    } else {
        botonBorrarVentas.classList.remove('d-none');
        botonCalcularTotalAcumulado.classList.remove('d-none');
    }

    // Tabla dinamica con informacion de las ventas
    bodyModalHistorialDeVentas.innerHTML = `
    <div class="table-responsive" style="max-height: 500px">
    <table class="table table-striped table-hover table-bordered text-center">
    <thead>
    <tr>
      <th class="sticky-top bg-dark text-white" scope="col">#</th>
      <th class="sticky-top bg-dark text-white" scope="col">Cedula Cliente</th>
      <th class="sticky-top bg-dark text-white" scope="col">Producto</th>
      <th class="sticky-top bg-dark text-white" scope="col">Cantidad</th>
      <th class="sticky-top bg-dark text-white" scope="col">Valor Unitario</th>
      <th class="sticky-top bg-dark text-white" scope="col">Pago</th>
      <th class="sticky-top bg-dark text-white" scope="col">Valor Venta</th>
      <th class="sticky-top bg-dark text-white" scope="col">Devuelta Venta</th>
      <th class="sticky-top bg-dark text-white" scope="col">Fecha Venta</th>
    </tr>
    </thead>
    <tbody>
    ${ventas.length
            ? ventas.map((venta, index) => `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td class=${venta.cedulaCliente == "" && 'fw-bolder'}>${venta.cedulaCliente == "" ? "No registrada" : venta.cedulaCliente}</td>
                    <td>${venta.nombreProducto}</td>
                    <td>${venta.cantidadProducto}</td>
                    <td>${formatoColombia(venta.precioUnitario)}</td>
                    <td>${formatoColombia(venta.valorApagarVenta)}</td>
                    <td class="text-success fw-bolder">${formatoColombia(venta.valorVenta)}</td>
                    <td class="${venta.devueltaVenta > 0 && 'text-danger fw-bolder'}">${venta.devueltaVenta > 0 ? "-" : ""} ${formatoColombia(venta.devueltaVenta)} </td>
                    <td>${venta.horaDeVenta}</td>
                </tr>
            `).join("")
            :
            `
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

// Boton para mostrar la alerta de confirmacion eliminar ventas 
botonBorrarVentas.addEventListener('click', () => {
    instanciaToastConfirmacion.show();
});

// Borrar todas las ventas, vaciar array
btnConfirmarToast.addEventListener('click', () => {
    const ventasABorrar = localStorageConseguirVentas();
    if (ventasABorrar.length >= 1) {
        const instanciaModalHistorialDeVentas = bootstrap.Modal.getInstance(modalHistorialDeVentas);
        instanciaToastConfirmacion.hide();
        if (instanciaModalHistorialDeVentas) {
            instanciaModalHistorialDeVentas.hide();
        }
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
    valorApagarRecibo.innerHTML = '';
    cedulaClienteRecibo.innerHTML = '';
    botonPdf.disabled = false;
    // Borrar hr del recibo de ventas
    const hrRecibo = document.querySelector("#recibo hr");
    if (hrRecibo) {
        hrRecibo.remove();
    }
    // Capturar y formatear valores de los inputs
    var cedulaCliente = document.getElementById('cedulaCliente').value;
    var producto = document.getElementById('productoVenta').value.trim();
    var cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    var valorUnitarioProducto = parseInt(document.getElementById('valorUnitarioVenta').value) || 0;
    var valorApagar = parseInt(document.getElementById('valorApagarVenta').value) || 0;

    // Realizar validacion y mostrar alerta en los inpust
    if (producto === "" || cantidad <= 0 || valorUnitarioProducto <= 0 || valorApagar <= 0) {
        formularioVenta.classList.add('was-validated');
        return;
    }


    // Almacenar el total a pagar
    const totalApagar = cantidad * valorUnitarioProducto;

    // Almacenar fecha actual y hora actual
    const fechaActualString = new Date().toLocaleDateString('es-ES');
    const horaActualString = new Date().toLocaleTimeString('es-ES', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
    });

    // Lógica de estados del pago
    // Si el dinero ingresado es menor a la venta - No registrar venta
    if (valorApagar < totalApagar) {
        const dineroFaltante = totalApagar - valorApagar;
        cedulaClienteRecibo.innerHTML = cedulaCliente !== "" ? "<i class='bi bi-person-vcard'></i> Cedula: " + cedulaCliente : "<i class='bi bi-person-x-fill'></i> No Registrada";
        total.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i> Dinero pendiente: " + formatoColombia(dineroFaltante) + " pesos";
        valorApagarRecibo.innerHTML = formatoColombia(valorApagar) + " pesos";
        valorUnitario.innerHTML = "<del><i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(valorUnitarioProducto) + " pesos</del>";
        productoComprado.innerHTML = " <del><i class='bi bi-box-seam-fill'></i> Producto: " + producto + "</del>";
        cantidadTexto.innerHTML = "<del><i class='bi bi-stack'></i> Cantidad: " + cantidad + "</del>";
        const hr = document.createElement('hr');
        fechaCompraDetalleFactura = recibo.lastElementChild;
        fechaCompraDetalleFactura.insertAdjacentElement("beforebegin", hr);
        fechaCompra.innerHTML = "";
        botonPdf.disabled = true;
        alerta("error");
        totales.classList.remove('d-none');
        devueltaTexto.innerHTML = formatoColombia(0) + " pesos";

        // Pago exacto o con devuelta
    } else {
        cedulaClienteRecibo.innerHTML = cedulaCliente !== "" ? "<i class='bi bi-person-vcard'></i> Cedula: " + cedulaCliente : "<i class='bi bi-person-x-fill'></i> No registrada";
        total.innerHTML = "<i class='bi bi-cash-coin'></i> Total a pagar: " + formatoColombia(totalApagar) + " pesos.";
        valorApagarRecibo.innerHTML = formatoColombia(valorApagar) + " pesos";
        valorUnitario.innerHTML = "<i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(valorUnitarioProducto) + " pesos";
        productoComprado.innerHTML = "<i class='bi bi-box-seam-fill'></i> Producto: " + producto;
        cantidadTexto.innerHTML = "<i class='bi bi-stack'></i> Cantidad: " + cantidad;
        const hr = document.createElement('hr');
        fechaCompraDetalleFactura = recibo.lastElementChild;
        fechaCompraDetalleFactura.insertAdjacentElement("beforebegin", hr);
        fechaCompra.innerHTML = "Fecha de compra: " + fechaActualString;
        alerta("correcto");
        botonPdf.disabled = false;
        totalApagarVenta.innerHTML = "";
        totales.classList.remove('d-none');

        // Realizar logica para la devuelta de dinero
        const devuelta = valorApagar - totalApagar;

        // Si hay devuelta
        if (devuelta >= 0) {
            devueltaTexto.innerHTML = valorApagar === "" ? formatoColombia(0) + "pesos" : formatoColombia(devuelta) + " pesos";
        } else if (valorApagar == totalApagar) {
            devueltaTexto.innerHTML = formatoColombia(0) + " pesos";
        }


        // Crear objeto de venta para añadir al localstorage
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
        // formularioVenta.classList.remove('was-validated');
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
