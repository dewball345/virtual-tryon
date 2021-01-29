import {GLTFLoader} from '../../third-party/GLTFLoader.js';
//import {DistanceHelper} from "./distanceHelper.js";

export class Goggles{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff, rotZ, rotX, rotY}){
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
        
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
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