import { M } from '../utils/formatters.js';

/**
 * Renders the "Estrategia de Tickets" view.
 */
export function renderTickets(state) {
    const totalTicketsConfigured = state.tickets.reduce((sum, t) => sum + (Number(t.cantidad) || 0), 0);
    const maxTickets = state.variables.numTicketsMax;
    const pctModelo = state.variables.pctTicketsModelo || 0;
    const ticketsModelo = Math.floor(maxTickets * (pctModelo / 100));
    const saleableTickets = maxTickets - ticketsModelo;
    const remaining = saleableTickets - totalTicketsConfigured;

    let html = `<div class="section-header">
    <div>
      <div class="section-title">Estrategia de Tickets (Venta vs Asignación)</div>
      <div class="section-sub">Configuración de Venta Limitada a ${saleableTickets} tickets (excluyendo asignación del modelo)</div>
    </div>
    <div style="text-align:right;">
      <span style="display:block; font-size:12px; font-weight:600; color: ${remaining < 0 ? '#E8A090' : 'var(--navy)'};">
        Tickets Emitidos Totales: ${totalTicketsConfigured + ticketsModelo} / ${maxTickets}
      </span>
    </div>
  </div>
  
  <div class="card" style="padding:24px;">
    <!-- ... Rest of renderTickets UI ... -->
    <p style="font-size:12px; color:var(--text-muted); text-align:center;">Módulo de Tickets Modularizado</p>
  </div>`;

    return html;
}
