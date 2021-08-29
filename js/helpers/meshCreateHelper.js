import {GLTFLoader} from '../../third-party/GLTFLoader.js';
import {OBJLoader} from '../../third-party/OBJLoader.js';
import {MeshStandardMaterial} from "../../third-party/three.module.js";

export class MeshCreateHelper{
    static async createGLTF(objPath, name) {
        this.path = objPath;
        return new Promise(async (resolve, reject) => {
            const gltfLoader = new GLTFLoader();
//            objLoader.setMaterials(material);
            var loader = gltfLoader.load(objPath, (result) => {
//                root.children[0].material = material.materials['TextureAtlas_1001.001'];
                var root = result.scene
                root.scale.setScalar(10);
                root.name = name;
                root.castShadow = true; 
                root.receiveShadow = true;
                //root.rotation.x = -90;
                resolve(root);
                console.log("Called!")
            });
        });
    }

    static createUntexturedOBJ(objPath, name) {
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
                root.name = name;
                root.castShadow = true; 
                root.receiveShadow = true;
                root.rotation.x = -90;
                resolve(root);
                console.log("Called!")
            });
        });
    }
}