import * as THREE from 'three';

import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

let container,
    searchBox,
    clock,
    mixer,
    actions,
    currentAction,
    currentActionIndex,
    previousAction,
    skeletonHelper,
    states,
    camera,
    controls,
    hemiLight,
    dirLight,
    scene,
    groundMesh,
    groundGrid,
    renderer,
    loader,
    model,
    animations,
    prompt,
    gui,
    rhController,
    lhController;

init();
animate();

function init() {
    container = document.getElementById( 'fingerspellingGenerator' );

    searchBox = document.getElementById( 'searchBox' );
    searchBox.addEventListener( 'keydown', onSearch );

    clock = new THREE.Clock();

    // camera
    camera = new THREE.PerspectiveCamera( 30, container.offsetWidth / 400, 0.25, 100 );
    camera.position.set( 0.0, 2.0, 2.0 );
    camera.lookAt( 0, 0, 0 );

    // scene
    scene = new THREE.Scene();
    scene.background = new THREE.Color( 0xe0e0e0 );
    scene.fog = new THREE.Fog( 0xe0e0e0, 20, 100 );

    // lights
    hemiLight = new THREE.HemisphereLight( 0xffffff, 0x444444 );
    hemiLight.position.set( 0, 20, 0 );
    scene.add( hemiLight );

    dirLight = new THREE.DirectionalLight( 0xffffff );
    dirLight.position.set( 0, 20, 10 );
    scene.add( dirLight );

    // ground
    groundMesh = new THREE.Mesh( new THREE.PlaneGeometry( 2000, 2000 ), new THREE.MeshPhongMaterial( { color: 0x999999, depthWrite: false } ) );
    groundMesh.rotation.x = - Math.PI / 2;
    scene.add( groundMesh );

    groundGrid = new THREE.GridHelper( 200, 40, 0x000000, 0x000000 );
    groundGrid.material.opacity = 0.2;
    groundGrid.material.transparent = true;
    scene.add( groundGrid );
    
    // GUI
    createGUI();
    
    // model
    loadModel( '../../assets/3d/right-handed.glb' );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( container.offsetWidth, 400 );
    container.appendChild( renderer.domElement );
    
    // controls
    controls = new OrbitControls( camera, renderer.domElement );
    controls.zoomSpeed = 0.1;
    controls.target = new THREE.Vector3( 0.0, 1.5, 0.0 );
    controls.update();

    window.addEventListener( 'resize', onWindowResize );
}

function createGUI() {
    gui = new GUI( { width: 100, autoPlace: false } );
    const customContainer = $('.moveGUI').append($(gui.domElement));

    rhController = gui.add( { 'right-handed': true }, 'right-handed' ).onChange( changeRightHanded );
    lhController = gui.add( { 'left-handed': false }, 'left-handed' ).onChange( changeLeftHanded );
    
    gui.close();
}

function loadModel(modelPath) {
    loader = new GLTFLoader();
    loader.load( modelPath, function ( gltf ) {
        model = gltf.scene;
        scene.add( model );
        
        animations = gltf.animations;
        
        skeletonHelper = new THREE.SkeletonHelper( model );
        skeletonHelper.material = new THREE.LineBasicMaterial( {
            color: 0x000000,
            linewidth: 1,
            linecap: 'round',
            linejoin:  'round'
        } );
        skeletonHelper.visible = true;
        scene.add( skeletonHelper );

        prompt = [];
        currentActionIndex = 0;
        createAnimations();
    },
    undefined,
    function ( e ) {
        console.error( e );
    } );
}

function createAnimations() {
    states = [ 'idle', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' ];

    mixer = new THREE.AnimationMixer( model );
    mixer.timeScale = 1.0;
    mixer.addEventListener( 'finished', playNextAction );

    actions = {};

    for ( let i = 0; i < animations.length; i++ ) {
        const clip = animations[ i ];
        const action = mixer.clipAction( clip );

        actions[ clip.name ] = action;

        action.clampWhenFinished = true;
        action.loop = THREE.LoopOnce;
    }
    
    currentAction = actions[ 'idle' ];
    currentAction.play();
}

function playNextAction() {
    if ( currentActionIndex === prompt.length ) return;

    previousAction = currentAction;
    currentAction = actions[ prompt[ currentActionIndex ] ];

    if ( previousAction !== currentAction ) {
        previousAction.fadeOut( 0.5 );
    }

    currentAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( 0.5 )
        .play();

    currentActionIndex++;
}

function onSearch() {
    if (event.keyCode === 13) {
        searchBox.blur();

        prompt = [];
        currentActionIndex = 0;

        const letterSequence = searchBox.value;
        const regexLetters = /^[a-zA-Z]+$/;
        for ( let i = 0; i < letterSequence.length; i++) {
            if ( letterSequence[ i ].match( regexLetters ) ) {
                prompt.push( letterSequence[ i ] );
            }
        }

        createAnimations();
    }
}

function changeRightHanded( status ) {
    if (status == false) {
        rhController.object = { 'right-handed': true }
        rhController.updateDisplay();
    }
    else {
        rhController.object = { 'right-handed': true }
        rhController.updateDisplay();
        lhController.object = { 'left-handed': false }
        lhController.updateDisplay();
        
        model.removeFromParent();
        skeletonHelper.removeFromParent();
        loadModel( '../../assets/3d/right-handed.glb' );
    }
}

function changeLeftHanded( status ) {
    if (status == false) {
        lhController.object = { 'left-handed': true }
        lhController.updateDisplay();
    }
    else {
        lhController.object = { 'left-handed': true }
        lhController.updateDisplay();
        rhController.object = { 'right-handed': false }
        rhController.updateDisplay();
        
        model.removeFromParent();
        skeletonHelper.removeFromParent();
        loadModel( '../../assets/3d/left-handed.glb' );
    }
}

function onWindowResize() {
    camera.aspect = container.offsetWidth / 400;
    camera.updateProjectionMatrix();

    renderer.setSize( container.offsetWidth, 400 );
}

function animate() {
    const dt = clock.getDelta();

    if ( mixer ) mixer.update( dt );

    requestAnimationFrame( animate );
    renderer.render( scene, camera );
}
