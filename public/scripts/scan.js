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
        patternUrl: 'assets/pattern/3.patt',
    });

    console.log("Contrôles du marker ajoutés.");

    // Configuration de la vidéo
    const video = document.createElement('video');
    video.src = "assets/video/6.mp4"; // Remplacez par le chemin correct de votre vidéo
    video.loop = true;
    video.preload = 'auto';
    video.setAttribute('playsinline', 'playsinline');
    video.muted = false; // Assurez-vous que le son est activé
    video.autoplay = false; // La vidéo ne doit pas se lancer automatiquement

    video.addEventListener('loadeddata', () => {
        console.log("Vidéo chargée et prête à être jouée.");
    });

    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.minFilter = THREE.LinearFilter;
    videoTexture.magFilter = THREE.LinearFilter;
    videoTexture.format = THREE.RGBFormat;

    // Ajuster le plan pour un format portrait (9:16)
    const videoHeight = 1.6; // Ajustez cette valeur en fonction de vos besoins
    const videoWidth = videoHeight * (9 / 16);

    const videoGeometry = new THREE.PlaneGeometry(videoWidth, videoHeight);
    const videoMaterial = new THREE.MeshBasicMaterial({ map: videoTexture });
    const videoMesh = new THREE.Mesh(videoGeometry, videoMaterial);

    // Centrer et aligner la vidéo sur le marker
    videoMesh.position.set(0, 0, 0); // Centrer sur le marker
    videoMesh.rotation.x = -Math.PI / 2; // Aligner avec le marker

    markerRoot.add(videoMesh);

    console.log("Vidéo ajoutée à la scène.");

    let videoPlaying = false; // Suivi de l'état de lecture de la vidéo

    function render() {
        requestAnimationFrame(render);
        if (arToolkitSource.ready === false) return;

        arToolkitContext.update(arToolkitSource.domElement);
        
        // Vérifier si le marker est visible
        if (markerRoot.visible) {
            if (!videoPlaying) {
                video.play(); // Démarrer la vidéo si elle n'est pas encore en lecture
                videoPlaying = true;
                console.log("Vidéo démarrée.");
            }
        } else {
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
