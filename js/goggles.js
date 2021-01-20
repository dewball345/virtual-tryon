import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';
import {MTLLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/MTLLoader.js';
import {GLTFLoader} from 'https://threejsfundamentals.org/threejs/resources/threejs/r122/examples/jsm/loaders/GLTFLoader.js';
//import {DistanceHelper} from "./distanceHelper.js";

export class Goggles{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff, scaleOff, rotZ}){
//        console.log(mask);
        const trackBottu = mask.geometry.track(55, 8, 9);
//        console.log(this.mesh)
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);

        //this.mesh.rotation.x *= -1;
        //this.mesh.rotation.y *= -1;
        this.mesh.rotation.z += 90 / 180 * Math.PI; 
        this.mesh.rotation.y += rotZ / 180 * Math.PI;

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
    static createMTL(mtlPath) {
        this.mtlPath = mtlPath;
        return new Promise((resolve, reject) => {
            const mtlLoader = new MTLLoader();
            var loader = mtlLoader.load(mtlPath, (mtl) => {
                //console.log("FUNCTION: " + objLoader.load);
                mtl.preload()
                resolve(mtl)
                console.log("MTL CALLED!")
            });
        });
    }
    static create(objPath){
        this.objPath = objPath;
        return new Promise(async (resolve, reject) => {
            const objLoader = new OBJLoader2();
            var material = await this.createMTL(mtlPath)
//            material.shininess = 1;
            console.log(material)
//            objLoader.setMaterials(material);
            var loader = objLoader.load(objPath, (root) => {
                root.children[0].material = material.materials['TextureAtlas_1001.001'];
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