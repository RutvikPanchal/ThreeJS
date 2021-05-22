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

document.body.lastChild.draggable = true;

var count = 0;
var pivot = [0.0, 0.0, 0.0];
var pivotMousePosition = [0, 0];

document.body.lastChild.addEventListener("dragstart", (e) => {
    count = 0;
    e.dataTransfer.setDragImage(document.getElementById("dragme"), 0, 0);
});

document.body.lastChild.addEventListener("drag", (e) => {
    if(count < 1){
        pivotMousePosition = [e.x, e.y];
        count++;
    }
    if(e.x != 0 && e.y != 0){
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
});

document.body.lastChild.addEventListener("dragend", (e) => {

});

document.body.addEventListener("wheel", (e) => {
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


// Materials
const material = new THREE.MeshPhongMaterial({
    side: THREE.DoubleSide,
    vertexColors: true
});

// Geometry Construction
const geometry = new THREE.BufferGeometry();
const indices = [];
const vertices = [];
const normals = [];
const colors = [];

// generate vertices
vertices.push(-0.5, 0.0, 0.0);
vertices.push(0.5, 0.0, 0.0);
vertices.push(0.0, 0.7, 0.0);

vertices.push(0.0, 0.0, -0.5);
vertices.push(0.0, 0.0, 0.5);
vertices.push(0.0, 0.7, 0.0);

vertices.push(0.0, 0.0, 0.0);

// generate normals
normals.push(0, 0, 1);
normals.push(0, 0, 1);
normals.push(0, 0, 1);

normals.push(0, 0, 1);
normals.push(0, 0, 1);
normals.push(0, 0, 1);

normals.push(0, 0, 1);

// generate indices
indices.push(0, 2, 6);
indices.push(1, 2, 6);
indices.push(3, 6, 5);
indices.push(4, 6, 5);
indices.push(6, 1, 4);
indices.push(6, 1, 3);
indices.push(6, 0, 4);
indices.push(6, 0, 3);

// generate colors
colors.push(1.0, 0.0, 0.0);
colors.push(0.0, 1.0, 0.0);
colors.push(0.0, 0.0, 0.1);

colors.push(0, 1.0, 1.0);
colors.push(1.0, 0.0, 1.0);
colors.push(1.0, 1.0, 0.0);

colors.push(1.0, 1.0, 1.0);

geometry.setIndex(indices);
geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));
geometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

// Objects
const mesh = new THREE.Mesh(geometry, material);

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const light = new THREE.HemisphereLight();

scene.background = new THREE.Color(0x2e2e2e);
scene.add(mesh);
scene.add(light);

// Code
    // Setup
    camera.position.x = 1;
    camera.position.y = 1;
    camera.position.z = 1;
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