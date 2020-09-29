//TEACH CORNELL NOTES
import {DistanceHelper} from './distanceHelper.js'

class RotHelper{
    static rotX({z1, y1, z2, y2}){
//        console.log(z2-z1);
        var m = (y2-y1)/(z2-z1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);
    }
    static rotZ({x1, z1, x2, z2}){
        var m = (z2-z1)/(x2-x1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);    
    }
    static rotY({x1, y1, x2, y2}){
        var m = (y2-y1)/(x2-x1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);    
    }
}
export class Ring{
    constructor(mesh){
        this.mesh = mesh;
    }
    static create(){
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshStandardMaterial({
              color: 0xff2010,
              roughness: 0.4,
              metalness: 0.1,
              transparent: true,
        });
        var cubeRing = new THREE.Mesh(geometry, material);
        cubeRing.scale.setScalar(5);
        return cubeRing;
    }
    
//    static #rotateX(){
//    d
    async update({
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
        console.log(points);
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
          let newPosition = new THREE.Vector3();
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
            this.mesh.rotation.z = -RotHelper.rotZ({
                x1: domPosMiddle.x,
                z1: -middleBottom[2],
                x2: domPosBottom.x,
                z2: -trackingBottom[2]
            });
            this.mesh.rotation.y = RotHelper.rotY({
                x1: domPos.x,
                y1: domPos.y,
                x2: domPosUpper.x,
                y2: domPosUpper.y
            });
//            console.log(this.mesh.rotation.x);
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