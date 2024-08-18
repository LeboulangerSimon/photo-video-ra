document.getElementById('pinForm').onsubmit = async function(event) {
    event.preventDefault();
    
    const formData = new FormData(this);
    const plainFormData = Object.fromEntries(formData.entries());
    const formBody = new URLSearchParams(plainFormData);

    try {
        const response = await fetch('/validate-pin', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: formBody.toString(),
        });

        const result = await response.json();
        if (response.ok) {
            // Redirection vers la page de scan avec le PIN
            window.location.href = `/scan.html?pin=${result.pin}`;
        } else {
            document.getElementById('errorMessage').innerText = 'Code PIN invalide, veuillez réessayer.';
        }
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('errorMessage').innerText = 'Une erreur est survenue. Veuillez réessayer.';
    }
};
