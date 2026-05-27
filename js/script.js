// ============================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================

const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';
const POKEMON_COUNT = 1028; // Quantidade de pokémons a listar

// Elementos do DOM
const pokemonGrid = document.getElementById('pokemonGrid');
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const searchInput = document.getElementById('searchInput');
const clearButton = document.getElementById('clearButton');

// Variável para armazenar todos os pokémons carregados
let allPokemons = [];
// Estado atual do filtro: 'all' ou 'favorites'
let currentFilter = 'all';

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Cria um card de pokémon
 * @param {Object} pokemon - Dados do pokémon
 * @returns {HTMLElement} - Elemento do card
 */
function createPokemonCard(pokemon) {
    const col = document.createElement('div');
    col.className = 'col-12 col-sm-6 col-md-4 col-lg-3';
    col.dataset.id = String(pokemon.id);

    const card = document.createElement('div');
    card.className = 'card pokemon-card h-100';
    card.style.cursor = 'pointer';

    // Imagem
    const imageDiv = document.createElement('div');
    imageDiv.className = 'pokemon-card-image';
    const img = document.createElement('img');
    img.src = pokemon.image;
    img.alt = pokemon.name;
    imageDiv.appendChild(img);

    // Botão de favorito (⭐) - fica sobre a imagem
    // Usa as funções globais isFavorito / toggleFavorito definidas em js/favoritos.js
    const favBtn = document.createElement('button');
    favBtn.className = 'fav-btn';
    favBtn.type = 'button';
    favBtn.title = 'Favoritar';
    // Estado inicial baseado no localStorage
    const ativo = typeof isFavorito === 'function' ? isFavorito(pokemon.id) : false;
    favBtn.textContent = ativo ? '★' : '☆';
    if (ativo) favBtn.classList.add('active');

    // Clique no botão de favorito não deve navegar para detalhes
    favBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (typeof toggleFavorito === 'function') {
            toggleFavorito(pokemon.id);
        }
        const novoEstado = typeof isFavorito === 'function' ? isFavorito(pokemon.id) : false;
        favBtn.classList.toggle('active', novoEstado);
        favBtn.textContent = novoEstado ? '★' : '☆';
    });

    imageDiv.appendChild(favBtn);

    // Corpo do Card
    const body = document.createElement('div');
    body.className = 'pokemon-card-body';
    
    const name = document.createElement('p');
    name.className = 'pokemon-card-name';
    name.textContent = pokemon.name;
    
    const id = document.createElement('p');
    id.className = 'pokemon-card-id';
    id.textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    
    const height = document.createElement('p');
    height.className = 'pokemon-card-info';
    height.textContent = `Altura: ${pokemon.height != null ? convertHeight(pokemon.height) : '—'}`;

    const weight = document.createElement('p');
    weight.className = 'pokemon-card-info';
    weight.textContent = `Peso: ${pokemon.weight != null ? convertWeight(pokemon.weight) : '—'}`;

    const types = document.createElement('p');
    types.className = 'pokemon-card-info';
    types.textContent = `Tipo: ${Array.isArray(pokemon.types) && pokemon.types.length > 0 ? pokemon.types.join(', ') : '—'}`;
    
    body.appendChild(name);
    body.appendChild(id);
    body.appendChild(types);
    body.appendChild(height);
    body.appendChild(weight);

    card.appendChild(imageDiv);
    card.appendChild(body);
    col.appendChild(card);

    // Adicionar evento de clique
    card.addEventListener('click', () => {
        sessionStorage.setItem('selectedPokemon', JSON.stringify(pokemon));
        window.location.href = `detalhes.html?id=${pokemon.id}`;
    });

    return col;
}

// Mostra apenas os pokémons favoritados
function mostrarFavoritos() {
    currentFilter = 'favorites';
    // Ler IDs dos favoritos via getFavoritos() (fornecido por favoritos.js)
    const favIds = (typeof getFavoritos === 'function') ? getFavoritos() : [];

    if (!Array.isArray(favIds) || favIds.length === 0) {
        pokemonGrid.innerHTML = '';
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-12 text-center py-5';
        emptyMessage.innerHTML = `
            <p class="text-muted fs-5">Nenhum Pokémon favoritado</p>
        `;
        pokemonGrid.appendChild(emptyMessage);
        return;
    }

    // Filtrar os pokémons já carregados sem chamar a API novamente
    const favSet = new Set(favIds.map(Number));
    const filtered = allPokemons.filter(p => favSet.has(Number(p.id)));
    renderPokemonCards(filtered);
}

// Restaura exibição de todos os pokémons
function mostrarTodos() {
    currentFilter = 'all';
    renderPokemonCards(allPokemons);
}

// Atualiza o botão de favorito em um card existente sem re-render completo
function updateCardFavoriteState(id) {
    const col = pokemonGrid.querySelector(`[data-id="${id}"]`);
    if (!col) return;
    const favBtn = col.querySelector('.fav-btn');
    if (!favBtn) return;
    const ativo = (typeof isFavorito === 'function') ? isFavorito(id) : false;
    favBtn.classList.toggle('active', ativo);
    favBtn.textContent = ativo ? '★' : '☆';
}

// Ouvir evento disparado por favoritos.js quando um favorito é atualizado
document.addEventListener('favoritosUpdated', (e) => {
    const { id } = e.detail || {};
    // Se estamos mostrando apenas favoritos, refazer a lista para refletir remoções
    if (currentFilter === 'favorites') {
        mostrarFavoritos();
    } else {
        // Apenas atualiza o botão no card correspondente
        updateCardFavoriteState(id);
    }
});

/**
 * Exibe a mensagem de carregamento
 */
function showLoading() {
    loadingIndicator.style.display = 'block';
    errorMessage.classList.add('d-none');
    pokemonGrid.innerHTML = '';
}

/**
 * Oculta a mensagem de carregamento
 */
function hideLoading() {
    loadingIndicator.style.display = 'none';
}

/**
 * Exibe mensagem de erro
 * @param {string} message - Mensagem de erro
 */
function showError(message) {
    hideLoading();
    errorText.textContent = message;
    errorMessage.classList.remove('d-none');
    pokemonGrid.innerHTML = '';
}

/**
 * Formata o nome do pokémon (primeira letra maiúscula)
 * @param {string} name - Nome a formatar
 * @returns {string} - Nome formatado
 */
function formatPokemonName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

function convertHeight(height) {
    return (height / 10).toFixed(1) + ' m';
}

function convertWeight(weight) {
    return (weight / 10).toFixed(1) + ' kg';
}

/**
 * Obtém a URL da imagem oficial do pokémon
 * @param {number} id - ID do pokémon
 * @returns {string} - URL da imagem
 */
function getPokemonImageUrl(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

// ============================================
// FUNÇÕES DE PESQUISA
// ============================================

/**
 * Filtra os pokémons com base no termo de busca
 * Busca por nome ou ID
 * @param {string} searchTerm - Termo de busca
 * @returns {Array} - Array de pokémons filtrados
 */
function filterPokemons(searchTerm) {
    if (!searchTerm.trim()) {
        return allPokemons;
    }

    const lowerSearchTerm = searchTerm.toLowerCase().trim();

    return allPokemons.filter(pokemon => {
        // Buscar por nome
        const nameMatch = pokemon.name.toLowerCase().includes(lowerSearchTerm);
        
        // Buscar por ID
        const idMatch = String(pokemon.id).includes(lowerSearchTerm);

        return nameMatch || idMatch;
    });
}

/**
 * Renderiza pokémons filtrados e atualiza o grid
 * Exibe mensagem se nenhum pokémon foi encontrado
 */
function handleSearch() {
    const searchTerm = searchInput.value;
    const filteredPokemons = filterPokemons(searchTerm);

    if (filteredPokemons.length === 0) {
        pokemonGrid.innerHTML = '';
        const emptyMessage = document.createElement('div');
        emptyMessage.className = 'col-12 text-center py-5';
        emptyMessage.innerHTML = `
            <p class="text-muted fs-5">
                <i class="bi bi-search"></i> Nenhum pokémon encontrado para "<strong>${searchTerm}</strong>"
            </p>
            <small class="text-muted">Tente buscar por outro nome ou ID</small>
        `;
        pokemonGrid.appendChild(emptyMessage);
    } else {
        renderPokemonCards(filteredPokemons);
    }
}

/**
 * Limpa o campo de pesquisa e mostra todos os pokémons
 */
function clearSearch() {
    searchInput.value = '';
    renderPokemonCards(allPokemons);
}


// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Busca os dados dos pokémons da API
 * Utiliza async/await para melhor legibilidade
 */
async function fetchPokemons() {
    showLoading();

    try {
        // Buscar lista de pokémons
        const response = await fetch(`${API_BASE_URL}?limit=${POKEMON_COUNT}&offset=0`);
        
        // Validar resposta
        if (!response.ok) {
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const data = await response.json();
        const pokemonList = data.results;

        // Buscar dados detalhados de cada pokémon
            const detailedPromises = pokemonList.map(async (pokemon, index) => {
            const id = index + 1;
            const responsePokemon = await fetch(pokemon.url);
            if (!responsePokemon.ok) {
                throw new Error(`Erro ao buscar detalhes de ${pokemon.name}: ${responsePokemon.status}`);
            }
            const pokemonDetails = await responsePokemon.json();

            return {
                id: id,
                name: formatPokemonName(pokemon.name),
                image: getPokemonImageUrl(id),
                url: pokemon.url,
                height: pokemonDetails.height,
                weight: pokemonDetails.weight,
                types: pokemonDetails.types.map(typeObj => typeObj.type.name)
            };
        });

        const detailedResults = await Promise.allSettled(detailedPromises);
        const pokemons = [];
        let failedCount = 0;

        detailedResults.forEach((result, index) => {
            const pokemon = pokemonList[index];
            const id = index + 1;

            if (result.status === 'fulfilled') {
                pokemons.push(result.value);
            } else {
                failedCount += 1;
                console.warn(`Falha ao carregar detalhes de ${pokemon.name}:`, result.reason);
                pokemons.push({
                    id: id,
                    name: formatPokemonName(pokemon.name),
                    image: getPokemonImageUrl(id),
                    url: pokemon.url,
                    height: null,
                    weight: null
                });
            }
        });

        if (failedCount === pokemons.length) {
            console.warn('Falha ao carregar detalhes de todos os pokémons. Exibindo cards com altura/peso indisponíveis.');
        }

        // Renderizar cards
        renderPokemonCards(pokemons);
        
        // Armazenar pokémons para uso na pesquisa
        allPokemons = pokemons;
        
        hideLoading();

    } catch (error) {
        console.error('Erro ao buscar pokémons:', error);
        showError('Não foi possível carregar os pokémons. Tente novamente mais tarde.');
    }
}

/**
 * Renderiza os cards dos pokémons na página
 * @param {Array} pokemons - Array de pokémons
 */
function renderPokemonCards(pokemons) {
    pokemonGrid.innerHTML = '';

    pokemons.forEach(pokemon => {
        const card = createPokemonCard(pokemon);
        pokemonGrid.appendChild(card);
    });
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa a página
 * Executado quando o DOM está carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    // Carregar pokémons
    fetchPokemons();

    // Adicionar evento de pesquisa em tempo real
    searchInput.addEventListener('input', handleSearch);

    // Adicionar evento do botão limpar
    clearButton.addEventListener('click', clearSearch);

        // Botões de filtro
        const filterAllBtn = document.getElementById('filterAll');
        const filterFavBtn = document.getElementById('filterFavoritos');
        if (filterAllBtn && filterFavBtn) {
            filterAllBtn.addEventListener('click', () => {
                filterAllBtn.classList.add('active');
                filterFavBtn.classList.remove('active');
                mostrarTodos();
            });

            filterFavBtn.addEventListener('click', () => {
                filterFavBtn.classList.add('active');
                filterAllBtn.classList.remove('active');
                mostrarFavoritos();
            });
        }
});
