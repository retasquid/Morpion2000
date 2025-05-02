document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const status = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
    const endMessage = document.getElementById('endMessage');
    const winner = document.getElementById('winner');
    const restartGame = document.getElementById('restartGame');
    const difficultySelector = document.getElementById('difficulty');
    
    let scoreJoueur = 0;
    let scoreRobot = 0;
    
    // État du jeu
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let currentPlayer = 'X';
    let gameActive = true;
    
    // Combinaisons gagnantes
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // colonnes
        [0, 4, 8], [2, 4, 6]             // diagonales
    ];
    
    // Messages
    const winMessage = () => `${currentPlayer === 'X' ? 'Vous avez' : 'Le robot a'} gagné!`;
    const drawMessage = () => 'Match nul!';
    const currentPlayerTurn = () => `C'est ${currentPlayer === 'X' ? 'votre tour (X)' : 'au tour du robot (O)'}`;
    
    // Fonction pour vérifier si un coup est gagnant
    function checkWin(board, player) {
        return winningConditions.some(condition => {
            return condition.every(index => {
                return board[index] === player;
            });
        });
    }
    
    // Fonction pour obtenir les positions vides
    function getEmptyCells(board) {
        return board.reduce((acc, cell, index) => {
            if (cell === '') acc.push(index);
            return acc;
        }, []);
    }
    
    // IA avec l'algorithme Minimax
    function minimax(board, depth, isMaximizing, alpha = -Infinity, beta = Infinity) {
        // Vérification de l'état terminal
        if (checkWin(board, 'O')) return 10 - depth;
        if (checkWin(board, 'X')) return depth - 10;
        
        const emptyCells = getEmptyCells(board);
        if (emptyCells.length === 0) return 0;
        
        // Difficulté - limiter la profondeur selon le niveau
        const difficulty = difficultySelector.value;
        if ((difficulty === 'facile' && depth > 1) || 
            (difficulty === 'moyen' && depth > 3)) {
            return 0;
        }
        
        if (isMaximizing) {
            let maxEval = -Infinity;
            for (let i = 0; i < emptyCells.length; i++) {
                const index = emptyCells[i];
                board[index] = 'O';
                const eval = minimax(board, depth + 1, false, alpha, beta);
                board[index] = '';
                maxEval = Math.max(maxEval, eval);
                alpha = Math.max(alpha, eval);
                if (beta <= alpha) break;
            }
            return maxEval;
        } else {
            let minEval = Infinity;
            for (let i = 0; i < emptyCells.length; i++) {
                const index = emptyCells[i];
                board[index] = 'X';
                const eval = minimax(board, depth + 1, true, alpha, beta);
                board[index] = '';
                minEval = Math.min(minEval, eval);
                beta = Math.min(beta, eval);
                if (beta <= alpha) break;
            }
            return minEval;
        }
    }
    
    // Fonction pour que l'IA joue
    function aiMove() {
        const difficulty = difficultySelector.value;
        const emptyCells = getEmptyCells(gameState);
        
        // Pour le niveau facile, jouer parfois aléatoirement
        if (difficulty === 'facile' && Math.random() < 0.5) {
            const randomIndex = Math.floor(Math.random() * emptyCells.length);
            return emptyCells[randomIndex];
        }
        
        let bestScore = -Infinity;
        let bestMove;
        
        for (let i = 0; i < emptyCells.length; i++) {
            const index = emptyCells[i];
            gameState[index] = 'O';
            const score = minimax(gameState, 0, false);
            gameState[index] = '';
            
            if (score > bestScore) {
                bestScore = score;
                bestMove = index;
            }
        }
        
        return bestMove;
    }
    
    // Fonction pour gérer le clic sur une cellule
    function cellClicked(e) {
        const clickedCellIndex = parseInt(e.target.getAttribute('data-index'));
        
        if (gameState[clickedCellIndex] !== '' || !gameActive || currentPlayer !== 'X') {
            return;
        }
        
        updateCell(clickedCellIndex);
        checkResult();
        
        // Tour de l'IA après un court délai
        if (gameActive) {
            currentPlayer = 'O';
            status.innerHTML = currentPlayerTurn();
            
            setTimeout(() => {
                const aiMoveIndex = aiMove();
                updateCell(aiMoveIndex);
                checkResult();
                
                if (gameActive) {
                    currentPlayer = 'X';
                    status.innerHTML = currentPlayerTurn();
                }
            }, 500);
        }
    }
    
    // Mise à jour de la cellule
    function updateCell(index) {
        gameState[index] = currentPlayer;
        cells[index].textContent = currentPlayer;
        cells[index].classList.add(currentPlayer.toLowerCase());
    }
    
    // Vérification du résultat
    function checkResult() {
        let gameWon = false;
        
        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] && gameState[a] === gameState[b] && gameState[a] === gameState[c]) {
                gameWon = true;
                break;
            }
        }
        
        if (gameWon) {
            status.innerHTML = winMessage();
            gameActive = false;
            
            // Mise à jour du score
            if (currentPlayer === 'X') {
                scoreJoueur++;
                document.getElementById('scoreJoueur1').textContent = `Joueur : ${scoreJoueur}`;
            } else {
                scoreRobot++;
                document.getElementById('scoreJoueur2').textContent = `Robot : ${scoreRobot}`;
            }
            
            // Affichage du message de fin
            winner.textContent = winMessage();
            endMessage.style.display = 'block';
            return;
        }
        
        const roundDraw = !gameState.includes('');
        if (roundDraw) {
            status.innerHTML = drawMessage();
            gameActive = false;
            
            // Affichage du message de fin
            winner.textContent = drawMessage();
            endMessage.style.display = 'block';
            return;
        }
    }
    
    // Réinitialisation du jeu
    function resetGame() {
        gameState = ['', '', '', '', '', '', '', '', ''];
        currentPlayer = 'X';
        gameActive = true;
        
        status.innerHTML = currentPlayerTurn();
        cells.forEach(cell => {
            cell.textContent = '';
            cell.classList.remove('x');
            cell.classList.remove('o');
        });
        
        endMessage.style.display = 'none';
    }
    
    // Gestionnaires d'événements
    cells.forEach(cell => cell.addEventListener('click', cellClicked));
    resetButton.addEventListener('click', resetGame);
    restartGame.addEventListener('click', resetGame);
    
    // Initialisation
    status.innerHTML = currentPlayerTurn();
});