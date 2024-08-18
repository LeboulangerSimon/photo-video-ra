document.addEventListener('DOMContentLoaded', () => {
    console.log("Page chargée, initialisation...");

    const scene = new THREE.Scene();
    const camera = new THREE.Camera();
    scene.add(camera);

    console.log("Scène et caméra initialisées.");

    const renderer = new THREE.WebGLRenderer({ alpha: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    console.log("Renderer ajouté au DOM.");

    const arToolkitSource = new THREEx.ArToolkitSource({
        sourceType: 'webcam',
    });

    arToolkitSource.init(() => {
        console.log("Source vidéo initialisée.");
        onResize();
    });

    window.addEventListener('resize', onResize);

    function onResize() {
        arToolkitSource.onResizeElement();
        arToolkitSource.copyElementSizeTo(renderer.domElement);
        if (arToolkitContext.arController !== null) {
            arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
        }
        console.log("Redimensionnement effectué.");
    }

    const arToolkitContext = new THREEx.ArToolkitContext({
        cameraParametersUrl: 'data/camera_para.dat',
        detectionMode: 'mono',
    });

    arToolkitContext.init(() => {
        camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
        console.log("Contexte AR.js initialisé.");
    });

    const markerRoot = new THREE.Group();
    scene.add(markerRoot);

    const arMarkerControls = new THREEx.ArMarkerControls(arToolkitContext, markerRoot, {
        type: 'pattern',
        patternUrl: 'assets/pattern/10.patt',  // Assurez-vous que le chemin est correct
    });

    console.log("Contrôles du marker ajoutés.");

    // Configuration de la vidéo
    const video = document.createElement('video');
    video.src = "assets/video/6.mp4"; // Remplacez par le chemin correct de votre vidéo
    video.loop = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', 'playsinline');
    video.muted = false;
    video.autoplay = false;

    video.addEventListener('loadeddata', () => {
        console.log("Vidéo chargée et prête à être jouée.");
    });

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    // Ajustement du plan en fonction du ratio de l'image du marker
    const markerRatio = 4 / 3; // Exemple : si votre image est en ratio 4:3
    const markerHeight = 1.0; // Définissez une hauteur standard
    const markerWidth = markerHeight * markerRatio;

    const videoGeometry = new THREE.PlaneGeometry(markerWidth, markerHeight);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    // Centrer et aligner la vidéo sur le marker
    videoMesh.position.set(0, 0, 0); // Centrer sur le marker
    videoMesh.rotation.x = -Math.PI / 2; // Aligner avec le marker

    markerRoot.add(videoMesh);

    console.log("Vidéo ajoutée à la scène.");

    let videoPlaying = false;

    function render() {
        requestAnimationFrame(render);
        if (arToolkitSource.ready === false) return;

        arToolkitContext.update(arToolkitSource.domElement);

        // Vérifier si le marker est visible
        if (markerRoot.visible) {
            console.log("Marker détecté, lancement de la vidéo.");
            if (!videoPlaying) {
                video.play(); // Démarrer la vidéo si elle n'est pas encore en lecture
                videoPlaying = true;
                console.log("Vidéo démarrée.");
            }
        } else {
            console.log("Marker non détecté.");
            if (videoPlaying) {
                video.pause(); // Mettre la vidéo en pause si le marker n'est plus visible
                videoPlaying = false;
                console.log("Vidéo mise en pause.");
            }
        }

        renderer.render(scene, camera);
        console.log("Rendu effectué.");
    }

    render();
    console.log("Rendu démarré.");
});
