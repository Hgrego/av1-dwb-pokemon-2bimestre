// ============================================
// CONSTANTES E CONFIGURAÇÕES
// ============================================

const API_BASE_URL = 'https://pokeapi.co/api/v2/pokemon';

// Elementos do DOM
const loadingIndicator = document.getElementById('loadingIndicator');
const errorMessage = document.getElementById('errorMessage');
const errorText = document.getElementById('errorText');
const detailsContainer = document.getElementById('detailsContainer');

// ============================================
// FUNÇÕES AUXILIARES
// ============================================

/**
 * Obtém o parâmetro ID da URL usando URLSearchParams
 * @returns {string|null} - ID do pokémon ou null
 */
function getPokemonIdFromURL() {
    const params = new URLSearchParams(window.location.search);
    return params.get('id');
}

function getCachedPokemon() {
    const cached = sessionStorage.getItem('selectedPokemon');
    try {
        return cached ? JSON.parse(cached) : null;
    } catch (error) {
        return null;
    }
}

/**
 * Exibe a mensagem de carregamento
 */
function showLoading() {
    loadingIndicator.style.display = 'block';
    errorMessage.classList.add('d-none');
    detailsContainer.classList.add('d-none');
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
function showError(message, hideDetails = true) {
    hideLoading();
    errorText.textContent = message;
    errorMessage.classList.remove('d-none');
    if (hideDetails) {
        detailsContainer.classList.add('d-none');
    }
}

function renderPokemonDetailsFallback(pokemon) {
    document.getElementById('pokemonName').textContent = formatPokemonName(pokemon.name);
    document.getElementById('pokemonImage').src = pokemon.image;
    document.getElementById('pokemonImage').alt = pokemon.name;
    document.getElementById('pokemonId').textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    document.getElementById('pokemonHeight').textContent = '—';
    document.getElementById('pokemonWeight').textContent = '—';

    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = '<span class="text-muted">Dados básicos carregados.</span>';

    const statsContainer = document.getElementById('pokemonStats');
    statsContainer.innerHTML = '<p class="text-muted mb-0">Estatísticas não disponíveis no momento.</p>';

    detailsContainer.classList.remove('d-none');
}

/**
 * Formata o nome do pokémon (primeira letra maiúscula)
 * @param {string} name - Nome a formatar
 * @returns {string} - Nome formatado
 */
function formatPokemonName(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Converte a altura de decímetros para metros
 * @param {number} height - Altura em decímetros
 * @returns {string} - Altura em metros
 */
function convertHeight(height) {
    return (height / 10).toFixed(1) + ' m';
}

/**
 * Converte o peso de hectogramas para quilogramas
 * @param {number} weight - Peso em hectogramas
 * @returns {string} - Peso em quilogramas
 */
function convertWeight(weight) {
    return (weight / 10).toFixed(1) + ' kg';
}

/**
 * Obtém a cor baseada no tipo do pokémon
 * @param {string} type - Tipo do pokémon
 * @returns {string} - Classe CSS do tipo
 */
function getTypeClass(type) {
    return `type-${type.toLowerCase()}`;
}

/**
 * Renderiza um badge de tipo
 * @param {string} type - Tipo do pokémon
 * @returns {HTMLElement} - Elemento do badge
 */
function createTypeBadge(type) {
    const badge = document.createElement('span');
    badge.className = `type-badge ${getTypeClass(type)}`;
    badge.textContent = type;
    return badge;
}

/**
 * Renderiza uma barra de estatística
 * @param {string} name - Nome da estatística
 * @param {number} value - Valor da estatística
 * @returns {HTMLElement} - Elemento da barra
 */
function createStatBar(name, value) {
    const container = document.createElement('div');
    
    const label = document.createElement('div');
    label.className = 'stat-label';
    
    const labelName = document.createElement('span');
    labelName.textContent = name;
    
    const labelValue = document.createElement('span');
    labelValue.className = 'stat-value';
    labelValue.textContent = value;
    
    label.appendChild(labelName);
    label.appendChild(labelValue);
    
    const bar = document.createElement('div');
    bar.className = 'stat-bar';
    
    const fill = document.createElement('div');
    fill.className = 'stat-fill';
    
    // Limitar o valor máximo a 255 para visualização
    const percentage = (value / 255) * 100;
    fill.style.width = percentage + '%';
    fill.textContent = value;
    
    bar.appendChild(fill);
    
    const wrapper = document.createElement('div');
    wrapper.className = 'stat-bar';
    wrapper.appendChild(label);
    wrapper.appendChild(bar);
    
    return wrapper;
}

// ============================================
// FUNÇÕES PRINCIPAIS
// ============================================

/**
 * Busca e exibe os detalhes do pokémon
 * Utiliza async/await para melhor legibilidade
 */
async function fetchPokemonDetails() {
    showLoading();

    try {
        // Obter ID da URL
        const pokemonId = getPokemonIdFromURL();

        // Validar se o ID foi fornecido
        if (!pokemonId) {
            throw new Error('ID do pokémon não fornecido');
        }

        // Buscar dados do pokémon
        const response = await fetch(`${API_BASE_URL}/${pokemonId}`);

        // Validar resposta
        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Pokémon não encontrado');
            }
            throw new Error(`Erro na requisição: ${response.status}`);
        }

        const pokemon = await response.json();

        // Renderizar detalhes
        renderPokemonDetails(pokemon);
        hideLoading();

    } catch (error) {
        console.error('Erro ao buscar detalhes do pokémon:', error);

        const cachedPokemon = getCachedPokemon();
        const pokemonId = getPokemonIdFromURL();

        if (cachedPokemon && String(cachedPokemon.id) === String(pokemonId)) {
            showError(
                'Falha ao carregar os dados completos do pokémon. Exibindo informações básicas em cache.',
                false
            );
            renderPokemonDetailsFallback(cachedPokemon);
        } else {
            showError(`Não foi possível carregar os detalhes do pokémon: ${error.message}`);
        }
    }
}

/**
 * Renderiza os detalhes do pokémon na página
 * @param {Object} pokemon - Dados completos do pokémon
 */
function renderPokemonDetails(pokemon) {
    // Nome e Imagem
    document.getElementById('pokemonName').textContent = formatPokemonName(pokemon.name);
    document.getElementById('pokemonImage').src = pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default;
    document.getElementById('pokemonImage').alt = pokemon.name;

    // Informações básicas
    document.getElementById('pokemonId').textContent = `#${String(pokemon.id).padStart(3, '0')}`;
    document.getElementById('pokemonHeight').textContent = convertHeight(pokemon.height);
    document.getElementById('pokemonWeight').textContent = convertWeight(pokemon.weight);

    // Tipos
    const typesContainer = document.getElementById('pokemonTypes');
    typesContainer.innerHTML = '';
    pokemon.types.forEach(typeObj => {
        const badge = createTypeBadge(typeObj.type.name);
        typesContainer.appendChild(badge);
    });

    // Estatísticas
    const statsContainer = document.getElementById('pokemonStats');
    statsContainer.innerHTML = '';
    
    pokemon.stats.forEach(statObj => {
        const statName = statObj.stat.name.replace('-', ' ').toUpperCase();
        const statValue = statObj.base_stat;
        const bar = createStatBar(statName, statValue);
        statsContainer.appendChild(bar);
    });

    // Mostrar container de detalhes
    detailsContainer.classList.remove('d-none');
}

// ============================================
// INICIALIZAÇÃO
// ============================================

/**
 * Inicializa a página de detalhes
 * Executado quando o DOM está carregado
 */
document.addEventListener('DOMContentLoaded', () => {
    fetchPokemonDetails();
});
