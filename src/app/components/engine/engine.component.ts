import { Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';

import * as THREE from "three";

import Stats from 'three/examples/jsm/libs/stats.module.js';
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { BufferGeometry, Vector3 } from 'three';
import Delaunator from "delaunator";

@Component({ selector: 'app-engine', templateUrl: './engine.component.html', styleUrls: ['./engine.component.scss'] })
export class EngineComponent implements OnInit {

    @ViewChild('canvas', { static: true })
    private canvas: ElementRef;
    
    private clock:          THREE.Clock;
    private scene:          THREE.Scene;
    private camera:         THREE.PerspectiveCamera;
    private renderer:       THREE.WebGLRenderer;

    private controls:       OrbitControls;

    private stats:          any

    constructor() {

    }

    ngOnInit(): void {

        if(!this.canvas){
            console.log("Error");
            return;
        }

        this.stats = Stats();
        document.body.appendChild(this.stats.dom);
        
        this.scene         = new THREE.Scene();
        this.camera        = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 5000);
        this.renderer      = new THREE.WebGLRenderer({ antialias: true, canvas: this.canvas.nativeElement });
        this.clock         = new THREE.Clock();

        this.controls      = new OrbitControls( this.camera, this.renderer.domElement );

        this.renderer.setPixelRatio  ( window.devicePixelRatio );
        this.renderer.setSize        ( window.innerWidth, window.innerHeight );
        this.renderer.outputEncoding = THREE.sRGBEncoding;
        this.renderer.shadowMap.enabled = true;

        const geometry      = this.createGemoetry();
            const simpleMaterial = new THREE.MeshPhongMaterial({ side: THREE.DoubleSide, vertexColors: true });
            const normalMaterial = new THREE.MeshNormalMaterial({ side: THREE.DoubleSide, flatShading: true });
            const dotMaterial    = new THREE.PointsMaterial({ size: 3, color: 0x000000, sizeAttenuation: false });
            const mesh          = new THREE.Mesh( geometry, normalMaterial );
            const pointCloud    = new THREE.Points( geometry, dotMaterial );
            mesh.castShadow = true;
            mesh.receiveShadow = true;
            this.scene.add( mesh );
            this.scene.add( pointCloud );

        this.camera.position.set( 10, 16, 32 );
        this.camera.lookAt( 0, 0, 0 );

        this.scene.background = new THREE.Color().setHSL( 0.6, 0, 1 );
        this.scene.fog = new THREE.Fog( this.scene.background, 1, 5000 );

        const hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
            hemiLight.color.setHSL( 0.6, 1, 0.6 );
            hemiLight.groundColor.setHSL( 0.095, 1, 0.75 );
            this.scene.add( hemiLight );

        const dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
            dirLight.color.setHSL( 0.1, 1, 0.95 );
            dirLight.position.set( - 1, 1.75, 1 );
            dirLight.position.multiplyScalar( 30 );
            this.scene.add( dirLight );

            dirLight.castShadow = true;

            dirLight.shadow.mapSize.width = 2048;
            dirLight.shadow.mapSize.height = 2048;

            const d = 50;

            dirLight.shadow.camera.left = - d;
            dirLight.shadow.camera.right = d;
            dirLight.shadow.camera.top = d;
            dirLight.shadow.camera.bottom = - d;

            dirLight.shadow.camera.far = 3500;
            dirLight.shadow.bias = - 0.0001;

        const groundGeo = new THREE.PlaneGeometry( 10000, 10000 );
            const groundMat = new THREE.MeshLambertMaterial( { color: 0xffffff } );
            groundMat.color.setHSL( 0.095, 1, 0.75 );

            const ground = new THREE.Mesh( groundGeo, groundMat );
            ground.position.y = - 16;
            ground.rotation.x = - Math.PI / 2;
            ground.receiveShadow = true;
            this.scene.add( ground );
        
        const skyGeo = new THREE.SphereGeometry( 4000, 32, 15 );
            const uniforms = {
                'topColor':     { value: new THREE.Color( 0x0077ff ) },
                'bottomColor':  { value: new THREE.Color( 0xffffff ) },
                'offset':       { value: 33 },
                'exponent':     { value: 0.6 }
            };
            const skyMat = new THREE.ShaderMaterial( {
                uniforms: uniforms,
                vertexShader: `
                    varying vec3 vWorldPosition;

                    void main() {
        
                        vec4 worldPosition = modelMatrix * vec4( position, 1.0 );
                        vWorldPosition = worldPosition.xyz;
        
                        gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
        
                    }
                `,
                fragmentShader: `
                    uniform vec3 topColor;
                    uniform vec3 bottomColor;
                    uniform float offset;
                    uniform float exponent;
        
                    varying vec3 vWorldPosition;
        
                    void main() {
        
                        float h = normalize( vWorldPosition + offset ).y;
                        gl_FragColor = vec4( mix( bottomColor, topColor, max( pow( max( h , 0.0), exponent ), 0.0 ) ), 1.0 );
        
                    }
                `,
                side: THREE.BackSide
            } );

            const sky = new THREE.Mesh( skyGeo, skyMat );
            this.scene.add( sky );

        var animate = () => {
            this.stats.begin();
            
            requestAnimationFrame( animate );
            this.onUpdate        ( this.clock.getDelta() );
            this.renderer.render ( this.scene, this.camera );
            
            this.stats.end();
        }

        animate();
    }

    onUpdate( delta: any ) {
        
    }

    private createGemoetry(): BufferGeometry {

        const geometry = new THREE.BufferGeometry();

        var vertices =    [];
        var triangles =   [];
        var colors =      [];
        var d_vertices =  [];

        var vertCount = 1000;
        var size      = 10;
        for (let i = 0; i < vertCount; i++)
        {
            let dist = i / (vertCount - 1.0);
            let azimuth = 2.0 * Math.PI * 1.61803398875 * i;
            let inclination = Math.acos(1.0 - 2.0 * dist);

            let x = Math.sin(inclination) * Math.sin(azimuth);
            let y = Math.sin(inclination) * Math.cos(azimuth);
            let z = Math.cos(inclination);

            if (z == 1) {
                z = 0.99;
            }

            vertices.push((x / (1.0 - z)), 0.0, (y / (1.0 - z)));
            d_vertices.push((x / (1.0 - z)), (y / (1.0 - z)));

            colors.push(198/255, 102/255, 125/255);
        }

        var delaunay = new Delaunator(d_vertices);
        for (let i = 0; i < delaunay.triangles.length; i += 3) {
            triangles.push(delaunay.triangles[i]);
            triangles.push(delaunay.triangles[i + 2]);
            triangles.push(delaunay.triangles[i + 1]);
        }
        triangles.push(1, 3, 2);
        triangles.push(1, 2, 4);
        triangles.push(2, 3, 5);

        for (let i = 0; i < vertices.length; i += 3) {
            let x: any = vertices[i];
            let y: any = vertices[i + 2];
    
            vertices[i] = (2 * x / (1 + x * x + y * y)) * size;
            vertices[i + 2] = (2 * y / (1 + x * x + y * y)) * size;
            vertices[i + 1] = ((-1 + x * x + y * y) / (1 + x * x + y * y)) * size;
        }

        geometry.setIndex(triangles);

        geometry.setAttribute('position',   new THREE.Float32BufferAttribute(vertices, 3));
        geometry.setAttribute('color',      new THREE.Float32BufferAttribute(colors, 3));
        geometry.computeVertexNormals();

        return geometry;
    }

    @HostListener( 'window:resize', ['$event'] )
    handleWindowResize(event: Event) {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();

        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

}