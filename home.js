const collage = document.querySelector('.collage');
const papers = [...document.querySelectorAll('.paper')];
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
collage.addEventListener('pointermove', (event) => {
  if (reducedMotion.matches || event.pointerType === 'touch') return;
  const rect = collage.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - .5;
  const y = (event.clientY - rect.top) / rect.height - .5;
  papers.forEach((paper, index) => {
    const depth = (index + 1) * 3;
    paper.style.setProperty('--move-x', `${x * depth}px`);
    paper.style.setProperty('--move-y', `${y * depth}px`);
  });
});
collage.addEventListener('pointerleave', () => {
  papers.forEach(paper => {
    paper.style.setProperty('--move-x', '0px');
    paper.style.setProperty('--move-y', '0px');
  });
});

// Bring the two heading halves together as the gallery enters the viewport.
const gallery = document.querySelector('.class-gallery');
let scrollQueued = false;
function updateHeading() {
  const top = gallery.getBoundingClientRect().top;
  const progress = Math.max(0, Math.min(1, (innerHeight - top) / (innerHeight * .72)));
  gallery.style.setProperty('--heading-shift', `${(1 - progress) * 28}vw`);
  scrollQueued = false;
}
addEventListener('scroll', () => {
  if (!scrollQueued) { scrollQueued = true; requestAnimationFrame(updateHeading); }
}, { passive: true });
addEventListener('resize', updateHeading);
updateHeading();

const stage = document.querySelector('.gallery-stage');
const title = document.querySelector('.hover-title');
const artist = document.querySelector('.hover-artist');
const icons = [...document.querySelectorAll('.artwork')];
let activeIcon = null;
function reveal(icon) {
  activeIcon = icon;
  setLabel(title, icon.dataset.title);
  setLabel(artist, icon.dataset.artist);
  stage.classList.add('has-hover');
}
function hide(icon) {
  if (activeIcon !== icon) return;
  activeIcon = null;
  scatterLabel(title);
  scatterLabel(artist);
  stage.classList.remove('has-hover');
}
for (const icon of icons) {
  icon.addEventListener('pointerenter', () => reveal(icon));
  icon.addEventListener('pointerleave', () => hide(icon));
  icon.addEventListener('focus', () => reveal(icon));
  icon.addEventListener('blur', () => hide(icon));
}

function setLabel(label, text) {
  label.replaceChildren(...Array.from(text, character => {
    const piece = document.createElement('span');
    piece.textContent = character;
    return piece;
  }));
  label.style.visibility = '';
}
function scatterLabel(label) {
  if (!reducedMotion.matches) {
    const style = getComputedStyle(label);
    for (const piece of label.children) {
      if (!piece.textContent.trim()) continue;
      const rect = piece.getBoundingClientRect();
      const fragment = document.createElement('span');
      fragment.className = 'text-fragment';
      fragment.setAttribute('aria-hidden', 'true');
      fragment.textContent = piece.textContent;
      Object.assign(fragment.style, {
        left: `${rect.left}px`, top: `${rect.top}px`,
        fontFamily: style.fontFamily, fontSize: style.fontSize,
        fontWeight: style.fontWeight, letterSpacing: style.letterSpacing,
        color: style.color
      });
      document.body.append(fragment);
      const animation = fragment.animate([
        { transform: 'translate(0, 0) rotate(0deg)', opacity: 1 },
        { transform: `translate(${(Math.random() - .5) * 100}px, ${20 + Math.random() * 70}px) rotate(${(Math.random() - .5) * 100}deg) scale(.5)`, opacity: 0 }
      ], { duration: 550 + Math.random() * 350, easing: 'cubic-bezier(.2,.6,.4,1)', fill: 'forwards' });
      animation.onfinish = () => fragment.remove();
      animation.oncancel = () => fragment.remove();
    }
  }
  label.style.visibility = 'hidden';
}
