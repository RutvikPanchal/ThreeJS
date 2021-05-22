class CameraControls{
    // Camera Parameters
    radius = 0.0;
    azimuth = 0.0;
    inclination = 0.0;

    getRadius(precision){
        return this.radius.toFixed(precision);
    }

    getInclination(precision){
        return (this.inclination * 180 / Math.PI).toFixed(precision);
    }

    getAzimuth(precision){
        return (this.azimuth * 180 / Math.PI).toFixed(precision);
    }

    distance(pointA, pointB){
        var distance = Math.sqrt(((pointA[0] - pointB[0]) * (pointA[0] - pointB[0])) + ((pointA[1] - pointB[1]) * (pointA[1] - pointB[1])) + ((pointA[2] - pointB[2]) * (pointA[2] - pointB[2])));
        return distance;
    }

    calcPolarCoords(inCamera, pivot){
        if(inCamera.position.x == 0 && inCamera.position.z == 0){
            inCamera.position.x = 0.00001;
            inCamera.position.z = 0.00001;
        }

        this.radius = this.distance([inCamera.position.x, inCamera.position.y, inCamera.position.z], pivot);
        this.azimuth = Math.atan(inCamera.position.z / inCamera.position.x);
        this.inclination = Math.acos(inCamera.position.y / this.radius);
    }

    orbit(inCamera, pivot, rateInclination, rateAzimuth){
        this.calcPolarCoords(inCamera, pivot);

        this.inclination += rateInclination;
        this.azimuth += rateAzimuth;

        if(this.inclination <= 0){
            this.inclination = 0.000001;
        }
        if(this.inclination >= Math.PI){
            this.inclination = Math.PI;
        }

        if(inCamera.position.x < 0){
            this.azimuth = this.azimuth + Math.PI;
        }
        else if(inCamera.position.x < 0 && inCamera.position.z < 0){
            this.azimuth = this.azimuth - Math.PI;
        }
        else if(this.azimuth < 0){
            this.azimuth += 2 * Math.PI;
        }

        inCamera.position.x = this.radius * Math.cos(this.azimuth) * Math.sin(this.inclination);
        inCamera.position.z = this.radius * Math.sin(this.inclination) * Math.sin(this.azimuth);
        inCamera.position.y = this.radius * Math.cos(this.inclination);

        inCamera.lookAt(pivot[0], pivot[1], pivot[2]);
    }

    zoom(inCamera, pivot, rate){
        this.calcPolarCoords(inCamera, pivot);

        this.radius += rate;

        if(this.inclination <= 0){
            this.inclination = 0.000001;
        }
        if(this.inclination >= Math.PI){
            this.inclination = Math.PI;
        }

        if(inCamera.position.x < 0){
            this.azimuth = this.azimuth + Math.PI;
        }
        else if(inCamera.position.x < 0 && inCamera.position.z < 0){
            this.azimuth = this.azimuth - Math.PI;
        }
        else if(this.azimuth < 0){
            this.azimuth += 2 * Math.PI;
        }

        inCamera.position.x = this.radius * Math.cos(this.azimuth) * Math.sin(this.inclination);
        inCamera.position.z = this.radius * Math.sin(this.inclination) * Math.sin(this.azimuth);
        inCamera.position.y = this.radius * Math.cos(this.inclination);

        inCamera.lookAt(pivot[0], pivot[1], pivot[2]);
    }
}