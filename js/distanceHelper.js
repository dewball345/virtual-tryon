export class DistanceHelper{
    static distance({x1, y1, x2, y2}){
        return Math.sqrt(
            Math.pow(x1-x2, 2) + 
            Math.pow(y1-y2, 2)
        );
    }
    static distance3d({x1, y1, z1, x2, y2, z2}){
        return Math.sqrt(
            Math.pow(x1-x2, 2) + 
            Math.pow(y1-y2, 2) + 
            Math.pow(z1-z2, 2)
        ); 
    }
}