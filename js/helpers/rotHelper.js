export class RotHelper{
    static rotX({z1, y1, z2, y2}){
//        console.log(z2-z1);
        var m = (y2-y1)/(z2-z1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);
    }
    static rotZ({x1, z1, x2, z2}){
        var m = (z2-z1)/(x2-x1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);    
    }
    static rotY({x1, y1, x2, y2}){
        var m = (y2-y1)/(x2-x1)
//        console.log(m);
//        console.log("(" + y2 + "-" + y1 + ")/" + "(" + z2 + "-" + z1 + ")")
        return Math.atan(m);    
    }
}