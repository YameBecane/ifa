// =============================================
// MENU FLUTUANTE DE ACESSIBILIDADE - VERSÃO GLOBAL
// =============================================

(function() {
    "use strict";

    // ========== CONFIGURAÇÕES ==========
    const CONFIG = {
        position: 'bottom-left', // bottom-left, bottom-right, top-left, top-right
        icon: '⚙️',
        menuTitle: 'Acessibilidade',
        autoClose: true, // Fecha o menu após clicar em uma ação
        savePreferences: true, // Salva as preferências no localStorage
    };

    // ========== ESTILOS DINÂMICOS ==========
    function injectStyles() {
        const styles = `
            /* RESET E LAYOUT GLOBAL */
            .floating-menu-global {
                position: fixed;
                z-index: 9999;
                display: flex;
                flex-direction: column;
                align-items: flex-start;
                gap: 8px;
                font-family: system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif;
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
                border-radius: 40px;
                font-size: 28px;
                cursor: pointer;
                box-shadow: 0 8px 20px rgba(0, 0, 0, 0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                transition: 0.2s ease;
                border: 1px solid rgba(255, 255, 255, 0.08);
                position: relative;
            }

            .menu-toggle-global:hover {
                background: #0f172a;
                transform: scale(1.03);
                box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
            }

            .menu-toggle-global:active {
                transform: scale(0.94);
            }

            .menu-toggle-global .badge {
                position: absolute;
                top: -4px;
                right: -4px;
                background: #3b82f6;
                color: white;
                border-radius: 50%;
                width: 20px;
                height: 20px;
                font-size: 10px;
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
            }

            /* CONTAINER DOS BOTÕES */
            .menu-actions-global {
                display: flex;
                flex-direction: column;
                gap: 8px;
                background: rgba(255, 255, 255, 0.92);
                backdrop-filter: blur(12px);
                -webkit-backdrop-filter: blur(12px);
                padding: 14px 12px;
                border-radius: 24px;
                box-shadow: 0 12px 35px rgba(0, 0, 0, 0.15);
                border: 1px solid rgba(255, 255, 255, 0.3);
                min-width: 180px;
                transition: opacity 0.2s, transform 0.25s cubic-bezier(0.34, 1.56, 0.64, 1);
                transform-origin: bottom left;
                opacity: 0;
                pointer-events: none;
                transform: scale(0.9) translateY(12px);
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
            }

            /* TÍTULO DO MENU */
            .menu-title-global {
                font-size: 0.75rem;
                text-transform: uppercase;
                letter-spacing: 0.05em;
                color: #64748b;
                padding: 4px 8px 8px 8px;
                border-bottom: 1px solid rgba(0, 0, 0, 0.06);
                margin-bottom: 4px;
                font-weight: 600;
            }

            /* BOTÕES DE AÇÃO */
            .action-btn-global {
                background: transparent;
                border: none;
                padding: 10px 14px;
                border-radius: 60px;
                font-size: 0.95rem;
                font-weight: 500;
                text-align: left;
                display: flex;
                align-items: center;
                gap: 12px;
                color: #0f172a;
                transition: 0.15s;
                cursor: pointer;
                width: 100%;
                letter-spacing: -0.01em;
                border: 1px solid transparent;
                font-family: inherit;
            }

            .action-btn-global:hover {
                background: rgba(30, 41, 59, 0.07);
                border-color: rgba(30, 41, 59, 0.08);
            }

            .action-btn-global:active {
                background: rgba(30, 41, 59, 0.12);
                transform: scale(0.96);
            }

            .action-btn-global .icon {
                font-size: 1.2rem;
                width: 24px;
                text-align: center;
            }

            .action-btn-global .label {
                flex: 1;
            }

            .action-btn-global .shortcut {
                font-size: 0.7rem;
                color: #94a3b8;
                background: #f1f5f9;
                padding: 2px 8px;
                border-radius: 12px;
            }

            .divider-global {
                height: 1px;
                background: rgba(0, 0, 0, 0.06);
                margin: 4px 0 6px;
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
            body.high-contrast-global h4 {
                color: #f0f6ff !important;
            }

            body.high-contrast-global p,
            body.high-contrast-global li,
            body.high-contrast-global span {
                color: #d0d9e8 !important;
            }

            body.high-contrast-global a {
                color: #8bb3ff !important;
            }

            body.high-contrast-global .menu-toggle-global {
                background: #e8edf5 !important;
                color: #0b0d10 !important;
                border-color: #9aaec9 !important;
            }

            body.high-contrast-global .menu-actions-global {
                background: rgba(22, 27, 34, 0.95) !important;
                border-color: #3d4b5e !important;
            }

            body.high-contrast-global .action-btn-global {
                color: #e8edf5 !important;
            }

            body.high-contrast-global .action-btn-global:hover {
                background: rgba(255, 255, 255, 0.08) !important;
                border-color: rgba(255, 255, 255, 0.15) !important;
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
                font-size: 2.4rem !important;
            }
            body.font-large-global h2 {
                font-size: 2rem !important;
            }
            body.font-large-global p {
                font-size: 1.2rem !important;
            }
            body.font-large-global .action-btn-global {
                font-size: 1.05rem !important;
            }

            body.font-small-global {
                font-size: 0.85rem !important;
            }

            body.font-small-global h1 {
                font-size: 1.6rem !important;
            }
            body.font-small-global h2 {
                font-size: 1.3rem !important;
            }
            body.font-small-global p {
                font-size: 0.85rem !important;
            }
            body.font-small-global .action-btn-global {
                font-size: 0.8rem !important;
            }

            /* ===== RESPONSIVO ===== */
            @media (max-width: 480px) {
                .floating-menu-global {
                    bottom: 18px !important;
                    left: 18px !important;
                    right: auto !important;
                    top: auto !important;
                }
                .menu-toggle-global {
                    width: 52px !important;
                    height: 52px !important;
                    font-size: 24px !important;
                }
                .menu-actions-global {
                    min-width: 160px !important;
                    padding: 12px 10px !important;
                }
                .action-btn-global {
                    font-size: 0.85rem !important;
                    padding: 8px 12px !important;
                }
                .action-btn-global .shortcut {
                    display: none !important;
                }
            }

            /* ===== ANIMAÇÃO DE ENTRADA ===== */
            @keyframes slideUp {
                from {
                    opacity: 0;
                    transform: translateY(20px) scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: translateY(0) scale(1);
                }
            }

            .floating-menu-global {
                animation: slideUp 0.3s ease-out;
            }
        `;

        const styleSheet = document.createElement('style');
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }

    // ========== CRIA O MENU ==========
    function createMenu() {
        // Verifica se já existe
        if (document.querySelector('.floating-menu-global')) {
            return;
        }

        const menuHTML = `
            <div class="floating-menu-global ${CONFIG.position}">
                <button class="menu-toggle-global" id="menuToggleGlobal" aria-label="Menu de acessibilidade">
                    ${CONFIG.icon}
                    <span class="badge" id="menuBadge">✨</span>
                </button>
                <div class="menu-actions-global" id="menuActionsGlobal">
                    <div class="menu-title-global">${CONFIG.menuTitle}</div>
                    
                    <button class="action-btn-global" data-action="increase-font">
                        <span class="icon">🔍+</span>
                        <span class="label">Aumentar fonte</span>
                        <span class="shortcut">A</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="decrease-font">
                        <span class="icon">🔍−</span>
                        <span class="label">Diminuir fonte</span>
                        <span class="shortcut">D</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="reset-font">
                        <span class="icon">🔍</span>
                        <span class="label">Fonte padrão</span>
                        <span class="shortcut">R</span>
                    </button>
                    
                    <div class="divider-global"></div>
                    
                    <button class="action-btn-global" data-action="high-contrast">
                        <span class="icon">🌓</span>
                        <span class="label">Alto contraste</span>
                        <span class="shortcut">C</span>
                    </button>
                    
                    <button class="action-btn-global" data-action="reset-all">
                        <span class="icon">↺</span>
                        <span class="label">Restaurar tudo</span>
                        <span class="shortcut">Esc</span>
                    </button>
                </div>
            </div>
        `;

        // Insere o menu no final do body
        document.body.insertAdjacentHTML('beforeend', menuHTML);
    }

    // ========== INICIALIZA O MENU ==========
    function initMenu() {
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

        if (!menuToggle || !menuActions) return;

        let menuOpen = false;

        // ===== FUNÇÕES DE ACESSIBILIDADE =====
        function resetAllStyles() {
            body.classList.remove('font-large-global', 'font-small-global', 'high-contrast-global');
            body.style.fontSize = '';
            updateBadge('✨');
        }

        function increaseFont() {
            body.classList.remove('font-small-global');
            if (!body.classList.contains('font-large-global')) {
                body.classList.add('font-large-global');
                updateBadge('🔍+');
            }
        }

        function decreaseFont() {
            body.classList.remove('font-large-global');
            if (!body.classList.contains('font-small-global')) {
                body.classList.add('font-small-global');
                updateBadge('🔍−');
            }
        }

        function resetFont() {
            body.classList.remove('font-large-global', 'font-small-global');
            updateBadge('🔍');
        }

        function toggleHighContrast() {
            body.classList.toggle('high-contrast-global');
            updateBadge(body.classList.contains('high-contrast-global') ? '🌓' : '✨');
        }

        function updateBadge(text) {
            if (badge) {
                badge.textContent = text;
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
        }

        // ===== EVENTOS =====
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
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                if (!menuOpen) toggleMenu();
                return;
            }

            // Esc = Fechar menu e restaurar
            if (e.key === 'Escape' && menuOpen) {
                toggleMenu();
                return;
            }

            // Atalhos apenas se o menu estiver aberto
            if (menuOpen) {
                switch(e.key.toLowerCase()) {
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
                };
                localStorage.setItem('accessibility_preferences', JSON.stringify(prefs));
            } catch (e) {
                // localStorage indisponível
            }
        }

        // ===== CARREGAR PREFERÊNCIAS =====
        function loadPreferences() {
            if (!CONFIG.savePreferences) return;

            try {
                const saved = localStorage.getItem('accessibility_preferences');
                if (!saved) return;

                const prefs = JSON.parse(saved);
                
                if (prefs.fontLarge) body.classList.add('font-large-global');
                if (prefs.fontSmall) body.classList.add('font-small-global');
                if (prefs.highContrast) body.classList.add('high-contrast-global');

                // Atualiza badge
                if (prefs.highContrast) {
                    updateBadge('🌓');
                } else if (prefs.fontLarge) {
                    updateBadge('🔍+');
                } else if (prefs.fontSmall) {
                    updateBadge('🔍−');
                } else {
                    updateBadge('✨');
                }
            } catch (e) {
                // Erro ao carregar preferências
            }
        }

        // ===== INICIALIZA =====
        resetAllStyles(); // Limpa qualquer estilo residual
        loadPreferences(); // Carrega preferências salvas
    }

    // ========== EXECUTA QUANDO O DOM ESTIVER PRONTO ==========
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initMenu);
    } else {
        initMenu();
    }

})();
