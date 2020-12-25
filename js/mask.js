import { FaceMeshFaceGeometry } from '../third-party/face.js';

export class Mask{
    constructor(mesh){
        this.mesh = mesh;
            
    }
    async update({points, camera, width, height, video}) {
        this.mesh.geometry = Mask.create({
            points:points, 
            camera:camera, 
            width:width, 
            height:height, 
            video:video
        }).geometry;
    }
    static create({points, camera, width, height, video}){
        const faceGeometry = new FaceMeshFaceGeometry({useVideoTexture: true});
//        console.log(points);
        const w = width;
        const h = height;
        camera.left = .5 * width;
        camera.right = -.5 * width;
        camera.top = .5 * height;
        camera.bottom = -.5 * height;
        camera.updateProjectionMatrix(); 
        faceGeometry.setSize(w, h);

        faceGeometry.setSize(width, height);
        faceGeometry.update(points, true);
        
//        var material = new THREE.MeshStandardMaterial({
//          color: 0xffffee,
//          roughness: 0.8,
//          metalness: 0.1,
//          map:null,
//          transparent: true,
////          opacity:1
//        });
        var material = new THREE.MeshBasicMaterial()
        const videoTexture = new THREE.VideoTexture(video);
        videoTexture.encoding = THREE.sRGBEncoding;
        material.map = videoTexture;
        const mask = new THREE.Mesh(faceGeometry, material);
        mask.receiveShadow = mask.castShadow = true;
//        console.log("Called!")
        return mask;
    }
}