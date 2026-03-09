import { M } from '../utils/formatters.js';

/**
 * Renders the Dashboard view.
 */
export function renderDashboard(state, scenariosDb) {
  const v = state.variables;
  const numTickets = Number(v.numTicketsMax) || 1;
  const capital = Number(v.capitalRequerido) || 0;

  // Calculos rapidos para KPIs
  const m2ComPB = Number(v.m2ComercialPB) || 0;
  const rPB = Number(v.rentaM2Comercial) || 0;
  const m2H1 = Number(v.m2HotelNivel1) || 0;
  const rH1 = Number(v.rentaM2HotelNivel1) || 0;
  const m2H2 = Number(v.m2HotelNivel2) || 0;
  const rH2 = Number(v.rentaM2HotelNivel2) || 0;

  const ingresoRentasMensual = (m2ComPB * rPB) + (m2H1 * rH1) + (m2H2 * rH2);
  const parkingIncome = (Number(v.cochesDiarios) || 0) * (Number(v.precioPorCoche) || 0) * 30;
  const totalMensual = ingresoRentasMensual + parkingIncome;
  const totalAnual = totalMensual * 12;

  const adminPct = (Number(v.costoAdminRentasPct) || 0) / 100;
  const utilidadAnualPool = totalAnual * (1 - adminPct);
  const utilPorTicketAnual = utilidadAnualPool / numTickets;
  const yieldPromedio = (utilPorTicketAnual / (capital / numTickets)) * 100;

  const html = `
    <div class="section-header" style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        <div class="section-title">Dashboard del Proyecto</div>
        <div class="section-sub">${v.proyecto} · Resumen Ejecutivo de Rendimientos</div>
      </div>
      ${state.currentRole === 'admin'
      ? `<div style="padding:6px 14px; background:rgba(46,204,113,0.1); border:1px solid #2ecc71; color:#2ecc71; border-radius:30px; font-size:11px; font-weight:700; letter-spacing:0.5px;">MODO ADMINISTRADOR</div>`
      : `<div style="padding:6px 14px; background:rgba(127,140,141,0.1); border:1px solid #7f8c8d; color:#7f8c8d; border-radius:30px; font-size:11px; font-weight:700; letter-spacing:0.5px;">MODO LECTURA</div>`
    }
    </div>

    <div class="kpi-grid">
      ${kpiCard('Pool Total Anual (Neta)', M(utilidadAnualPool), 'Utilidad después de administración', '#2ecc71', '#27ae60')}
      ${kpiCard('Rendimiento x Ticket', M(utilPorTicketAnual), 'Promedio anual proyectado', 'var(--gold)', '#C5A059')}
      ${kpiCard('Yield Promedio', yieldPromedio.toFixed(2) + '%', 'Retorno sobre inversión capital', 'var(--navy)', '#1e3d59')}
      ${kpiCard('Escenarios Guardados', scenariosDb.length, 'Simulaciones disponibles', '#9b59b6', '#8e44ad')}
    </div>

    <div style="display:grid; grid-template-columns: repeat(auto-fit, minmax(320px, 1fr)); gap:24px; margin-top:24px;">
      <div class="card">
        <h3 style="font-size:16px; margin-bottom:16px;">Distribución de Ingresos</h3>
        <div style="height:300px;"><canvas id="chart-ingresos"></canvas></div>
      </div>
      <div class="card">
        <h3 style="font-size:16px; margin-bottom:16px;">Rendimiento Proyectado (10 años)</h3>
        <div style="height:300px;"><canvas id="chart-utilidades"></canvas></div>
      </div>
    </div>
  `;

  return html;
}

function kpiCard(label, valor, sub, color, borderColor) {
  return `
    <div class="kpi-card" style="border-top: 4px solid ${borderColor};">
      <div class="kpi-label">${label}</div>
      <div class="kpi-value" style="color:${color}">${valor}</div>
      <div class="kpi-subText">${sub}</div>
    </div>
  `;
}
