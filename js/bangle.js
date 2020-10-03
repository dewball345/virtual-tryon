import {DistanceHelper} from "./distanceHelper.js";
import {RotHelper} from "./rotHelper.js";

export class Bangle{
    constructor(mesh){
        this.mesh = mesh;
    }
    static create(){
        var geometry = new THREE.BoxGeometry;
        var material = new THREE.MeshStandardMaterial({
            color: 0xaaaa11,
            roughness: 0.4,
            metalness: 0.1,
            transparent: true,
        });
        var mesh = new THREE.Mesh(geometry, material);
        return mesh;
    }
    update({
        points, 
        xOff, 
        yOff, 
        zOff, 
        scaleOff, 
        adaptive, 
        rotatable,
        width,
        height,
        camera
    }) {
//        console.log(points);
        try{
            var palm = points[0].annotations.palmBase[0];
//            console.log("HERE")
            var index = points[0].annotations.indexFinger[0];
            var thumb = points[0].annotations.thumb[0];
            var pinky = points[0].annotations.pinky[0];
        } catch(error){
            console.log("ERROR OCCURED HERE - INITIALIZATION IS NOT RIGHT :-(")
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
        
        var domPalm = domToWorld(palm[0], palm[1]);
        var domIndex = domToWorld(index[0], index[1]);
        var domThumb = domToWorld(thumb[0], thumb[1]);
        var domPinky = domToWorld(pinky[0], pinky[1]);
//        console.log('HERE');
        this.mesh.position.x = domPalm.x + xOff;
        this.mesh.position.y = domPalm.y + yOff;
        this.mesh.position.z = -palm[2] + zOff;
//        console.log(this.mesh.position);
        if(adaptive){
            
            var distance = DistanceHelper.distance3d({
                x1: domPalm.x,
                y1: domPalm.y,
                z1: -palm[2],
                x2: domIndex.x,
                y2: domIndex.y,
                z2: -index[2],
            })
            this.mesh.scale.setScalar(distance + scaleOff);
//            console.log(this.mesh.scale);
        } else {
            this.mesh.scale.setScalar(10+scaleOff)
        }
        if(rotatable){
            this.mesh.rotation.x = RotHelper.rotX({
                z1: -pinky[2], 
                y1: domPinky.y, 
                z2: -thumb[2], 
                y2: domThumb.y
            });
            this.mesh.rotation.y = RotHelper.rotY({
                x1: domPinky.x, 
                y1: domPinky.y, 
                x2: domThumb.x, 
                y2: domThumb.y
            });
//            this.mesh.rotation.z = RotHelper.rotZ({
//                x1: domPinky.x, 
//                z1: -domPinky[2], 
//                x2: domThumb.x, 
//                z2: -domThumb[2]
//            });
            console.log(this.mesh);
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