// BootStrap
var stats = new Stats();
stats.showPanel(0);                     // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

cameraControls = new CameraControls;

// Events
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

var count = 0;
var dragged = false;
var pivot = [0.0, 0.0, 0.0];
var pivotMousePosition = [0, 0];

var canvas = document.body.lastChild;

canvas.addEventListener("mousedown", (e) => {
    count = 0;
    if(e.which == 1){
        dragged = true;
    }
});

canvas.addEventListener("mousemove", (e) => {
    if(dragged){
        if(count < 1){
            pivotMousePosition = [e.x, e.y];
            count++;
        }
        if(e.x != 0 && e.y != 0){
            canvas.style.cursor = "move";

            var mousePositionDelta = [(e.x - pivotMousePosition[0]) * 0.01, (pivotMousePosition[1] - e.y) * 0.01];
            pivotMousePosition = [e.x, e.y];
    
            cameraControls.orbit(camera, pivot, mousePositionDelta[1], mousePositionDelta[0]);
            
            document.getElementById("radius").innerText = cameraControls.getRadius(4);
            document.getElementById("inclination").innerText = cameraControls.getInclination(4);
            document.getElementById("azimuth").innerText = cameraControls.getAzimuth(4);
            document.getElementById("CamX").innerText = (camera.position.x).toFixed(4);
            document.getElementById("CamY").innerText = (camera.position.y).toFixed(4);
            document.getElementById("CamZ").innerText = (camera.position.z).toFixed(4);
        }
    }
});

canvas.addEventListener("mouseup", (e) => {
    dragged = false;
    canvas.style.cursor = "default";
});

canvas.addEventListener("touchstart", (e) => {
    console.log(e.touches);
    count = 0;
});

canvas.addEventListener("touchmove", (e) => {
    if(count < 1){
        pivotMousePosition = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];
        count++;
    }
    if(e.x != 0 && e.y != 0){
        var mousePositionDelta = [(e.changedTouches[0].clientX - pivotMousePosition[0]) * 0.01, (pivotMousePosition[1] - e.changedTouches[0].clientY) * 0.01];
        pivotMousePosition = [e.changedTouches[0].clientX, e.changedTouches[0].clientY];

        cameraControls.orbit(camera, pivot, mousePositionDelta[1], mousePositionDelta[0]);
        
        document.getElementById("radius").innerText = cameraControls.getRadius(4);
        document.getElementById("inclination").innerText = cameraControls.getInclination(4);
        document.getElementById("azimuth").innerText = cameraControls.getAzimuth(4);
        document.getElementById("CamX").innerText = (camera.position.x).toFixed(4);
        document.getElementById("CamY").innerText = (camera.position.y).toFixed(4);
        document.getElementById("CamZ").innerText = (camera.position.z).toFixed(4);
    }
});

canvas.addEventListener("wheel", (e) => {
    if(e.deltaY < 0){
        cameraControls.zoom(camera, pivot, -0.1);
    }
    else{
        cameraControls.zoom(camera, pivot, 0.1);
    }

    document.getElementById("radius").innerText = cameraControls.getRadius(4);
    document.getElementById("inclination").innerText = cameraControls.getInclination(4);
    document.getElementById("azimuth").innerText = cameraControls.getAzimuth(4);
    document.getElementById("CamX").innerText = (camera.position.x).toFixed(4);
    document.getElementById("CamY").innerText = (camera.position.y).toFixed(4);
    document.getElementById("CamZ").innerText = (camera.position.z).toFixed(4);
});

// Functions
function orbitFront(){

}

function orbitBack(){

}

function orbitTop(){

}

function orbitBottom(){

}

function changeFactor(obj){
    let factor = obj.value * 1;
    let vertices = sphere.geometry.attributes.position.array;

    for(let i = 0; i < vertices.length; i += 3){
        let x = sphereVertices[i];
        let z = sphereVertices[i + 1];
        let y = sphereVertices[i + 2];

        vertices[i] = ((x * (1 - factor)) + factor * (2 * x / (1 + x * x + y * y)));
        vertices[i + 2] = ((y * (1 - factor)) + factor * (2 * y / (1 + x * x + y * y)));
        vertices[i + 1] = ((z * (1 - factor)) + factor * ((-1 + x * x + y * y) / (1 + x * x + y * y)));
    }

    sphere.geometry.attributes.position.needsUpdate = true;
}

// Materials
const simpleMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true
});

const simpleTranslucentMaterial = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true,
    transparent: true,
    opacity: 0.5,
});

const dotMaterial = new THREE.PointsMaterial({
    size: 2,
    sizeAttenuation: false
});

const lineMaterial = new THREE.LineBasicMaterial({
    vertexColors: true
});

// Geometry Construction
const sphereGeometry = new THREE.BufferGeometry();
const sphereVertices = [];
const sphereNormals = [];
const sphereIndices = [];
const sphereColors = [];

// generate vertices
vertSize = 1000

for(let i = 0; i < vertSize; i++){

    let dist = i / (vertSize - 1.0);
    let azimuth = 2.0 * Math.PI * 1.61803398875 * i;
    let inclination = Math.acos(1.0 - 2.0 * dist);

    let x = Math.sin(inclination) * Math.sin(azimuth);
    let y = Math.sin(inclination) * Math.cos(azimuth);
    let z = Math.cos(inclination);

    if(z == 1){
        z = 0.99;
    }

    sphereVertices.push((x / (1.0 - z)), 0.0, (y / (1.0 - z)));

    sphereColors.push(Math.random(), Math.random(), Math.random());
    sphereNormals.push(0, 0, 0);
}

//sphereGeometry.setIndex(sphereIndices);
sphereGeometry.setAttribute('position', new THREE.Float32BufferAttribute(sphereVertices, 3));
sphereGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(sphereNormals, 3));
sphereGeometry.setAttribute('color', new THREE.Float32BufferAttribute(sphereColors, 3));

const originGeometry = new THREE.BufferGeometry();
const originPositions = [];
const originIndices = [];
const originColors = [];

originPositions.push(0.0, 0.0, 0.0);
originPositions.push(1.0, 0.0, 0.0);
originPositions.push(0.0, 1.0, 0.0);
originPositions.push(0.0, 0.0, 1.0);

originIndices.push(0, 1);
originIndices.push(0, 3);
originIndices.push(0, 2);

originColors.push(1.0, 1.0, 1.0);
originColors.push(0.0, 1.0, 0.0);
originColors.push(0.0, 0.0, 1.0);
originColors.push(1.0, 0.0, 0.0);

originGeometry.setIndex(originIndices);
originGeometry.setAttribute('position', new THREE.Float32BufferAttribute(originPositions, 3));
originGeometry.setAttribute('color', new THREE.Float32BufferAttribute(originColors, 3));

const geometry = new THREE.BufferGeometry();
const indices = [];
const vertices = [];
const normals = [];
const colors = [];

// generate vertices
vertices.push(0.0, 0.0, 0.0);

vertices.push(0.5, 0.0, 0.0);
vertices.push(0.0, 0.0, 0.5);
vertices.push(0.0, 0.5, 0.0);

vertices.push(-0.5, 0.0, 0.0);
vertices.push(0.0, 0.0, -0.5);

// generate normals
normals.push(0, 0, 1);
normals.push(0, 0, 1);
normals.push(0, 0, 1);

normals.push(0, 0, 1);
normals.push(0, 0, 1);
normals.push(0, 0, 1);

normals.push(0, 0, 1);

// generate indices
indices.push(0, 1, 2);
indices.push(0, 2, 3);
indices.push(0, 1, 3);

indices.push(0, 4, 5);
indices.push(0, 1, 5);
indices.push(0, 2, 4);

indices.push(0, 3, 4);
indices.push(0, 3, 5);

// generate colors
colors.push(0.0, 0.0, 0.0);

colors.push(0.0, 1.0, 0.0);
colors.push(1.0, 0.0, 0.0);
colors.push(0.0, 0.0, 1.0);

colors.push(0.0, 1.0, 1.0);
colors.push(1.0, 0.0, 1.0);

geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Objects
const origin = new THREE.Line(originGeometry, lineMaterial);
const mesh = new THREE.Mesh(geometry, simpleMaterial);
const pointsCloud = new THREE.Points(geometry, dotMaterial);
const sphere = new THREE.Points(sphereGeometry, dotMaterial);

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const light = new THREE.HemisphereLight();

scene.background = new THREE.Color(0x2e2e2e);
scene.add(mesh);
scene.add(light);
scene.add(origin);
scene.add(sphere);
scene.add(pointsCloud);

// Code
    // Setup
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1.6;
    camera.lookAt(0, 0, 0);

    cameraControls.orbit(camera, pivot, 0.0, 0.0);

    document.getElementById("radius").innerText = cameraControls.getRadius(4);
    document.getElementById("inclination").innerText = cameraControls.getInclination(4);
    document.getElementById("azimuth").innerText = cameraControls.getAzimuth(4);
    document.getElementById("CamX").innerText = (camera.position.x).toFixed(4);
    document.getElementById("CamY").innerText = (camera.position.y).toFixed(4);
    document.getElementById("CamZ").innerText = (camera.position.z).toFixed(4);

    // Loop
    function Loop() {
        stats.begin();

        renderer.render(scene, camera);
        requestAnimationFrame(Loop);

        stats.end();
    }
    Loop();