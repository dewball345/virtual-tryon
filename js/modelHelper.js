export class ModelHelper{
    constructor(){
        this.facemodel;
        this.posemodel;
        this.handmodel;
    }
    async load(width, height){
        this.facemodel = await facemesh.load(1);
        this.posemodel = await posenet.load({
          architecture: 'MobileNetV1',
          outputStride: 16,
          inputResolution: { width: width, height: height },
          multiplier: 0.75,
        });
        this.handmodel = await handpose.load()
    }
    
    async predictFace(video){
        var faces;
        video.width = 0;
        video.height = 0;
        faces = await this.facemodel.estimateFaces(video, false, true);
        return faces[0];
    }
    
    async predictPose(video, canvas){
        var poses;
        video.width = canvas.width;
        video.height = canvas.height;
        poses = await this.posemodel.estimateSinglePose(video, {
          flipHorizontal: false
        });
        return poses;        
    }
    
    async predictHands(video){
        const predictions = await this.handmodel.estimateHands(video);
        return predictions;
    }
}