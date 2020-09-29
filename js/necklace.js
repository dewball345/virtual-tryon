import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {DistanceHelper} from "./distanceHelper.js";

export class Necklace{
    constructor(mesh){
        this.mesh = mesh;
        this.path = "";
        this.prevDom = {x: 0, y:0};
    }
    async update({poses, mask, xOff, yOff, zOff, scaleOff, width, height, camera, rotX, necklacePath, adaptive}){
        if(necklacePath !== this.path){
            this.path = necklacePath;
            this.mesh.children[0].geometry = (await Necklace.create(necklacePath)).children[0].geometry
//            console.log("Howdyj");
        }
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };
        

        var domPosLeft = domToWorld(poses.keypoints[5].position.x, poses.keypoints[5].position.y);
        var domPosRight = domToWorld(poses.keypoints[6].position.x, poses.keypoints[6].position.y);
        var averagedX = (domPosLeft.x + domPosRight.x)/2;
        var averagedY = (domPosLeft.y + domPosRight.y)/2;
//        var domPos = domToWorld(averagedX, averagedY);
        
        //console.log(domPos.y + " " + this.mesh.position.y);

        this.mesh.position.x = (averagedX + this.prevDom.x)/2;
        this.mesh.position.y = (averagedY + this.prevDom.y)/2;  


        this.mesh.position.z = 0;
        this.mesh.rotation.x = rotX;

        this.mesh.position.x += xOff;
        this.mesh.position.y += yOff;
        this.mesh.position.z += zOff;
        
        if(!adaptive){
            this.mesh.scale.x = 10 + scaleOff;
            this.mesh.scale.y = 10 + scaleOff;
            this.mesh.scale.z = 10 + scaleOff;
        } else {            
            this.mesh.scale.setScalar(DistanceHelper.distance({
                x1: domPosLeft.x, 
                y1: domPosLeft.y, 
                x2: domPosRight.x, 
                y2: domPosRight.y})/23 + scaleOff);
//            console.log(domPosRight.x);
//            console.log(domPosLeft.x);
//            console.log(DistanceHelper.distance({
//                x1: domPosLeft.x, 
//                y1: domPosLeft.y, 
//                x2: domPosRight.x, 
//                x2: domPosRight.y}));
        }
        this.prevDom.x = averagedX;
        this.prevDom.y = averagedY;
        
//        console.log(this.prevDom)
        //rotate(this.mesh);
        //console.log(this.mesh.position);
    }
    static create(objPath='./obj/untitled.obj') {
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader2();
            var loader = objLoader.load(objPath, (root) => {
                //console.log("FUNCTION: " + objLoader.load);
                var material = new THREE.MeshStandardMaterial({
                      color: 0xD4AF37,
                      roughness: 0.2,
                      metalness: 0.7,
                      transparent: true,
                });
                //console.log(root);
                root.children[0].material = material;
                root.scale.setScalar(10);
                root.name = "Necklace";
                root.castShadow = true; 
                root.receiveShadow = true;
                root.rotation.x = -90;
                resolve(root);
                console.log("Called!")
            });
        });
    }
    hide(){
        //console.log(this.mesh);
        this.mesh.visible = false;
    }
    show(){
        //console.log(this.mesh);
        this.mesh.visible = true;
    }
}
