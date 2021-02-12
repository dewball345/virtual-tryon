import {OBJLoader} from '../../third-party/OBJLoader.js';
import {DistanceHelper} from "../helpers/distanceHelper.js";
import {MeshStandardMaterial, Vector3} from "../../third-party/three.module.js";

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
          let newPosition = new Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        }; 
        
        
//        if(poses.keypoints[4].score <= 0.3){
//            this.hide();
//            return;
//        }
        
        var domPosLeft = domToWorld(poses.poseLandmarks[11].x * width, poses.poseLandmarks[11].y * height);
        var domPosRight = domToWorld(poses.poseLandmarks[12].x * width, poses.poseLandmarks[12].y * height);
        var averagedX = (domPosLeft.x + domPosRight.x)/2;
        var averagedY = (domPosLeft.y + domPosRight.y)/2;
//        var domPos = domToWorld(averagedX, averagedY);
        this.mesh.position.x = (averagedX + this.prevDom.x)/2 + xOff;
        this.mesh.position.y = (averagedY + this.prevDom.y)/2 + yOff;
        this.mesh.position.z = zOff;
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 20 + scaleOff;
        //rotate(this.mesh);
        this.prevDom.x = averagedX;
        this.prevDom.y = averagedY;
    }
    static create(objPath) {
        this.path = objPath;
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            var loader = objLoader.load(objPath, (root) => {
                //console.log("FUNCTION: " + objLoader.load);
                var material = new MeshStandardMaterial({
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
