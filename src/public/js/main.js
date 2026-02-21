document.addEventListener("DOMContentLoaded", () => {
  const flashItems = document.querySelectorAll(".flash__item");
  if (!flashItems.length) {
    return;
  }

  setTimeout(() => {
    flashItems.forEach((item) => {
      item.style.opacity = "0";
      item.style.transition = "opacity 0.4s ease";
    });
  }, 3500);
});
