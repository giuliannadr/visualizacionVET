async function cargarProductos() {
    try {
        const res = await fetch('../json/productos.json');
        if (!res.ok) throw new Error('Error al cargar productos.json');
        const productos = await res.json();

        // Función para obtener N productos random sin repetir
        function obtenerProductosRandom(arr, n) {
            const copia = [...arr];
            const seleccionados = [];
            while (seleccionados.length < n && copia.length > 0) {
                const idx = Math.floor(Math.random() * copia.length);
                seleccionados.push(copia.splice(idx, 1)[0]);
            }
            return seleccionados;
        }


        // Crear el HTML para cada producto
        function crearCardProducto(producto) {
            let rutaDetalle = producto.detalle;
            rutaDetalle = '/html/' + rutaDetalle.replace(/^(\.\.\/)+/, '');
            return `
               <article class="card h-100 shadow-sm">
                       <a href="${rutaDetalle}">
                           <img src="${producto.imagen}" class="card-img-top" alt="${producto.nombre}">
                       </a>
                       <div class="card-body d-flex flex-column justify-content-between flex-grow-1">
                           <div class="d-flex flex-column flex-grow-1">
                               <h5 class="card-title fs-6">${producto.nombre}</h5>
                               <p class="card-text">${producto.presentacion}</p>  <!-- Aquí usás presentacion -->
                               <h5 class="fw-semibold mt-auto">$ ${producto.precio.toLocaleString()}</h5>
                           </div>
                       </div>
               </article>
             `;
        }


        // Crear slide para swiper
        function crearSlide(producto) {
            return `
        <div class="swiper-slide">
          ${crearCardProducto(producto)}
        </div>
      `;
        }

        const sliderContenedor = document.getElementById('sliderProductosDestacados');
        const grillaContenedor = document.getElementById('grillaProductosDestacados');

        const productosRandom = obtenerProductosRandom(productos, 4);

        sliderContenedor.innerHTML = productosRandom.map(crearSlide).join('');
        grillaContenedor.innerHTML = productosRandom.map(p => `
      <div class="col-12 col-md-6 col-lg-3">${crearCardProducto(p)}</div>
    `).join('');

        // Inicializar swiper si usás (ajustá según tu setup)
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

window.addEventListener('load', cargarProductos);
