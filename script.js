const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    menuToggle.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    });
});

document.addEventListener('click', (e) => {
    if (!e.target.closest('.header')) {
        navMenu.classList.remove('active');
        menuToggle.classList.remove('active');
    }
});

window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 50) {
        header.style.boxShadow = '0 20px 60px rgba(0, 102, 255, 0.25)';
    } else {
        header.style.boxShadow = '0 20px 60px rgba(0, 102, 255, 0.15)';
    }
});
