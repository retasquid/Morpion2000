document.addEventListener('DOMContentLoaded', function () {
    const imageUrl = localStorage.getItem('profileImage');
    const userName = localStorage.getItem('userName');

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
});
