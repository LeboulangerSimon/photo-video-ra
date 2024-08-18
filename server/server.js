const express = require('express');
const path = require('path');
const mongoose = require('mongoose');

const Association = require('./models/Association'); // Importation du modèle Association

const app = express();
const PORT = process.env.PORT || 3000;

// Connexion à MongoDB
mongoose.connect('mongodb://localhost:27017/ra', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware pour traiter les données JSON et URL-encoded
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Route pour valider le code PIN
app.post('/validate-pin', async (req, res) => {
    console.log("Contenu du body reçu par le serveur:", req.body);  // Vérification que le PIN est reçu

    const { pin } = req.body;

    if (!pin) {
        console.log("PIN manquant dans la requête");
        return res.status(400).json({ message: 'Code PIN invalide' });
    }

    const existingAssociation = await Association.findOne({ pin });
    if (!existingAssociation) {
        console.log("PIN invalide ou non trouvé:", pin);
        return res.status(400).json({ message: 'Code PIN invalide' });
    }

    console.log("PIN valide:", pin);
    res.json({ pin });
});

// Route pour récupérer les associations (facultatif pour l'instant)
app.get('/get-associations', async (req, res) => {
    const { pin } = req.query;

    const existingAssociation = await Association.findOne({ pin });
    if (!existingAssociation) {
        return res.status(400).json({ message: 'Aucune association trouvée pour ce PIN' });
    }

    res.json(existingAssociation);
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
