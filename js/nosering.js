export class NoseRing{
    constructor(mesh){
        this.mesh = mesh
    }
    async update({mask, xOff, yOff, zOff}){

            const trackNoseRing = mask.geometry.track(235, 64, 240);
            this.mesh.position.copy(trackNoseRing.position);
            this.mesh.rotation.setFromRotationMatrix(trackNoseRing.rotation);

            this.mesh.rotation.x *= -1;
            this.mesh.rotation.y *= -1;
            this.mesh.rotation.z *= -1;
        
            this.mesh.position.x += xOff;
            this.mesh.position.y += yOff;
            this.mesh.position.z += zOff;
    }
    static create() {
            var geometry = new THREE.SphereGeometry();
            var material = new THREE.MeshStandardMaterial({
              color: 0xaaaa00,
              roughness: 0.4,
              metalness: 0.1,
              transparent: true,
            });

            var sphere = new THREE.Mesh(geometry, material);
            sphere.scale.setScalar(5);
            sphere.name = "nosering";

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