/* Final */
const preview = document.querySelector('.preview');
const frame = preview.querySelector('iframe');
// Keep the artwork's desktop composition visible inside the exhibition frame.
new ResizeObserver(([entry]) => {
  frame.style.width = '1440px';
  frame.style.height = `${1440 * preview.clientHeight / entry.contentRect.width}px`;
  frame.style.transformOrigin = 'top left';
  frame.style.transform = `scale(${entry.contentRect.width / 1440})`;
}).observe(preview);
const buttons = [...document.querySelectorAll('[data-reaction]')];
for (const button of buttons) button.addEventListener('click', () => {
  const rect = button.getBoundingClientRect();
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  for (let i = 0; i < 12; i++) {
    const particle = document.createElement('span');
    particle.className = 'reaction-particle';
    particle.textContent = button.textContent;
    particle.setAttribute('aria-hidden', 'true');
    particle.style.left = `${rect.left + rect.width / 2}px`;
    particle.style.top = `${rect.top + rect.height / 2}px`;
    document.body.append(particle);
    const drift = (Math.random() - .5) * 180;
    const rise = 100 + Math.random() * 180;
    const animation = particle.animate([
      { transform: 'translate(-50%, -50%) scale(.5)', opacity: 0 },
      { opacity: 1, offset: .15 },
      { transform: reducedMotion ? 'translate(-50%, -50%) scale(1)' : `translate(calc(-50% + ${drift}px), calc(-50% - ${rise}px)) rotate(${(Math.random() - .5) * 50}deg) scale(1.1)`, opacity: 0 }
    ], { duration: reducedMotion ? 250 : 900 + Math.random() * 600, delay: reducedMotion ? 0 : i * 25, easing: 'cubic-bezier(.15,.6,.35,1)' });
    animation.onfinish = () => particle.remove();
    animation.oncancel = () => particle.remove();
  }
});
