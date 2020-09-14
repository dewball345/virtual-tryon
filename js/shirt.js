import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';

import {DistanceHelper} from "./distanceHelper.js";

export class Shirt{
    constructor(mesh){
        this.mesh = mesh;
        this.path = "";
        this.prevDom = {x: 0, y:0};
    }
    async update({poses, xOff, yOff, zOff, width, height, scaleOff, camera, shirtPath}){
        if(shirtPath !== this.path){
            this.path = shirtPath;
            this.mesh.children[0].geometry = (await Shirt.create(shirtPath)).children[0].geometry
//            console.log("Howdy");
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
                poses.keypoints[7].position.x, 
                poses.keypoints[7].position.y
            );
            var domArmRight = domToWorld(
                poses.keypoints[8].position.x,
                poses.keypoints[8].position.y
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
                ((distanceLeftArm- distanceRightArm)/
                distanceShoulder));
            
            mesh.rotation.y = yRot;
            this.prevDom.x = domPos.x;
            this.prevDom.y = domPos.y;
        }
        
        if(poses.keypoints[4].score <= 0.3){
            this.hide();
            return;
        }
        
        var averagedX = (poses.keypoints[5].position.x + poses.keypoints[6].position.x)/2;
        var averagedY = (poses.keypoints[5].position.y + poses.keypoints[6].position.y)/2;
        var domPos = domToWorld(averagedX, averagedY);
        this.mesh.position.x = (domPos.x + this.prevDom.x)/2 + xOff;
        this.mesh.position.y = (domPos.y + this.prevDom.y)/2 + yOff;
        this.mesh.position.z = zOff;
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
        //rotate(this.mesh);
        this.prevDom.x = domPos.x;
        this.prevDom.y = domPos.y;
    }
    static create(objPath) {
        this.path = objPath;
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader2();
            var loader = objLoader.load(objPath, (root) => {
                //console.log("FUNCTION: " + objLoader.load);
                var material = new THREE.MeshStandardMaterial({
                      color: 0xCB55DC,
                      roughness: 0.2,
                      metalness: 0.8,
                      transparent: true,
                });
                //console.log(root);
                root.children[0].material = material;
                root.scale.setScalar(40);
                root.name = "shirt";
                root.castShadow = true; 
                root.receiveShadow = true;
                //root.rotation.x = -90;
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
