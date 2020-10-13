"use strict";

import {TRIANGULATION} from '../third-party/triangulation.js';
import { FaceMeshFaceGeometry } from '../third-party/face.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {OrbitControls} from "../third-party/OrbitControls.js";
import {EarringLeft} from "./earringLeft.js";
import {EarringRight} from "./earringRight.js";
import {Necklace} from "./necklace.js";
import {NoseRing} from "./nosering.js";
import {Bottu} from "./bottu.js";
import {Mask} from "./mask.js";
import {Goggles} from "./goggles.js";
//import {BangleRight} from "./bangleRight.js";
import {Shirt} from "./shirt.js";
import {ModelHelper} from "./modelHelper.js";
import {NeckOccluder} from "./neckOccluder.js";
import {Ring} from './ring.js';
import {Bangle} from './bangle.js';
import {HeadLocket} from './headLocket.js';

var gui = new dat.GUI();
var controls = {
    needEarrings: false,
    needNecklace: false,
    needBottu: false,
    needNoseRing: false,
    needBangle: false,
    needRing: false,
    needGoggles: false,
    needShirt: false,
    needNeckoccluder: false,
    needHeadLocket: false,
    zOff: -100,
    yOff: 60,
    xOff: -10,
    zOff2:-100,
    yOff2:60,
    xOff2:10,
    zOff3:-700,
    yOff3:200,
    xOff3:-10,
    xOff4:0,
    yOff4:0,
    zOff4:0,
    xOff5:0,
    yOff5:0,
    zOff5:0,
    xOff6:0,
    yOff6:0,
    zOff6:0,
    xOff7:0,
    yOff7:0,
    zOff7:0,
    zOff8:0,
    yOff8:0,
    xOff8:0,
    zOff9:0,
    yOff9:0,
    xOff9:0,
    zOff10:0,
    xOff10:0,
    yOff10:0,
    zOff11:0,
    xOff11:0,
    yOff11:0,
    scaleOff:0,
    scaleOff2:0,
    scaleOff3:0,
    scaleOff4:0,
    scaleOff5:0,
    scaleOff6:0,
    scaleOff7:0,
    scaleOff8:0,
    rotX:0,
    goggleRotZ:0,
    earringType:'Option 1',
    necklaceType:'Option 1', 
}
var earringFolder = gui.addFolder("Earrings(Pre-Release/Release)");
earringFolder.add(controls, 'needEarrings').name("Include Earrings").listen();
earringFolder.add(controls, 'zOff').name("Z offset(Earring: left)").min(-1000).max(1000).step(10);
earringFolder.add(controls, 'xOff').name("X offset(Earring: left)").min(-200).max(200).step(10);
earringFolder.add(controls, 'yOff').name("Y offset(Earring: left)").min(-200).max(200).step(10);
earringFolder.add(controls, 'scaleOff').name("Scale(Earring: Left)").min(-5).max(10).step(1);
earringFolder.add(controls, 'scaleOff2').name("Scale(Earring: Right)").min(-5).max(10).step(1);
earringFolder.add(controls, 'zOff2').name("Z offset(Earring: right)").min(-1000).max(1000).step(100);
earringFolder.add(controls, 'xOff2').name("X offset(Earring: right)").min(-200).max(200).step(10);
earringFolder.add(controls, 'yOff2').name("Y offset(Earring: right)").min(-200).max(200).step(10);
earringFolder.add(controls, 'earringType', [ 'Option 1', 'Option 2'] );
var necklaceFolder = gui.addFolder("Necklace(Pre-Release/Release)");
necklaceFolder.add(controls, 'needNecklace').name("Include Necklace").listen();
necklaceFolder.add(controls, 'zOff3').name("Z offset(Necklace)").min(-1000).max(1000).step(10);
necklaceFolder.add(controls, 'xOff3').name("X offset(Necklace)").min(-200).max(200).step(10);
necklaceFolder.add(controls, 'yOff3').name("Y offset(Necklace)").min(-200).max(400).step(10);
necklaceFolder.add(controls, 'rotX').name("Rotation X(Necklace)").min(0).max(2 * Math.PI)
necklaceFolder.add(controls, 'scaleOff3').name("Scale(Necklace)").min(-10).max(20).step(1);
necklaceFolder.add(controls, 'necklaceType', [ 'Option 1', 'Option 2'] );
var bottuFolder = gui.addFolder("Bottu(Release)");
bottuFolder.add(controls, 'needBottu').name("Include Bottu").listen();
bottuFolder.add(controls, 'zOff4').name("Z offset(Bottu)").min(-1000).max(1000).step(10);
bottuFolder.add(controls, 'xOff4').name("X offset(Bottu)").min(-200).max(200).step(10);
bottuFolder.add(controls, 'yOff4').name("Y offset(Bottu)").min(-200).max(200).step(10);
var noseRingFolder = gui.addFolder("Nose Ring(Release)");
noseRingFolder.add(controls, 'needNoseRing').name("Include Nose Ring").listen();
noseRingFolder.add(controls, 'zOff5').name("Z offset(Nose Ring)").min(-1000).max(1000).step(10);
noseRingFolder.add(controls, 'xOff5').name("X offset(Nose Ring)").min(-200).max(200).step(10);
noseRingFolder.add(controls, 'yOff5').name("Y offset(Nose Ring)").min(-200).max(200).step(10);
var goggleFolder = gui.addFolder("Goggles(Release)");
goggleFolder.add(controls, 'needGoggles').name("Include Goggles").listen();
goggleFolder.add(controls, 'zOff6').name("Z offset(Goggles)").min(-1000).max(1000).step(10);
goggleFolder.add(controls, 'xOff6').name("X offset(Goggles)").min(-200).max(200).step(10);
goggleFolder.add(controls, 'yOff6').name("Y offset(Goggles)").min(-200).max(400).step(10);
goggleFolder.add(controls, 'scaleOff4').name("Scale(Goggles)").min(-10).max(20).step(1);
var shirtFolder = gui.addFolder("Shirts(Alpha)");
shirtFolder.add(controls, 'needShirt').name("Include Shirt").listen();
shirtFolder.add(controls, 'zOff7').name("Z offset(Shirt)").min(-1000).max(1000).step(5);
shirtFolder.add(controls, 'xOff7').name("X offset(Shirt)").min(-500).max(500).step(10);
shirtFolder.add(controls, 'yOff7').name("Y offset(Shirt)").min(-500).max(400).step(10);
shirtFolder.add(controls, 'scaleOff5').name("Scale(Shirt)").min(-10).max(40).step(1);
var neckOccluderFolder = gui.addFolder("Neck Occluder(Alpha)");
neckOccluderFolder.add(controls, 'needNeckoccluder').name("Include Neck Occluder").listen();
neckOccluderFolder.add(controls, 'zOff8').name("Z offset(Neck)").min(-1000).max(1000).step(10);
neckOccluderFolder.add(controls, 'xOff8').name("X offset(Neck)").min(-500).max(500).step(10);
neckOccluderFolder.add(controls, 'yOff8').name("Y offset(Neck)").min(-500).max(400).step(10);
neckOccluderFolder.add(controls, 'scaleOff6').name("Scale(Neck)").min(-10).max(80).step(1);
var ringFolder = gui.addFolder("Ring(Alpha)");
ringFolder.add(controls, 'needRing').name("Include Ring").listen();
ringFolder.add(controls, 'zOff9').name("Z offset(Ring)").min(-1000).max(1000).step(10);
ringFolder.add(controls, 'xOff9').name("X offset(Ring)").min(-500).max(500).step(10);
ringFolder.add(controls, 'yOff9').name("Y offset(Ring)").min(-500).max(400).step(10);
ringFolder.add(controls, 'scaleOff6').name("Scale(Ring)").min(-40).max(40).step(1);
var bangleFolder = gui.addFolder("Bangle(Alpha)");
bangleFolder.add(controls, 'needBangle').name("Include Bangle").listen();
bangleFolder.add(controls, 'zOff10').name("Z offset(Bangle)").min(-1000).max(1000).step(10);
bangleFolder.add(controls, 'xOff10').name("X offset(Bangle)").min(-500).max(500).step(10);
bangleFolder.add(controls, 'yOff10').name("Y offset(Bangle)").min(-500).max(400).step(10);
bangleFolder.add(controls, 'scaleOff7').name("Scale(Bangle)").min(-80).max(40).step(1);
var headLocketFolder = gui.addFolder("Head Locket(Alpha)");
headLocketFolder.add(controls, 'needHeadLocket').name("Include Head Locket").listen();
headLocketFolder.add(controls, 'zOff11').name("Z offset(Head Locket)").min(-1000).max(1000).step(10);
headLocketFolder.add(controls, 'xOff11').name("X offset(Head Locket)").min(-500).max(500).step(10);
headLocketFolder.add(controls, 'yOff11').name("Y offset(Head Locket)").min(-500).max(400).step(10);
headLocketFolder.add(controls, 'scaleOff8').name("Scale(Head Locket)").min(-80).max(40).step(1);

var video = document.getElementById("video");
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var container = document.getElementById("container");
var modelHelper;
var shouldStop = true;
var scene = new THREE.Scene();
var ocamera = new THREE.OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -1000, 1000);
var pcamera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 );
var debug = false;
var camera;
if(debug){
    camera = pcamera;
} else {
    camera = ocamera;
}

var renderer = new THREE.WebGLRenderer({alpha: true, antialias:true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
var zOffset = 0;
var loader = document.getElementById("loader");
let width = 0;
let height = 0;
var playedOnce = false;
var shouldRestart = true;
var canStart = false;
container.appendChild(renderer.domElement)
var orbitControls = new OrbitControls(camera, renderer.domElement);
//console.log(orbitControls);
var camToSave = {};
camToSave.position = camera.position.clone();
camToSave.rotation = camera.rotation.clone();
camToSave.controlCenter = orbitControls.target.clone();

renderer.setSize( canvas.width, canvas.height );
async function startVideo(){
    var constraints = { audio: false, video: { width: canvas.width, height: canvas.height} }; 
    try{
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
    } catch(err){
        console.log(err.name + ": " + err.message);
    }
}
function setWidths(){
    const w =Math.min(window.innerWidth, window.innerHeight)/1.5;
    const h = Math.min(window.innerWidth, window.innerHeight)/1.5;
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
console.log("HELLO LOL");
console.log(video)
setWidths();
resize();
startVideo();
function resize(){
    camera.left = -.5 * canvas.width;
    camera.right = .5 * canvas.width;
    camera.top = -.5 * canvas.height;
    camera.bottom = .5 * canvas.height;
    camera.updateProjectionMatrix(); 
    renderer.setSize(canvas.width, canvas.height)
}
window.addEventListener("resize", async () => {
    resize();
})
video.addEventListener("playing", async () => {
    if(!playedOnce){
        loader.className = "loading-state"
        modelHelper = new ModelHelper();
        await modelHelper.load(canvas.width, canvas.height);
        canStart = true;
        console.log("CAN START LOL");
        playedOnce = true;
        loader.className = "dormant-state"
    }
})
function startLandmarkVideo() {
    shouldStop = false;
    window.requestAnimationFrame(getLandmarks)
}
function setLighting(){
    const light = new THREE.PointLight(0xffffff, 2, 10);
    light.position.set(0, 10, 0);
    scene.add(light);
    var hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
    scene.add( hemiLight );
}
async function startThreeJS(){
    shouldStop = false;
    loader.className = "loading-state"
    setLighting();
    var leftEarring = new EarringLeft(await EarringLeft.create(
        controls.earringType == "Option 1" ? './obj/untitled.obj' : './obj/secondearring.obj'));
    scene.add(leftEarring.mesh);
    var rightEarring = new EarringRight(await EarringRight.create(
        controls.earringType == "Option 1" ? './obj/untitled.obj' : './obj/secondearring.obj'));
    scene.add(rightEarring.mesh);      
    if(controls.necklaceType == "Option 1"){
        var necklace = new Necklace(await Necklace.create("./obj/necklace.obj"));
        scene.add(necklace.mesh);       
    } else {
        var necklace = new Necklace(await Necklace.create("./obj/necklace2.obj"));
        scene.add(necklace.mesh);
    }
    var noseRing = new NoseRing(NoseRing.create());
    scene.add(noseRing.mesh);
    var bottu = new Bottu(Bottu.create());
    scene.add(bottu.mesh)
    var goggles = new Goggles(await Goggles.create("./obj/goggles.obj"));
    scene.add(goggles.mesh);
    var shirt = new Shirt(await Shirt.create("./obj/shirt.obj"));
    scene.add(shirt.mesh);
    var neck = new NeckOccluder(await NeckOccluder.create(video));
    scene.add(neck.mesh);
    var ring = new Ring(await Ring.create("./obj/ring.obj"));
    scene.add(ring.mesh);
    var bangle = new Bangle(await Bangle.create("./obj/ring.obj"));
    scene.add(bangle.mesh);
    var mask = new Mask(Mask.create({
        points: await modelHelper.predictFace(video), 
        camera: camera, 
        width: canvas.width, 
        height: canvas.height, 
        video: video
    }));
    scene.add(mask.mesh)
    var headLocket = new HeadLocket(HeadLocket.create());
    scene.add(headLocket.mesh);
    camera.position.z = 5;
    loader.className = "dormant-state";
    var startThreeJSAnimation = async function (){
        var faceLandmarks = await modelHelper.predictFace(video);
        var poseLandmarks = await modelHelper.predictPose(video, canvas);
        var handLandmarks = await modelHelper.predictHands(video);
//        console.log(faceLandmarks);
//        console.log(handLandmarks);
//        console.log(poseLandmarks);
        if(!shouldStop){
            window.requestAnimationFrame(startThreeJSAnimation);
        }
        
        controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
        controls.dampingFactor = 0.05;

        controls.screenSpacePanning = false;

        controls.minDistance = 100;
        controls.maxDistance = 500;
        await mask.update({
            points: faceLandmarks, 
            camera: camera, 
            width: canvas.width, 
            height: canvas.height, 
            video: video
        });

        
        if(controls.needEarrings == false){
            leftEarring.hide();
            rightEarring.hide();
        } else {
            leftEarring.show();
            rightEarring.show();
            await leftEarring.update({
                poses: poseLandmarks, 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: controls.xOff,
                yOff: controls.yOff,
                zOff: controls.zOff,
                scaleOff:controls.scaleOff,
                earringPath: controls.earringType == "Option 1" ? './obj/untitled.obj' : './obj/secondearring.obj',
                adaptive: true
            });
            await rightEarring.update({
                poses: poseLandmarks, 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: controls.xOff2, 
                yOff: controls.yOff2,
                zOff: controls.zOff2,
                scaleOff: controls.scaleOff2,
                earringPath: controls.earringType == "Option 1" ? './obj/untitled.obj' : './obj/secondearring.obj',
                adaptive: true
            }) 
        }
        if(controls.needNoseRing == false){
            noseRing.hide();
        } else {
            noseRing.show();
            noseRing.update({
                mask: mask.mesh,
                xOff: 0,
                yOff: 0,
                zOff: 0
            });
        }
        if(controls.needBottu == false){
            bottu.hide();
        } else {
            bottu.show();
            bottu.update({
                mask: mask.mesh,
                zOff: 10,
                xOff: 0,
                yOff:0
            });
        }
        if(controls.needNecklace == false){
            necklace.hide();
        } else {
            necklace.show();
            await necklace.update({
                poses: poseLandmarks,
                camera: camera,
                height: canvas.height,
                width: canvas.width,
                mask: mask.mesh,
                xOff: controls.xOff3,
                yOff: controls.yOff3,
                zOff: controls.zOff3,
                scaleOff: controls.scaleOff3,
                rotX: controls.rotX,
                necklacePath: controls.necklaceType == "Option 1" ? './obj/necklace2.obj' : './obj/necklace.obj',
                adaptive: true,
            });
        }
        if(controls.needGoggles == false){
            goggles.hide();
        } else {
            goggles.show();
            await goggles.update({
                mask: mask.mesh,
                zOff: controls.zOff6,
                xOff: controls.xOff6,
                yOff:controls.yOff6,
                scaleOff: controls.scaleOff4
            });
        }
        if(controls.needShirt == false){
            shirt.hide();
        } else {
//            console.log("hello");
            shirt.show();
            await shirt.update({
                poses: poseLandmarks, 
                xOff: controls.xOff7, 
                yOff: controls.yOff7, 
                zOff: controls.zOff7, 
                width: canvas.width, 
                height: canvas.height, 
                scaleOff: controls.scaleOff5, 
                camera: camera, 
                shirtPath: "./obj/shirt.obj"
            });
        }
        if(controls.needNeckoccluder){
//            console.log("HI")
            neck.show();
            await neck.update({
                poses: poseLandmarks, 
                xOff: controls.xOff8,
                yOff: controls.yOff8,
                zOff: controls.zOff8,
                width: canvas.width, 
                height: canvas.height, 
                camera: camera,
                widthOff: controls.scaleOff6,
            });
        } else {
            neck.hide();
        }
        if(controls.needRing){
            ring.show();
//            console.log(handLandmarks);
            await ring.update({
                points: handLandmarks,
                xOff: controls.xOff9,
                yOff: controls.yOff9,
                zOff: controls.zOff9,
                scaleOff: controls.scaleOff6,
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
        if(controls.needBangle){
//            console.log("OKAY");
            bangle.show();
            bangle.update({
                points: handLandmarks, 
                xOff: controls.xOff10, 
                yOff: controls.yOff10, 
                zOff: controls.zOff10, 
                scaleOff: controls.scaleOff7, 
                adaptive: false, 
                rotatable: true,
                width: canvas.width,
                height: canvas.height,
                camera: camera
            });
        } else {
            bangle.hide();
        }
        if(controls.needHeadLocket){
            headLocket.show();
            headLocket.update({
                mask: mask.mesh, 
                xOff: controls.xOff11, 
                yOff: controls.yOff11, 
                zOff: controls.zOff11, 
                scaleOff: controls.scaleOff8,
            });
        } else {
            headLocket.hide();
        }
        renderer.render( scene, camera );
    }
    startThreeJSAnimation();
}
function stopVideo(){
    shouldStop = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    scene.remove.apply(scene, scene.children);
}
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
var stopvideo = document.getElementById("stopVideo");
var threeJS = document.getElementById("threeJS");
var reset = document.getElementById("resetOrbit");
stopvideo.addEventListener('click', stopVideo);
threeJS.addEventListener('click', startThreeJS);
reset.addEventListener('click', resetOrbit);