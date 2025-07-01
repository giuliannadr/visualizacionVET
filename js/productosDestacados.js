async function cargarProductos() {

    
    try {
        const res = await fetch('../json/productos.json');
        if (!res.ok) throw new Error('Error al cargar productos.json');
        const productos = await res.json();

        

        // Obtener N productos random
        function obtenerProductosRandom(arr, n) {
            const copia = [...arr];
            const seleccionados = [];
            while (seleccionados.length < n && copia.length > 0) {
                const idx = Math.floor(Math.random() * copia.length);
                seleccionados.push(copia.splice(idx, 1)[0]);
            }
            return seleccionados;
        }

        cargarCarritoDesdeLocalStorage();
        actualizarContadorCarrito();
        
        // Card HTML para producto
        function crearCardProducto(producto) {
            let rutaDetalle = producto.detalle;
            rutaDetalle = '/html/' + rutaDetalle.replace(/^(\.\.\/)+/, '');
            return `
                <article class="card h-100 shadow-sm producto-destacado" data-id="${producto.id}">
                    <a href="${rutaDetalle}">
                        <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                    </a>
                    <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
                        <div class="d-flex flex-column flex-grow-1">
                            <h5 class="card-title fs-6">${producto.nombre}</h5>
                            <p class="card-text">${producto.presentacion}</p>
                            <h5 class="fw-semibold mt-auto">$ ${producto.precio.toLocaleString()}</h5>
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
            `;
             
        }

        // Crear slide para el slider de celulares
        function crearSlide(producto) {
            return `<div class="swiper-slide">${crearCardProducto(producto)}</div>`;
        }

        const productosRandom = obtenerProductosRandom(productos, 4);

        const sliderContenedor = document.getElementById('sliderProductosDestacados');
        const grillaContenedor = document.getElementById('grillaProductosDestacados');

        sliderContenedor.innerHTML = productosRandom.map(crearSlide).join('');
        grillaContenedor.innerHTML = productosRandom.map(p => `<div class="col-12 col-md-6 col-lg-3">${crearCardProducto(p)}</div>`).join('');

        agregarEventosBotones();

        // Inicializar Swiper (slider)
        if (window.swiperInstance) window.swiperInstance.destroy();
        window.swiperInstance = new Swiper(".mySwiper-productosDestacados", {
            pagination: {
                el: ".swiper-pagination-productosDestacados",
            },
            slidesPerView: 1,
            spaceBetween: 10,
        });

    } catch (error) {
        console.error(error);
    }
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
