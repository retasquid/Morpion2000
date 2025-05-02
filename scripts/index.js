document.addEventListener('DOMContentLoaded', function () {
    const imageUrl = localStorage.getItem('profileImage');
    const userName = localStorage.getItem('userName');
	const onlineButton = document.querySelector('.boutons .btn:nth-child(2)'); // Sélectionne le bouton ONLINE
    const overlay = document.getElementById('overlay');
    const notificationPopup = document.getElementById('notificationPopup');
    const closeButton = document.getElementById('closeButton');
	
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

    
    // Fonction pour afficher la popup
    function showPopup() {
        overlay.style.display = 'block';
        notificationPopup.style.display = 'block';
    }
    
    // Fonction pour fermer la popup
    function closePopup() {
        overlay.style.display = 'none';
        notificationPopup.style.display = 'none';
    }
    
    // Ajouter des écouteurs d'événements
    onlineButton.addEventListener('click', showPopup);
    closeButton.addEventListener('click', closePopup);
    overlay.addEventListener('click', closePopup);
});
