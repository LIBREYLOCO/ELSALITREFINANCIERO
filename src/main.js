import { state, DEFAULTS, setState, setScenarios } from './core/State.js';
import { renderDashboard } from './ui/DashboardView.js';
import { renderProyeccion } from './ui/ProyeccionView.js';
import { renderParametros, renderConstruccion, renderPlusvalia } from './ui/ConfigViews.js';

/**
 * Main Application Orchestrator
 */
const App = (() => {
    const container = document.getElementById('main-content');
    const navItems = document.querySelectorAll('.nav-item');

    /**
     * Initialize Application
     */
    async function init() {
        console.log('Iniciando Aplicación Modular...');
        try {
            // Intentar cargar estado persistido
            const saved = localStorage.getItem('lyl_state');
            if (saved) setState(JSON.parse(saved));

            // Configurar navegación
            setupNavigation();

            // Renderizar vista inicial
            renderActiveView();

        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }

    /**
   * Unified Rendering Hub
   */
    function renderActiveView() {
        const view = state.activeView || 'dashboard';
        let html = '';

        switch (view) {
            case 'dashboard':
                html = renderDashboard(state, []);
                break;
            case 'parametros':
                html = renderParametros(state);
                break;
            case 'proyeccion':
                html = renderProyeccion(state);
                break;
            case 'construccion':
                html = renderConstruccion(state);
                break;
            case 'plusvalia':
                html = renderPlusvalia(state);
                break;
            default:
                html = '<h2>Vista no encontrada</h2>';
        }

        container.innerHTML = html;

        // Auto-focus inputs if needed and setup local listeners
        setupInputListeners();
    }

    function setupNavigation() {
        navItems.forEach(item => {
            item.onclick = (e) => {
                const view = e.currentTarget.dataset.view;
                state.activeView = view;

                // Update active class in sidebar
                navItems.forEach(nav => nav.classList.remove('active'));
                e.currentTarget.classList.add('active');

                renderActiveView();
            };
        });
    }

    function setupInputListeners() {
        container.querySelectorAll('.form-input').forEach(input => {
            input.oninput = (e) => handleInputChange(e.target);
        });
    }

    function handleInputChange(el) {
        const key = el.dataset.key;
        const nested = el.dataset.nested;
        let val = el.value;

        if (!el.dataset.isText) {
            val = Number(val.replace(/[^0-9.-]+/g, ""));
        }

        if (nested && state[nested]) {
            state[nested][key] = val;
        } else {
            state[key] = val;
        }

        // Persist
        localStorage.setItem('lyl_state', JSON.stringify(state));

        // Debounced Re-render would be better, but for now:
        renderActiveView();
    }

    // --- Public Methods (State Mutators) ---

    function switchProyeccionTab(tab) {
        state.variables.activeProyeccionTab = tab;
        renderActiveView();
    }

    function switchParamTab(tab) {
        state.variables.activeParamTab = tab;
        renderActiveView();
    }

    function toggleAportaTerreno() {
        state.variables.aportaTerreno = !state.variables.aportaTerreno;
        renderActiveView();
    }

    function toggleTicketAportado(index) {
        state.tickets[index].esAportado = !state.tickets[index].esAportado;
        renderActiveView();
    }

    function addTicketTier() {
        state.tickets.push({
            id: Date.now(),
            cantidad: 0,
            precio: 0,
            nombre: "Nueva Fase",
            esAportado: false
        });
        renderActiveView();
    }

    function removeTicketTier(index) {
        state.tickets.splice(index, 1);
        renderActiveView();
    }

    function addShowroomItem() {
        if (!state.showroomItems) state.showroomItems = [];
        state.showroomItems.push({
            nombre: 'Nuevo Concepto',
            cantidad: 1,
            costo: 0
        });
        renderActiveView();
    }

    function removeShowroomItem(index) {
        state.showroomItems.splice(index, 1);
        renderActiveView();
    }

    return {
        init,
        renderActiveView,
        switchProyeccionTab,
        switchParamTab,
        toggleAportaTerreno,
        toggleTicketAportado,
        addTicketTier,
        removeTicketTier,
        addShowroomItem,
        removeShowroomItem
    };
})();

// Expose to window for HTML event handlers (onclick="App...")
window.App = App;

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', App.init);
export default App;
