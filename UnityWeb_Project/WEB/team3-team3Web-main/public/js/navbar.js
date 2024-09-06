
const username = sessionStorage.getItem('nombre')
const renderNavbar = () => {
    const navbar = document.querySelector('.navbar_container');
    navbar.innerHTML = `
    <h2>Escuela Metropolitana - Panel de Control</h2>
    <nav class = "navbar">
    <p>Escuela Metropolitana - Panel de Control</p>
      <a href="dashboard.html" class="general_links menu_links">Dashboard</a>
      <a href="first_level.html" class="links_to_levels menu_links">Nivel 1</a>
      <a href="second_level.html" class="links_to_levels menu_links">Nivel 2</a>
      <a href="third_level.html" class="links_to_levels menu_links">Nivel 3</a>
      <a href="alumnos.html" class="general_links menu_links">Alumnos</a>
      <p>Bienvenid@ ${username}</p>
        <button id="close_session_btn">Cerrar Sesión</button>
        <button id="close_menu_btn">
        <svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  fill="none"  stroke="#fff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler icons-tabler-outline icon-tabler-x"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M18 6l-12 12" /><path d="M6 6l12 12" /></svg>
        </button>
    </nav>
    <button id="menu_btn"><svg  xmlns="http://www.w3.org/2000/svg"  width="24"  height="24"  viewBox="0 0 24 24"  
      fill="none"  stroke="#fff"  stroke-width="2"  stroke-linecap="round"  stroke-linejoin="round"  class="icon icon-tabler 
      icons-tabler-outline icon-tabler-menu-2"><path stroke="none" d="M0 0h24v24H0z" fill="none"/><path d="M4 6l16 0" /><path d="M4 12l16 0" /><path d="M4 18l16 0" /></svg>
      </button>

    `;
}

renderNavbar();

const session_btn = document.getElementById('close_session_btn');
const close_session = () => {
    sessionStorage.removeItem('nombre');
    alert('Has cerrado Sesión');
    location.replace("/login");
}

session_btn.addEventListener('click', close_session);


const scrolling = () => {
    const navbars = document.querySelectorAll('.navbar_container');
    navbars.forEach(navbar => {
        if (window.scrollY > 300) {
            const blueColor = getComputedStyle(document.documentElement).getPropertyValue('--blue');
            navbar.style.backgroundColor = `rgba(${hexToRgb(blueColor)}, 0.9)`;
        } else {
            navbar.style.backgroundColor = getComputedStyle(document.documentElement).getPropertyValue('--blue');
        }
    });
}

window.addEventListener('scroll', scrolling);

// Función para convertir el color hexadecimal en formato RGB
function hexToRgb(hex) {
    hex = hex.replace(/^#/, '');
    if (hex.length === 3) {
        hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;
    return `${r}, ${g}, ${b}`;
}




// Obtener los elementos relevantes del DOM
const menuLinks = document.querySelectorAll('.menu_links');
let close_menu_btn = document.getElementById('close_menu_btn');
let menu_btn = document.getElementById('menu_btn');
let menu = document.querySelector('.navbar');

// Función para abrir el menú
const openNavbar = () => {
    menu.style.transform = 'translateX(0%)';
    menu.style.transition = '0.3s ease-in-out';
};

// Función para cerrar el menú
const closeNavbar = () => {
    menu.style.transform = 'translateX(100%)';
    menu.style.transition = '0.3s ease-in-out';
};

// Agregar un controlador de eventos al botón de cierre del menú
close_menu_btn.addEventListener('click', closeNavbar);

// Agregar un controlador de eventos al botón del menú
menu_btn.addEventListener('click', openNavbar);


// Función para verificar si el tamaño de la pantalla es menor a 1000px
const isMobileScreen = () => {
    return window.innerWidth <= 1024;
};

// Agregar un controlador de eventos a cada enlace del menú si el tamaño de la pantalla es menor a 1000px
const attachMenuLinkListeners = () => {
    if (isMobileScreen()) {
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                closeNavbar(); // Cerrar el menú de navegación al hacer clic en un enlace
            });
        });
    } else {
        // Si el tamaño de la pantalla es mayor a 1000px, eliminamos los controladores de eventos de los enlaces
        menuLinks.forEach(link => {
            link.removeEventListener('click', closeNavbar);
        });
    }
};

// Ejecutar la función una vez al cargar la página
attachMenuLinkListeners();

// Volver a adjuntar los controladores de eventos cuando el tamaño de la pantalla cambia
window.addEventListener('resize', attachMenuLinkListeners);


