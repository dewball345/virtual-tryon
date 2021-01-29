import {DistanceHelper} from "../helpers/distanceHelper.js"
export class NeckOccluder{
    constructor(mesh){
        this.mesh = mesh;    
    }
    
    static create(video){
        var geometry = new THREE.BoxGeometry();
        var vtexture = new THREE.VideoTexture(video);
        vtexture.mapping = THREE.EquirectangularRefractionMapping;
        var material = new THREE.MeshStandardMaterial({
//          color: 0x550000,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
          map: vtexture,
        });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.scale.setScalar(40);
        sphere.name = "neck";
        sphere.castShadow = true; 
        sphere.receiveShadow = true;
        return sphere;
    }
    
    async update({poses, xOff, yOff, zOff, width, height, camera, widthOff}){
        console.log(this.mesh);
        const domToWorld = function(x, y) {
          let newPosition = new THREE.Vector3();
          let normalizedX = (x / width) * 2 - 1;
          let normalizedY = ((y - height) / height) * 2 + 1;
          newPosition.set(normalizedX, -normalizedY, 0);
          newPosition.unproject(camera);
//          console.log(newPosition);
          return newPosition;
        };
        
//        console.log({poses, xOff, yOff, zOff, width, height, camera});
        var domPosLeft = domToWorld(poses.poseLandmarks[11].x * width, poses.poseLandmarks[11].y * height);
        var domPosRight = domToWorld(poses.poseLandmarks[12].x * width, poses.poseLandmarks[12].y * height);
        var domPos = domToWorld(averagedX, averagedY);
        
        var noseX = poses.keypoints[0].position.x;
        var noseY = poses.keypoints[0].position.y;
        var domNose = domToWorld(noseX, noseY);
        
        //console.log(domPos.y + " " + this.mesh.position.y);
//        this.mesh.scale.y = 2
//        console.log(this.mesh);
        this.mesh.scale.y = DistanceHelper.distance({
            x1: domNose.x, 
            y1: domNose.y, 
            x2: domPos.x, 
            y2: domPos.y
        });
        
        this.mesh.scale.x = 5 + widthOff;
        this.mesh.scale.z = 5 + widthOff;
//        console.log(this.mesh.scale.y);
        
        this.mesh.position.x = domPos.x;
        this.mesh.position.y = domPos.y;  


        this.mesh.position.z = 0;
//        this.mesh.rotation.x = rotX;
        console.log(this.mesh.geometry.vertices);
        this.mesh.position.x += xOff;
        this.mesh.position.y += yOff;
        this.mesh.position.z += zOff;
        
//        this.mesh.scale.x = 10 + scaleOff;
//        this.mesh.scale.y = 10 + scaleOff;
//        this.mesh.scale.z = 10 + scaleOff;
    }
    hide(){
        //console.log(this.mesh);
        this.mesh.visible = false;
    }
    show(){
//        console.log(this.mesh);
        this.mesh.visible = true;
    }
}