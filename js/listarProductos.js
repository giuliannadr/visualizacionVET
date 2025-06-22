let productos = [];

async function cargarProductos() {
    const res = await fetch('../json/productos.json');
    productos = await res.json();
    window.productos = productos; // para que el carrito tenga acceso

    cargarCarritoDesdeLocalStorage();
    renderizarProductos(productos);
    actualizarContadorCarrito();
}

function renderizarProductos(lista) {
    const contenedor = document.getElementById('listaProductos');
    contenedor.innerHTML = '';

    lista.forEach(p => {
        const html = `
    <div class="col-12 col-md-6 col-lg-4 d-flex">
        <article class="card producto"
            data-id="${p.id}"
            data-animal="${p.animal}"
            data-categoria="${p.categoria}"
            data-edad="${p.edad.join(' ')}"
            data-tamanio="${p.tamanio.join(' ')}"
            data-raza="${Array.isArray(p.raza) ? p.raza.join(' ') : p.raza}">
            <a href="${p.detalle}">
                <img src="${p.imagen}" class="card-img-top" alt="${p.nombre}">
            </a>
            <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
                <div class="d-flex flex-column flex-grow-1">
                    <h5 class="card-title fs-6">${p.nombre}</h5>
                    <p class="card-text">${p.presentacion}</p>
                    <h5 class="fw-semibold mt-auto">$ ${p.precio.toLocaleString()}</h5>
                </div>
                <div class="d-flex justify-content-end align-items-center mt-3 gap-2 flex-wrap">
                    <div class="input-group input-group-sm" style="width: auto;">
                        <button class="btn btn-outline-secondary btn-restar" type="button">-</button>
                        <input type="text" class="form-control text-center cantidad" value="1" style="width: 40px;">
                        <button class="btn btn-outline-secondary btn-sumar" type="button">+</button>
                    </div>
                    <button class="btn btn-outline-primary btn-sm btn-agregar-carrito"><i class="bi bi-cart"></i></button>
                </div>
            </div>
        </article>
    </div>
`;
        contenedor.innerHTML += html;
    });

    agregarEventosBotones();
}

function agregarEventosBotones() {
    document.querySelectorAll('.btn-sumar').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('.cantidad');
            input.value = parseInt(input.value) + 1;
        });
    });

    document.querySelectorAll('.btn-restar').forEach(btn => {
        btn.addEventListener('click', () => {
            const input = btn.parentElement.querySelector('.cantidad');
            const val = parseInt(input.value);
            if (val > 1) input.value = val - 1;
        });
    });

    document.querySelectorAll('.btn-agregar-carrito').forEach(btn => {
        btn.addEventListener('click', () => {
            const card = btn.closest('.producto');
            const id = card.dataset.id;
            const cantidadInput = card.querySelector('.cantidad');
            const cantidad = parseInt(cantidadInput.value);
            agregarAlCarrito(id, cantidad);
        });
    });
}

window.addEventListener('load', cargarProductos);
