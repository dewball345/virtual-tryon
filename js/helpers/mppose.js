export class MPPose{
    constructor(){
        this.pose = new Pose({locateFile: (file) => {
          return `https://cdn.jsdelivr.net/npm/@mediapipe/pose@0.8.4/${file}`;
        }});
        this.pose.setOptions({
          upperBodyOnly: true,
          smoothLandmarks: true,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5
        });
    }
    async predict(video){
        console.log("here");
        this.pose.onResults((results) => console.log(results));
        console.log("here1");
        await this.pose.send({image: video})
        console.log("here2");
    }
}