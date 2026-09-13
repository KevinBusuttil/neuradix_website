const button = document.querySelector('.menu-button');
const links = document.querySelector('.nav-links');
if (button && links) {
  button.addEventListener('click', () => {
    const open = links.classList.toggle('open');
    button.setAttribute('aria-expanded', String(open));
  });
}
for (const node of document.querySelectorAll('[data-year]')) {
  node.textContent = new Date().getFullYear();
}
