
import {TRIANGULATION} from '../third-party/triangulation.js';
import { FaceMeshFaceGeometry } from '../third-party/face.js';
import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {EarringLeft} from "./earringLeft.js";
import {EarringRight} from "./earringRight.js";
import {Necklace} from "./necklace.js";
import {NoseRing} from "./nosering.js";
import {Bottu} from "./bottu.js";
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
            zOff: 0,
            yOff: 0,
            xOff: 0,
            zOff2:0,
            yOff2:0,
            xOff2:0,
            
}

gui.add(controls, 'needEarrings').name("Include Earrings").listen();
gui.add(controls, 'zOff').name("Z offset(Earring: left)").min(-1000).max(1000).step(100);
gui.add(controls, 'xOff').name("X offset(Earring: left)").min(-200).max(200).step(10);
gui.add(controls, 'yOff').name("Y offset(Earring: left)").min(-200).max(200).step(10);
gui.add(controls, 'zOff2').name("Z offset(Earring: right)").min(-1000).max(1000).step(100);
gui.add(controls, 'xOff2').name("X offset(Earring: right)").min(-200).max(200).step(10);
gui.add(controls, 'yOff2').name("Y offset(Earring: right)").min(-200).max(200).step(10);
gui.add(controls, 'needNecklace').name("Include Necklace").listen();

gui.add(controls, 'needBottu').name("Include Bottu").listen();
gui.add(controls, 'needNoseRing').name("Include Nose Ring").listen();
gui.add(controls, 'needBangle').name("Include Bangle").listen();
gui.add(controls, 'needRing').name("Include Ring").listen();

var video = document.getElementById("video");


var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
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
    
var container = document.getElementById("container");
var zOffset = 0;


let width = 0;
let height = 0;

container.appendChild(renderer.domElement)
renderer.setSize( canvas.width, canvas.height );

async function startVideo(){
    var constraints = { audio: false, video: { width: 500, height: 375 } }; 
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
      architecture: 'MobileNetV1',
      outputStride: 16,
      inputResolution: { width: 500, height:375 },
      multiplier: 0.75
    });
    canStart = true;
    console.log("CAN START LOL")
    startThreeJS();
})

function startLandmarkVideo() {
    shouldStop = false;
    window.requestAnimationFrame(getLandmarks)
}

async function getLandmarks() {
    if(!shouldStop){
        window.requestAnimationFrame(getLandmarks);
    }
//    setTimeout(
//        () => {
//            ctx.clearRect(0, 0, canvas.width, canvas.height);
//            console.log("CLeared");
//        }, 
//        80
//    )
    
    var faces;
    faces = await returnLandmarks();
    //console.log(faces['scaledMesh'])
    faces['scaledMesh'].forEach(face => {
        //console.log(face[0])
        //console.log(face[1])
        ctx.fillStyle = "#fff"
        ctx.beginPath();
        ctx.arc(face[0],face[1],2,0,2 * Math.PI);
        ctx.stroke();
        ctx.fill();
    })
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
    
    video.width = 500;
    video.height = 375;

    poses = await pose.estimateSinglePose(video, {
      flipHorizontal: false
    });
    
    
    
    return poses;
}

function generateMesh(points){
    const faceGeometry = new FaceMeshFaceGeometry({useVideoTexture: true});
    
    if (width !== canvas.width || height !== canvas.height) {
        const w = canvas.width;
        const h = canvas.height;
        //console.log("WIDTH: " + w);
        //console.log("HEIGHT: " +h);
        camera.left = .5 * canvas.width;
        camera.right = -.5 * canvas.width;
        camera.top = .5 * canvas.height;
        camera.bottom = -.5 * canvas.height;
        camera.updateProjectionMatrix(); 
        //resize();
        faceGeometry.setSize(w, h);
    }
    
    //console.log(canvas.width);
    //console.log(canvas.height);
    faceGeometry.setSize(canvas.width, canvas.height);
    
    faceGeometry.update(points, true);
    
    //console.log("DONE!");
    var material = new THREE.MeshStandardMaterial({
      color: 0xffffee,
      roughness: 0.8,
      metalness: 0.1,
      map:null,
      transparent: true,
    });
    
    const videoTexture = new THREE.VideoTexture(video);
    videoTexture.encoding = THREE.sRGBEncoding;
    material.map = videoTexture;
    const mask = new THREE.Mesh(faceGeometry, material);
    mask.receiveShadow = mask.castShadow = true;
    return mask;
}



async function createMask(){
    var landmark = await returnLandmarks();

    var mesh = generateMesh(landmark);
    mesh.name = "mask"
    
    mesh.castShadow = true; 
    mesh.receiveShadow = true;
    
    scene.add(mesh)
}

async function updateMask() {
    var landmark = await returnLandmarks();
    var mesh = scene.getObjectByName('mask');
    
    mesh.geometry = generateMesh(landmark).geometry;
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

function hide(id){
    scene.getObjectByName(id).visible = false;
}
function show(id){
    scene.getObjectByName(id).visible = true;
}

async function startThreeJS(){
    shouldStop = false;
    
    setLighting();
    
    
    var leftEarring = new EarringLeft(await EarringLeft.create());
    scene.add(leftEarring.mesh);
    console.log("ADDED!")
    
    var rightEarring = new EarringRight(await EarringRight.create());
    scene.add(rightEarring.mesh);
    console.log("ADDED!")
    
    //createLeftEarring();
    //createRightEarring();
    var necklace = new Necklace(await Necklace.create("./obj/necklace.obj"));
    scene.add(necklace.mesh);
    //createNecklace();
    var noseRing = new NoseRing(NoseRing.create());
    scene.add(noseRing.mesh);
//    createNoseRing();
    var bottu = new Bottu(Bottu.create());
    scene.add(bottu.mesh)
//    createBottu();
    await createMask();
    
    camera.position.z = 5;
    var startThreeJSAnimation = async function (){
        if(!shouldStop){
            window.requestAnimationFrame(startThreeJSAnimation);
        }
        
        //scene.remove(scene.getObjectByName("MESH"));
        //console.log(controls.needNecklace)
        await updateMask();
        
        if(controls.needEarrings == false){
            //hide("left");
            leftEarring.hide();
            rightEarring.hide();
            //hide("right");
        } else {
            //show("left");
            leftEarring.show();
            rightEarring.show();
            //show("right");
            //await moveLeftEarring();
            await leftEarring.update({
                poses: await returnPoseLandmarks(), 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: scene.getObjectByName("mask"),
                xOff: controls.xOff,
                yOff: controls.yOff,
                zOff: controls.zOff
            });
            
            await rightEarring.update({
                poses: await returnPoseLandmarks(), 
                camera: camera, 
                height: canvas.height,
                width: canvas.width,
                mask: scene.getObjectByName("mask"),
                xOff: controls.xOff2,
                yOff: controls.yOff2,
                zOff: controls.zOff2
            })
            //await moveRightEarring(); 
        }
    
        if(controls.needNoseRing == false){
            //hide("nosering")
            noseRing.hide();
        } else {
//            show("nosering")
            noseRing.show();
            noseRing.update({
                mask: scene.getObjectByName("mask"),
                xOff: 0,
                yOff: 0,
                zOff: 0
            });
//            moveNoseRing();
        }
        
        if(controls.needBottu == false){
//            hide("bottu")
            bottu.hide();
        } else {
//            show("bottu")
            bottu.show();
            bottu.update({
                mask: scene.getObjectByName("mask"),
                zOff: 10,
                xOff: 0,
                yOff:0
            });
//            moveBottu();
        }
        
        if(controls.needNecklace == false){
//            hide("necklace");
            necklace.hide();
        } else {
//            show("necklace");
            necklace.show();
            await necklace.update({
                poses: await returnPoseLandmarks(),
                camera: camera,
                height: canvas.height,
                width: canvas.width,
                mask: scene.getObjectByName("mask"),
                xOff: 0,
                yOff: 0,
                zOff: 0
            })
            //moveNecklace();
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

var landmarkButton = document.getElementById("landmarkButton");
var stopvideo = document.getElementById("stopVideo");
var threeJS = document.getElementById("threeJS");

//landmarkButton.addEventListener('click', startLandmarkVideo)
stopvideo.addEventListener('click', stopVideo)
threeJS.addEventListener('click', startThreeJS)
