document.addEventListener('DOMContentLoaded', function() {
    const mobileMenuToggle = document.getElementById('mobileMenuToggle');
    const navMenu = document.getElementById('navMenu');
    const bookingModal = document.getElementById('bookingModal');
    const bookingForm = document.getElementById('bookingForm');
    const contactForm = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    // إعداد القائمة المتنقلة
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
            document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';

            const spans = mobileMenuToggle.querySelectorAll('span');
            if (navMenu.classList.contains('active')) {
                spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
                spans[1].style.opacity = '0';
                spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
            } else {
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });

        // إغلاق القائمة عند النقر خارجها
        document.addEventListener('click', function(event) {
            const isClickInsideNav = navMenu.contains(event.target);
            const isClickOnToggle = mobileMenuToggle.contains(event.target);

            if (!isClickInsideNav && !isClickOnToggle && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
                const spans = mobileMenuToggle.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            }
        });
    }

    // التنقل السلس
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }

            if (navMenu && navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });

    // تأثير الظل للشريط العلوي
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;

            if (currentScroll > 100) {
                navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
            } else {
                navbar.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.05)';
            }
        });
    }

    // تأثير الظهور للعناصر
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -100px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.service-card, .process-step, .testimonial-card, .service-detail-card');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });

    // معالجة نموذج حجز الخدمة
    if (bookingForm) {
        bookingForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                service: document.getElementById('serviceName').value,
                name: document.getElementById('clientName').value,
                phone: document.getElementById('phone').value,
                email: document.getElementById('email').value,
                description: document.getElementById('description').value
            };

            console.log('Booking submitted:', formData);

            // إرسال البريد الإلكتروني
            sendBookingEmail(formData);

            closeBookingModal();

            setTimeout(() => {
                alert('تم إرسال طلبك بنجاح! سنتواصل معك قريبًا.');
                bookingForm.reset();
            }, 300);
        });
    }

    // معالجة نموذج التواصل
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const formData = {
                name: document.getElementById('name').value,
                email: document.getElementById('contactEmail').value,
                phone: document.getElementById('contactPhone').value,
                message: document.getElementById('message').value
            };

            console.log('Contact form submitted:', formData);

            // إرسال البريد الإلكتروني
            sendContactEmail(formData);

            // إظهار رسالة النجاح
            contactForm.style.display = 'none';
            if (successMessage) {
                successMessage.style.display = 'flex';
                successMessage.classList.add('active');
            }

            setTimeout(() => {
                contactForm.reset();
                contactForm.style.display = 'flex';
                if (successMessage) {
                    successMessage.style.display = 'none';
                    successMessage.classList.remove('active');
                }
            }, 5000);
        });
    }

    // إغلاق المودال عند النقر خارجها
    if (bookingModal) {
        bookingModal.addEventListener('click', function(e) {
            if (e.target === bookingModal) {
                closeBookingModal();
            }
        });

        // إغلاق المودال بمفتاح ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && bookingModal.classList.contains('active')) {
                closeBookingModal();
            }
        });
    }
});

// دالة فتح مودال الحجز
function openBookingModal(serviceName) {
    const modal = document.getElementById('bookingModal');
    const serviceInput = document.getElementById('serviceName');

    if (modal && serviceInput) {
        serviceInput.value = serviceName;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
        
        // إضافة تأثير التركيز على أول حقل
        setTimeout(() => {
            const clientNameInput = document.getElementById('clientName');
            if (clientNameInput) {
                clientNameInput.focus();
            }
        }, 300);
    }
}

// دالة إغلاق مودال الحجز
function closeBookingModal() {
    const modal = document.getElementById('bookingModal');

    if (modal) {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }
}

// دالة إرسال بريد حجز الخدمة
function sendBookingEmail(formData) {
    const email = 'aivo.hup.ai@gmail.com';
    const subject = `طلب خدمة جديد: ${formData.service}`;
    const body = `
طلب خدمة جديد من موقع Aivo

الخدمة المطلوبة: ${formData.service}
الاسم: ${formData.name}
الهاتف: ${formData.phone}
البريد الإلكتروني: ${formData.email}

وصف الاحتياج:
${formData.description}

---
تم الإرسال من موقع Aivo
    `.trim();

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // فتح نافذة جديدة لإرسال البريد
    window.open(mailtoLink, '_blank');
}

// دالة إرسال بريد التواصل
function sendContactEmail(formData) {
    const email = 'aivo.hup.ai@gmail.com';
    const subject = `رسالة جديدة من ${formData.name}`;
    const body = `
رسالة جديدة من موقع Aivo

الاسم: ${formData.name}
البريد الإلكتروني: ${formData.email}
الهاتف: ${formData.phone}

الرسالة:
${formData.message}

---
تم الإرسال من موقع Aivo
    `.trim();

    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // فتح نافذة جديدة لإرسال البريد
    window.open(mailtoLink, '_blank');
}

// دالة مساعدة للتحقق من صحة البريد الإلكتروني
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

// دالة مساعدة للتحقق من صحة رقم الهاتف
function isValidPhone(phone) {
    const phoneRegex = /^[\+]?[0-9]{8,15}$/;
    return phoneRegex.test(phone.replace(/\s/g, ''));
}