// Gerencia favoritos usando localStorage (apenas IDs)
// Chave utilizada: "favoritos"

const FAVORITOS_KEY = 'favoritos';
let favoritosSet = new Set();

// Carrega favoritos do localStorage para um Set em memória (rápido para >1000 itens)
function loadFavoritos() {
    try {
        const raw = localStorage.getItem(FAVORITOS_KEY);
        if (raw) {
            const arr = JSON.parse(raw);
            if (Array.isArray(arr)) {
                favoritosSet = new Set(arr.map(Number));
            }
        }
    } catch (err) {
        console.error('Erro ao carregar favoritos do localStorage:', err);
        favoritosSet = new Set();
    }
}

// Persiste o Set atual no localStorage como array
function saveFavoritos() {
    try {
        const arr = Array.from(favoritosSet);
        localStorage.setItem(FAVORITOS_KEY, JSON.stringify(arr));
    } catch (err) {
        console.error('Erro ao salvar favoritos no localStorage:', err);
    }
}

// Retorna true se o ID estiver favoritado
function isFavorito(idPokemon) {
    return favoritosSet.has(Number(idPokemon));
}

// Alterna estado do favorito (adiciona/remove) e atualiza localStorage
function toggleFavorito(idPokemon) {
    const id = Number(idPokemon);
    if (favoritosSet.has(id)) {
        favoritosSet.delete(id);
    } else {
        favoritosSet.add(id);
    }
    saveFavoritos();

    // Notifica a aplicação (opcional) que um favorito foi atualizado
    try {
        document.dispatchEvent(new CustomEvent('favoritosUpdated', { detail: { id, isFavorito: favoritosSet.has(id) } }));
    } catch (e) {
        // ignore
    }
}

// Retorna array de IDs favoritados
function getFavoritos() {
    return Array.from(favoritosSet);
}

// Inicializa ao carregar o script
loadFavoritos();

// Tornar as funções disponíveis globalmente
window.isFavorito = isFavorito;
window.toggleFavorito = toggleFavorito;
window.getFavoritos = getFavoritos;

// Comentário: usar o evento 'favoritosUpdated' permite atualizar UI externa se necessário
