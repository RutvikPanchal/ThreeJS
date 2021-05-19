// BootStrap
var stats = new Stats();
stats.showPanel(0);                     // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild( stats.dom );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

// Events
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight );
}

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
vertices.push(0.0, 0.0, 0.0);
vertices.push(1.0, 0.0, 0.0);
vertices.push(0.0, 1.0, 0.0);

// generate normals
normals.push(0, 0, 1);
normals.push(0, 0, 1);
normals.push(0, 0, 1);

// generate indices
indices.push(0, 1, 2);

// generate colors
colors.push(1.0, 0.0, 0.0);
colors.push(0.0, 1.0, 0.0);
colors.push(0.0, 0.0, 0.1);

geometry.setIndex(indices);
geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ));
geometry.setAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ));

// Objects
const mesh = new THREE.Mesh( geometry, material );

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
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