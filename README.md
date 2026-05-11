# Pokédex - Aplicação Web de Consumo da PokéAPI

Uma aplicação web moderna e responsiva para explorar pokémons usando a **PokéAPI (https://pokeapi.co/api/v2/pokemon)**.

## 📋 Estrutura do Projeto

```
av1-dwb-pokemon-2bimestre/
├── index.html          # Página principal com listagem de pokémons
├── detalhes.html       # Página de detalhes de um pokémon específico
├── css/
│   └── style.css       # Estilos personalizados e layout responsivo
├── js/
│   ├── script.js       # JavaScript para página inicial
│   └── detalhes.js     # JavaScript para página de detalhes
└── README.md           # Este arquivo
```

## 🎯 Funcionalidades

### Página Principal (index.html)
- ✅ Listagem de 20 pokémons da primeira geração
- ✅ Exibição de nome e imagem oficial de cada pokémon
- ✅ Layout responsivo com Bootstrap e cards
- ✅ Indicador de carregamento com spinner
- ✅ Tratamento de erros com try/catch
- ✅ Clique em um pokémon redireciona para detalhes

### Página de Detalhes (detalhes.html)
- ✅ Exibe informações completas do pokémon selecionado
- ✅ Parâmetro de URL (id) usando URLSearchParams
- ✅ Mostra altura, peso, tipos e estatísticas
- ✅ Barras de progresso para visualizar estatísticas
- ✅ Badges coloridas por tipo de pokémon
- ✅ Botão para voltar à listagem
- ✅ Indicador de carregamento e tratamento de erros

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura semântica
- **CSS3** - Estilos e animações
- **Bootstrap 5** - Framework responsivo
- **JavaScript Vanilla** - Lógica da aplicação (sem frameworks)
- **Fetch API** - Consumo de dados (async/await)
- **URLSearchParams** - Leitura de parâmetros de URL

## 📡 Consumo de API

### Endpoints Utilizados

1. **Listagem de Pokémons**
   ```
   GET https://pokeapi.co/api/v2/pokemon?limit=20&offset=0
   ```
   - Retorna lista de 20 pokémons com dados básicos

2. **Detalhes do Pokémon**
   ```
   GET https://pokeapi.co/api/v2/pokemon/{id}
   ```
   - Retorna dados completos incluindo altura, peso, tipos e estatísticas

## 🚀 Como Usar

### Requisitos
- Navegador moderno com suporte a ES6+
- Conexão com a internet para acessar a PokéAPI

### Passos para Executar

1. **Clone ou baixe o projeto**
   ```bash
   cd av1-dwb-pokemon-2bimestre
   ```

2. **Abra o arquivo index.html no navegador**
   - Clique duas vezes em `index.html`, ou
   - Abra com um servidor local (recomendado):
     ```bash
     # Usando Python 3
     python -m http.server 8000
     
     # Usando Python 2
     python -m SimpleHTTPServer 8000
     
     # Usando Node.js (com http-server)
     npx http-server
     ```

3. **Navegue e explore**
   - A página carregará os 20 primeiros pokémons
   - Clique em qualquer pokémon para ver detalhes completos
   - Use o botão "Voltar" para retornar à listagem

## 📝 Detalhes da Implementação

### Padrões de Código

- **Separação de Responsabilidades**: HTML, CSS e JavaScript separados
- **Funções Reutilizáveis**: Cada tarefa tem sua própria função bem documentada
- **Comentários Claros**: Código bem comentado e organizado em seções
- **EventListeners**: Uso de `addEventListener` ao invés de onclick inline
- **Async/Await**: Requisições assíncronas com tratamento de erros
- **Try/Catch**: Captura e tratamento adequado de exceções

### Conversões de Unidades

- **Altura**: Convertida de decímetros para metros
- **Peso**: Convertido de hectogramas para quilogramas

### Cores de Tipos

Cada tipo de pokémon possui uma cor específica:
- Fire (Fogo) - Laranja
- Water (Água) - Azul
- Grass (Grama) - Verde
- Electric (Elétrico) - Amarelo
- E muitos mais...

## 🎨 Design e Responsividade

- **Mobile First**: Layout otimizado para dispositivos móveis
- **Responsive Grid**: Cards adaptáveis com Bootstrap Grid
- **Animações Suaves**: Transições CSS para melhor UX
- **Tema Temático**: Cores inspiradas na identidade visual Pokémon

### Breakpoints
- 📱 **Extra Small** (< 576px) - Devices móveis
- 📱 **Small** (≥ 576px) - Tablets pequenos
- 📋 **Medium** (≥ 768px) - Tablets
- 💻 **Large** (≥ 992px) - Desktops
- 💻 **Extra Large** (≥ 1200px) - Telas grandes

## 🔍 Exemplos de Uso

### Exemplo 1: Acessar Detalhes de um Pokémon
```javascript
// A URL será algo como: detalhes.html?id=1
// O JavaScript automaticamente:
// 1. Extrai o ID da URL
// 2. Busca dados do pokémon
// 3. Renderiza os detalhes
```

### Exemplo 2: Adicionar Mais Pokémons
```javascript
// Em script.js, altere:
const POKEMON_COUNT = 20;
// Para:
const POKEMON_COUNT = 50; // Para 50 pokémons
```

## ⚠️ Tratamento de Erros

- ✅ Validação de resposta HTTP
- ✅ Try/catch para exceções
- ✅ Mensagens de erro amigáveis
- ✅ Fallback para imagens não disponíveis
- ✅ Verificação de parâmetros de URL

## 📚 Aprendizados Principais

Este projeto demonstra:

1. **Fetch API com async/await** - Requisições assíncronas modernas
2. **Manipulação do DOM** - Criação e inserção dinâmica de elementos
3. **URLSearchParams** - Leitura de parâmetros de query string
4. **Responsive Design** - Layout adaptável com Bootstrap
5. **Boas Práticas** - Código limpo, organizado e bem documentado
6. **CSS Avançado** - Gradientes, animações e custom properties
7. **Arquitetura Frontend** - Separação de concerns e modularidade

## 🌐 Links Úteis

- [PokéAPI Documentation](https://pokeapi.co/)
- [Bootstrap 5 Documentation](https://getbootstrap.com/docs/5.0/)
- [MDN - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [MDN - URLSearchParams](https://developer.mozilla.org/en-US/docs/Web/API/URLSearchParams)

## 📄 Licença

Projeto educacional para fins de aprendizagem.

---

**Desenvolvido com ❤️ usando HTML, CSS e JavaScript Vanilla**

**Data**: 2024 | **Bimestre**: 2º
