/**
 * はじめての人への使い方の案内（コーチマーク）。
 * まわりを暗くして、ボタンを 1 つずつ明るく抜き出し、その横に短い説明を出す。「次へ」「わかった」で進む。
 *
 * 使い方：
 *   showCoachMarks(dialogEl, [{ target: btnEl, title: 'スキマ探索', text: '…' }, …], { onDone })
 * host は案内を入れる要素（モーダルの <dialog> の中に出すときは、その dialog を渡す。最前面の層に乗るため）。
 */
const reduceMotion = () => typeof window.matchMedia === 'function' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

export function showCoachMarks(host, steps, { onDone } = {}) {
  const list = steps.filter((s) => s.target && s.target.getClientRects().length > 0);
  if (!host || !list.length) return null;

  const root = document.createElement('div');
  root.className = 'coach';
  root.innerHTML = `
    <div class="coach-spot" aria-hidden="true"></div>
    <div class="coach-bubble" role="dialog" aria-modal="true" aria-labelledby="coach-title" aria-describedby="coach-text">
      <p class="coach-step"></p>
      <h3 id="coach-title" class="coach-title"></h3>
      <p id="coach-text" class="coach-text"></p>
      <div class="coach-actions">
        <button type="button" class="coach-skip">スキップ</button>
        <button type="button" class="coach-next"></button>
      </div>
    </div>`;
  host.appendChild(root);
  const spot = root.querySelector('.coach-spot');
  const bubble = root.querySelector('.coach-bubble');
  const nextBtn = root.querySelector('.coach-next');
  let i = 0;
  let done = false;

  /** 対象のボタンの位置に穴をあけ、吹き出しを上（入らなければ下）に置く */
  const place = () => {
    const base = root.getBoundingClientRect(); // fixed の基準（親に変形があってもずれないように）
    const r = list[i].target.getBoundingClientRect();
    const pad = 6;
    const x = r.left - base.left - pad;
    const y = r.top - base.top - pad;
    Object.assign(spot.style, { left: `${x}px`, top: `${y}px`, width: `${r.width + pad * 2}px`, height: `${r.height + pad * 2}px` });
    const vw = base.width;
    const bw = Math.min(300, vw - 24);
    bubble.style.width = `${bw}px`;
    const cx = x + (r.width + pad * 2) / 2;
    const left = Math.max(12, Math.min(vw - bw - 12, cx - bw / 2));
    bubble.style.left = `${left}px`;
    bubble.style.setProperty('--arrow-x', `${Math.max(18, Math.min(bw - 18, cx - left))}px`);
    const bh = bubble.offsetHeight;
    const above = y - bh - 14 > 8;
    bubble.classList.toggle('is-above', above);
    bubble.classList.toggle('is-below', !above);
    bubble.style.top = above ? `${y - bh - 14}px` : `${y + r.height + pad * 2 + 14}px`;
  };

  const render = () => {
    const s = list[i];
    root.querySelector('.coach-step').textContent = list.length > 1 ? `${i + 1} / ${list.length}` : '';
    root.querySelector('.coach-title').textContent = s.title;
    root.querySelector('.coach-text').textContent = s.text;
    nextBtn.textContent = i < list.length - 1 ? '次へ' : 'わかった';
    place();
    if (!reduceMotion()) {
      bubble.animate([{ opacity: 0, transform: 'translateY(6px)' }, { opacity: 1, transform: 'none' }], { duration: 220, easing: 'cubic-bezier(0.24, 1, 0.4, 1)' });
    }
    nextBtn.focus({ preventScroll: true });
  };

  const onResize = () => place();
  // Esc は案内だけを閉じる（下のモーダルまで閉じない）
  const onCancel = (e) => { e.preventDefault(); finish(); };
  function finish() {
    if (done) return;
    done = true;
    window.removeEventListener('resize', onResize);
    host.removeEventListener('cancel', onCancel);
    root.remove();
    if (onDone) onDone();
  }
  nextBtn.addEventListener('click', () => {
    if (i < list.length - 1) { i += 1; render(); } else finish();
  });
  root.querySelector('.coach-skip').addEventListener('click', finish);
  window.addEventListener('resize', onResize);
  host.addEventListener('cancel', onCancel);
  render();
  return { finish };
}
