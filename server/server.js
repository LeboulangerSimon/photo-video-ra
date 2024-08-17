const express = require('express');
const path = require('path');
const multer = require('multer');
const mongoose = require('mongoose');
require('dotenv').config();

const Association = require('./models/Association'); // Importer le modèle Association

const app = express();
const PORT = process.env.PORT || 3000;

mongoose.connect('mongodb://localhost:27017/ra', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connecté à MongoDB'))
.catch(err => console.error('Erreur de connexion à MongoDB:', err));

// Middleware pour servir les fichiers statiques
app.use(express.static(path.join(__dirname, '../public')));

// Configuration de Multer pour les téléchargements de fichiers
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = `server/uploads/${req.body.pin}`;
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../public/accueil.html'));
});

// Route pour les téléchargements de fichiers et création d'associations
app.post('/upload', upload.fields([{ name: 'photo', maxCount: 1 }, { name: 'video', maxCount: 1 }]), async (req, res) => {
    const { pin } = req.body;

    // Vérifier si le PIN existe déjà
    const existingAssociation = await Association.findOne({ pin });
    if (existingAssociation) {
        return res.status(400).send('Ce code PIN est déjà utilisé, veuillez en choisir un autre.');
    }

    const files = req.files;
    if (!files.photo || !files.video) {
        return res.status(400).send('Photo et vidéo sont requises.');
    }

    const photoPath = files.photo[0].path;
    const videoPath = files.video[0].path;

    const association = new Association({ pin, photos: [photoPath], videos: [videoPath] });

    try {
        await association.save();
        res.json({ message: 'Fichiers téléchargés avec succès !', pin });
    } catch (err) {
        console.error(err);
        res.status(500).send('Erreur lors de la création de l\'association.');
    }
});

// Démarrage du serveur
app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});
