document.getElementById('uploadForm').onsubmit = async function(event) {
    event.preventDefault();

    const formData = new FormData();
    const imageFile = document.getElementById('image').files[0];
    const videoFile = document.getElementById('video').files[0];

    formData.append('image', imageFile);
    formData.append('video', videoFile);

    
    try {
        const response = await fetch('http://localhost/photo-video-ra/public/upload.php', {
            method: 'POST',
            body: formData
        });
        
        const result = await response.json();
        if (result.success) {
            alert('Fichiers téléchargés avec succès !');
            // Vous pouvez mettre à jour la vidéo dans la scène AR ici
        } else {
            alert('Échec du téléchargement.');
        }
        
    } catch (error) {
        console.error('Erreur:', error);
        alert('Erreur lors du téléchargement.');
    }

    
};
