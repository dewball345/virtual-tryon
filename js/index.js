
import {TRIANGULATION} from '../third-party/triangulation.js'
import { FaceMeshFaceGeometry } from '../third-party/face.js';
//import * as dat from './dat.gui.js';

//var gui = new dat.GUI();
var video = document.getElementById("video");
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var model;
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
    canStart = true;
    console.log("CAN START LOL")
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
    console.log(faces['scaledMesh'])
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
    
    faces = await model.estimateFaces(video, false, true);
    
    //console.log("SCALED" + faces[0)
    return faces[0];
}


function generateMesh(points){
    const faceGeometry = new FaceMeshFaceGeometry({useVideoTexture: true});
    
    if (width !== canvas.width || height !== canvas.height) {
        const w = canvas.width;
        const h = canvas.height;
        camera.left = .5 * canvas.width;
        camera.right = -.5 * canvas.width;
        camera.top = .5 * canvas.height;
        camera.bottom = -.5 * canvas.height;
        camera.updateProjectionMatrix(); 
        //resize();
        faceGeometry.setSize(w, h);
    }
    
    faceGeometry.setSize(canvas.width, canvas.height)
    
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

function createLeftEarring() {
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshStandardMaterial({
      color: 0xff2010,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
    });
    
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.setScalar(5);
    cube.name = "left";
    
    cube.castShadow = true; 
    cube.receiveShadow = true;
    
    scene.add( cube ); 
}

function createRightEarring(){
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshStandardMaterial({
      color: 0xff2010,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
    });
    
    var cube = new THREE.Mesh( geometry, material );
    cube.scale.set(10, 5, 5);
    cube.name = "right";
    
    cube.castShadow = true; 
    cube.receiveShadow = true;
    
    scene.add( cube );
}

function createNecklace(){
    var geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    
    var material = new THREE.MeshStandardMaterial({
      color: 0x00ffff,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
    });
    
    var cube = new THREE.Mesh(geometry, material);
//    cube.scale.x=10;
//    cube.scale.y = 60;
//    cube.scale.z = 10;
    cube.name = "necklace";
    
    cube.castShadow = true; 
    cube.receiveShadow = true;
    
    scene.add(cube);
}

function createNoseRing(){
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshStandardMaterial({
      color: 0xaaaa00,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
    });
    
    var sphere = new THREE.Mesh(geometry, material);
    sphere.scale.setScalar(5);
    sphere.name = "nosering";
    
    sphere.castShadow = true; 
    sphere.receiveShadow = true;
    
    scene.add(sphere);
}

function createBottu(){
    var geometry = new THREE.SphereGeometry();
    var material = new THREE.MeshStandardMaterial({
      color: 0x550000,
      roughness: 0.4,
      metalness: 0.1,
      transparent: true,
    });
    
    var sphere = new THREE.Mesh(geometry, material);
    sphere.scale.setScalar(5);
    sphere.name = "bottu";
    
    sphere.castShadow = true; 
    sphere.receiveShadow = true;
    
    scene.add(sphere);
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

function moveRightEarring(){
    var cube = scene.getObjectByName( "right" );
    var mesh = scene.getObjectByName("mask");
    
    const track = mesh.geometry.track(333, 323, 454);
    cube.position.copy(track.position);
    cube.rotation.setFromRotationMatrix(track.rotation);
    
    cube.rotation.x *= -1;
    cube.rotation.y *= -1;
    cube.rotation.z *= -1;
    
    cube.position.z += -100;
    cube.position.x += -12;
    cube.position.y += -40;
}

function moveLeftEarring(){
    var cube = scene.getObjectByName( "left" );
    var mesh = scene.getObjectByName("mask");
    
    const trackLeft = mesh.geometry.track(227, 34, 234);
    cube.position.copy(trackLeft.position);
    cube.rotation.setFromRotationMatrix(trackLeft.rotation);
    
    cube.rotation.x *= -1;
    cube.rotation.y *= -1;
    cube.rotation.z *= -1;
    
    cube.position.z = -100;
    cube.position.x += 10;
    cube.position.y += -30;
}

function moveNecklace(){
    var cube = scene.getObjectByName("necklace");
    var mesh = scene.getObjectByName("mask");
    
    const trackNecklace = mesh.geometry.track(148, 175, 152);
    cube.position.copy(trackNecklace.position);
    cube.rotation.setFromRotationMatrix(trackNecklace.rotation);
    
    cube.rotation.x *= -1;
    cube.rotation.y *= -1;
    cube.rotation.z *= -1;
    
    //cube.position.z = -100;
    cube.position.x += 12;
    cube.position.y += -40;
}

function moveNoseRing(){
    var cube = scene.getObjectByName("nosering");
    var mesh = scene.getObjectByName("mask");
    
    const trackNoseRing = mesh.geometry.track(235, 64, 240);
    cube.position.copy(trackNoseRing.position);
    cube.rotation.setFromRotationMatrix(trackNoseRing.rotation);
    
    cube.rotation.x *= -1;
    cube.rotation.y *= -1;
    cube.rotation.z *= -1;
    
    //cube.position.z = -100;
    //cube.position.x += 12;
    //cube.position.y += -40; 
}

function moveBottu(){
    var cube = scene.getObjectByName("bottu");
    var mesh = scene.getObjectByName("mask");
    
    const trackBottu = mesh.geometry.track(55, 8, 9);
    cube.position.copy(trackBottu.position);
    cube.rotation.setFromRotationMatrix(trackBottu.rotation);
    
    cube.rotation.x *= -1;
    cube.rotation.y *= -1;
    cube.rotation.z *= -1; 
    
    cube.position.z += 10;
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
    createLeftEarring();
    createRightEarring();
    //createNecklace();
    createNoseRing();
    createBottu();
    await createMask();
    
    camera.position.z = 5;
    var startThreeJSAnimation = async function (){
        if(!shouldStop){
            window.requestAnimationFrame(startThreeJSAnimation);
        }
        
        //scene.remove(scene.getObjectByName("MESH"));
        await updateMask();
        moveLeftEarring();
        moveRightEarring();
        //moveNecklace();
        moveNoseRing();
        moveBottu();
        
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