"use strict";

//import statements
import {TRIANGULATION} from '../third-party/triangulation.js';
import { FaceMeshFaceGeometry } from '../third-party/face.js';
//import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {OrbitControls} from "../third-party/OrbitControls.js";
import {EarringLeft} from "./jewelery/earringLeft.js";
import {EarringRight} from "./jewelery/earringRight.js";
import {Necklace} from "./jewelery/necklace.js";
import {NoseRing} from "./jewelery/nosering.js";
import {Bottu} from "./jewelery/bottu.js";
import {Mask} from "./jewelery/mask.js";
import {Goggles} from "./jewelery/goggles.js";
import {Shirt} from "./jewelery/shirt.js";
import {ModelHelper} from "./helpers/modelHelper.js";
import {ControlsHelper} from "./helpers/controlsHelper.js"
import {NeckOccluder} from "./jewelery/neckOccluder.js";
import {Ring} from './jewelery/ring.js';
import {Bangle} from './jewelery/bangle.js';
import {HeadLocket} from './jewelery/headLocket.js';
import {Facemask} from './jewelery/facemask.js';
import {Hat} from './jewelery/hat.js';
//import {RGBELoader} from "https://cdn.jsdelivr.net/npm/three@0.116.1/examples/jsm/loaders/RGBELoader.js"
import {RGBELoader} from "../third-party/RGBELoader.js";
import {Scene, OrthographicCamera, PerspectiveCamera, WebGLRenderer, sRGBEncoding, PointLight, HemisphereLight, UnsignedByteType, PMREMGenerator} from "../third-party/three.module.js";
//STOP UNDOING HERE 1/26/2021
//import {MPPose} from './mppose.js'
//import {MPHolistic} from './holistic.js';
//import {MPFacemesh} from './mpfacemesh.js';

//initialize dat.GUI(Interface for controls)
var gui = new dat.GUI();
//initialize controlshelper(map with different settings to customize with)
var settings = new ControlsHelper();

//Initialize Earring Folder
var earringFolder = gui.addFolder("Earrings(Pre-Release/Release)");
earringFolder.add(settings.earrings, 'enabled')
    .name("Include Earrings").listen();
earringFolder.add(settings.earrings.left, 'zOff')
    .name("Z offset(Earring: left)").min(-1000).max(1000).step(1);
earringFolder.add(settings.earrings.left, 'xOff')
    .name("X offset(Earring: left)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.left, 'yOff')
    .name("Y offset(Earring: left)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.left, 'scaleOff')
    .name("Scale(Earring: Left)").min(-5).max(10).step(1);
earringFolder.add(settings.earrings.left, 'zRot')
    .name("Z rot(Earring: left)").min(-1000).max(1000).step(1);
earringFolder.add(settings.earrings.left, 'xRot')
    .name("X rot(Earring: left)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.left, 'yRot')
    .name("Y rot(Earring: left)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.right, 'scaleOff')
    .name("Scale(Earring: Right)").min(-5).max(10).step(1);
earringFolder.add(settings.earrings.right, 'zOff')
    .name("Z offset(Earring: right)").min(-1000).max(1000).step(10);
earringFolder.add(settings.earrings.right, 'xOff')
    .name("X offset(Earring: right)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.right, 'yOff')
    .name("Y offset(Earring: right)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.right, 'zRot')
    .name("Z rot(Earring: right)").min(-1000).max(1000).step(1);
earringFolder.add(settings.earrings.right, 'xRot')
    .name("X rot(Earring: right)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings.right, 'yRot')
    .name("Y rot(Earring: right)").min(-200).max(200).step(1);
earringFolder.add(settings.earrings, 'earringType', [ 'Option 1', 'Option 2'] );
//Initialize Necklace Folder
var necklaceFolder = gui.addFolder("Necklace(Pre-Release/Release)");
necklaceFolder.add(settings.necklace, 'enabled')
    .name("Include Necklace").listen();
necklaceFolder.add(settings.necklace, 'zOff')
    .name("Z offset(Necklace)").min(-1000).max(1000).step(1);
necklaceFolder.add(settings.necklace, 'xOff')
    .name("X offset(Necklace)").min(-200).max(200).step(1);
necklaceFolder.add(settings.necklace, 'yOff')
    .name("Y offset(Necklace)").min(-200).max(400).step(1);
necklaceFolder.add(settings.necklace, 'rotation')
    .name("Rotation X(Necklace)").min(0).max(2 * Math.PI)
necklaceFolder.add(settings.necklace, 'scaleOff')
    .name("Scale(Necklace)").min(-10).max(20).step(1);
necklaceFolder.add(settings.necklace, 'necklaceType', [ 'Option 1', 'Option 2'] );
//Initialize bottu folder
var bottuFolder = gui.addFolder("Bottu(Release)");
bottuFolder.add(settings.bottu, 'enabled')
    .name("Include Bottu").listen();
bottuFolder.add(settings.bottu, 'zOff')
    .name("Z offset(Bottu)").min(-1000).max(1000).step(1);
bottuFolder.add(settings.bottu, 'xOff')
    .name("X offset(Bottu)").min(-200).max(200).step(1);
bottuFolder.add(settings.bottu, 'yOff')
    .name("Y offset(Bottu)").min(-200).max(200).step(1);
//Initialize Nose Ring Folder
var noseRingFolder = gui.addFolder("Nose Ring(Release)");
noseRingFolder.add(settings.nosering, 'enabled')
    .name("Include Nose Ring").listen();
noseRingFolder.add(settings.nosering, 'zOff')
    .name("Z offset(Nose Ring)").min(-1000).max(1000).step(1);
noseRingFolder.add(settings.nosering, 'xOff')
    .name("X offset(Nose Ring)").min(-200).max(200).step(1);
noseRingFolder.add(settings.nosering, 'yOff')
    .name("Y offset(Nose Ring)").min(-200).max(200).step(1);
//Initialize Goggle Folder
var goggleFolder = gui.addFolder("Goggles(Release)");
goggleFolder.add(settings.goggles, 'enabled')
    .name("Include Goggles").listen();
goggleFolder.add(settings.goggles, 'zOff')
    .name("Z offset(Goggles)").min(-1000).max(1000).step(1);
goggleFolder.add(settings.goggles, 'xOff')
    .name("X offset(Goggles)").min(-200).max(200).step(1);
goggleFolder.add(settings.goggles, 'yOff')
    .name("Y offset(Goggles)").min(-200).max(400).step(1);
goggleFolder.add(settings.goggles, 'scaleOff')
    .name("Scale(Goggles)").min(-10).max(20).step(1);
goggleFolder.add(settings.goggles, 'rotZ')
    .name("RotZ(Goggles)").min(-100).max(100).step(1);
goggleFolder.add(settings.goggles, 'rotX')
    .name("RotX(Goggles)").min(-100).max(100).step(1);
goggleFolder.add(settings.goggles, 'rotY')
    .name("RotY(Goggles)").min(-100).max(100).step(1);
//Initialize Hat Folder
var hatFolder = gui.addFolder("hat(Release)");
hatFolder.add(settings.hat, 'enabled')
    .name("Include hat").listen();
hatFolder.add(settings.hat, 'zOff')
    .name("Z offset(hat)").min(-1000).max(1000).step(1);
hatFolder.add(settings.hat, 'xOff')
    .name("X offset(hat)").min(-200).max(200).step(1);
hatFolder.add(settings.hat, 'yOff')
    .name("Y offset(hat)").min(-200).max(400).step(1);
hatFolder.add(settings.hat, 'scaleOff')
    .name("Scale(hat)").min(-10).max(20).step(1);
hatFolder.add(settings.hat, 'rotZ')
    .name("RotZ(hat)").min(-100).max(100).step(1);
hatFolder.add(settings.hat, 'rotX')
    .name("RotX(hat)").min(-100).max(100).step(1);
hatFolder.add(settings.hat, 'rotY')
    .name("RotY(hat)").min(-100).max(100).step(1);
//Initialize Shirt Folder
var shirtFolder = gui.addFolder("Shirts(Alpha)");
shirtFolder.add(settings.shirt, 'enabled')
    .name("Include Shirt").listen();
shirtFolder.add(settings.shirt, 'zOff')
    .name("Z offset(Shirt)").min(-1000).max(1000).step(1);
shirtFolder.add(settings.shirt, 'xOff')
    .name("X offset(Shirt)").min(-500).max(500).step(1);
shirtFolder.add(settings.shirt, 'yOff')
    .name("Y offset(Shirt)").min(-500).max(400).step(1);
shirtFolder.add(settings.shirt, 'scaleOff')
    .name("Scale(Shirt)").min(-10).max(40).step(1);
//Initialize Neck Occluder Folder
var neckOccluderFolder = gui.addFolder("Neck Occluder(Alpha)");
neckOccluderFolder.add(settings.neck, 'enabled')
    .name("Include Neck Occluder").listen();
neckOccluderFolder.add(settings.neck, 'zOff')
    .name("Z offset(Neck)").min(-1000).max(1000).step(1);
neckOccluderFolder.add(settings.neck, 'xOff')
    .name("X offset(Neck)").min(-500).max(500).step(1);
neckOccluderFolder.add(settings.neck, 'yOff')
    .name("Y offset(Neck)").min(-500).max(400).step(1);
neckOccluderFolder.add(settings.neck, 'scaleOff')
    .name("Scale(Neck)").min(-10).max(80).step(1);
//Initialize Ring Folder
var ringFolder = gui.addFolder("Ring(Alpha)");
ringFolder.add(settings.ring, 'enabled')
    .name("Include Ring").listen();
ringFolder.add(settings.ring, 'zOff')
    .name("Z offset(Ring)").min(-1000).max(1000).step(1);
ringFolder.add(settings.ring, 'xOff')
    .name("X offset(Ring)").min(-500).max(500).step(1);
ringFolder.add(settings.ring, 'yOff')
    .name("Y offset(Ring)").min(-500).max(400).step(1);
ringFolder.add(settings.ring, 'scaleOff')
    .name("Scale(Ring)").min(-40).max(40).step(1);
//Initialize Bangle Folder
var bangleFolder = gui.addFolder("Bangle(Alpha)");
bangleFolder.add(settings.bangle, 'enabled')
    .name("Include Bangle").listen();
bangleFolder.add(settings.bangle, 'zOff')
    .name("Z offset(Bangle)").min(-1000).max(1000).step(1);
bangleFolder.add(settings.bangle, 'xOff')
    .name("X offset(Bangle)").min(-500).max(500).step(1);
bangleFolder.add(settings.bangle, 'yOff')
    .name("Y offset(Bangle)").min(-500).max(400).step(1);
bangleFolder.add(settings.bangle, 'scaleOff')
    .name("Scale(Bangle)").min(-80).max(40).step(1);
//Initialize Head Locket Folder
var headLocketFolder = gui.addFolder("Head Locket(Alpha)");
headLocketFolder.add(settings.headlocket, 'enabled')
    .name("Include Head Locket").listen();
headLocketFolder.add(settings.headlocket, 'zOff')
    .name("Z offset(Head Locket)").min(-1000).max(1000).step(1);
headLocketFolder.add(settings.headlocket, 'xOff')
    .name("X offset(Head Locket)").min(-500).max(500).step(1);
headLocketFolder.add(settings.headlocket, 'yOff')
    .name("Y offset(Head Locket)").min(-500).max(400).step(1);
headLocketFolder.add(settings.headlocket, 'xRot')
    .name("Xrot Offset(HeadLocket)").min(-1000).max(1000).step(1);
headLocketFolder.add(settings.headlocket, 'yRot')
    .name("Yrot Offset(HeadLocket)").min(-500).max(500).step(1);
headLocketFolder.add(settings.headlocket, 'zRot')
    .name("Zrot Offset(HeadLocket)").min(-500).max(400).step(1);
headLocketFolder.add(settings.headlocket, 'scaleOff')
    .name("Scale(Head Locket)").min(-80).max(40).step(1);
//Initialize Face Mask Folder
var faceMaskFolder = gui.addFolder("Face Mask(Alpha)")
faceMaskFolder.add(settings.facemask, 'enabled')
    .name("Include Face Mask").listen();
faceMaskFolder.add(settings.facemask, 'zOff')
    .name("Z offset(Face Mask)").min(-1000).max(1000).step(1);
faceMaskFolder.add(settings.facemask, 'xOff')
    .name("X offset(Face Mask)").min(-500).max(500).step(1);
faceMaskFolder.add(settings.facemask, 'yOff')
    .name("Y offset(Face Mask)").min(-500).max(400).step(1);
faceMaskFolder.add(settings.facemask, 'xRot')
    .name("Xrot Offset(Face Mask)").min(-1000).max(1000).step(1);
faceMaskFolder.add(settings.facemask, 'yRot')
    .name("Yrot Offset(Face Mask)").min(-500).max(500).step(1);
faceMaskFolder.add(settings.facemask, 'zRot')
    .name("Zrot Offset(Face Mask)").min(-500).max(400).step(1);
faceMaskFolder.add(settings.facemask, 'scaleOff')
    .name("Scale(Face Mask)").min(-80).max(40).step(1);

//access video element
var video = document.getElementById("video");
//access canvas element
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
//access width and height(for sizing)
var container = document.getElementById("container");
//setting variable modelHelper as blank
//(model helper is a class with handpose facemesh 
//enabled so user doesnt have to instantiate it)
//STOP UNDOING HERE!
var modelHelper;
const pose = new Pose({locateFile: (file) => {
  return `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`;
}});
pose.setOptions({
  upperBodyOnly: true,
  smoothLandmarks: true,
  minDetectionConfidence: 0.5,
  minTrackingConfidence: 0.5
});
var result;
pose.onResults((results) => {result = results; /*console.log(results)*/});

//var mpHolistic;
//shouldStop checks whether or not to stop the program
var shouldStop = true;
//initialize scene(blank world)
var scene = new Scene();
//initialize variables for orthographic and perspective camera(CHANGE TO -1000 undo here)
var ocamera = new OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -1000, 1000);
var pcamera = new PerspectiveCamera( 45, 1, 1, 1000 );
var debug = false;
var controls = {};
//uses orthographic or perspective camera based on debug variable
var camera;
if(debug){
    camera = pcamera;
} else {
    camera = ocamera;
}
//initialize Renderer
var renderer = new WebGLRenderer({alpha: true, antialias:true });
//render settings
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.toneMapping = THREE.ACESFilmicToneMapping;
// renderer.toneMappingExposure = 0.8;
// renderer.outputEncoding = THREE.sRGBEncoding;
renderer.outputEncoding = sRGBEncoding;
//Loading elements
var loader = document.getElementById("loader");
var loadtext = document.getElementById("loading-text");
//Width and height variable(possible for resizing idk)
let width = 0;
let height = 0;
//playedOnce variable to check how many times video.addeventlistener(playing)
//executed. Sometimes it may run twice but idk really i may not need it
var playedOnce = false;
//Checks to see if I can start program
var canStart = false;
//adds renderer to html
container.appendChild(renderer.domElement)
//initialize OrbitControls(to look around scene)
var orbitControls = new OrbitControls(camera, renderer.domElement);
////console.log(orbitControls);\
//used to reset orbitControls
var camToSave = {};
camToSave.position = camera.position.clone();
camToSave.rotation = camera.rotation.clone();
camToSave.controlCenter = orbitControls.target.clone();
//sets renderer size to proper width and height
renderer.setSize( canvas.width, canvas.height );
async function startVideo(){
    //initializes video
    var constraints = { audio: false, video: { width: canvas.width, height: canvas.height} }; 
    try{
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch(err){
        console.log(err.name + ": " + err.message);
    }
}
function setWidths(){
    //sets width of canvas based on screen size
//    const w =Math.min(window.innerWidth, window.innerHeight)/1.5;
    const w = window.innerWidth/2.5;
    const h = window.innerHeight/1.5;
//    const h = Math.min(window.innerWidth, window.innerHeight)/1.5;
    container.width = w;
    container.height = h;
    container.style.width = w + "px";
    container.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    video.width = w;
    video.height = h;
    video.style.width = w + "px";
    video.style.height = h + "px";
}
//for debugging purposes
console.log("Program started");
console.log(video)
//resizes and starts video
setWidths();
resize();
startVideo();
function resize(){
    //resizes three.js camera based on screen size
    camera.left = -.5 * canvas.width;
    camera.right = .5 * canvas.width;
    camera.top = -.5 * canvas.height;
    camera.bottom = .5 * canvas.height;
    camera.updateProjectionMatrix(); 
    renderer.setSize(canvas.width, canvas.height)
}
//resizes camera when window size changes
window.addEventListener("resize", async () => {
    resize();
})

video.addEventListener("playing", async () => {
    if(!playedOnce){
        //sets loader state to loading
        loader.className = "loading-state"
        loadtext.innerText = "Status: Loading Model"
        //initializes model helper(see class)
        modelHelper = new ModelHelper();
        await modelHelper.load(canvas.width, canvas.height);
        
//        mpHolistic = new MPHolistic();
//        mpFacemesh = new MPFacemesh();
//        mpPose = new MPPose();
        canStart = true;
        console.log("CAN START LOL");
        playedOnce = true;
        loader.className = "dormant-state"
        loadtext.innerText = "Status: idle";
    }
})
function startLandmarkVideo() {
    shouldStop = false;
    window.requestAnimationFrame(getLandmarks)
}
function setLighting(){
//    const light = new PointLight(0xffffff, 2, 5);
//    light.position.set(0, 10, 0);
//    scene.add(light);
    var hemiLight = new HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( hemiLight );
    //Stop undoing here
    new RGBELoader()
		.setDataType( UnsignedByteType )
    //https://threejs.org/examples/textures/equirectangular/royal_esplanade_1k.hdr
		.load( './assets/royal_esplanade_1k.hdr', function ( texture ) {

		var envMap = pmremGenerator.fromEquirectangular( texture ).texture;

		scene.background = envMap;
		scene.environment = envMap;

		texture.dispose();
		pmremGenerator.dispose();
    })
    var pmremGenerator = new PMREMGenerator( renderer );
	pmremGenerator.compileEquirectangularShader();

}

const FRAMES_PER_SECOND = 20;  // Valid values are 60,30,20,15,10...
// set the mim time to render the next frame
const FRAME_MIN_TIME = (1000/60) * (60 / FRAMES_PER_SECOND) - (1000/60) * 0.5;
var lastFrameTime = 0;  // the last frame time

//UNDOING
async function predict(){
//    subpredict(videoElement)
    console.log("here");
    
    console.log("here1");
    await pose.send({image: video})
    console.log("here2");
//    console.log("ok")
//    window.requestAnimationFrame(predict)
}

async function startThreeJS(){
    
    
    shouldStop = false;
    //sets loader to loading
    loader.className = "loading-state"
    loadtext.innerText = "Setting Lighting"
    setLighting();
    //adds earrings to scene
    loadtext.innerText = "Adding Earrings"
    var leftEarring = new EarringLeft(await EarringLeft.create(
        settings.earrings.earringType == "Option 1" ? './obj/earrings/untitled.obj' : './obj/earrings/secondearring.obj'));
    scene.add(leftEarring.mesh);
    var rightEarring = new EarringRight(await EarringRight.create(
        settings.earrings.earringType == "Option 1" ? './obj/earrings/untitled.obj' : './obj/earrings/secondearring.obj'));
    scene.add(rightEarring.mesh); 
    //adds necklace to scene
    loadtext.innerText = "Adding Necklace"
    if(settings.necklace.necklaceType == "Option 1"){
        var necklace = new Necklace(await Necklace.create("./obj/necklace/necklace.obj"));
        scene.add(necklace.mesh);       
    } else {
        var necklace = new Necklace(await Necklace.create("./obj/necklace/necklace2.obj"));
        scene.add(necklace.mesh);
    }
    //adds other jewelry to scene
    loadtext.innerText = "Adding Nosering"
    var noseRing = new NoseRing(NoseRing.create());
    scene.add(noseRing.mesh);
    loadtext.innerText = "Adding Bottu"
    var bottu = new Bottu(Bottu.create());
    scene.add(bottu.mesh)
    loadtext.innerText = "Adding Goggles"
    var goggles = new Goggles(await Goggles.createGLTF("./obj/sungoggles/sungoggles.glb"));
    scene.add(goggles.mesh);
    loadtext.innerText = "Adding Hat"
    var hat = new Hat(await Hat.createGLTF("./obj/hat/hat.glb"));
    scene.add(hat.mesh);
    loadtext.innerText = "Adding Shirt"
    var shirt = new Shirt(await Shirt.create("./obj/shirt/shirt.obj"));
    scene.add(shirt.mesh);
//    loadtext.innerText = "Adding Occluder"
//    var neck = new NeckOccluder(await NeckOccluder.create(video));
//    scene.add(neck.mesh);
    loadtext.innerText = "Adding Ring"
    var ring = new Ring(await Ring.create("./obj/ring/ring.obj"));
    scene.add(ring.mesh);
    loadtext.innerText = "Adding Bangle"
    var bangle = new Bangle(await Bangle.create("./obj/ring/ring.obj"));
    scene.add(bangle.mesh);
    loadtext.innerText = "Adding Face mask"
    var facemask = new Facemask(await Facemask.createGLTF("./obj/facemask/mask4.glb"))
    scene.add(facemask.mesh);
    loadtext.innerText = "Adding Maang Tikka"
    var headLocket = new HeadLocket(HeadLocket.create());
    scene.add(headLocket.mesh);
    loadtext.innerText = "Adding Face Occluder"
    var mask = new Mask(Mask.create({
        points: await modelHelper.predictFace(video), 
        camera: camera, 
        width: canvas.width, 
        height: canvas.height, 
        video: video
    }));
    scene.add(mask.mesh)
    camera.position.z = 5;
    //sets loader to dormant(inactive)
    loader.className = "dormant-state";
    loadtext.innerText = "Status: Try jewelery on(Wait until after choppy framerate)!";
    var startThreeJSAnimation = async function (time){
        //gets landmarks
        //move below

        
        let t0 = performance.now()
        await pose.send({image: video})
 
        if(!shouldStop){
//            if(time-lastFrameTime < FRAME_MIN_TIME){ //skip the frame if the call is too early
//                requestAnimationFrame(startThreeJSAnimation);
//                return; // return as there is nothing to do
//            }
//            
//            lastFrameTime = time;
//            await setTimeout(() => {}, )
            window.requestAnimationFrame(startThreeJSAnimation);
        }
//        console.log(faceLandmarks);
//        console.log(handLandmarks);
//        console.log(poseLandmarks);
        //if not stop then play animation

        
//        var holistic = await mpHolistic.predict(video);
//        mpPose.predict(video)
//            console.log("here");
            
//            console.log("here1");
//            await pose.send({image: video})
//            console.log("here2");
        //    console.log("ok")
//            window.requestAnimationFrame(predict)
        //UNDOING
//        predict()
        
        
        var faceLandmarks = await modelHelper.predictFace(video);
        

//        var poseLandmarks = await modelHelper.predictPose (video, canvas)/*holistic.poseLandmarks*/;
        if(settings.ring.enabled || settings.bangle.enabled){
            var handLandmarks = await modelHelper.predictHands(video);
        }
//        console.log(poseLandmarks)
//        var mpplandmarks = await modelHelper.predictMP(video);
//        //TODO: Try initializing mediapipe here...
//        await modelHelper.mppose.send({image: video})
//        this.mppose.onResults((results)=> {console.log(results)}); 
        
        //initialize OrbitControl settings
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;
        controls.screenSpacePanning = false;
        controls.minDistance = 100;
        controls.maxDistance = 500;
        
        
        //update face mesh
        await mask.update({
            points: faceLandmarks, 
            camera: camera, 
            width: canvas.width, 
            height: canvas.height, 
            video: video
        });
        
        //hide/show earrings and update
        
        if(settings.earrings.enabled == false){
            leftEarring.hide();
            rightEarring.hide();
        } else {
            leftEarring.show();
            rightEarring.show();
            await leftEarring.update({
                poses: result, 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: settings.earrings.left.xOff,
                yOff: settings.earrings.left.yOff,
                zOff: settings.earrings.left.zOff,
                scaleOff:settings.earrings.left.scaleOff,
                earringPath: settings.earrings.earringType == "Option 1" ? './obj/earrings/untitled.obj' : './obj/earrings/secondearring.obj',
                adaptive: true,
                rotX: settings.earrings.left.xRot,
                rotY: settings.earrings.left.yRot,
                rotZ: settings.earrings.left.zRot
            });
            await rightEarring.update({
                poses: result, 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: settings.earrings.right.xOff,
                yOff: settings.earrings.right.yOff,
                zOff: settings.earrings.right.zOff,
                scaleOff:settings.earrings.right.scaleOff,
                earringPath: settings.earrings.earringType == "Option 1" ? './obj/earrings/untitled.obj' : './obj/earrings/secondearring.obj',
                adaptive: true,
                rotX: settings.earrings.right.xRot,
                rotY: settings.earrings.right.yRot,
                rotZ: settings.earrings.right.zRot
            }) 
        }
        //HS&U nosering
        if(settings.nosering.enabled == false){
            noseRing.hide();
        } else {
            noseRing.show();
            noseRing.update({
                mask: mask.mesh,
                xOff: settings.nosering.xOff,
                yOff: settings.nosering.yOff,
                zOff: settings.nosering.zOff
            });
        }
        //HS&U bottu
        if(settings.bottu.enabled == false){
            bottu.hide();
        } else {
            bottu.show();
            bottu.update({
                mask: mask.mesh,
                zOff: settings.bottu.zOff,
                xOff: settings.bottu.xOff,
                yOff: settings.bottu.yOff
            });
        }
        //HS&U necklace
        if(settings.necklace.enabled == false){
            necklace.hide();
        } else {
            necklace.show();
            await necklace.update({
                poses: result,
                camera: camera,
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: settings.necklace.xOff,
                yOff: settings.necklace.yOff,
                zOff: settings.necklace.zOff,
                scaleOff: settings.necklace.scaleOff,
                rotX: settings.necklace.rotation,
                necklacePath: settings.necklace.necklaceType == "Option 1" ? './obj/necklace/necklace2.obj' : './obj/necklace/necklace.obj',
                adaptive: true,
            });
        }
        //HS&U goggles
        if(settings.goggles.enabled == false){
            goggles.hide();
        } else {
            goggles.show();
            await goggles.update({
                mask: mask.mesh,
                zOff: settings.goggles.zOff,
                xOff: settings.goggles.xOff,
                yOff: settings.goggles.yOff,
                rotZ: settings.goggles.rotZ,
                rotX: settings.goggles.rotX,
                rotY: settings.goggles.rotY,
                scaleOff: settings.goggles.scaleOff,
                poses: result,
                adaptive: true,
                width: canvas.width,
                height: canvas.height,
                camera: camera
            });
        }
        //HS&U hat
        if(settings.hat.enabled == false){
            hat.hide();
        } else {
            hat.show();
            await hat.update({
                mask: mask.mesh,
                zOff: settings.hat.zOff,
                xOff: settings.hat.xOff,
                yOff: settings.hat.yOff,
                rotZ: settings.hat.rotZ,
                rotX: settings.hat.rotX,
                rotY: settings.hat.rotY,
                scaleOff: settings.hat.scaleOff,
                poses: result,
                adaptive: true,
                width: canvas.width,
                height: canvas.height,
                camera: camera
            });
        }
        //HS&U shirt
        if(settings.shirt.enabled == false){
            shirt.hide();
        } else {
//            console.log("hello");
            shirt.show();
            await shirt.update({
                poses: result, 
                xOff: settings.shirt.xOff, 
                yOff: settings.shirt.yOff, 
                zOff: settings.shirt.zOff, 
                width: canvas.width, 
                height: canvas.height, 
                scaleOff: settings.shirt.scaleOff, 
                camera: camera, 
                shirtPath: "./obj/shirt/shirt.obj"
            });
        }
        //HS&U neck
//        if(settings.neck.enabled){
////            console.log("HI")
//            neck.show();
//            await neck.update({
//                poses: result, 
//                xOff: settings.neck.xOff,
//                yOff: settings.neck.yOff,
//                zOff: settings.neck.zOff,
//                width: canvas.width, 
//                height: canvas.height, 
//                camera: camera,
//                widthOff: settings.controls.scaleOff,
//            });
//        } else {
//            neck.hide();
//        }
        //HS&U ring
        if(settings.ring.enabled){
            ring.show();
//            console.log(handLandmarks);
            await ring.update({
                points: handLandmarks,
                xOff: settings.ring.xOff,
                yOff: settings.ring.yOff,
                zOff: settings.ring.zOff,
                scaleOff: settings.ring.scaleOff,
                width: canvas.width,
                height: canvas.height,
                camera: camera,
//                adaptive: true,
                adaptive:false,
                rotatable:true,
            });
        } else {
            ring.hide();
        }
        //HS&U bangle
        if(settings.bangle.enabled){
//            console.log("OKAY");
            bangle.show();
            bangle.update({
                points: handLandmarks, 
                xOff: settings.bangle.xOff, 
                yOff: settings.bangle.yOff, 
                zOff: settings.bangle.zOff, 
                scaleOff: settings.bangle.scaleOff, 
                adaptive: false, 
                rotatable: true,
                width: canvas.width,
                height: canvas.height,
                camera: camera
            });
        } else {
            bangle.hide();
        }
        //HS&U headlocket
        if(settings.headlocket.enabled){
            headLocket.show();
            headLocket.update({
                mask: mask.mesh, 
                xOff: settings.headlocket.xOff, 
                yOff: settings.headlocket.yOff, 
                zOff: settings.headlocket.zOff, 
                scaleOff: settings.headlocket.scaleOff,
                xRot: settings.headlocket.xRot,
                yRot: settings.headlocket.yRot,
                zRot: settings.headlocket.zRot,
            });
        } else {
            headLocket.hide();
        }
        
        //HS&U facemask
        if(settings.facemask.enabled){
            facemask.show();
            facemask.update({
                mask: mask.mesh,
                xOff: settings.facemask.xOff,
                yOff: settings.facemask.yOff,
                zOff: settings.facemask.zOff,
                scaleOff: settings.facemask.scaleOff,
                xRot: settings.facemask.xRot,
                yRot: settings.facemask.yRot,
                zRot: settings.facemask.zRot,
                poses: result,
                adaptive: true,
                width: canvas.width,
                height: canvas.height,
                camera: camera
            });
        } else {
            facemask.hide()
        }

        
        //render scene
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
        renderer.render( scene, camera );
        
        let t1 = performance.now()
        console.log((t1-t0)/1000)
        let fps = document.getElementById("FPS")
        fps.innerText = 1/((t1-t0)/1000) + "FPS"

        
    }
    //call animation function
    window.requestAnimationFrame(startThreeJSAnimation);
}
//function to stop video - clears canvas
function stopVideo(){
    shouldStop = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scene.remove.apply(scene, scene.children);
}
//resets orbit controls
async function resetOrbit(){
    camera.position.set(camToSave.position.x, camToSave.position.y, camToSave.position.z);
    camera.rotation.set(camToSave.rotation.x, camToSave.rotation.y, camToSave.rotation.z);

    orbitControls.target.set(camToSave.controlCenter.x, camToSave.controlCenter.y, camToSave.controlCenter.z);
    orbitControls.update();
    stopVideo();
    await startThreeJS();
    console.log("RESETTED")
}
//var landmarkButton = document.getElementById("landmarkButton");
//gets ids of buttons for each
var stopvideo = document.getElementById("stopVideo");
var threeJS = document.getElementById("threeJS");
var reset = document.getElementById("resetOrbit");
//wires functions to buttons
stopvideo.addEventListener('click', stopVideo);
threeJS.addEventListener('click', startThreeJS);
reset.addEventListener('click', resetOrbit);