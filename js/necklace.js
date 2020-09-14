import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {DistanceHelper} from "./distanceHelper.js";

export class Necklace{
    constructor(mesh){
        this.mesh = mesh;
        this.path = "";
        this.prevDom = {x: 0, y:0};
    }
    async update({poses, mask, xOff, yOff, zOff, scaleOff, width, height, camera, rotX, necklacePath}){
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
        
        const rotate = function(mesh){
            var domShoulderLeft = domToWorld(
                poses.keypoints[5].position.x, 
                poses.keypoints[5].position.y
            );
            var domShoulderRight = domToWorld(
                poses.keypoints[6].position.x,
                poses.keypoints[6].position.y
            );
            var domArmLeft = domToWorld(
                poses.keypoints[11].position.x, 
                poses.keypoints[11].position.y
            );
            var domArmRight = domToWorld(
                poses.keypoints[12].position.x,
                poses.keypoints[12].position.y
            );
            
            var shoulderPtLeftX = domShoulderLeft.x;
            var shoulderPtLeftY = domShoulderLeft.y
            
            var shoulderPtRightX = domShoulderRight.x;
            var shoulderPtRightY = domShoulderRight.y;
            
            var armPtLeftX = domArmLeft.x;
            var armPtLeftY = domArmLeft.y
            
            var armPtRightX = domArmRight.x;
            var armPtRightY = domArmRight.y;
            
            var distanceLeftArm = DistanceHelper.distance({
                x1: armPtLeftX,
                y1: armPtLeftY,
                x2: shoulderPtLeftX,
                y2: shoulderPtLeftY
            });
            
            var distanceRightArm = DistanceHelper.distance({
                x1: armPtRightX,
                y1: armPtRightY,
                x2: shoulderPtRightX,
                y2: shoulderPtRightY
            });
            
            var distanceShoulder = DistanceHelper.distance({
                x1: shoulderPtLeftX,
                y1: shoulderPtLeftY,
                x2: shoulderPtRightX,
                y2: shoulderPtRightY                
            })
            
            var yRot = Math.atan(
                (distanceRightArm, distanceLeftArm - distanceRightArm,distanceLeftArm)/
                distanceShoulder);
            
            mesh.rotation.y = yRot;
        }
        
        var averagedX = (poses.keypoints[5].position.x + poses.keypoints[6].position.x)/2;
        var averagedY = (poses.keypoints[5].position.y + poses.keypoints[6].position.y)/2;
        var domPos = domToWorld(averagedX, averagedY);
        
        //console.log(domPos.y + " " + this.mesh.position.y);

        this.mesh.position.x = (domPos.x + this.prevDom.x)/2;
        this.mesh.position.y = (domPos.y + this.prevDom.y)/2;  


        this.mesh.position.z = 0;
        this.mesh.rotation.x = rotX;

        this.mesh.position.x += xOff;
        this.mesh.position.y += yOff;
        this.mesh.position.z += zOff;
        
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
        
        this.prevDom.x = domPos.x;
        this.prevDom.y = domPos.y;
        
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
