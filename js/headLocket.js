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
    update({mask, xOff, yOff, zOff, scaleOff}){
        const trackBottu = mask.geometry.track(338 , 10 , 151);
        this.mesh.position.copy(trackBottu.position);
        this.mesh.rotation.setFromRotationMatrix(trackBottu.rotation);
        
//        console.log(this.mesh);
        this.mesh.rotation.x *= -1;
        this.mesh.rotation.y *= -1;
//        this.mesh.rotation.z *= -1; 

        this.mesh.position.z += zOff;
        this.mesh.position.y += yOff;
        this.mesh.position.x += xOff;
        
        this.mesh.scale.x = scaleOff;
        this.mesh.scale.y = scaleOff;
        this.mesh.scale.z = scaleOff;
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