// Constantes para la API
const API_URL = 'http://localhost:3000/api';

// Funciones de utilidad
function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('es-ES', options);
}

function showError(message) {
    const toast = new bootstrap.Toast(document.createElement('div'));
    toast.classList.add('toast', 'bg-danger', 'text-white');
    toast.innerHTML = `
        <div class="toast-header bg-danger text-white">
            <i class="bi bi-exclamation-circle me-2"></i>
            <strong class="me-auto">Error</strong>
            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
        </div>
        <div class="toast-body">${message}</div>
    `;
    document.body.appendChild(toast);
    toast.show();
}

// Animaciones de scroll suave para los enlaces de navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        const navHeight = document.querySelector('.navbar').offsetHeight;
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });

        // Actualizar la navegación activa
        document.querySelectorAll('.nav-link').forEach(link => {
            link.classList.remove('active');
        });
        this.classList.add('active');
    });
});

// Animación del navbar al hacer scroll
const navbar = document.querySelector('.navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    // Añadir sombra al navbar cuando se hace scroll
    if (currentScroll > 50) {
        navbar.classList.add('shadow-lg');
        navbar.style.backgroundColor = 'rgba(33, 37, 41, 0.95)';
    } else {
        navbar.classList.remove('shadow-lg');
        navbar.style.backgroundColor = 'rgb(33, 37, 41)';
    }

    // Actualizar el enlace activo en la navegación según la sección visible
    const sections = document.querySelectorAll('section[id]');
    sections.forEach(section => {
        const sectionTop = section.offsetTop - navbar.offsetHeight - 100;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (currentScroll >= sectionTop && currentScroll < sectionBottom) {
            document.querySelector(`.nav-link[href="#${section.id}"]`)?.classList.add('active');
        } else {
            document.querySelector(`.nav-link[href="#${section.id}"]`)?.classList.remove('active');
        }
    });

    lastScroll = currentScroll;
});

// Animación de entrada para las tarjetas de proyectos
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('show');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Cargar proyectos desde la API
async function loadProjects() {
    try {
        const response = await fetch(`${API_URL}/proyectos`);
        if (!response.ok) throw new Error('Error en la respuesta del servidor');
        
        const projects = await response.json();
        const projectsContainer = document.querySelector('.row');
        projectsContainer.innerHTML = '';

        projects.forEach((project, index) => {
            const projectCol = document.createElement('div');
            projectCol.className = `col-md-6 animate__animated ${index % 2 === 0 ? 'animate__fadeInLeft' : 'animate__fadeInRight'}`;
            projectCol.innerHTML = `
                <div class="card h-100 bg-dark border-light project-card">
                    <img src="${project.imagen_preview}" class="card-img-top" alt="${project.nombre}">
                    <div class="card-body">
                        <h3 class="card-title h4">${project.nombre}</h3>
                        <p class="card-text">${project.descripcion_corta}</p>
                        <div class="d-flex gap-2">
                            <a href="proyecto.html?id=${project.id}" class="btn btn-primary">
                                <i class="bi bi-info-circle me-2"></i>Ver Detalles
                            </a>
                            <a href="${project.enlace_descarga}" class="btn btn-outline-light">
                                <i class="bi bi-download me-2"></i>Descargar
                            </a>
                        </div>
                    </div>
                </div>
            `;

            projectsContainer.appendChild(projectCol);
            observer.observe(projectCol);
        });
    } catch (error) {
        showError('Error al cargar los proyectos: ' + error.message);
    }
}