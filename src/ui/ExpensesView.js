import { M } from '../utils/formatters.js';

/**
 * Renders the "Presupuesto de Egresos" view.
 */
export function renderEgresos(state) {
    const e = state.egresos;
    const fijoMensual = (e.nominaAdmin || 0) + (e.nominaVentas || 0) + (e.gastosContables || 0) +
        (e.gastosLegales || 0) + (e.rentaLugar || 0) +
        (e.gastosPublicidad || 0) + (e.gastosRepresentacion || 0);

    let html = `<div class="section-header">
    <div>
      <div class="section-title">Presupuesto de Egresos Levantamiento Capital</div>
      <div class="section-sub">Costos fijos, operativos y estructurales</div>
    </div>
  </div>
  
  <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
    <div class="card" style="padding:24px;">
      <h3 style="font-size:14px; color:var(--navy); margin-bottom:16px; font-weight:500">Gastos Mensuales</h3>
      <div style="display:flex; justify-content:space-between; font-weight:600; color:var(--navy); margin-top:20px;">
        <span>Total Fijo Mensual:</span>
        <span>${M(fijoMensual)}</span>
      </div>
    </div>
  </div>`;

    return html;
}
