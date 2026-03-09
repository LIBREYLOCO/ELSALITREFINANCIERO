import { M } from '../utils/formatters.js';

/**
 * Renders the Base Parameters view with all its functional tabs.
 */
export function renderParametros(state) {
    const v = state.variables;
    const activeTab = v.activeParamTab || 'generales';
    const aniosVal = Number(v.aniosProyeccion) || 10;
    const inflVal = Number(v.inflacionAnualRentas) || 5;
    const adminVal = Number(v.costoAdminRentasPct) || 8.9;

    const tabStyle = (tab) => activeTab === tab
        ? 'padding:12px 24px; font-weight:600; color:var(--navy); border-bottom:2px solid var(--navy); cursor:pointer; background:rgba(30, 61, 89, 0.05); white-space:nowrap;'
        : 'padding:12px 24px; font-weight:500; color:var(--text-muted); border-bottom:2px solid transparent; cursor:pointer; white-space:nowrap;';

    let html = `
    <div class="section-header">
      <div>
        <div class="section-title">Parámetros Base</div>
        <div class="section-sub">Configuración inicial del desarrollo inmobiliario</div>
      </div>
    </div>
    <div class="card" style="padding:0; overflow:hidden;">
      <div style="display:flex; border-bottom:1px solid #eee; background:#f9fbfd; font-size:13px; overflow-x:auto;">
        <div style="${tabStyle('generales')}" onclick="App.switchParamTab('generales')">Datos Generales</div>
        <div style="${tabStyle('rentas')}" onclick="App.switchParamTab('rentas')">Distribución Rentable y Tarifas</div>
        <div style="${tabStyle('estacionamiento')}" onclick="App.switchParamTab('estacionamiento')">Estacionamiento</div>
        <div style="${tabStyle('fiduciaria')}" onclick="App.switchParamTab('fiduciaria')">Estructura Fiduciaria</div>
      </div>
      <div style="padding:24px;">
  `;

    if (activeTab === 'generales') {
        const e = state.egresos || {};
        const comisionPct = Number(e.comisionVentasPct) || 0;
        const totalVendidos = state.tickets
            .filter(t => !t.esAportado)
            .reduce((s, t) => s + (Number(t.cantidad) * Number(t.precio)), 0);
        const comisionMonto = totalVendidos * (comisionPct / 100);

        html += `
      <h3 style="font-size:14px; color:var(--navy); margin-bottom:16px; font-weight:500">Datos Generales</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <label class="form-label">Nombre del Proyecto</label>
          <input type="text" class="form-input" style="width:100%" value="${v.proyecto}" data-key="proyecto" data-nested="variables" data-is-text="true">
        </div>
        <div>
          <label class="form-label">Capital Requerido Target</label>
          <input type="text" class="form-input" style="width:100%" value="${M(v.capitalRequerido)}" data-key="capitalRequerido" data-nested="variables">
        </div>
        <div>
          <label class="form-label">Total Tickets Emitidos (Max)</label>
          <input type="number" class="form-input" style="width:100%" value="${v.numTicketsMax}" data-key="numTicketsMax" data-nested="variables">
        </div>
      </div>
      
      <div style="margin-top:28px; padding:20px; background:#f9fbfd; border-radius:8px; border:1px solid #e1e8ed;">
        <h3 style="font-size:13px; color:var(--navy); margin-bottom:16px; font-weight:600; text-transform:uppercase;">Comisión de Ventas</h3>
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div style="flex:1">
            <label class="form-label">Porcentaje Comisión: ${comisionPct}%</label>
            <input type="range" class="form-input" min="0" max="30" step="0.5" style="width:100%" value="${comisionPct}" data-key="comisionVentasPct" data-nested="egresos">
          </div>
          <div style="margin-left:40px; text-align:right;">
            <div style="font-size:11px; color:var(--text-muted);">Comisión Estimada:</div>
            <div style="font-size:20px; font-weight:700; color:#C5A059;">${M(comisionMonto)}</div>
          </div>
        </div>
      </div>

      <div style="margin-top:28px; padding:20px; background:#f9fbfd; border-radius:8px; border:1px solid #e1e8ed;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <h3 style="font-size:13px; color:var(--navy); margin:0; font-weight:600;">Aportación de Terreno</h3>
            <p style="font-size:11px; color:var(--text-muted); margin-top:4px;">El valor del terreno se convierte en tickets fijos.</p>
          </div>
          <button onclick="App.toggleAportaTerreno()" class="btn-toggle" style="background:${v.aportaTerreno ? 'rgba(46,204,113,0.1)' : '#eee'}; color:${v.aportaTerreno ? '#2ecc71' : '#666'}">
            ${v.aportaTerreno ? 'ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>
      </div>
    `;
    } else if (activeTab === 'rentas') {
        html += `
      <h3 style="font-size:14px; color:var(--navy); margin-bottom:16px; font-weight:500">Distribución Rentable y Tarifas</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <label class="form-label">M² Comercial (PB)</label>
          <input type="number" class="form-input" style="width:100%" value="${v.m2ComercialPB}" data-key="m2ComercialPB" data-nested="variables">
        </div>
        <div>
          <label class="form-label">Renta/M² (PB)</label>
          <input type="text" class="form-input" style="width:100%" value="${M(v.rentaM2Comercial)}" data-key="rentaM2Comercial" data-nested="variables">
        </div>
        <!-- ... more fields ... -->
      </div>
    `;
    } else if (activeTab === 'estacionamiento') {
        const coches = Number(v.cochesDiarios) || 350;
        const precio = Number(v.precioPorCoche) || 50;
        html += `
      <h3 style="font-size:14px; color:var(--navy); margin-bottom:16px; font-weight:500">Parámetros Estacionamiento</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:20px;">
        <div>
          <label class="form-label">Coches Diarios (Rotación)</label>
          <input type="number" class="form-input" style="width:100%" value="${coches}" data-key="cochesDiarios" data-nested="variables">
        </div>
        <div>
          <label class="form-label">Ticket Promedio</label>
          <input type="text" class="form-input" style="width:100%" value="${M(precio)}" data-key="precioPorCoche" data-nested="variables">
        </div>
      </div>
      <div style="margin-top:20px; padding:16px; background:rgba(46,204,113,0.05); border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
        <span style="font-weight:600; color:var(--navy);">Ingreso Mensual Proyectado:</span>
        <span style="font-size:20px; font-weight:700; color:#2ecc71;">${M(coches * precio * 30)}</span>
      </div>
    `;
    }

    html += `</div></div>`;
    return html;
}

export function renderConstruccion(state) {
    return `<div class="section-title">Inversión y Construcción</div><div class="card">Módulo en proceso de modularización...</div>`;
}

export function renderPlusvalia(state) {
    return `<div class="section-title">Plusvalía y Mercado</div><div class="card">Módulo en proceso de modularización...</div>`;
}
