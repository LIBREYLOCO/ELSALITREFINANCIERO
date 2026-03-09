import { M } from '../utils/formatters.js';
import { calculateYearlyProjection, calculateRecovery } from '../core/FinancialEngine.js';

/**
 * Renders the "Corrida Financiera" view.
 */
export function renderProyeccion(state, isPDFMode = false) {
    const v = state.variables;
    const activeTab = v.activeProyeccionTab || 'flujo';
    const anios = Number(v.aniosProyeccion) || 10;
    const inflacion = (Number(v.inflacionAnualRentas) || 0) / 100;
    const adminPct = (Number(v.costoAdminRentasPct) || 0) / 100;
    const maxTickets = Number(v.numTicketsMax) || 1;

    // Use the core engine to calculate data
    const yearlyData = calculateYearlyProjection(v, state.tickets);

    const tabStyle = (tab) => activeTab === tab
        ? 'padding:12px 24px; font-weight:600; color:var(--navy); border-bottom:2px solid var(--navy); cursor:pointer; background:rgba(30, 61, 89, 0.05); white-space:nowrap;'
        : 'padding:12px 24px; font-weight:500; color:var(--text-muted); border-bottom:2px solid transparent; cursor:pointer; white-space:nowrap;';

    let headersHTML = ``;
    state.tickets.forEach(ticket => {
        if (ticket.cantidad > 0) {
            headersHTML += `<th style="padding:12px 16px; font-weight:600; text-align:center; border-left:1px solid #eee;">Rend. ${ticket.nombre}<br><span style="font-size:10px; font-weight:400; color:var(--text-muted);">${M(ticket.precio)}</span></th>`;
        }
    });

    let html = `<div class="section-header">
    <div>
      <div class="section-title">Corrida Financiera</div>
      <div class="section-sub">Proyección a ${anios} años · Inflación ${(inflacion * 100).toFixed(1)}% · Costo Admin ${(adminPct * 100).toFixed(1)}%</div>
    </div>
  </div>
  <div class="card" style="padding:0; overflow:hidden;">
    <div style="display:flex; border-bottom:1px solid #eee; background:#f9fbfd; font-size:13px; overflow-x:auto;">
      <div style="${tabStyle('flujo')}" onclick="App.switchProyeccionTab('flujo')">Flujo Operativo Anual</div>
      <div style="${tabStyle('ticket')}" onclick="App.switchProyeccionTab('ticket')">Rendimiento por Fase</div>
      <div style="${tabStyle('acumulado')}" onclick="App.switchProyeccionTab('acumulado')">Recuperación Acumulada</div>
    </div>
    <div style="padding:24px;">`;

    if (activeTab === 'flujo') {
        html += `<div style="overflow-x:auto;"><table style="width:100%; text-align:right; border-collapse:collapse; font-size:${isPDFMode ? '10px' : '13px'}; min-width:${isPDFMode ? '900px' : '1100px'};">
      <thead>
        <tr style="border-bottom:2px solid #eee; background:#f9fbfd; color:var(--navy);">
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600; text-align:left;">Año Operativo</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Ocup.<br>Renta</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Ingreso<br>Rentas</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Ocup.<br>Estac.</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Ingreso<br>Estacionamiento</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Costo Admin.<br>(${(adminPct * 100).toFixed(1)}%)</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Utilidad Neta<br>(Pool Total)</th>
          <th style="padding:${isPDFMode ? '8px 10px' : '12px 16px'}; font-weight:600;">Utilidad Neta<br>/ Ticket</th>
          ${headersHTML}
        </tr>
      </thead>
      <tbody>`;

        for (let yr = 0; yr < anios; yr++) {
            const d = yearlyData[yr];
            const utilidadPorTicket = d.utilidadPorTicket;

            let yieldCols = ``;
            state.tickets.forEach(ticket => {
                if (ticket.cantidad > 0) {
                    const pct = (utilidadPorTicket / (Number(ticket.precio) || 1)) * 100;
                    yieldCols += `<td style="padding:12px 16px; font-weight:600; color:${pct > 12 ? '#2ecc71' : 'var(--navy)'}; text-align:center; border-left:1px solid #f5f5f5;">${pct.toFixed(2)}%</td>`;
                }
            });

            html += `<tr style="border-bottom:1px solid #f5f5f5; background:${yr % 2 === 0 ? '#fff' : '#fafbfd'};">
        <td style="padding:12px 16px; text-align:left; font-weight:600; color:var(--navy);">Año ${yr + 1}</td>
        <td style="padding:12px 16px; font-weight:600; color:#C5A059; background:rgba(197,160,89,0.05);">${(d.pctRent * 100).toFixed(0)}%</td>
        <td style="padding:12px 16px; color:var(--text-muted);">${M(d.ingresoNetoRentas)}</td>
        <td style="padding:12px 16px; font-weight:600; color:#2ecc71; background:rgba(46,204,113,0.05);">${(d.pctEstac * 100).toFixed(0)}%</td>
        <td style="padding:12px 16px; color:var(--text-muted);">${M(d.ingresoNetoEstac)}</td>
        <td style="padding:12px 16px; color:#E8A090;">– ${M(d.costoAdmin)}</td>
        <td style="padding:12px 16px; font-weight:700; color:#2ecc71;">${M(d.utilidadPool)}</td>
        <td style="padding:12px 16px; font-weight:700; color:var(--navy); background:rgba(197,160,89,0.05);">${M(utilidadPorTicket)}</td>
        ${yieldCols}
      </tr>`;
        }
        html += `</tbody></table></div>`;

    } else if (activeTab === 'ticket') {
        const utilPorTicket1 = yearlyData[0].utilidadPorTicket;
        const utilPorTicket5 = anios >= 5 ? yearlyData[4].utilidadPorTicket : yearlyData[anios - 1].utilidadPorTicket;
        const utilPorTicketN = yearlyData[anios - 1].utilidadPorTicket;

        html += `<p style="font-size:13px; color:var(--text-muted); margin-bottom:20px; line-height:1.6;">
      Rendimiento y cap rate proyectado por cada fase de inversión, calculado sobre la utilidad neta del pool total ÷ ${maxTickets} tickets emitidos.
    </p>
    <div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead>
        <tr style="border-bottom:2px solid #eee; background:#f9fbfd; color:var(--navy);">
          <th style="padding:12px 16px; text-align:left; font-weight:600;">Fase</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Precio Ticket</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Util. Anual / Ticket</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Cap Rate Año 1</th>
          ${anios >= 5 ? `<th style="padding:12px 16px; text-align:right; font-weight:600;">Cap Rate Año 5</th>` : ''}
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Cap Rate Año ${anios}</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Recuperación Est.</th>
        </tr>
      </thead>
      <tbody>`;

        state.tickets.forEach(ticket => {
            const precio = Number(ticket.precio) || 1;
            const cr1 = (utilPorTicket1 / precio) * 100;
            const cr5 = (utilPorTicket5 / precio) * 100;
            const crN = (utilPorTicketN / precio) * 100;

            const recup = calculateRecovery(yearlyData, precio, anios);

            html += `<tr style="border-bottom:1px solid #f5f5f5;">
        <td style="padding:12px 16px; font-weight:600; color:var(--navy);">${ticket.nombre}</td>
        <td style="padding:12px 16px; text-align:right;">${M(precio)}</td>
        <td style="padding:12px 16px; text-align:right; color:#2ecc71; font-weight:600;">${M(utilPorTicket1)}</td>
        <td style="padding:12px 16px; text-align:right; font-weight:700; color:${cr1 > 10 ? '#2ecc71' : 'var(--navy)'};">${cr1.toFixed(2)}%</td>
        ${anios >= 5 ? `<td style="padding:12px 16px; text-align:right; font-weight:700; color:${cr5 > 12 ? '#2ecc71' : 'var(--navy)'};">${cr5.toFixed(2)}%</td>` : ''}
        <td style="padding:12px 16px; text-align:right; font-weight:700; color:#C5A059;">${crN.toFixed(2)}%</td>
        <td style="padding:12px 16px; text-align:right; color:var(--text-muted);">${recup}</td>
      </tr>`;
        });

        html += `</tbody></table></div>
    <div style="margin-top:16px; padding:12px 16px; background:#f9fbfd; border:1px solid #e1e8ed; border-radius:6px; font-size:12px; color:var(--text-muted);">
      <strong>Notas:</strong> Inflación ${(inflacion * 100).toFixed(1)}% anual aplicada al ingreso bruto.
      Costo administrativo ${(adminPct * 100).toFixed(1)}% deducido del ingreso bruto.
      Ocupación 100% para esta proyección base — usa <em>Escenarios Financieros</em> para estresar el modelo.
    </div>`;

    } else if (activeTab === 'acumulado') {
        let acum = 0;
        html += `<p style="font-size:13px; color:var(--text-muted); margin-bottom:20px; line-height:1.6;">
      Muestra cuánto ha recuperado cada fase de su inversión inicial, año a año. Verde = recuperación total del capital.
    </p>
    <div style="overflow-x:auto;"><table style="width:100%; border-collapse:collapse; font-size:13px;">
      <thead>
        <tr style="border-bottom:2px solid #eee; background:#f9fbfd; color:var(--navy);">
          <th style="padding:12px 16px; text-align:left; font-weight:600;">Año</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Utilidad Anual / Ticket</th>
          <th style="padding:12px 16px; text-align:right; font-weight:600;">Utilidad Acumulada</th>`;
        state.tickets.forEach(t => {
            if (t.cantidad > 0) html += `<th style="padding:12px 16px; text-align:right; font-weight:600; border-left:1px solid #eee;">% Recup. ${t.nombre}</th>`;
        });
        html += `</tr></thead><tbody>`;

        for (let yr = 0; yr < anios; yr++) {
            const utilPorTicket = yearlyData[yr].utilidadPorTicket;
            acum += utilPorTicket;
            let recupCols = '';
            state.tickets.forEach(t => {
                if (t.cantidad > 0) {
                    const pct = ((acum / (Number(t.precio) || 1)) * 100);
                    const isRecovered = pct >= 100;
                    recupCols += `<td style="padding:12px 16px; text-align:right; font-weight:700; color:${isRecovered ? '#2ecc71' : 'var(--navy)'}; border-left:1px solid #f5f5f5; background:${isRecovered ? 'rgba(46,204,113,0.05)' : 'transparent'};">${pct.toFixed(1)}%</td>`;
                }
            });
            html += `<tr style="border-bottom:1px solid #f5f5f5; background:${yr % 2 === 0 ? '#fff' : '#fafbfd'};">
        <td style="padding:12px 16px; font-weight:600; color:var(--navy);">Año ${yr + 1}</td>
        <td style="padding:12px 16px; text-align:right; color:#2ecc71; font-weight:600;">${M(utilPorTicket)}</td>
        <td style="padding:12px 16px; text-align:right; font-weight:700; color:var(--navy);">${M(acum)}</td>
        ${recupCols}
      </tr>`;
        }
        html += `</tbody></table></div>`;
    }

    return html;
}
