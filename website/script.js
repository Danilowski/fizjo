$(document).ready(function(){
    $(".testimonial__slider").owlCarousel({
        loop: true,
        margin: 30,
        nav: false,
        dots: true,
        autoplay: true,
        autoplayTimeout: 5000,
        responsive: { 0:{items:1}, 768:{items:2} }
    });

    $("#certificates .gallery").owlCarousel({
        loop: true,
        margin: 10,
        nav: false,
        dots: false,
        autoplay: true,
        autoplayTimeout: 3000,
        autoplayHoverPause: true,
        responsive: { 0:{items:1}, 600:{items:2}, 1000:{items:5} }
    });
});

const questions = document.querySelectorAll(".faq-question");

questions.forEach((question) => {
  question.addEventListener("click", () => {
    const parent = question.parentElement;
    parent.classList.toggle("active");
  });
});
