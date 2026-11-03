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
const status = document.querySelector('.reaction-status');
const storageKey = 'essental-reaction';
let selected;
try { selected = localStorage.getItem(storageKey); } catch {}
function render() {
  for (const button of buttons) button.setAttribute('aria-pressed', String(button.dataset.reaction === selected));
}
render();
for (const button of buttons) button.addEventListener('click', () => {
  selected = selected === button.dataset.reaction ? null : button.dataset.reaction;
  try { if (selected) localStorage.setItem(storageKey, selected); else localStorage.removeItem(storageKey); } catch {}
  render();
  status.textContent = selected ? 'Your reaction is saved on this device.' : 'Reaction removed.';
});
