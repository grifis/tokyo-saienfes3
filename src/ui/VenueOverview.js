import { Parser } from '../core/Parser.js';
import { closeTopLayer } from './motion.js';

const MEETING = '1F ホール集合';
const FLOORS = [
  { id: '1F', title: 'ホール集合', hint: '11Fのホール公演は、開演時刻に1Fへ。' },
  { id: '2F', title: '会議室・応接室' },
  { id: '4F', title: 'ブース' },
  { id: '11F', title: 'ホール', hint: 'ホール公演に参加する方は、開演時刻に1F集合。' }
];
const floorOf = room => room.split(' ')[0];
const roomName = room => room.slice(room.indexOf(' ') + 1);
const esc = Parser.escapeHtml;

export class VenueOverview {
  constructor() {
    this.dialog = document.getElementById('venue-overview-dialog');
    this.button = document.getElementById('venue-overview-btn');
    this.content = document.getElementById('venue-overview-content');
    this.rooms = new Set();
    this.legs = [];
    this.index = 0;
    this.floor = '1F';

    this.button.addEventListener('click', () => this.open());
    document.getElementById('venue-overview-close').addEventListener('click', () => closeTopLayer(this.dialog));
    this.content.addEventListener('click', event => {
      const button = event.target.closest('button');
      if (!button) return;
      if (button.dataset.floor) {
        this.floor = button.dataset.floor;
      } else if (button.dataset.leg !== undefined) {
        this.index = Number(button.dataset.leg);
        this.floor = floorOf(this.legs[this.index].from);
      } else {
        return;
      }
      this.render();
      const selector = button.dataset.floor
        ? `[data-floor="${this.floor}"][aria-pressed="true"]`
        : '[data-current-leg]';
      this.content.querySelector(selector)?.focus({ preventScroll: true });
    });
  }

  setContext(config, shows) {
    this.rooms = new Set();
    if (config.showRoomTransferNotes) {
      this.rooms.add(MEETING);
      for (const show of shows) {
        if (!show.isUnscheduled && FLOORS.some(floor => floor.id === floorOf(show.room))) {
          this.rooms.add(show.room);
        }
      }
    }
    this.button.hidden = this.rooms.size < 2;
  }

  canGuide(from, to) {
    return this.rooms.has(from) && this.rooms.has(to) && (from !== to || to.startsWith('11F ホール'));
  }

  open(legs = []) {
    this.legs = legs.filter(({ from, to }) => this.canGuide(from, to));
    this.index = 0;
    this.floor = this.legs.length ? floorOf(this.legs[0].from) : '1F';
    this.render();
    this.dialog.showModal();
  }

  render() {
    const leg = this.legs[this.index];
    const floor = FLOORS.find(item => item.id === this.floor);
    const stops = leg ? [{ room: leg.from, label: '出発' }] : [];
    if (leg) {
      if (leg.to.startsWith('11F ホール') && leg.from !== MEETING) {
        stops.push({ room: MEETING, label: '開演時刻に集合' });
      }
      stops.push({ room: leg.to, label: '公演会場' });
    }
    const route = leg ? `
      <section class="venue-route" aria-label="公演間の移動">
        ${this.legs.length > 1 ? `
          <div class="venue-route-nav">
            <button type="button" data-leg="${this.index - 1}" ${this.index === 0 ? 'disabled' : ''}>前の移動</button>
            <p data-current-leg tabindex="-1">${this.index + 1} / ${this.legs.length}</p>
            <button type="button" data-leg="${this.index + 1}" ${this.index + 1 === this.legs.length ? 'disabled' : ''}>次の移動</button>
          </div>` : ''}
        ${leg.nextShowLabel ? `<h3>${esc(leg.nextShowLabel)}</h3>` : ''}
        <ol class="venue-stops">
          ${stops.map(({ room, label }) => `
            <li><button type="button" data-floor="${floorOf(room)}" aria-pressed="${floorOf(room) === floor.id}">
              <span class="venue-stop-floor">${floorOf(room)}</span>
              <span><small>${label}</small><strong>${esc(roomName(room))}</strong></span>
            </button></li>`).join('')}
        </ol>
      </section>` : '';
    const rooms = [...this.rooms].filter(room => floorOf(room) === floor.id)
      .sort((a, b) => a.localeCompare(b, 'ja', { numeric: true }));
    this.content.innerHTML = `${route}
      <nav class="venue-floor-nav" aria-label="表示する階">
        ${FLOORS.map(({ id }) => `<button type="button" data-floor="${id}" aria-pressed="${id === floor.id}">${id}</button>`).join('')}
      </nav>
      <section class="venue-floor-map" aria-label="${floor.id}の会場">
        <div class="venue-floor-heading"><span>${floor.id}</span><h3>${floor.title}</h3></div>
        ${floor.hint ? `<p>${floor.hint}</p>` : ''}
        <ul class="venue-rooms">
          ${rooms.map(room => {
            const markers = stops.filter(stop => stop.room === room).map(stop => stop.label);
            return `<li class="${markers.length ? 'is-on-route' : ''}">${esc(roomName(room))}
              ${markers.length ? `<small>${markers.join('・')}</small>` : ''}</li>`;
          }).join('')}
        </ul>
      </section>`;
  }
}
