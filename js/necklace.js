import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';

export class Necklace{
    constructor(mesh){
        this.mesh = mesh
        this.path = "";
    }
    async update({poses, mask, xOff, yOff, zOff, scaleOff, width, height, camera, rotX, necklacePath}){
        if(necklacePath !== this.path){
            this.path = necklacePath;
            this.mesh.children[0].geometry = (await Necklace.create(necklacePath)).children[0].geometry
//            console.log("Howdy");
        }
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };
        
        var averagedX = (poses.keypoints[5].position.x + poses.keypoints[6].position.x)/2;
        var averagedY = (poses.keypoints[5].position.y + poses.keypoints[6].position.y)/2;
        var domPos = domToWorld(averagedX, averagedY);
        this.mesh.position.x = domPos.x;
        this.mesh.position.y = domPos.y;
        this.mesh.position.z = 0;
        this.mesh.rotation.x = rotX;
        
        //const trackNecklace = mask.geometry.track(118 , 50 , 101);
        //this.mesh.position.copy(trackNecklace.position);
        
        //this.mesh.rotation.setFromRotationMatrix(trackNecklace.rotation);

        //this.mesh.rotation.x *= -1;
        //this.mesh.rotation.y *= -1;
        //this.mesh.rotation.z *= -1;

        this.mesh.position.x += xOff;
        this.mesh.position.y += yOff;
        this.mesh.position.z += zOff;
        
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
        console.log(this.mesh.position);
    }
    static create(objPath='./obj/untitled.obj') {
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
