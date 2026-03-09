export const DEFAULTS = {
    variables: {
        proyecto: 'PUEBLO MÁGICO EL SALITRE',
        capitalRequerido: 215000000,
        terreno: 40000,
        numTicketsMax: 400,
        m2ComercialPB: 3000,
        rentaM2Comercial: 450,
        m2HotelNivel1: 3000,
        rentaM2HotelNivel1: 350,
        m2HotelNivel2: 3000,
        rentaM2HotelNivel2: 300,
        m2Estacionamiento: 6000,
        capacidadEstacionamiento: 270,
        cochesDiarios: 350,
        precioPorCoche: 70,
        valorFideicomiso: 2000000,
        costoFideicomisoMensual: 50000,
        aniosProyeccion: 10,
        inflacionAnualRentas: 5,
        costoAdminRentasPct: 8.9,
        pctTicketsModelo: 10,
        costoM2Construccion: 18000,
        precioMercadoActualM2: 45000,
        aportaTerreno: false,
        valorTerrenoAportado: 36000000,
        precioTicketTerreno: 599999,
        selectedPlusvaliaTicketIdx: 0,
        activeReportTab: 'ingresos',
        ocupacionRentas: [60, 75, 90, ...Array(17).fill(100)],
        ocupacionEstacionamiento: [60, 75, 90, ...Array(17).fill(100)]
    },
    tickets: [
        { id: 1, cantidad: 50, precio: 499999, nombre: "Fase Semilla", esAportado: false },
        { id: 2, cantidad: 50, precio: 549999, nombre: "Preventa Privada", esAportado: false },
        { id: 3, cantidad: 75, precio: 599999, nombre: "Oferta Primaria", esAportado: false },
        { id: 4, cantidad: 75, precio: 649999, nombre: "Oferta Secundaria", esAportado: false },
        { id: 5, cantidad: 50, precio: 719999, nombre: "Cierre de Emisión", esAportado: false },
        { id: 6, cantidad: 60, precio: 599000, nombre: "Capital Tierra", esAportado: true, esTerrenoFijo: true }
    ],
    egresos: {
        nominaAdmin: 80000,
        nominaVentas: 150000,
        gastosContables: 30000,
        gastosLegales: 60000,
        rentaLugar: 20000,
        gastosPublicidad: 150000,
        gastosRepresentacion: 50000,
        showroomItems: [
            { nombre: 'Maqueta del Proyecto', cantidad: 1, costo: 150000 },
            { nombre: 'Escritorios', cantidad: 4, costo: 8000 },
            { nombre: 'Sillas de Oficina', cantidad: 8, costo: 3500 },
            { nombre: 'Pantalla Showroom', cantidad: 2, costo: 12000 },
            { nombre: 'Decoración / Branding', cantidad: 1, costo: 45000 },
            { nombre: 'Kiosko Interactivo', cantidad: 1, costo: 65000 }
        ],
        montoFinanciado: 0,
        tasaInteresAnual: 14,
        plazoMeses: 24,
        acopOficina: 150000,
        acopMaqueta: 120000,
        acopRenders: 80000,
        acopFotos: 30000,
        acopMedia: 120000,
        comisionVentasPct: 8,
        mesesLevantamiento: 24
    }
};

export let state = JSON.parse(JSON.stringify(DEFAULTS));
export let scenariosDb = [];
export let currentRole = 'viewer';

export function setState(newState) {
    state = newState;
}

export function setScenarios(scenarios) {
    scenariosDb = scenarios;
}

export function setRole(role) {
    currentRole = role;
}
