export class BangleRight{
    constructor(mesh){
        this.mesh = mesh
    }
    static create(){
        var cube = new THREE.BoxGeometry();
        var material = new THREE.MeshStandardMaterial({
          color: 0xEDC839,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
        });

        var cubeMesh = new THREE.Mesh(cube, material);
        cubeMesh.scale.setScalar(5);
        cubeMesh.name = "bangle";

        cubeMesh.castShadow = true; 
        cubeMesh.receiveShadow = true;

        return cubeMesh;
    }
    async update({poses, xOff, yOff, zOff, width, height, scaleOff, camera /*,banglePath*/}){
//        if(earringPath !== this.path){
//            this.path = earringPath;
//            this.mesh.children[0].geometry = (await EarringLeft.create(earringPath)).children[0].geometry
////            console.log("Howdy");
//        }
        
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
          return newPosition;
        };  
//        if(poses.keypoints[4].score <= 0.3){
//            this.hide();
//            return;
//        }
        var domPos = domToWorld(
            poses.keypoints[9].position.x, 
            poses.keypoints[9].position.y
        );
        this.mesh.position.x = domPos.x + xOff;
        this.mesh.position.y = domPos.y + yOff;
////        const trackLeftRot = mask.geometry.track(109 , 108 , 151 );
////        const trackLeftPos = mask.geometry.track(177 , 137 , 132 );
////        this.mesh.rotation.setFromRotationMatrix(trackLeftRot.rotation);
////        var temp = this.mesh.rotation.z;
////        this.mesh.rotation.x += -90 / 180 * Math.PI;
////        this.mesh.rotation.z = -this.mesh.rotation.y;
//        this.mesh.rotation.y = temp;
//        this.mesh.position.z = trackLeftPos.position.z + zOff;
        this.mesh.scale.x = 10 + scaleOff;
        this.mesh.scale.y = 10 + scaleOff;
        this.mesh.scale.z = 10 + scaleOff;
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