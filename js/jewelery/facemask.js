
import {OBJLoader} from '../../third-party/OBJLoader.js';
import {GLTFLoader} from '../../third-party/GLTFLoader.js';
import {DistanceHelper} from "../helpers/distanceHelper.js";
import {Vector3} from "../../third-party/three.module.js";

export class Facemask{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff, xRot, yRot, zRot, adaptive, poses, width, height, camera}){
//        console.log(mask);
        const trackBottu = mask.geometry.track(164 , 0 , 267);
//        console.log(this.mesh)
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);

        //this.mesh.rotation.x *= -1;
        //this.mesh.rotation.y *= -1;
//        this.mesh.rotation.z += Math.PI/2; 

        this.mesh.position.z += zOff;
        this.mesh.position.y += yOff;
        this.mesh.position.x += xOff;
        
        this.mesh.rotation.x += xRot * Math.PI/90;
        this.mesh.rotation.y += yRot * Math.PI/90;
        this.mesh.rotation.z += zRot * Math.PI/90
        
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

    
    static async createGLTF(objPath) {
        this.path = objPath;
        return new Promise(async (resolve, reject) => {
            const gltfLoader = new GLTFLoader();
//            objLoader.setMaterials(material);
            var loader = gltfLoader.load(objPath, (result) => {
//                root.children[0].material = material.materials['TextureAtlas_1001.001'];
                var root = result.scene
                root.scale.setScalar(10);
                root.name = "goggles";
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