async function cargarProductos() {
    const res = await fetch('../json/productos.json');
    return await res.json();
}

function obtenerIdDesdeURL() {
    const params = new URLSearchParams(window.location.search);
    return Number(params.get('id'));
}

function actualizarCantidad(operacion) {
    const inputCantidad = document.getElementById('input-cantidad');
    let cantidad = Number(inputCantidad.value);
    if (operacion === 'sumar') cantidad++;
    else if (operacion === 'restar' && cantidad > 1) cantidad--;
    inputCantidad.value = cantidad;
}

async function mostrarDetalle() {
    const productos = await cargarProductos();
    window.productos = productos;  // <-- esta línea hace que carrito.js pueda acceder a la lista

    const id = obtenerIdDesdeURL();
    const producto = productos.find(p => p.id === id);

    if (!producto) {
        document.body.innerHTML = '<p>Producto no encontrado</p>';
        return;
    }

    // Actualizás el DOM con los datos del producto
    document.getElementById('producto-imagen').src = producto.imagen;
    document.getElementById('producto-imagen').alt = producto.nombre;
    document.getElementById('producto-nombre').textContent = producto.nombre;
    document.getElementById('producto-presentacion').textContent = producto.presentacion;
    document.getElementById('producto-precio').textContent = `$ ${producto.precio.toLocaleString()}`;
    document.getElementById('producto-descripcion').innerHTML = producto.descripcion;

    document.getElementById('btn-sumar').addEventListener('click', () => actualizarCantidad('sumar'));
    document.getElementById('btn-restar').addEventListener('click', () => actualizarCantidad('restar'));

    // Evento para agregar al carrito
    const btnAgregar = document.getElementById('btn-agregar-carrito');
    btnAgregar.addEventListener('click', (e) => {
        e.preventDefault();

        const cantidad = Number(document.getElementById('input-cantidad').value);
        agregarAlCarrito(id, cantidad);
    });
}


window.addEventListener('load', mostrarDetalle);
