import {OBJLoader} from '../../third-party/OBJLoader.js';
import {DistanceHelper} from "../helpers/distanceHelper.js";
import {MeshStandardMaterial, Vector3} from "../../third-party/three.module.js";

export class EarringRight{
    constructor(mesh){
        this.mesh = mesh;
        this.path = "";
        this.prevDom = {x: 0, y:0};
    }
    static create(objPath) {
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            var loader = objLoader.load(objPath, (root) => {
                //console.log("FUNCTION: " + objLoader.load);
                var material = new MeshStandardMaterial({
                      color: 0xD4AF37,
                      roughness: 0.4,
                      metalness: 0.1,
                      transparent: true,
                });
                //console.log(root);
                root.children[0].material = material;
                root.scale.setScalar(10);
                root.name = objPath;
                root.castShadow = true; 
                root.receiveShadow = true;
                root.rotation.x = -90;
                console.log("Called!")
                resolve(root);
            });
        });
    }
    async update({poses, mask, xOff, yOff, zOff, width, height, camera, scaleOff, earringPath, adaptive, rotX, rotY, rotZ}){
        if(earringPath !== this.path){
            this.path = earringPath;
            //console.log((await EarringRight.create(earringPath)).children);
            //console.log(this.mesh.children);
            this.mesh.children[0].geometry = (await EarringRight.create(earringPath)).children[0].geometry
            
        }
        const domToWorld = function(x, y) {
          let newPosition = new Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);

          newPosition.unproject(camera);
          return newPosition;
        };  

        if(poses.poseLandmarks[7].score <= 0.1){
            this.hide();
            return;
        } 
        var domPos = domToWorld(
            poses.poseLandmarks[7].x * width, 
            poses.poseLandmarks[7].y * height
        );
        
        this.mesh.position.x = (domPos.x + this.prevDom.x)/2 + xOff;
        this.mesh.position.y = (domPos.y + this.prevDom.y)/2 + yOff;
        
        const trackLeftRot = mask.geometry.track(109 , 108 , 151 );
        const trackLeftPos = mask.geometry.track(177 , 137 , 132 );
        
        this.mesh.rotation.setFromRotationMatrix(trackLeftRot.rotation);
        
        var temp = this.mesh.rotation.z;
        this.mesh.rotation.x += rotX / 180 * Math.PI;
        this.mesh.rotation.z =  -this.mesh.rotation.y + rotZ/180*Math.PI;
        this.mesh.rotation.y = -temp + rotY/180*Math.PI;
        this.mesh.position.z = trackLeftPos.position.z + zOff;
        
        var domPosLeft = domToWorld(poses.poseLandmarks[11].x * width, poses.poseLandmarks[11].y * height);
        var domPosRight = domToWorld(poses.poseLandmarks[12].x * width, poses.poseLandmarks[12].y * height);
        
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
        }
        
        this.prevDom.x = domPos.x;
        this.prevDom.y = domPos.y;
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
