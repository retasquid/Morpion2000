document.getElementById('profilePhoto').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        
        reader.onload = function(e) {
            const img = document.getElementById('profileImage');
            img.src = e.target.result;
            img.style.display = 'block';
            document.getElementById('placeholder').style.display = 'none';
        }
        
        reader.readAsDataURL(file);
    }
});

document.getElementById('profileForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const userName = document.getElementById('userName').value;
    const profileImg = document.getElementById('profileImage').src;
    
    localStorage.setItem('userName', userName);
    localStorage.setItem('profileImage', profileImg);

    window.location.href = "../index.html";
});
