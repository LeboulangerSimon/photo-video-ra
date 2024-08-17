document.getElementById('uploadForm').onsubmit = async function(event) {
    event.preventDefault();
    const formData = new FormData(this);

    const response = await fetch('/upload', {
        method: 'POST',
        body: formData,
    });

    const result = await response.json();
    if (response.ok) {
        document.getElementById('pinMessage').innerText = `Votre code PIN est : ${result.pin}`;
    } else {
        document.getElementById('pinMessage').innerText = `Erreur : ${result.message}`;
    }
};
