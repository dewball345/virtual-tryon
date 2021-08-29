import {GLTFLoader} from '../../third-party/GLTFLoader.js';
import {DistanceHelper} from "../helpers/distanceHelper.js";
import {Vector3} from "../../third-party/three.module.js";

export class Goggles{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff, rotZ, rotX, rotY, adaptive, poses, width, height, camera}){
//        console.log(mask);
        const trackGoggles = mask.geometry.track(55, 8, 9);
//        console.log(this.mesh)
        this.mesh.position.copy(trackGoggles.position);
        this.mesh.rotation.setFromRotationMatrix(trackGoggles.rotation);

        this.mesh.rotation.z += rotZ / 180 * Math.PI; 
        this.mesh.rotation.y += rotY / 180 * Math.PI;
        this.mesh.rotation.x += rotX / 180 * Math.PI;

        this.mesh.position.z += zOff;
        this.mesh.position.y += yOff;
        this.mesh.position.x += xOff;
        
        const domToWorld = function(x, y) {
          let newPosition = new Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };
        
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