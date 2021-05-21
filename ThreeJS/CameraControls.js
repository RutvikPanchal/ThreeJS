class CameraControls{
    // Camera Parameters
    radius = 0.0;
    azimuth = 0.0;
    inclination = 0.0;

    distance(pointA, pointB){
        var distance = Math.sqrt(((pointA[0] - pointB[0]) * (pointA[0] - pointB[0])) + ((pointA[1] - pointB[1]) * (pointA[1] - pointB[1])) + ((pointA[2] - pointB[2]) * (pointA[2] - pointB[2])));
        return distance;
    }

    orbit(inCamera, pivot, rate){
        this.radius = this.distance([inCamera.position.x, inCamera.position.y, inCamera.position.z], pivot);
        this.azimuth = Math.atan(inCamera.position.z / inCamera.position.x);
        this.inclination = 0;

        if(this.inclination <= 0){
            this.inclination = 0.00001;
        }
        if(this.inclination >= Math.PI){
            this.inclination = Math.PI;
        }

        //inCamera.position.x = this.radius * Math.cos(this.azimuth) * Math.sin(this.inclination);
        //inCamera.position.z = this.radius * Math.sin(this.azimuth) * Math.sin(this.inclination); 
        //inCamera.position.y = this.radius * Math.cos(this.azimuth);

        console.log(this.radius, this.inclination * 180 / Math.PI, this.azimuth * 180 / Math.PI);
    }

    zoom(){

    }
}