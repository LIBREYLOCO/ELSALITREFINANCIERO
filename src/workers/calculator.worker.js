/**
 * Calculation Worker
 * Offloads heavy financial projections from the main thread.
 */

// I can't easily import ES modules in workers without a bundler or specific flags
// So I will replicate the logic or use a worker-friendly version.

self.onmessage = function (e) {
    const { variables, tickets } = e.data;

    const v = variables;
    const anios = Number(v.aniosProyeccion) || 10;
    const inflacion = (Number(v.inflacionAnualRentas) || 0) / 100;
    const adminPct = (Number(v.costoAdminRentasPct) || 0) / 100;
    const maxTickets = Number(v.numTicketsMax) || 1;

    const m2ComercialPB = Number(v.m2ComercialPB) || 0;
    const rentaM2Comercial = Number(v.rentaM2Comercial) || 0;
    const m2HotelNivel1 = Number(v.m2HotelNivel1) || 0;
    const rentaM2HotelNivel1 = Number(v.rentaM2HotelNivel1) || 0;
    const m2HotelNivel2 = Number(v.m2HotelNivel2) || 0;
    const rentaM2HotelNivel2 = Number(v.rentaM2HotelNivel2) || 0;

    const ingresoRentasMensualBase = (m2ComercialPB * rentaM2Comercial) +
        (m2HotelNivel1 * rentaM2HotelNivel1) +
        (m2HotelNivel2 * rentaM2HotelNivel2);

    const cochesDiarios = Number(v.cochesDiarios) || 350;
    const precioCoche = Number(v.precioPorCoche) || 50;
    const ingresoEstacionamientoMensualBase = cochesDiarios * precioCoche * 30;

    const yearlyData = [];
    let curRentas = ingresoRentasMensualBase * 12;
    let curEstac = ingresoEstacionamientoMensualBase * 12;

    for (let yr = 0; yr < anios; yr++) {
        if (yr > 0) {
            curRentas *= (1 + inflacion);
            curEstac *= (1 + inflacion);
        }
        const pctRent = (v.ocupacionRentas && v.ocupacionRentas[yr] !== undefined) ? v.ocupacionRentas[yr] / 100 : 1;
        const pctEstac = (v.ocupacionEstacionamiento && v.ocupacionEstacionamiento[yr] !== undefined) ? v.ocupacionEstacionamiento[yr] / 100 : 1;

        const ingresoNetoRentas = curRentas * pctRent;
        const ingresoNetoEstac = curEstac * pctEstac;
        const ingresoBruto = ingresoNetoRentas + ingresoNetoEstac;
        const costoAdmin = ingresoBruto * adminPct;
        const utilidadPool = ingresoBruto - costoAdmin;
        const utilidadPorTicket = utilidadPool / maxTickets;

        yearlyData.push({
            pctRent, pctEstac,
            ingresoNetoRentas, ingresoNetoEstac,
            costoAdmin, utilidadPool, utilidadPorTicket
        });
    }

    self.postMessage(yearlyData);
};
