// Initialisation de la scène Three.js
const scene = new THREE.Scene();
const camera = new THREE.Camera();
scene.add(camera);

const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Ajout d'une lumière
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(1, 1, 1).normalize();
scene.add(light);

// Initialisation d'AR.js
const arSource = new THREEx.ArToolkitSource({
    sourceType: 'webcam',
});

arSource.init(() => {
    onResize();
});

window.addEventListener('resize', onResize);

function onResize() {
    arSource.onResizeElement();
    arSource.copyElementSizeTo(renderer.domElement);

    if (arContext.arController !== null) {
        arSource.copySizeTo(arContext.arController.canvas);
    }
}

const arContext = new THREEx.ArToolkitContext({
    cameraParametersUrl: THREEx.ArToolkitContext.baseURL + '../data/data/camera_para.dat',
    detectionMode: 'mono'
});

arContext.init(() => {
    camera.projectionMatrix.copy(arContext.getProjectionMatrix());
});

// Charger le marqueur
const markerRoot = new THREE.Group();
scene.add(markerRoot);

const arMarkerControls = new THREEx.ArMarkerControls(arContext, markerRoot, {
    type: 'pattern',
    patternUrl: '../public/assets/pattern/3.patt', // utilisez votre propre pattern ici
});

// Ajouter la vidéo
const video = document.createElement('video');
video.src = "../public/assets/video/6.mp4"; // Le chemin vers votre vidéo
video.loop = true;      // Optionnel : fait en sorte que la vidéo boucle
video.preload = 'auto'; // Précharge la vidéo
video.muted = false;    // Désactivez le mute pour que le son fonctionne

const videoTexture = new THREE.VideoTexture(video);
const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });

const videoGeometry = new THREE.PlaneGeometry(1, 1);
const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);
videoMesh.rotation.x = -Math.PI / 2;
markerRoot.add(videoMesh);

// Variable pour suivre l'état de la vidéo
let videoPlaying = false;

// Animation et rendu
function render() {
    requestAnimationFrame(render);

    if (arSource.ready === false) return;

    arContext.update(arSource.domElement);

    // Vérifiez si le marqueur est détecté
    if (markerRoot.visible) {
        if (!videoPlaying) {
            video.play(); // Joue la vidéo seulement si elle n'est pas déjà en cours
            videoPlaying = true;
        }
    } else {
        if (videoPlaying) {
            video.pause(); // Met en pause la vidéo si le marqueur n'est plus détecté
            videoPlaying = false;
        }
    }

    renderer.render(scene, camera);
}

render();
