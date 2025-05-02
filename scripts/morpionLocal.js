document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const cells = document.querySelectorAll('.cell');
    const statusDisplay = document.getElementById('status');
    const resetButton = document.getElementById('reset-button');
	const userName = localStorage.getItem('userName');
	const imageUrl = localStorage.getItem('profileImage');
    
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;
    let scoreX = 0;
	let scoreO = 0;
	const scoreXDisplay = document.getElementById('scoreJoueur1');
	const scoreODisplay = document.getElementById('scoreJoueur2');
    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Lignes
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Colonnes
        [0, 4, 8], [2, 4, 6]             // Diagonales
    ];
	
	if (imageUrl) {
        const profileImg = document.getElementById('profileImg');
        if (profileImg) {
            profileImg.src = imageUrl;
        }
    }
	
    if (userName) {
        const pseudoElem = document.getElementById('pseudo');
        if (pseudoElem) {
            pseudoElem.textContent = userName;
        }
    }
	
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

		if (roundWon) {
			statusDisplay.textContent = winMessage();
			updateScore(currentPlayer);
			return;
		}

		let roundDraw = !gameState.includes('');
		if (roundDraw) {
			statusDisplay.textContent = drawMessage();
			resetRound();
			return;
		}

		currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
		statusDisplay.textContent = currentPlayerTurn();
	}
    
    function handleRestartGame() {
		scoreX = 0;
		scoreO = 0;
		scoreXDisplay.textContent = "Joueur 1 : 0";
		scoreODisplay.textContent = "Invité : 0";
		gameActive = true;
		currentPlayer = 'X';
		gameState = ['', '', '', '', '', '', '', '', ''];
		statusDisplay.textContent = currentPlayerTurn();
		cells.forEach(cell => {
			cell.textContent = '';
			cell.classList.remove('x');
			cell.classList.remove('o');
		});
		document.getElementById('reset-button').style.display = 'none'; // cacher le bouton reset jusqu’à la fin
	}
	
    function updateScore(winner) {
		if (winner === 'X') {
			scoreX++;
			scoreXDisplay.textContent = `Joueur 1 : ${scoreX}`;
		} else {
			scoreO++;
			scoreODisplay.textContent = `Invité : ${scoreO}`;
		}

		if (scoreX === 3 || scoreO === 3) {
			gameActive = false;
			if (scoreX === 3) {
				statusDisplay.textContent = "Joueur 1 a gagné la partie ! 🏆";
			} else {
				statusDisplay.textContent = "Invité a gagné la partie ! 🏆";
			}
			document.getElementById('reset-button').style.display = 'block'; // Montrer bouton
		} else {
			resetRound(); // sinon continuer avec une autre manche
		}
	}
	
	function resetRound() {
		gameState = ['', '', '', '', '', '', '', '', ''];
		cells.forEach(cell => {
			cell.textContent = '';
			cell.classList.remove('x');
			cell.classList.remove('o');
		});
		currentPlayer = 'X';
		statusDisplay.textContent = currentPlayerTurn();
	}
	

    // Ajouter les événements
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    resetButton.addEventListener('click', handleRestartGame);
});