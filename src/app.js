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
const alertaContenedor = document.getElementById('alerta');
const mensajeAlerta = document.getElementById('mensajeAlerta');

// Esperar los cambios en tiempo real de los inputs
cantidadInput.addEventListener('input', calcularTotal);
valorUnitarioInput.addEventListener('input', calcularTotal);

// Array para almacenar el historial de ventas
let historialDeVentas = [];

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

// Función para calcular y mostrar el total
function calcularTotal() {
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
    }
};

// Generar documento PDF 
document.getElementById('botonPdf').addEventListener('click', () => {
    const recibo = document.getElementById('recibo');

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
});

// Recorrer el array de objetos con todas las ventas realizadas
historialDeVentasBoton.addEventListener('click', () => {

    const fechaActual = new Date();
    fechaActualModal.innerHTML = fechaActual.toLocaleDateString('es-ES');
    numeroDeVentas.innerHTML = historialDeVentas.length;
    bodyModalHistorialDeVentas.innerHTML = "";

    // Tabla dinamica con informacion de las ventas
    bodyModalHistorialDeVentas.innerHTML = `
    <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered text-center">
  <thead>
    <tr>
      <th scope="col">#</th>
      <th scope="col">Producto</th>
      <th scope="col">Cantidad</th>
      <th scope="col">Valor Unitario</th>
      <th scope="col">Valor Venta</th>
      <th scope="col">Hora Venta</th>
    </tr>
  </thead>
<tbody>
    ${historialDeVentas.length
            ? historialDeVentas.map((venta, index) => `
                <tr>
                    <th scope="row">${index + 1}</th>
                    <td>${venta.nombreProducto}</td>
                    <td>${venta.cantidadProducto}</td>
                    <td>${formatoColombia(venta.precioUnitario)}</td>
                    <td>${formatoColombia(venta.valorVenta)}</td>
                    <td>${venta.horaDeVenta}</td>
                </tr>
            `).join("")
            : `
                <tr>
                    <td colspan="6" class="text-center">
                        No hay ventas registradas.
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
    if (historialDeVentas.length >= 1) {
        bodyModalHistorialDeVentas.innerHTML = "";
        numeroDeVentas.innerHTML = "";
        historialDeVentas.length = 0;
    }
});

// Boton para calcular el total final acumulado de las ventas totales
botonCalcularTotalAcumulado.addEventListener('click', () => {
    if (historialDeVentas.length !== 0) {
        const totalFinal = historialDeVentas.reduce((acumulador, venta) => acumulador + venta.valorVenta, 0);

        // Verifica si ya existe un h4 con ese texto específico
        const h4Existente = bodyModalHistorialDeVentas.querySelector(`h4.text-dark`);
        if (!h4Existente) {
            // Si no existe crea el elemento 
            const h4 = document.createElement('h4');
            h4.classList.add('text-dark', 'fw-bolder');
            h4.textContent = "Total Final: " + formatoColombia(totalFinal) + " pesos";
            bodyModalHistorialDeVentas.append(h4);
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
    var producto = document.getElementById('productoVenta').value.trim();
    var cantidad = parseInt(document.getElementById('cantidadVenta').value) || 0;
    var valorUnitarioProducto = parseInt(document.getElementById('valorUnitarioVenta').value) || 0;
    var valorApagar = parseInt(document.getElementById('valorApagarVenta').value) || 0;

    if (producto === "" || cantidad <= 0 || valorUnitarioProducto <= 0 || valorApagar <= 0) {
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
        total.classList.add("text-dark");
        total.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i> Dinero pendiente: " + formatoColombia(dineroFaltante) + " pesos";
        valorUnitario.innerHTML = "<del><i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(valorUnitarioProducto) + " pesos</del>";
        productoComprado.innerHTML = " <del><i class='bi bi-box-seam-fill'></i> Producto: " + producto + "</del>";
        cantidadTexto.innerHTML = "<del><i class='bi bi-stack'></i> Cantidad: " + cantidad + "</del>";
        fechaCompra.innerHTML = "Fecha de compra: " + fechaActualString;
        alerta("error");

    } else {
        // Pago exacto o con devuelta (Comparten casi toda la lógica)
        total.classList.add("text-dark");
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

        botonPdf.classList.remove("d-none");
        botonPdf.classList.add("d-block");

        // Guardar en el historial
        historialDeVentas.push({
            nombreProducto: producto,
            precioUnitario: valorUnitarioProducto,
            valorVenta: totalApagar,
            cantidadProducto: cantidad,
            horaDeVenta: horaActualString
        });

        // Limpiar el formulario
        formularioVenta.classList.remove('was-validated');
        formularioVenta.reset();
    }


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
