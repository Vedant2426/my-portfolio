/* ==========================================================
   PARTICLE CANVAS BACKGROUND
   ========================================================== */
(function () {
    const canvas = document.getElementById('particle-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouse = { x: null, y: null };
    const PARTICLE_COUNT = 60;
    const CONNECT_DIST = 140;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.vx = (Math.random() - 0.5) * 0.4;
            this.vy = (Math.random() - 0.5) * 0.4;
            this.r = Math.random() * 1.5 + 0.5;
        }
        update() {
            this.x += this.vx;
            this.y += this.vy;
            if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
            if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
        }
        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(139, 92, 246, 0.4)';
            ctx.fill();
        }
    }

    for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => { p.update(); p.draw(); });
        // Draw connections
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < CONNECT_DIST) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(139, 92, 246, ${0.08 * (1 - dist / CONNECT_DIST)})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
            // Mouse interaction
            if (mouse.x !== null) {
                const dx = particles[i].x - mouse.x;
                const dy = particles[i].y - mouse.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 180) {
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.strokeStyle = `rgba(6, 182, 212, ${0.15 * (1 - dist / 180)})`;
                    ctx.lineWidth = 0.6;
                    ctx.stroke();
                }
            }
        }
        requestAnimationFrame(animate);
    }
    animate();
})();

/* ==========================================================
   MOBILE MENU
   ========================================================== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');
const navLinks = document.querySelectorAll('.nav__link');

if (navToggle) navToggle.addEventListener('click', () => navMenu.classList.add('show'));
if (navClose) navClose.addEventListener('click', () => navMenu.classList.remove('show'));
navLinks.forEach(link => link.addEventListener('click', () => navMenu.classList.remove('show')));

/* ==========================================================
   STICKY HEADER & ACTIVE NAV LINK
   ========================================================== */
const header = document.getElementById('header');
const scrollTopBtn = document.getElementById('scroll-top');
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;

    // Header shadow
    header.classList.toggle('scrolled', scrollY > 50);

    // Scroll-to-top button
    scrollTopBtn.classList.toggle('visible', scrollY > 400);

    // Active nav link
    let current = '';
    sections.forEach(section => {
        const top = section.offsetTop - 200;
        if (scrollY >= top) current = section.getAttribute('id');
    });
    navLinks.forEach(link => {
        link.classList.toggle('active', link.getAttribute('data-section') === current);
    });
});

scrollTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

/* ==========================================================
   SCROLL REVEAL (Intersection Observer)
   ========================================================== */
const revealEls = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const delay = entry.target.dataset.delay || 0;
            setTimeout(() => entry.target.classList.add('revealed'), parseInt(delay));
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

revealEls.forEach(el => revealObserver.observe(el));

/* ==========================================================
   STAT COUNTER ANIMATION
   ========================================================== */
const statNumbers = document.querySelectorAll('.stat-number');

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const target = parseInt(entry.target.dataset.count);
            let count = 0;
            const duration = 1500;
            const increment = target / (duration / 16);
            const timer = setInterval(() => {
                count += increment;
                if (count >= target) { count = target; clearInterval(timer); }
                entry.target.textContent = Math.floor(count);
            }, 16);
            counterObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

statNumbers.forEach(el => counterObserver.observe(el));

/* ==========================================================
   TYPED TEXT EFFECT
   ========================================================== */
const typedEl = document.getElementById('typed-text');
const phrases = ['AI & Machine Learning.', 'Full-Stack Applications.', 'Real-World Solutions.', 'Clean Architecture.'];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeLoop() {
    const current = phrases[phraseIdx];
    typedEl.textContent = current.substring(0, charIdx);

    if (!isDeleting) {
        charIdx++;
        if (charIdx > current.length) { isDeleting = true; setTimeout(typeLoop, 1800); return; }
        setTimeout(typeLoop, 90);
    } else {
        charIdx--;
        if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; setTimeout(typeLoop, 500); return; }
        setTimeout(typeLoop, 40);
    }
}

document.addEventListener('DOMContentLoaded', () => { setTimeout(typeLoop, 1500); });

/* ==========================================================
   CONTACT FORM — EmailJS Integration
   ========================================================== */
// ⚠️ REPLACE these with your actual EmailJS credentials:
const EMAILJS_PUBLIC_KEY = 'pLVZX1qXgFJK1nXN6';      // From EmailJS Dashboard > Account > API Keys
const EMAILJS_SERVICE_ID = 'service_ktail6u';      // From EmailJS Dashboard > Email Services
const EMAILJS_TEMPLATE_ID = 'template_6wcdvkn';    // From EmailJS Dashboard > Email Templates

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = contactForm.querySelector('button[type="submit"]');
        const original = btn.innerHTML;
        btn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> <span>Sending...</span>';
        btn.disabled = true;

        const templateParams = {
            name: document.getElementById('name').value,
            email: document.getElementById('email').value,
            message: document.getElementById('message').value,
        };

        emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams)
            .then(() => {
                formStatus.textContent = '✓ Message sent successfully!';
                formStatus.style.color = '#22c55e';
                contactForm.reset();
                btn.innerHTML = original;
                btn.disabled = false;
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            })
            .catch((error) => {
                formStatus.textContent = '✗ Failed to send. Please try again.';
                formStatus.style.color = '#ef4444';
                btn.innerHTML = original;
                btn.disabled = false;
                console.error('EmailJS error:', error);
                setTimeout(() => { formStatus.textContent = ''; }, 5000);
            });
    });
}

/* ==========================================================
   FOOTER YEAR
   ========================================================== */
document.getElementById('footer-year').textContent = new Date().getFullYear();
