import {OBJLoader} from '../../third-party/OBJLoader.js';
import {DistanceHelper} from '../helpers/distanceHelper.js'
import {RotHelper} from '../helpers/rotHelper.js'
import {MeshStandardMaterial, Vector3} from "../../third-party/three.module.js";

export class Ring{
    constructor(mesh){
        this.mesh = mesh;
    }
    static create(objPath) {
        this.path = objPath;
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
                root.name = "left";
                root.castShadow = true; 
                root.receiveShadow = true;
                root.rotation.x = -90;
                resolve(root);
                console.log("Called!")
            });
        });
    }
    
//    static #rotateX(){
//    d
    update({
        points, 
        xOff, 
        yOff, 
        zOff, 
        width, 
        height, 
        camera, 
        scaleOff, 
        adaptive,
        rotatable,
    }){
//        console.log(tracking);
//        console.log(points);
        try{
            var tracking = points[0].annotations.indexFinger[1];
            var upperTracking = points[0].annotations.indexFinger[2];
            var middleBottom = points[0].annotations.middleFinger[0];
            var trackingBottom = points[0].annotations.indexFinger[0];
//            var thumb = points[0].annotations.thumb[1];
        } catch(error){
            return;
        }
        const domToWorld = function(x, y) {
          let newPosition = new Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };
        
        var domPos = domToWorld(tracking[0], tracking[1])
        this.mesh.position.x = domPos.x + xOff;
        this.mesh.position.y = domPos.y + yOff;
        this.mesh.position.z = -tracking[2] + zOff;
        var domPosUpper = domToWorld(upperTracking[0], upperTracking[1]);
        var domPosMiddle = domToWorld(middleBottom[0], middleBottom[1]);
        var domPosBottom = domToWorld(trackingBottom[0], trackingBottom[1]);
        if(adaptive){
           
            var distance = DistanceHelper.distance3d({
                x1: domPos.x,
                y1: domPos.y,
                z1: -tracking[2],
                x2: domPosUpper.x,
                y2: domPosUpper.y,
                z2: -upperTracking[2]
            });
            this.mesh.scale.setScalar(distance + scaleOff);
//            this.mesh.scale.x = distance/3 + scaleOff;
        } else {
            this.mesh.scale.setScalar(5 + scaleOff); 
        }
        
        if(rotatable){
            this.mesh.rotation.x = RotHelper.rotX({
                z1: -upperTracking[2], 
                y1: domPosUpper.y, 
                z2: -tracking[2], 
                y2: domPos.y
            });
            this.mesh.rotation.z = RotHelper.rotZ({
                x1: domPosMiddle.x,
                z1: -middleBottom[2],
                x2: domPosBottom.x,
                z2: -trackingBottom[2]
            });
//            console.log(this.mesh.rotation.z);
//            this.mesh.rotation.y = RotHelper.rotY({
//                x1: domPos.x,
//                y1: domPos.y,
//                x2: domPosUpper.x,
//                y2: domPosUpper.y
//            });
//            console.log(this.mesh.rotation.x);
//              this.mesh.rotation.y += 0.1;
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