import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {DistanceHelper} from "./distanceHelper.js";

export class Goggles{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff}){
        const trackBottu = mask.geometry.track(55, 8, 9);
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);

        //this.mesh.rotation.x *= -1;
        //this.mesh.rotation.y *= -1;
        this.mesh.rotation.z += Math.PI/2; 

        this.mesh.position.z += zOff;
        this.mesh.position.y += yOff;
        this.mesh.position.x += xOff;
        
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
    }
    static create(objPath) {
        this.path = objPath;
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader2();
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