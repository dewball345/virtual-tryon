import {SphereGeometry, Mesh, MeshStandardMaterial} from "../../third-party/three.module.js";
export class Bottu{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff}){
        const trackBottu = mask.geometry.track(55, 8, 9);
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);

        this.mesh.rotation.x *= -1;
        this.mesh.rotation.y *= -1;
        this.mesh.rotation.z *= -1; 

        this.mesh.position.z += zOff;
        this.mesh.position.y += yOff;
        this.mesh.position.x += xOff;
    }
    static create() {
        var geometry = new SphereGeometry();
        var material = new MeshStandardMaterial({
          color: 0x550000,
          roughness: 0.4,
          metalness: 0.1,
          transparent: true,
        });
        var sphere = new Mesh(geometry, material);
        sphere.scale.setScalar(5);
        sphere.name = "bottu";
        sphere.castShadow = true; 
        sphere.receiveShadow = true;
        return sphere;
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