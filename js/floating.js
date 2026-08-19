// =============================================
// MENU FLUTUANTE DE ACESSIBILIDADE - VERSÃO GLOBAL
// ARQUIVO: js/floating.js
// =============================================

(function() {
    "use strict";

    // ========== CONFIGURAÇÕES ==========
    const CONFIG = {
        position: 'bottom-left',     // bottom-left, bottom-right, top-left, top-right
        icon: '⚙️',                  // Ícone do botão
        menuTitle: 'Acessibilidade', // Título do menu
        autoClose: true,             // Fecha o menu após clicar em uma ação
        savePreferences: true,       // Salva as preferências no localStorage
        debug: false,                // Ativa logs de debug
    };

    // ========== LOG DE DEBUG ==========
    function log(message, data) {
        if (CONFIG.debug) {
            console.log(`[Floating Menu] ${message}`, data || '');
        }
    }

    // ========== ESTILOS DINÂMICOS ==========
    function injectStyles() {
        log('Injetando estilos...');
        
        const styles = `
            /* ============================================
               MENU FLUTUANTE - ESTILOS GLOBAIS
               ============================================ */

            /* CONTAINER PRINCIPAL */
            .floating-menu-global {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, sans-serif;
                animation: floatingMenuSlideUp 0.3s ease-out;
            }

            /* POSIÇÕES */
            .floating-menu-global.bottom-left {
                bottom: 28px;
                left: 28px;
            }
            .floating-menu-global.bottom-right {
                bottom: 28px;
                right: 28px;
                align-items: flex-end;
            }
            .floating-menu-global.top-left {
                top: 28px;
                left: 28px;
            }
            .floating-menu-global.top-right {
                top: 28px;
                right: 28px;
                align-items: flex-end;
            }

            /* BOTÃO TOGGLE */
            .menu-toggle-global {
                background: #1e293b;
                color: white;
                border: none;
                width: 58px;
                height: 58px;
                border-radius: 50%;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: all 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                border: 2px solid rgba(255, 255, 255, 0.1);
                position: relative;
                user-select: none;
                -webkit-tap-highlight-color: transparent;
            }

            .menu-toggle-global:hover {
                background: #0f172a;
                transform: scale(1.05);
                box-shadow: 0 12px 30px rgba(0, 0, 0, 0.3);
                border-color: rgba(255, 255, 255, 0.2);
            }

            .menu-toggle-global:active {
                transform: scale(0.92);
            }

            .menu-toggle-global .badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: #3b82f6;
                color: white;
                border-radius: 50%;
                width: 22px;
                height: 22px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                box-shadow: 0 2px 8px rgba(59, 130, 246, 0.4);
                transition: all 0.3s ease;
            }

            .menu-toggle-global .badge.active {
                background: #8b5cf6;
                animation: badgePulse 1.5s ease-in-out infinite;
            }

            /* CONTAINER DOS BOTÕES */
            .menu-actions-global {
                display: flex;
                flex-direction: column;
                gap: 6px;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(16px);
                -webkit-backdrop-filter: blur(16px);
                padding: 12px 10px;
                border-radius: 20px;
                box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.4);
                min-width: 190px;
                transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform-origin: bottom left;
                opacity: 0;
                pointer-events: none;
                transform: scale(0.85) translateY(16px);
                max-height: 0;
                overflow: hidden;
                padding: 0 10px;
            }

            .floating-menu-global.bottom-right .menu-actions-global {
                transform-origin: bottom right;
            }
            .floating-menu-global.top-left .menu-actions-global {
                transform-origin: top left;
            }
            .floating-menu-global.top-right .menu-actions-global {
                transform-origin: top right;
            }

            .menu-actions-global.open {
                opacity: 1;
                pointer-events: auto;
                transform: scale(1) translateY(0);
                max-height: 500px;
                padding: 12px 10px;
                overflow: visible;
            }

            /* TÍTULO DO MENU */
            .menu-title-global {
                font-size: 0.7rem;
                text-transform: uppercase;
                letter-spacing: 0.08em;
                color: #94a3b8;
                padding: 4px 8px 8px 8px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                margin-bottom: 4px;
                font-weight: 600;
            }

            /* BOTÕES DE AÇÃO */
            .action-btn-global {
                background: transparent;
                border: none;
                padding: 9px 12px;
                border-radius: 12px;
                font-size: 0.9rem;
                font-weight: 500;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 12px;
                color: #0f172a;
                transition: all 0.15s ease;
                cursor: pointer;
                width: 100%;
                letter-spacing: -0.01em;
                border: 1px solid transparent;
                font-family: inherit;
                position: relative;
            }

            .action-btn-global:hover {
                background: rgba(30, 41, 59, 0.06);
                border-color: rgba(30, 41, 59, 0.08);
                transform: translateX(2px);
            }

            .action-btn-global:active {
                background: rgba(30, 41, 59, 0.12);
                transform: scale(0.96);
            }

            .action-btn-global .icon {
                font-size: 1.1rem;
                width: 24px;
                text-align: center;
                flex-shrink: 0;
            }

            .action-btn-global .label {
                flex: 1;
                font-size: 0.9rem;
            }

            .action-btn-global .shortcut {
                font-size: 0.65rem;
                color: #94a3b8;
                background: #f1f5f9;
                padding: 2px 8px;
                border-radius: 10px;
                font-weight: 600;
                letter-spacing: 0.02em;
            }

            .divider-global {
                height: 1px;
                background: rgba(0, 0, 0, 0.06);
                margin: 4px 0 6px;
            }

            /* ===== ANIMAÇÕES ===== */
            @keyframes floatingMenuSlideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            @keyframes badgePulse {
                0%, 100% { transform: scale(1); }
                50% { transform: scale(1.1); }
            }

            /* ===== MODO ALTO CONTRASTE ===== */
            body.high-contrast-global {
                background: #0b0d10 !important;
                color: #e8edf5 !important;
            }

            body.high-contrast-global * {
                border-color: #3d4b5e !important;
            }

            body.high-contrast-global .content,
            body.high-contrast-global main,
            body.high-contrast-global article,
            body.high-contrast-global section,
            body.high-contrast-global div:not(.floating-menu-global):not(.menu-actions-global) {
                background: #161b22 !important;
                color: #e8edf5 !important;
            }

            body.high-contrast-global h1,
            body.high-contrast-global h2,
            body.high-contrast-global h3,
            body.high-contrast-global h4,
            body.high-contrast-global h5,
            body.high-contrast-global h6 {
                color: #f0f6ff !important;
            }

            body.high-contrast-global p,
            body.high-contrast-global li,
            body.high-contrast-global span:not(.badge):not(.shortcut):not(.icon) {
                color: #d0d9e8 !important;
            }

            body.high-contrast-global a {
                color: #8bb3ff !important;
                text-decoration-color: #8bb3ff !important;
            }

            body.high-contrast-global .menu-toggle-global {
                background: #e8edf5 !important;
                color: #0b0d10 !important;
                border-color: #9aaec9 !important;
            }

            body.high-contrast-global .menu-toggle-global:hover {
                background: #ffffff !important;
            }

            body.high-contrast-global .menu-actions-global {
                background: rgba(22, 27, 34, 0.96) !important;
                border-color: #3d4b5e !important;
            }

            body.high-contrast-global .action-btn-global {
                color: #e8edf5 !important;
            }

            body.high-contrast-global .action-btn-global:hover {
                background: rgba(255, 255, 255, 0.08) !important;
                border-color: rgba(255, 255, 255, 0.15) !important;
            }

            body.high-contrast-global .action-btn-global:active {
                background: rgba(255, 255, 255, 0.15) !important;
            }

            body.high-contrast-global .divider-global {
                background: rgba(255, 255, 255, 0.1) !important;
            }

            body.high-contrast-global .menu-title-global {
                color: #94a3b8 !important;
                border-bottom-color: rgba(255, 255, 255, 0.1) !important;
            }

            body.high-contrast-global .action-btn-global .shortcut {
                background: #2d3a4b !important;
                color: #b0c4e0 !important;
            }

            /* ===== FONTES ===== */
            body.font-large-global {
                font-size: 1.2rem !important;
            }

            body.font-large-global h1 {
                font-size: 2.6rem !important;
            }
            body.font-large-global h2 {
                font-size: 2.2rem !important;
            }
            body.font-large-global h3 {
                font-size: 1.8rem !important;
            }
            body.font-large-global p {
                font-size: 1.2rem !important;
                line-height: 1.7 !important;
            }
            body.font-large-global .action-btn-global {
                font-size: 1.05rem !important;
            }
            body.font-large-global .action-btn-global .label {
                font-size: 1.05rem !important;
            }

            body.font-small-global {
                font-size: 0.82rem !important;
            }

            body.font-small-global h1 {
                font-size: 1.6rem !important;
            }
            body.font-small-global h2 {
                font-size: 1.3rem !important;
            }
            body.font-small-global h3 {
                font-size: 1.1rem !important;
            }
            body.font-small-global p {
                font-size: 0.82rem !important;
                line-height: 1.5 !important;
            }
            body.font-small-global .action-btn-global {
                font-size: 0.78rem !important;
            }
            body.font-small-global .action-btn-global .label {
                font-size: 0.78rem !important;
            }

            /* ===== RESPONSIVO ===== */
            @media (max-width: 768px) {
                .floating-menu-global {
                    bottom: 20px !important;
                    left: 20px !important;
                    right: auto !important;
                    top: auto !important;
                }
                .menu-toggle-global {
                    width: 54px !important;
                    height: 54px !important;
                    font-size: 24px !important;
                }
                .menu-actions-global {
                    min-width: 170px !important;
                    padding: 10px 8px !important;
                }
                .menu-actions-global.open {
                    padding: 10px 8px !important;
                }
                .action-btn-global {
                    font-size: 0.85rem !important;
                    padding: 8px 10px !important;
                }
                .action-btn-global .label {
                    font-size: 0.85rem !important;
                }
                .action-btn-global .shortcut {
                    display: none !important;
                }
            }

            @media (max-width: 480px) {
                .floating-menu-global {
                    bottom: 16px !important;
                    left: 16px !important;
                }
                .menu-toggle-global {
                    width: 48px !important;
                    height: 48px !important;
                    font-size: 20px !important;
                }
                .menu-toggle-global .badge {
                    width: 18px !important;
                    height: 18px !important;
                    font-size: 8px !important;
                    top: -2px !important;
                    right: -2px !important;
                }
                .menu-actions-global {
                    min-width: 150px !important;
                    padding: 8px 6px !important;
                    border-radius: 16px !important;
                }
                .menu-actions-global.open {
                    padding: 8px 6px !important;
                }
                .action-btn-global {
                    font-size: 0.8rem !important;
                    padding: 6px 8px !important;
                    gap: 8px !important;
                    border-radius: 10px !important;
                }
                .action-btn-global .label {
                    font-size: 0.8rem !important;
                }
                .action-btn-global .icon {
                    font-size: 0.95rem !important;
                    width: 20px !important;
                }
                .menu-title-global {
                    font-size: 0.6rem !important;
                    padding: 2px 6px 6px 6px !important;
                }
            }

            /* ===== SCROLLBAR PERSONALIZADA (opcional) ===== */
            .menu-actions-global::-webkit-scrollbar {
                width: 4px;
            }
            .menu-actions-global::-webkit-scrollbar-track {
                background: transparent;
            }
            .menu-actions-global::-webkit-scrollbar-thumb {
                background: #cbd5e1;
                border-radius: 10px;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        styleSheet.id = 'floating-menu-styles';
        document.head.appendChild(styleSheet);
        
        log('Estilos injetados com sucesso');
    }

    // ========== CRIA O MENU ==========
    function createMenu() {
        // Verifica se já existe
        if (document.querySelector('.floating-menu-global')) {
            log('Menu já existe, abortando criação');
            return;
        }

        log('Criando menu...');

        const menuHTML = `
            <div class="floating-menu-global ${CONFIG.position}" role="navigation" aria-label="Menu de acessibilidade">
                <button class="menu-toggle-global" id="menuToggleGlobal" 
                        aria-label="Menu de acessibilidade" 
                        aria-expanded="false"
                        title="Menu de acessibilidade (Ctrl+Shift+A)">
                    ${CONFIG.icon}
                    <span class="badge" id="menuBadge" aria-hidden="true">✨</span>
                </button>
                <div class="menu-actions-global" id="menuActionsGlobal" role="menu">
                    <div class="menu-title-global" aria-hidden="true">${CONFIG.menuTitle}</div>
                    
                    <button class="action-btn-global" data-action="increase-font" role="menuitem">
                        <span class="icon" aria-hidden="true">🔍+</span>
                        <span class="label">Aumentar fonte</span>
                        <span class="shortcut">A</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="decrease-font" role="menuitem">
                        <span class="icon" aria-hidden="true">🔍−</span>
                        <span class="label">Diminuir fonte</span>
                        <span class="shortcut">D</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="reset-font" role="menuitem">
                        <span class="icon" aria-hidden="true">🔍</span>
                        <span class="label">Fonte padrão</span>
                        <span class="shortcut">R</span>
                    </button>
                    
                    <div class="divider-global" role="separator"></div>
                    
                    <button class="action-btn-global" data-action="high-contrast" role="menuitem">
                        <span class="icon" aria-hidden="true">🌓</span>
                        <span class="label">Alto contraste</span>
                        <span class="shortcut">C</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="reset-all" role="menuitem">
                        <span class="icon" aria-hidden="true">↺</span>
                        <span class="label">Restaurar tudo</span>
                        <span class="shortcut">Esc</span>
                    </button>
                </div>
            </div>
        `;

        // Insere o menu no final do body
        document.body.insertAdjacentHTML('beforeend', menuHTML);
        log('Menu criado com sucesso');
    }

    // ========== INICIALIZA O MENU ==========
    function initMenu() {
        log('Inicializando menu flutuante...');

        // Verifica se o DOM está pronto
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function() {
                initMenu();
            });
            return;
        }

        // Injeta estilos
        injectStyles();

        // Cria o menu
        createMenu();

        // ===== REFERÊNCIAS =====
        const body = document.body;
        const menuToggle = document.getElementById('menuToggleGlobal');
        const menuActions = document.getElementById('menuActionsGlobal');
        const menuContainer = document.querySelector('.floating-menu-global');
        const badge = document.getElementById('menuBadge');

        if (!menuToggle || !menuActions) {
            log('Erro: Elementos do menu não encontrados');
            return;
        }

        let menuOpen = false;

        // ===== FUNÇÕES DE ACESSIBILIDADE =====
        function resetAllStyles() {
            body.classList.remove('font-large-global', 'font-small-global', 'high-contrast-global');
            body.style.fontSize = '';
            updateBadge('✨');
            log('Todos os estilos resetados');
        }

        function increaseFont() {
            body.classList.remove('font-small-global');
            if (!body.classList.contains('font-large-global')) {
                body.classList.add('font-large-global');
                updateBadge('🔍+');
                log('Fonte aumentada');
            } else {
                log('Fonte já está no tamanho máximo');
            }
        }

        function decreaseFont() {
            body.classList.remove('font-large-global');
            if (!body.classList.contains('font-small-global')) {
                body.classList.add('font-small-global');
                updateBadge('🔍−');
                log('Fonte diminuída');
            } else {
                log('Fonte já está no tamanho mínimo');
            }
        }

        function resetFont() {
            body.classList.remove('font-large-global', 'font-small-global');
            updateBadge('🔍');
            log('Fonte resetada para o padrão');
        }

        function toggleHighContrast() {
            body.classList.toggle('high-contrast-global');
            const isActive = body.classList.contains('high-contrast-global');
            updateBadge(isActive ? '🌓' : '✨');
            log(`Alto contraste ${isActive ? 'ativado' : 'desativado'}`);
        }

        function updateBadge(text) {
            if (badge) {
                badge.textContent = text;
                if (text === '🌓') {
                    badge.classList.add('active');
                } else {
                    badge.classList.remove('active');
                }
            }
        }

        // ===== MAPEAMENTO DE AÇÕES =====
        const actionMap = {
            'increase-font': increaseFont,
            'decrease-font': decreaseFont,
            'reset-font': resetFont,
            'high-contrast': toggleHighContrast,
            'reset-all': resetAllStyles,
        };

        // ===== TOGGLE MENU =====
        function toggleMenu() {
            menuOpen = !menuOpen;
            menuActions.classList.toggle('open', menuOpen);
            menuToggle.setAttribute('aria-expanded', menuOpen);
            menuToggle.style.transform = menuOpen ? 'rotate(60deg)' : 'rotate(0deg)';
            log(`Menu ${menuOpen ? 'aberto' : 'fechado'}`);
        }

        // ===== EVENTOS =====
        // Toggle do menu
        menuToggle.addEventListener('click', function(e) {
            e.stopPropagation();
            toggleMenu();
        });

        // Fecha ao clicar fora
        document.addEventListener('click', function(e) {
            if (menuOpen && menuContainer && !menuContainer.contains(e.target)) {
                toggleMenu();
            }
        });

        // Fecha ao pressionar ESC
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && menuOpen) {
                toggleMenu();
            }
        });

        // Ações dos botões
        menuActions.addEventListener('click', function(e) {
            const btn = e.target.closest('.action-btn-global');
            if (!btn) return;

            const action = btn.dataset.action;
            if (action && actionMap[action]) {
                actionMap[action]();

                // Fecha o menu após ação (se configurado)
                if (CONFIG.autoClose && menuOpen) {
                    toggleMenu();
                }

                // Salva preferências (se configurado)
                if (CONFIG.savePreferences) {
                    savePreferences();
                }
            }
        });

        // ===== ATALHOS DO TECLADO =====
        document.addEventListener('keydown', function(e) {
            // Ctrl+Shift+A = Abrir menu
            if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
                e.preventDefault();
                if (!menuOpen) toggleMenu();
                return;
            }

            // Atalhos apenas se o menu estiver aberto
            if (menuOpen) {
                const key = e.key.toLowerCase();
                switch(key) {
                    case 'a':
                        e.preventDefault();
                        increaseFont();
                        if (CONFIG.autoClose) toggleMenu();
                        break;
                    case 'd':
                        e.preventDefault();
                        decreaseFont();
                        if (CONFIG.autoClose) toggleMenu();
                        break;
                    case 'r':
                        e.preventDefault();
                        resetFont();
                        if (CONFIG.autoClose) toggleMenu();
                        break;
                    case 'c':
                        e.preventDefault();
                        toggleHighContrast();
                        if (CONFIG.autoClose) toggleMenu();
                        break;
                    case 'escape':
                        // Já tratado acima
                        break;
                }
            }
        });

        // ===== SALVAR PREFERÊNCIAS =====
        function savePreferences() {
            try {
                const prefs = {
                    fontLarge: body.classList.contains('font-large-global'),
                    fontSmall: body.classList.contains('font-small-global'),
                    highContrast: body.classList.contains('high-contrast-global'),
                    timestamp: Date.now()
                };
                localStorage.setItem('floating_menu_preferences', JSON.stringify(prefs));
                log('Preferências salvas', prefs);
            } catch (e) {
                log('Erro ao salvar preferências:', e);
            }
        }

        // ===== CARREGAR PREFERÊNCIAS =====
        function loadPreferences() {
            if (!CONFIG.savePreferences) {
                log('Salvamento de preferências desabilitado');
                return;
            }

            try {
                const saved = localStorage.getItem('floating_menu_preferences');
                if (!saved) {
                    log('Nenhuma preferência salva encontrada');
                    return;
                }

                const prefs = JSON.parse(saved);
                log('Preferências carregadas', prefs);
                
                if (prefs.fontLarge) {
                    body.classList.add('font-large-global');
                    updateBadge('🔍+');
                }
                if (prefs.fontSmall) {
                    body.classList.add('font-small-global');
                    updateBadge('🔍−');
                }
                if (prefs.highContrast) {
                    body.classList.add('high-contrast-global');
                    updateBadge('🌓');
                }

                // Se nenhuma preferência ativa, badge padrão
                if (!prefs.fontLarge && !prefs.fontSmall && !prefs.highContrast) {
                    updateBadge('✨');
                }

                log('Preferências aplicadas com sucesso');
            } catch (e) {
                log('Erro ao carregar preferências:', e);
            }
        }

        // ===== INICIALIZA =====
        resetAllStyles(); // Limpa qualquer estilo residual
        loadPreferences(); // Carrega preferências salvas


        log('Inicialização concluída');
    }

    // ========== EXECUTA ==========
    initMenu();

})();
