
import {OBJLoader} from '../../third-party/OBJLoader.js';
//import {DistanceHelper} from "./distanceHelper.js";

export class Facemask{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff, xRot, yRot, zRot}){
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
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
    }
    static create(objPath) {
        this.path = objPath;
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader();
            var loader = objLoader.load(objPath, (root) => {
                //console.log("FUNCTION: " + objLoader.load);
                var material = new THREE.MeshStandardMaterial({
                      color: 0xff2010,
                      roughness: 0.4,
                      metalness: 0.1,
                      transparent: true,
                });
                //console.log(root);
                root.children[0].material = material;
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