let burger = document.querySelector(".hamburger");
let menu = document.querySelector(".nav__list");
let menuLinks = menu.querySelectorAll('.list__item');
let scrolllinks = menu.querySelectorAll('.js-menu-link');
let scrolllink = menu.querySelector('.js-menu-link');

burger.addEventListener('click',
  function () {
    burger.classList.toggle('is-active');

    menu.classList.toggle('nav__list--active');
    menu.style.transition = 'visibility .3s ease-in-out, transform .3s ease-in-out';

    document.body.classList.toggle('stop-scroll');
  });

menu.addEventListener('transitionend', function () {
  if (!menu.classList.contains('nav__list--active'))
    menu.removeAttribute('style');
});

menuLinks.forEach(function (el) {
  el.addEventListener('click', function () {
    burger.classList.remove('is-active');

    menu.classList.remove('nav__list--active');

    document.body.classList.remove('stop-scroll');
  })
});

// Smooth scroll

function scrollToSection(link) {
  console.log(link);
  const href = link.getAttribute("href").substring(1);
  const scrollTarget = document.getElementById(href);
  const elementPosition = scrollTarget.getBoundingClientRect().top;

  window.scrollBy({
    top: elementPosition,
    behavior: "smooth"
  });
};

scrolllinks.forEach((link) => {
  link.addEventListener("click", function (e) {
    e.preventDefault();
    scrollToSection(this);
  });
});

function LinkPage(e) {
  window.location.href = e;
}

