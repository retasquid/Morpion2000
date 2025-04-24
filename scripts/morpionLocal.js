document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
    
    // Messages d'état du jeu
    const winMessage = () => `Le joueur ${currentPlayer} a gagné!`;
    const drawMessage = () => `Match nul!`;
    const currentPlayerTurn = () => `C'est au tour de ${currentPlayer}`;
    
    // Affiche le tour de jeu initial
    statusDisplay.textContent = currentPlayerTurn();
    
    // Fonctions de gestion du jeu
    function handleCellClick(clickedCellEvent) {
        const clickedCell = clickedCellEvent.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));
        
        // Vérifié si la cellule est déjà jouée ou si le jeu est terminé
        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }
        
        // Joue le coup
        handleCellPlayed(clickedCell, clickedCellIndex);
        // Vérifie le résultat
        handleResultValidation();
    }
    
    function handleCellPlayed(clickedCell, clickedCellIndex) {
        // Met à jour l'état du jeu
        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;
        clickedCell.classList.add(currentPlayer.toLowerCase());
    }
    
    function handleResultValidation() {
        let roundWon = false;
        
        // Vérifier les conditions de victoire
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            const condition = gameState[a] !== '' && 
                            gameState[a] === gameState[b] && 
                            gameState[b] === gameState[c];
            
            if (condition) {
                roundWon = true;
                break;
            }
        }
        
        // Si victoire, afficher le gagnant et terminer le jeu
        if (roundWon) {
            statusDisplay.textContent = winMessage();
            gameActive = false;
            return;
        }
        
        // Vérifier s'il y a match nul
        let roundDraw = !gameState.includes('');
        if (roundDraw) {
            statusDisplay.textContent = drawMessage();
            gameActive = false;
            return;
        }
        
        // Changer de joueur
        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        statusDisplay.textContent = currentPlayerTurn();
    }
    
    function handleRestartGame() {
        gameActive = true;
        currentPlayer = 'X';
        gameState = ['', '', '', '', '', '', '', '', ''];
        statusDisplay.textContent = currentPlayerTurn();
        
        // Réinitialiser les cellules
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x');
            cell.classList.remove('o');
        });
    }
    
    // Ajouter les événements
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', handleRestartGame);
});