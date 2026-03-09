import { state, DEFAULTS, setState, setScenarios, setRole } from './core/State.js';
import { renderDashboard } from './ui/DashboardView.js';
import { renderProyeccion } from './ui/ProyeccionView.js';
import { renderParametros, renderConstruccion, renderPlusvalia } from './ui/ConfigViews.js';

/**
 * Main Application Orchestrator
 */
const App = (() => {
    let container;
    let navItems;

    /**
     * Initialize Application
     */
    async function init() {
        console.log('Iniciando Aplicación Modular...');
        container = document.getElementById('content-body');
        navItems = document.querySelectorAll('.nav-item');

        if (!container) {
            console.error('Error: No se encontró el contenedor #content-body');
            return;
        }

        try {
            // Intentar cargar estado persistido
            const saved = localStorage.getItem('lyl_state');
            if (saved) setState(JSON.parse(saved));

            // Cargar rol desde login
            const auth = JSON.parse(localStorage.getItem('lyl_mock_auth') || '{}');
            if (auth.role) setRole(auth.role);

            // Sincronizar UI de rol
            syncRoleUI();

            // Configurar navegación
            setupNavigation();

            // Renderizar vista inicial
            renderActiveView();

        } catch (error) {
            console.error('Error durante la inicialización:', error);
        }
    }

    function syncRoleUI() {
        const badge = document.getElementById('user-role-badge');
        const layout = document.getElementById('app-layout');
        const role = (localStorage.getItem('lyl_mock_auth') ? JSON.parse(localStorage.getItem('lyl_mock_auth')).role : 'viewer') || 'viewer';

        if (badge) {
            badge.textContent = role === 'admin' ? 'ADMINISTRADOR' : 'LECTURA';
            badge.style.background = role === 'admin' ? '#2ecc71' : '#888';
        }

        if (layout) {
            layout.classList.toggle('role-viewer', role === 'viewer');
            layout.classList.toggle('role-admin', role === 'admin');
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

    function logout() {
        localStorage.removeItem('lyl_mock_auth');
        location.reload();
    }

    function toggleSidebar() {
        const app = document.getElementById('app-layout');
        if (app) {
            const collapsed = app.classList.toggle('sidebar-collapsed');
            localStorage.setItem('lil_sidebar_collapsed', collapsed ? '1' : '0');
        }
    }

    function resetState() {
        if (!confirm("¿Restablecer todos los valores a los parámetros base?")) return;
        setState(JSON.parse(JSON.stringify(DEFAULTS)));
        localStorage.removeItem('lyl_state');
        renderActiveView();
    }

    function exportCSV() {
        alert("Exportación CSV en preparación...");
    }

    function exportFullReport() {
        alert("Generación de Presentación PDF en preparación...");
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
        removeShowroomItem,
        logout,
        toggleSidebar,
        resetState,
        exportCSV,
        exportFullReport
    };
})();

// Expose to window for HTML event handlers (onclick="App...")
window.App = App;

// Initialize on DOM load
window.addEventListener('DOMContentLoaded', App.init);
export default App;
