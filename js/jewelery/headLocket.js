import {OBJLoader} from '../../third-party/OBJLoader.js';

export class HeadLocket{
    constructor(mesh){
        this.mesh = mesh;
    }
    static create() {
        var geometry = new THREE.BoxGeometry();
        var material = new THREE.MeshStandardMaterial({
          color: 0xdddd33,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
        });
        var sphere = new THREE.Mesh(geometry, material);
        sphere.scale.setScalar(5);
        sphere.name = "bottu";
        sphere.castShadow = true; 
        sphere.receiveShadow = true;
        return sphere;
    }
    update({mask, xOff, yOff, zOff, scaleOff, xRot, yRot, zRot}){
        const trackBottu = mask.geometry.track(338 , 10 , 151);
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);
        
//        console.log(this.mesh);
        this.mesh.rotation.x *= -1;
        this.mesh.rotation.y *= -1;
//        this.mesh.rotation.z *= -1; 
        var xPos = this.mesh.position.x;
        var yPos = this.mesh.position.y;
        var zPos = this.mesh.position.z;
        
        this.mesh.position.z = zPos + zOff;
        this.mesh.position.y = yPos + yOff;
        this.mesh.position.x = xPos + xOff;
        
        
        this.mesh.scale.x = 5+scaleOff;
        this.mesh.scale.y = 5+scaleOff;
        this.mesh.scale.z = 5+scaleOff;
        
        this.mesh.rotation.x += xRot;
        this.mesh.rotation.y += yRot;
        this.mesh.rotation.z += zRot;
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