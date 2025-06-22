// carrito.js
let carrito = [];

function cargarCarritoDesdeLocalStorage() {
    const carritoGuardado = localStorage.getItem('carrito');
    carrito = carritoGuardado ? JSON.parse(carritoGuardado) : [];
}

function guardarCarritoEnLocalStorage() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
}

function mostrarToast(producto, cantidad) {
    const toastEl = document.getElementById('toastCarrito');
    const mensajeEl = document.getElementById('mensajeToast');

    const precioTotal = (producto.precio * cantidad).toLocaleString();

    mensajeEl.innerHTML = `
      <strong>Añadido exitosamente</strong><br>
      Producto: ${producto.nombre}<br>
      Cantidad: ${cantidad}<br>
      Precio: $${precioTotal}
    `;

    const toast = new bootstrap.Toast(toastEl);
    toast.show();
}

function agregarAlCarrito(idProducto, cantidad) {
    if (!window.productos || !window.productos.length) {
        console.warn('Lista de productos no disponible');
        return;
    }

    const producto = productos.find(p => p.id == idProducto);
    if (!producto) return;

    const productoEnCarrito = carrito.find(item => item.id == idProducto);
    if (productoEnCarrito) {
        productoEnCarrito.cantidad += cantidad;
    } else {
        carrito.push({
            id: producto.id,
            nombre: producto.nombre,
            precio: producto.precio,
            cantidad,
            imagen: producto.imagen
        });
    }

    guardarCarritoEnLocalStorage();
    actualizarContadorCarrito();

    mostrarToast(producto, cantidad);
}

function actualizarContadorCarrito() {
    const contador = document.getElementById('contador-carrito');
    if (!contador) return;

    const totalCantidad = carrito.reduce((acc, item) => acc + item.cantidad, 0);
    contador.style.display = totalCantidad > 0 ? 'inline-block' : 'none';
    contador.textContent = totalCantidad;
}

// Para que productos.js pueda usarlas
window.agregarAlCarrito = agregarAlCarrito;
window.actualizarContadorCarrito = actualizarContadorCarrito;
window.cargarCarritoDesdeLocalStorage = cargarCarritoDesdeLocalStorage;

window.addEventListener('DOMContentLoaded', () => {
    cargarCarritoDesdeLocalStorage();
    actualizarContadorCarrito();
});
