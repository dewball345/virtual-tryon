import {OBJLoader2} from 'https://threejsfundamentals.org/threejs/resources/threejs/r119/examples/jsm/loaders/OBJLoader2.js';

export class EarringLeft{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({poses, mask, xOff, yOff, zOff, width, height, camera}){
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };  
        if(poses.keypoints[4].score <= 0.3){
            this.hide();
            return;
        }
        var domPos = domToWorld(
            poses.keypoints[4].position.x, 
            poses.keypoints[4].position.y
        );
        this.mesh.position.x = domPos.x + xOff;
        this.mesh.position.y = domPos.y + yOff;
        const trackLeftRot = mask.geometry.track(109 , 108 , 151 );
        const trackLeftPos = mask.geometry.track(177 , 137 , 132 );
        this.mesh.rotation.setFromRotationMatrix(trackLeftRot.rotation);
        var temp = this.mesh.rotation.z;
        this.mesh.rotation.x += -90 / 180 * Math.PI;
        this.mesh.rotation.z = -this.mesh.rotation.y;
        this.mesh.rotation.y = temp;
        this.mesh.position.z = trackLeftPos.position.z + zOff;
    }
    static create(objPath='../obj/untitled.obj') {
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
                root.name = "left";
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