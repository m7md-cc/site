document.addEventListener("DOMContentLoaded", () => {
  const scrollButtons = document.querySelectorAll("[data-scroll]");
  const topButton = document.getElementById("topButton");
  const revealElements = document.querySelectorAll(".reveal");

  /* ================= Smooth navigation ================= */
  scrollButtons.forEach(button => {
    button.addEventListener("click", () => {
      const targetSelector = button.dataset.scroll;
      const target = document.querySelector(targetSelector);

      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });

  /* ================= Reveal on scroll ================= */
  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.12,
      rootMargin: "0px 0px -40px 0px"
    }
  );

  revealElements.forEach(element => observer.observe(element));

  /* ================= Back to top ================= */
  window.addEventListener("scroll", () => {
    if (window.scrollY > window.innerHeight * 0.7) {
      topButton.classList.add("show");
    } else {
      topButton.classList.remove("show");
    }
  }, { passive: true });

  topButton.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
