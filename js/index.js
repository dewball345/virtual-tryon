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
import {GuiHelper} from "./helpers/guiHelper.js";
import {MeshCreateHelper} from "./helpers/meshCreateHelper.js";

import {
    Scene, 
    OrthographicCamera, 
    PerspectiveCamera, 
    WebGLRenderer, 
    sRGBEncoding, 
    PointLight, 
    HemisphereLight, 
    UnsignedByteType, 
    PMREMGenerator
} from "../third-party/three.module.js";

var gui = new dat.GUI();
var settings = new ControlsHelper();
new GuiHelper(gui, settings)
var video = document.getElementById("video");
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var container = document.getElementById("container");
var modelHelper;
var shouldStop = true;
//initialize scene(blank world)
var scene = new Scene();
//initialize variables for orthographic and perspective camera(CHANGE TO -1000 undo here)
var ocamera = new OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -1000, 1000);
var pcamera = new PerspectiveCamera( 45, 1, 1, 1000 );
var debug = false;
var controls = {};
var camera;
if(debug){
    camera = pcamera;
} else {
    camera = ocamera;
}
var renderer = new WebGLRenderer({alpha: true, antialias:true,preserveDrawingBuffer:true});
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.outputEncoding = sRGBEncoding;
var loader = document.getElementById("loader");
var loadtext = document.getElementById("loading-text");
let photolist = document.getElementById("photolist");
var playedOnce = false;
renderer.domElement.id = "rendererCanvas";
container.appendChild(renderer.domElement)
var orbitControls = new OrbitControls(camera, renderer.domElement);
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
    const w = window.innerWidth/2.5;
    const h = window.innerHeight/1.5;
    let ps = document.getElementById("photosection");
    let ctrl = document.getElementById("controlls");
    ps.style.width = w/2 + 50 + "px";
    photolist.style.height = h + "px";
    photolist.style.width = w/2 + 50 + "px";
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
        loader.className = "loading-state"
        loadtext.innerText = "Status: Loading Model"
        modelHelper = new ModelHelper();
        await modelHelper.load(canvas.width, canvas.height);
        // canStart = true;
        console.log("CAN START LOL");
        playedOnce = true;
        loader.className = "dormant-state"
        loadtext.innerText = "Status: idle";
    }
})

function setLighting(){
    var hemiLight = new HemisphereLight( 0xffffbb, 0x080820, 1 );
    scene.add( hemiLight );
    new RGBELoader()
		.setDataType( UnsignedByteType )
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


async function startThreeJS(){
    const pose = new Pose({locateFile: (file) => {
        return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.2/${file}`;
    }});
    pose.setOptions({
        upperBodyOnly: true,
        smoothLandmarks: true,
        minDetectionConfidence: 0.5,
        minTrackingConfidence: 0.5
    });

    
    var result;
    pose.onResults((results) => {result = results; /*console.log(results)*/});

    shouldStop = false;
    //sets loader to loading
    loader.className = "loading-state"
    loadtext.innerText = "Setting Lighting"
    setLighting();
    //adds earrings to scene
    loadtext.innerText = "Adding Earrings"


    var ePath = './obj/earrings/earringotherglb.glb';

    if(settings.earrings.earringType == "Option 1"){
        ePath = './obj/earrings/earringtest.glb'
    }
    //TODO: change for multiple meshes options.
    var leftEarring = new EarringLeft(await MeshCreateHelper.createGLTF(
        ePath));

    scene.add(leftEarring.mesh);
    var rightEarring = new EarringRight(await MeshCreateHelper.createGLTF(
        ePath));

    scene.add(rightEarring.mesh); 
    //adds necklace to scene
    loadtext.innerText = "Adding Necklace"
    // if(settings.necklace.necklaceType == "Option 1"){
    //     var necklace = new Necklace(await Necklace.create("./obj/necklace/necklace.obj"));
    //     scene.add(necklace.mesh);       
    // } else {
    //     var necklace = new Necklace(await Necklace.create("./obj/necklace/necklace2.obj"));
    //     scene.add(necklace.mesh);
    // }

    var necklace = new Necklace(await MeshCreateHelper.createGLTF('./obj/necklace/necklace.glb'));
    scene.add(necklace.mesh);

    //adds other jewelry to scene
    loadtext.innerText = "Adding Nosering"
    var noseRing = new NoseRing(NoseRing.create());
    scene.add(noseRing.mesh);
    loadtext.innerText = "Adding Bottu"
    var bottu = new Bottu(Bottu.create());
    scene.add(bottu.mesh)
    loadtext.innerText = "Adding Goggles"
    
    var goggles = new Goggles(await MeshCreateHelper.createGLTF("./obj/sungoggles/sungoggles.glb", 'goggles'));
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
    loadtext.innerText = "Status: Try jewelery on when you see FPS counter!";
    var startThreeJSAnimation = async function (time){
        //gets landmarks
        //move below

        
        let t0 = performance.now()
        // console.log("hoi")
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

            if(settings.earrings.earringType == "Option 1"){
                ePath = './obj/earrings/earringtest.glb'
            } else {
                ePath = './obj/earrings/earringotherglb.glb'
            }

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
                earringPath: ePath,
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
                earringPath: ePath,
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
        // console.log((t1-t0)/1000)
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

function takePicture(){
    console.log("picture");
    let combined = document.createElement("CANVAS");
    combined.width = canvas.width/2;
    combined.height = canvas.height/2;
    let combinedCtx = combined.getContext('2d');
    combinedCtx.drawImage(canvas, 0, 0, canvas.width/2, canvas.height/2);
    combinedCtx.drawImage(renderer.domElement, 0, 0, canvas.width/2, canvas.height/2)
    // canvas.scale(0.5, 0.5)
    let canvasimg = combined.toDataURL("image/png");
    photolist.innerHTML += '<img class="borderimage" src="'+canvasimg+'"/>'  

}
//var landmarkButton = document.getElementById("landmarkButton");
//gets ids of buttons for each
var stopvideo = document.getElementById("stopVideo");
var threeJS = document.getElementById("threeJS");
var reset = document.getElementById("resetOrbit");
var takepic = document.getElementById("takePic");

//wires functions to buttons
stopvideo.addEventListener('click', stopVideo);
threeJS.addEventListener('click', startThreeJS);
reset.addEventListener('click', resetOrbit);
takepic.addEventListener('click', takePicture);