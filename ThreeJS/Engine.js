// BootStrap
var stats = new Stats();
stats.showPanel(0);                     // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Events
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
}

document.body.addEventListener("wheel", (e) => {
    if (e.deltaY > 0) {
        camera.position.x += 0.04;
        camera.position.y += 0.04;
        camera.position.z += 0.04;
    }
    else {
        camera.position.x -= 0.04;
        camera.position.y -= 0.04;
        camera.position.z -= 0.04;
    }
});

document.body.lastChild.draggable = true;

var cameraposition = [0.0, 0.0, 0.0];

var radius = 0.0;
var inclination = 0.0;
var azimuth = 0.0;

var pivot = [0.0, 0.0, 0.0];

var pivotMousePosition = [0, 0];
var count = 0;

document.body.lastChild.addEventListener("dragstart", (e) => {
    cameraposition = [camera.position.x, camera.position.y, camera.position.z];

    radius = Math.sqrt((pivot[0] - cameraposition[0]) * (pivot[0] - cameraposition[0]) + (pivot[1] - cameraposition[1]) * (pivot[1] - cameraposition[1]) + (pivot[2] - cameraposition[2]) * (pivot[2] - cameraposition[2]));
    inclination = Math.atan(cameraposition[1] / Math.sqrt((pivot[0] - cameraposition[0]) * (pivot[0] - cameraposition[0]) + (pivot[1] - cameraposition[1]) * (pivot[1] - cameraposition[1]) + (pivot[2] - cameraposition[2]) * (pivot[2] - cameraposition[2])));
    azimuth = Math.atan(cameraposition[0] / cameraposition[2]);

    pivotMousePosition = [e.x, e.y];
    e.dataTransfer.setDragImage(document.getElementById("dragme"), 0, 0);
});

document.body.lastChild.addEventListener("drag", (e) => {
    if(!e.altKey && e.x != 0 && e.y != 0){
        var mousePositionDelta = [e.x - pivotMousePosition[0], pivotMousePosition[1] - e.y];

        var newinclination = inclination + (0.005 * mousePositionDelta[0]);
        var newazimuth = azimuth + (0.005 * mousePositionDelta[1]);

        newinclination %= 2 * Math.PI;
        newazimuth %= 2 * Math.PI;

        if(newazimuth <= 0){
            newazimuth = 0.00001;
        }
        if(newazimuth > Math.PI){
            newazimuth = Math.PI;
        }

        var newX = radius * Math.sin(newazimuth) * Math.cos(newinclination);
        var newZ = radius * Math.sin(newazimuth) * Math.sin(newinclination); 
        var newY = radius * Math.cos(newazimuth);

        camera.position.x = newX;
        camera.position.y = newY;
        camera.position.z = newZ;

        camera.lookAt(pivot[0], pivot[1], pivot[2]);
        
        document.getElementById("inclination").innerText = (newinclination * 180 / Math.PI).toFixed(4);
        document.getElementById("azimuth").innerText = (newazimuth * 180 / Math.PI).toFixed(4);
        document.getElementById("CamX").innerText = (camera.position.x).toFixed(4);
        document.getElementById("CamY").innerText = (camera.position.y).toFixed(4);
        document.getElementById("CamZ").innerText = (camera.position.z).toFixed(4);
    }
});

document.body.lastChild.addEventListener("dragend", (e) => {
    radius = 0.0;
    azimuth = 0.0;
    inclination = 0.0;

    pivot = [0.0, 0.0, 0.0];
    cameraposition = [0.0, 0.0, 0.0];

    pivotMousePosition = [0, 0];
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
indices.push(0, 1, 2);
indices.push(3, 4, 5);
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

colors.push(1.0, 1.0, 0.1);

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
camera.position.z = 1;
camera.position.x = 1;
camera.position.y = 1;
camera.lookAt(0, 0, 0);

// Loop
function Loop() {
    stats.begin();

    renderer.render(scene, camera);
    requestAnimationFrame(Loop);

    stats.end();
}
Loop();