
import {TRIANGULATION} from '../third-party/triangulation.js';
import { FaceMeshFaceGeometry } from '../third-party/face.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {EarringLeft} from "./earringLeft.js";
import {EarringRight} from "./earringRight.js";
import {Necklace} from "./necklace.js";
import {NoseRing} from "./nosering.js";
import {Bottu} from "./bottu.js";
import {Mask} from "./mask.js";
//import * as dat from './dat.gui.js';


//var gui = new dat.GUI();
var gui = new dat.GUI();

var controls = {
            needEarrings: false,
            needNecklace: false,
            needBottu: false,
            needNoseRing: false,
            needBangle: false,
            needRing: false,
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
            scaleOff:0,
            scaleOff2:0,
            scaleOff3:0,
            rotX:0,
            earringType:'Option 1',
            necklaceType:'Option 1'
}

var earringFolder = gui.addFolder("Earrings");
earringFolder.add(controls, 'needEarrings').name("Include Earrings").listen();
earringFolder.add(controls, 'zOff').name("Z offset(Earring: left)").min(-1000).max(1000).step(100);
earringFolder.add(controls, 'xOff').name("X offset(Earring: left)").min(-200).max(200).step(10);
earringFolder.add(controls, 'yOff').name("Y offset(Earring: left)").min(-200).max(200).step(10);
earringFolder.add(controls, 'scaleOff').name("Scale(Earring: Left)").min(-5).max(10).step(1);
earringFolder.add(controls, 'scaleOff2').name("Scale(Earring: Right)").min(-5).max(10).step(1);
earringFolder.add(controls, 'zOff2').name("Z offset(Earring: right)").min(-1000).max(1000).step(100);
earringFolder.add(controls, 'xOff2').name("X offset(Earring: right)").min(-200).max(200).step(10);
earringFolder.add(controls, 'yOff2').name("Y offset(Earring: right)").min(-200).max(200).step(10);
earringFolder.add(controls, 'earringType', [ 'Option 1', 'Option 2'] );

var necklaceFolder = gui.addFolder("Necklace");
necklaceFolder.add(controls, 'needNecklace').name("Include Necklace").listen();
necklaceFolder.add(controls, 'zOff3').name("Z offset(Necklace)").min(-1000).max(1000).step(100);
necklaceFolder.add(controls, 'xOff3').name("X offset(Necklace)").min(-200).max(200).step(10);
necklaceFolder.add(controls, 'yOff3').name("Y offset(Necklace)").min(-200).max(400).step(10);
necklaceFolder.add(controls, 'rotX').name("Rotation X(Necklace)").min(0).max(2 * Math.PI)
necklaceFolder.add(controls, 'scaleOff3').name("Scale(Necklace)").min(-10).max(20).step(1);
necklaceFolder.add(controls, 'necklaceType', [ 'Option 1', 'Option 2'] );

var bottuFolder = gui.addFolder("Bottu");
bottuFolder.add(controls, 'needBottu').name("Include Bottu").listen();
bottuFolder.add(controls, 'zOff4').name("Z offset(Bottu)").min(-1000).max(1000).step(100);
bottuFolder.add(controls, 'xOff4').name("X offset(Bottu)").min(-200).max(200).step(10);
bottuFolder.add(controls, 'yOff4').name("Y offset(Bottu)").min(-200).max(200).step(10);

var noseRingFolder = gui.addFolder("Nose Ring");
noseRingFolder.add(controls, 'needNoseRing').name("Include Nose Ring").listen();
noseRingFolder.add(controls, 'zOff5').name("Z offset(Nose Ring)").min(-1000).max(1000).step(100);
noseRingFolder.add(controls, 'xOff5').name("X offset(Nose Ring)").min(-200).max(200).step(10);
noseRingFolder.add(controls, 'yOff5').name("Y offset(Nose Ring)").min(-200).max(200).step(10);

gui.add(controls, 'needBangle').name("Include Bangle").listen();
gui.add(controls, 'needRing').name("Include Ring").listen();

var video = document.getElementById("video");


var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var container = document.getElementById("container");



var model;
var pose;
var shouldStop = true;
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -1000, 1000);

//var camera = new THREE.PerspectiveCamera(45, canvas.width/canvas.height, -1000, 1000)

var renderer = new THREE.WebGLRenderer({alpha: true, antialias:true });

renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
    

var zOffset = 0;


let width = 0;
let height = 0;

container.appendChild(renderer.domElement)
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

console.log("HELLO LOL");
console.log(video)
startVideo();

var canStart = false;



function resize(){
    camera.left = -.5 * canvas.width;
    camera.right = .5 * canvas.width;
    camera.top = -.5 * canvas.height;
    camera.bottom = .5 * canvas.height;
    camera.updateProjectionMatrix(); 
    renderer.setSize(canvas.width, canvas.height)
}


window.addEventListener("resize", () => {
    resize();
})

video.addEventListener("playing", async () => {
    model = await facemesh.load();
    pose = await posenet.load({
      architecture: 'ResNet50',
      outputStride: 32,
      inputResolution: { width: canvas.width, height:canvas.height },
      quantBytes:2
    });
    canStart = true;
    console.log("CAN START LOL")
//    startThreeJS();
})

function startLandmarkVideo() {
    shouldStop = false;
    window.requestAnimationFrame(getLandmarks)
}



async function returnLandmarks(){
    var faces;
    video.width = 0;
    video.height = 0;
    faces = await model.estimateFaces(video, false, true);
    return faces[0];
}

async function returnPoseLandmarks(){
    var poses;
    video.width = canvas.width;
    video.height = canvas.width;
    poses = await pose.estimateSinglePose(video, {
      flipHorizontal: false
    });
    return poses;
}

function setLighting(){
    var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 1);
    hemiLight.color.setHSL( 0.6, 1, 0.6 );
    hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
    hemiLight.position.set( 0, 50, 0 );
    scene.add( hemiLight );


    //

    var dirLight = new THREE.DirectionalLight( 0xffffff, 5 );
    dirLight.color.setHSL( 0.1, 1, 0.95 );
    dirLight.position.set( 0, 0, 10);
    dirLight.position.multiplyScalar( 30 );
    scene.add( dirLight );

    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    var d = 50;

    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;

    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = - 0.0001;

}



async function startThreeJS(){
    shouldStop = false;
    setLighting();
    
    if(controls.earringType === "Option 1"){
        var leftEarring = new EarringLeft(await EarringLeft.create('./obj/untitled.obj'));
        scene.add(leftEarring.mesh);
        var rightEarring = new EarringRight(await EarringRight.create('./obj/untitled.obj'));
        scene.add(rightEarring.mesh);  
    } else {
        var leftEarring = new EarringLeft(await EarringLeft.create('./obj/secondearring.obj'));
        scene.add(leftEarring.mesh);
        var rightEarring = new EarringRight(await EarringRight.create('./obj/secondearring.obj'));
        scene.add(rightEarring.mesh);  
    }
    
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
    var mask = new Mask(Mask.create({
        points: await returnLandmarks(), 
        camera: camera, 
        width: canvas.width, 
        height: canvas.height, 
        video: video
    }));
    scene.add(mask.mesh)
    camera.position.z = 5;
    var startThreeJSAnimation = async function (){
        var faceLandmarks = await returnLandmarks();
        var poseLandmarks = await returnPoseLandmarks();
        
        if(!shouldStop){
            window.requestAnimationFrame(startThreeJSAnimation);
        }
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
            if(controls.earringType === "Option 1"){
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
                    earringPath: './obj/untitled.obj'
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
                    earringPath: './obj/untitled.obj'
                }) 
            } else {
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
                    earringPath: './obj/secondearring.obj'
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
                    earringPath: './obj/secondearring.obj'
                })                
            }

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
            if(controls.necklaceType == "Option 1"){
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
                    necklacePath: "./obj/necklace2.obj"
                });
            } else {
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
                    necklacePath: "./obj/necklace.obj"
                });                
            }

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

//var landmarkButton = document.getElementById("landmarkButton");
var stopvideo = document.getElementById("stopVideo");
var threeJS = document.getElementById("threeJS");
stopvideo.addEventListener('click', stopVideo)
threeJS.addEventListener('click', startThreeJS)
