//necessary import statements
import {Goggles} from './goggles.js';
import {Mask} from './mask.js';
import {ModelHelper} from './modelHelper.js'

//access html elements
var video = document.getElementById("video");
var placeholder = document.getElementById("placeholder");
var canvas = document.getElementById("draw");
var ctx = canvas.getContext("2d");
var container = document.getElementById("container");
var modelHelper;

//three.js boilerplate code
var scene = new THREE.Scene();
var camera = new THREE.OrthographicCamera(-canvas.width/2, canvas.width/2, -canvas.height/2, canvas.height/2, -1000, 1000);
var renderer = new THREE.WebGLRenderer({alpha: true, antialias:true });
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.outputEncoding = THREE.sRGBEncoding;
container.appendChild(renderer.domElement)
renderer.domElement.style.position = "absolute";
renderer.setSize( canvas.width, canvas.height );

//play webcam video
async function startVideo(){
    var constraints = { audio: false, video: { width: canvas.width, height: canvas.height} }; 
    try{
        var stream = await navigator.mediaDevices.getUserMedia(constraints);
        video.srcObject = stream;
        placeholder.srcObject = stream;
    } catch(err){
        console.log(err.name + ": " + err.message);
    }
}

//initialize lighting
function setLighting(){
    const light = new THREE.PointLight(0xffffff, 2, 10);
    light.position.set(0, 10, 0);
    scene.add(light);
    var hemiLight = new THREE.HemisphereLight( 0xffffbb, 0x080820, 2 );
    scene.add( hemiLight );
}

//important part- main content
async function startThreeJs(){
    //gets points for mask
    var facepoints = await modelHelper.predictFace(placeholder);
    
    //creates and adds goggles to scene
    var goggles = new Goggles(await Goggles.create('./obj/goggles.obj'));
    scene.add(goggles.mesh);
    
    //creates and adds mask to scene
    var mask = new Mask(await Mask.create({
        points: facepoints,
        camera: camera,
        width: canvas.width,
        height: canvas.height,
        video: video
    }));
    scene.add(mask.mesh);
    
    //animation
    async function animation(){
        //gets points for face to update mask
        var facepoints = await modelHelper.predictFace(placeholder);
        //line of code will make it an animation
        window.requestAnimationFrame(animation)
        
        //update mask
        await mask.update({
            points: facepoints,
            camera: camera,
            width: canvas.width,
            height: canvas.height,
            video: video   
        });
        console.log(facepoints);
        //update goggles
        await goggles.update({
            mask: mask.mesh, 
            xOff: 0, 
            yOff: -50, 
            zOff: 0,
            scaleOff:2,
        });
        
        //render updated changes
        renderer.render( scene, camera );
    }
    //call animation function
    animation();
}

//initialize and run code
async function init(){
    await startVideo();
    setLighting();
}
console.log("Started!")
init();

//starts animation when video is playing(to avoid errors)
video.addEventListener('playing', async () => {
    modelHelper = new ModelHelper();
    await modelHelper.load(canvas.width, canvas.height);
    await startThreeJs();
})