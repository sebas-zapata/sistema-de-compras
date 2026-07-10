const botonIniciar = document.getElementById('iniciar');
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

// Dar formato a los valores en peso colombiano
function formatoColombia(valor) {
    const formatoCOP = new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0,
    }).format(valor);

    // Devolver valor con formato
    return formatoCOP;
}

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

// Array para almacenar el historial de ventas
let historialDeVentas = [];

// Recorrer el array de objetos con todas las ventas realizadas
historialDeVentasBoton.addEventListener('click', () => {

    const fechaActual = new Date();
    fechaActualModal.innerHTML = fechaActual.toLocaleDateString('es-ES');
    numeroDeVentas.innerHTML = historialDeVentas.length;
    bodyModalHistorialDeVentas.innerHTML = "";

    // Tabla dinamica con informacion de las ventas
    bodyModalHistorialDeVentas.innerHTML = `
    <div class="table-responsive">
    <table class="table table-striped table-hover table-bordered">
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
        const h4Existente = bodyModalHistorialDeVentas.querySelector(`h4.text-success`);
        if (!h4Existente) {
            // Si no existe crea el elemento 
            const h4 = document.createElement('h4');
            h4.classList.add('text-success');
            h4.textContent = formatoColombia(totalFinal) + " pesos";
            bodyModalHistorialDeVentas.append(h4);
        }
    }
})

// Iniciar una nueva venta
botonIniciar.addEventListener("click", () => {
    total.innerHTML = '';
    devueltaTexto.innerHTML = '';
    productoComprado.innerHTML = '';

    const producto = prompt("Ingrese el producto que va a comprar.");
    if (producto.trim() === "") {
        alert("Se debe ingresar un producto.");
    } else {
        const cantidad = parseInt(prompt("Ingrese la cantidad de ese producto que va a comprar."));
        if (cantidad <= 0) {
            alert("La cantidad no puede ser " + cantidad + " .");
        } else {
            const precioUnitario = parseFloat(prompt("Ingrese el precio unitario del producto " + producto));
            if (precioUnitario <= 0) {
                alert("El precio unitario no puede ser " + precioUnitario + " .")
            } else {
                const totalApagar = cantidad * precioUnitario;
                alert("El total a pagar es: " + formatoColombia(totalApagar) + " pesos.");
                const valorApagar = parseFloat(prompt("Ingrese el valor a pagar, Total: " + formatoColombia(totalApagar) + " pesos."));
                if (valorApagar <= 0) {
                    alert("El valor a pagar no debe ser " + valorApagar + " pesos");
                } else {
                    if (valorApagar < totalApagar) {
                        alert("El total a pagar es " + formatoColombia(totalApagar) + " pesos y el valor ingresado es " + formatoColombia(valorApagar) + " pesos.");
                        const faltante = totalApagar - valorApagar;
                        alert("Hace falta " + formatoColombia(faltante) + " pesos.");
                        total.classList.add("text-danger");
                        total.innerHTML = "<i class='bi bi-exclamation-triangle-fill'></i> Dinero pendiente: " + formatoColombia(totalApagar) + " pesos";
                        valorUnitario.innerHTML = "<del><i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(precioUnitario) + " pesos</del>";
                        productoComprado.innerHTML = " <del><i class='bi bi-box-seam-fill'></i> Producto: " + producto + "</del>";
                        cantidadTexto.innerHTML = "<del><i class='bi bi-stack'></i> Cantidad: " + cantidad + "</del>";
                        fechaCompra.innerHTML = "Fecha de compra: " + new Date().toLocaleDateString('es-ES');
                    } else if (valorApagar > totalApagar) {
                        alert("El total a pagar es " + formatoColombia(totalApagar) + " pesos y el valor ingresado es " + formatoColombia(valorApagar) + " pesos.");
                        const devuelta = valorApagar - totalApagar;
                        alert("Tu devuelta es de " + formatoColombia(devuelta) + " pesos");
                        total.classList.add("text-success");
                        total.innerHTML = "<i class='bi bi-cash-coin'></i> Total a pagar: " + formatoColombia(totalApagar) + " pesos.";
                        valorUnitario.innerHTML = "<i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(precioUnitario) + " pesos";
                        productoComprado.innerHTML = "<i class='bi bi-box-seam-fill'></i> Producto: " + producto;
                        cantidadTexto.innerHTML = "<i class='bi bi-stack'></i> Cantidad: " + cantidad;
                        devueltaTexto.innerHTML = "<i class='bi bi-cash'></i> Devuelta: " + formatoColombia(devuelta) + " pesos";
                        fechaCompra.innerHTML = "Fecha de compra: " + new Date().toLocaleDateString('es-ES');
                        botonPdf.classList.remove("d-none");
                        botonPdf.classList.add("d-block");

                        // Añadir al historial de ventas
                        historialDeVentas.push({
                            nombreProducto: producto,
                            precioUnitario: precioUnitario,
                            valorVenta: totalApagar,
                            cantidadProducto: cantidad,
                            horaDeVenta: new Date().toLocaleTimeString('es-ES', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })
                        });

                    } else {
                        alert("El total a pagar es " + formatoColombia(totalApagar) + " pesos y el valor ingresado es " + formatoColombia(valorApagar) + " pesos.");
                        total.classList.add("text-success");
                        total.innerHTML = "<i class='bi bi-cash-coin'></i> Total a pagar: " + formatoColombia(totalApagar) + " pesos.";
                        valorUnitario.innerHTML = "<i class='bi bi-coin'></i> Valor Unitario: " + formatoColombia(precioUnitario) + " pesos";
                        productoComprado.innerHTML = "<i class='bi bi-box-seam-fill'></i> Producto: " + producto;
                        cantidadTexto.innerHTML = "<i class='bi bi-stack'></i> Cantidad: " + cantidad;
                        fechaCompra.innerHTML = "Fecha de compra: " + new Date().toLocaleDateString('es-ES');
                        botonPdf.classList.remove("d-none");
                        botonPdf.classList.add("d-block");

                        // Añadir al historial de ventas
                        historialDeVentas.push({
                            nombreProducto: producto,
                            precioUnitario: precioUnitario,
                            valorVenta: totalApagar,
                            cantidadProducto: cantidad,
                            horaDeVenta: new Date().toLocaleTimeString('es-ES', {
                                hour: 'numeric',
                                minute: '2-digit',
                                hour12: true
                            })
                        });
                    }

                }

            }

        }


    }
})