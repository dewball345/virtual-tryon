import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';

export class Necklace{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({poses, mask, xOff, yOff, zOff, width, height, camera}){
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / canvas.width) * 2 - 1;
          let normalizedY = ((y - canvas.height) / canvas.height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };
    
        const trackNecklace = mask.geometry.track(118 , 50 , 101);
        this.mesh.position.copy(trackNecklace.position);
        this.mesh.rotation.setFromRotationMatrix(trackNecklace.rotation);

        this.mesh.rotation.x *= -1;
        this.mesh.rotation.y *= -1;
        this.mesh.rotation.z *= -1;

        this.mesh.position.x += 12;
        this.mesh.position.y += -40;
    }
    static create(objPath='./obj/untitled.obj') {
        return new Promise((resolve, reject) => {
            const objLoader = new OBJLoader2();
            var loader = objLoader.load(objPath, (root) => {
                console.log("FUNCTION: " + objLoader.load);
                var material = new THREE.MeshStandardMaterial({
                      color: 0xff2010,
                      roughness: 0.4,
                      metalness: 0.1,
                      transparent: true,
                });
                //console.log(root);
                root.children[0].material = material;
                root.scale.setScalar(10);
                root.name = "Necklace";
                root.castShadow = true; 
                root.receiveShadow = true;
                root.rotation.x = -90;
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
