// Um mapa de playerName para um array de valores playerPER
var playerMap = new Map();

// Variáveis para manter o controle de constantes
const maxPlayersOnCourt = 5;
const numQuarters = 4;

// Variáveis para rastrear o estado ao longo do jogo
var currentQuarter = 0;
var playersOnCourt = 0;
var quarterInPlay = false;

// Variáveis para rastrear o PER ao longo do jogo
var quarterPER = 0;
var quarterAvePER = 0;
var totalAvePER = 0;

// Função para ler todas as estatísticas do jogador
function processPlayers(allPlayerStats) {
// Divida os dados por nova linha em um array.
    var allPlayerStatLines = allPlayerStats.split(/\r\n|\n/);

    // remove a linha de cabeçalho (primeira linha)
    allPlayerStatLines.shift();

    // Percorre os 15 jogadores e cria uma entrada no mapa do nome do jogador para o jogador PER
    for (var statLine of allPlayerStatLines) {
        // Obtém todos os valores de estatísticas individuais
        var stats = statLine.split(',');

        // Se for apenas uma linha vazia, pule-a
        if (!stats || stats.length <= 1) continue; // linha vazia

        // A segunda coluna tem o nome do jogador
        var playerName = stats[1];

        // verifica se o jogador existe no mapa
        if (!playerMap.has(playerName)) {
            // Primeira vez que vemos o jogador; Adicione-os!
            playerMap.set(playerName, []);
        }

        // Obtém por valor para o jogador
        var per = parseFloat(stats[9]);

        // Adiciona por valor ao array do jogador (no próximo quarto)
        playerMap.get(playerName).push(per);
    }

    // Adiciona os jogadores ao banco.
    displayPlayerBench();
}

// Função para adicionar os jogadores ao banco para iniciar o jogo
function displayPlayerBench() {
// Obtém a div do banco em que os jogadores serão mostrados.
    var bench = document.getElementById('playersOnBench');

    // Para cada jogador, cria um botão
    for (let playerName of playerMap.keys()) {
        // Cria um botão para cada jogador
        var newPlayer = document.createElement('button');

        // Defina o ID para o nome do jogador para que possamos obtê-lo mais tarde
        newPlayer.id = playerName;

        // Identifica a classe de estilo, que definirá o esquema de cores
        newPlayer.className = 'playerButton';

        // Quando o botão é clicado, chama a função movePlayer
        newPlayer.onclick = movePlayer;

        // Adiciona a imagem dos jogadores ao botão
        var playerImage = document.createElement('img');

        // Define a fonte (ou local) da imagem
        playerImage.src = 'images/'+playerName+'.png';

        // Adiciona a imagem ao botão
        newPlayer.appendChild(playerImage);

        // Adiciona o botão ao banco
        bench.appendChild(newPlayer);
    }

    // Exibe cartas para todos os jogadores
    displayPlayerCards();
}

// Esta função é chamada no início do jogo para inicializar
// PER para cada jogador, e em cada quarto para fazer duas coisas:
// 1. Garantir que os jogadores atualmente na quadra tenham o PER correto representado
// 2. Atualize as estatísticas de cada jogador para o quarto atual
function displayPlayerCards() {
    // Esta função é chamada no início do jogo para inicializar
    var playerCardDisplay = document.getElementById('playerCards');

    // Para cada jogador, crie um cartão de estatísticas de jogador para mostrar o PER desse jogador por um
     // quarto específico.
    for (let [playerName, playerStats] of playerMap.entries()) {
// Cria uma div geral que conterá as informações das estatísticas do jogador.        var playerCard = document.createElement('div');

        // Defina um ID para o cartão para que possamos obtê-lo mais tarde
        playerCard.id = playerName + '_card';

        // Define o nome da classe de estilo
        playerCard.className = 'playerCard';

        // Adiciona a imagem do player ao div.
        var playerImage = document.createElement('img');

        // Define o estilo da imagem
        playerImage.className = 'perCard';

        // Carregue a imagem
        playerImage.src = 'images/'+playerName+'.png';

        // Adiciona a imagem ao cartão
        playerCard.appendChild(playerImage);

        // Adiciona o PER do jogador à div.
        var newPlayerPER = document.createElement('p');

        // Define o estilo do número
        newPlayerPER.className = 'perCard';

        // Define o texto para o PER
        newPlayerPER.innerText = 'PER: ' + playerStats[currentQuarter].toPrecision(4);

        // ADD o PER
        playerCard.appendChild(newPlayerPER);

        // Adiciona o cartão de estatísticas do jogador ao jogo.
        playerCardDisplay.appendChild(playerCard);
    }
}

// Esta função é chamada cada vez que um botão de jogador é clicado. Um jogador
// botão sendo clicado indica que os jogadores estão se movendo para a quadra
// ou para o banco para uma pausa para a água
function movePlayer() {
    // Não deixe o treinador trocar de jogador durante um quarto
    if(quarterInPlay) {
        return;
    }

    // Obtém a div em que este botão está atualmente (seja bancada ou quadra).
    var parentDiv = this.parentElement;

    // Verifica se o jogador está atualmente no banco.
    if(parentDiv.id == 'playersOnBench') {

        // If there are already five players on the court, don't let the player
        // move to the court; alert the coach that there are enough players.
        if(playersOnCourt >= maxPlayersOnCourt){
            alert('You can only have ' + maxPlayersOnCourt + ' players on the court at a time.');
        } else {
            // If there is room on the court, update the number of players on
            // the court, and update the average PER for the quarter based on
            // this player moving to the court.
            playersOnCourt++;
            quarterPER += playerMap.get(this.id)[currentQuarter];
            quarterAvePER = quarterPER / playersOnCourt;
            document.getElementById('currentPER').innerText = 'Current PER: '+ quarterAvePER.toPrecision(4);
            
            // Move the player to the court
            document.getElementById('playersOnCourt').appendChild(this);
        }
    } else {
        // If the player is being taken off the court for a water break, decrement
        // the number of players on the bench and remove the player's PER from the
        // average.
        playersOnCourt--;

        if(playersOnCourt != 0) {
            quarterPER -= playerMap.get(this.id)[currentQuarter];
            quarterAvePER = quarterPER / playersOnCourt;
        } else {
            // If there are no more players on the court, set the values to 0.
            quarterPER = 0;
            quarterAvePER = 0;
        }

        // Update the PER average. This might result in a zero value if your team is particularly tired.
        document.getElementById('currentPER').innerText = 'Current PER: '+ quarterAvePER.toPrecision(4);

        // Move the player to the bench.
        document.getElementById('playersOnBench').appendChild(this);
    }

}

// At the start of each quarter, do two things: 
// 1. Ensure the players currently on the court have the correct PER represented
// 2. Update the stats for each player for the current quarter.
function updateCardsInGame() {
    // For each player, update their player stat card to show PER for that player for 
    // a specific quarter.
    for (let [playerName, playerStats] of playerMap.entries()) {
        document.getElementById(playerName + '_card').children[1].innerText = 'PER: '+playerStats[currentQuarter].toPrecision(4);
    }

    // Reset the current quarter's total PER.
    quarterPER = 0;
    quarterAvePER = 0;

    // Get a list of all the players currently on the court.
    var currentPlayers = document.getElementById('playersOnCourt').children;

    // Loop through each of the players currently on the court.
    for(var playerIndex = 0; playerIndex < currentPlayers.length; playerIndex++) {
        // Get the name of the player
        var playerName = currentPlayers[playerIndex].id;

        // Get the PER for the player
        var playerPER = playerMap.get(playerName)[currentQuarter];

        // Add the PER to the quarter PER total
        quarterPER += playerPER;
    }

    // Get the average PER for the start of the quarter.
    quarterAvePER = quarterPER / playersOnCourt;

    // Update Current PER with the new average PER for the quarter now that the
    // stats have been updated.
    document.getElementById('currentPER').innerText = 'Current PER: '+ quarterAvePER.toPrecision(4);
}

// At the end of each quarter, show the coach the average PER
// for that quarter, allow the coach to make changes to the
// players on the court again, and add the stats for the next quarter to the game.
function endQuarter() {
    // Update the clock display
    document.getElementById('timer').innerText = 'Q '+ (currentQuarter + 1) + ' Time: 0:00';

    // Allow the coach to move players again.
    quarterInPlay = false;

    // Add the average PER of the quarter to the total count.
    totalAvePER += parseFloat(quarterAvePER.toPrecision(4));

    // Add the value to the display counter above the stats column.
    document.getElementById('averagePER').innerText += quarterAvePER.toPrecision(4) + ' + ';

    // Progress to the next quarter.
    currentQuarter++;

    // Update the stats so that they reflect the next quarter.
    updateCardsInGame();

    // Let the coach know that the new PER stats are up to date. 
    alert('Q' + (currentQuarter+1) + ' PER stats are in!');

    // Encourage the coach to consider new players.
    document.getElementById('quarter').innerText = 'Choose Players for Q'+(currentQuarter+1);

    // Update the button text.
    document.getElementById('start').innerText = 'Start Q'+(currentQuarter+1);
}

// At the end of the game, show the coach the average PER
// for the entire game and clean up the final view of the app.
function endGame() {
    // Don't let the coach move players around; the game is over.
    quarterInPlay = true;

    // Calculate the average PER for the entire game, including the last quarter.
    totalAvePER += parseFloat(quarterAvePER);
    var averagePER = totalAvePER/numQuarters;

    // Let the coach know that the game is over and what the PER was for the game.
    alert('Game Over. Game Average PER was: ' + averagePER.toPrecision(4));
    document.getElementById('averagePER').innerText += quarterAvePER.toPrecision(4) + ' = ' + averagePER.toPrecision(4);

    // Clean up the web app view.
    document.getElementById('timer').innerText = 'That\'s All Folks!';
    document.getElementById('gameButton').innerText = '';
    document.getElementById('quarter').innerText = '';
    document.getElementById('currentPER').innerText = '';
}

// This function is called when the Game button is selected. Each time the button is selected,
// it runs through a 12-second timer (simulating 12 minutes) and then updates the game
// to the next quarter.
function startNextQuarter() {
    // If there aren't exactly five players on the court, alert the coach that the game can't start.
    if(playersOnCourt != maxPlayersOnCourt){
        alert('Choose exactly ' + maxPlayersOnCourt + ' players to be on the court.');
        return;
    }

    // Update the button to indicate a quarter is in progress.
    document.getElementById('start').innerText = 'Q' + (currentQuarter + 1) + ' is in progress';

    // Define the interval period for the quarter; in this case, it's 12 seconds.
    var secondsInQuarter = 12;

    // Set the quarterInPlay variable to true so that the coach
    // can't move players during gameplay
    quarterInPlay = true;

    // Update the count down every 1 second, as indicated by the `1000` as
    // the second parameter to the setInterval function
    var x = setInterval(function() {        
        // Display the current time on the court board.
        document.getElementById('timer').innerText = 'Q '+ (currentQuarter + 1) + ' Time: ' + secondsInQuarter + ':00';

        // Decrement the interval counter for this quarter.
        secondsInQuarter--;

        // If the quarter has ended, reset the interval timer and get ready for the next quarter.
        if (secondsInQuarter < 0) {
            clearInterval(x);
            if(currentQuarter < 3) {
                endQuarter();
            }
            else {
                endGame();
            }
        }
    }, 1000);
}