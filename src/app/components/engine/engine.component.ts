import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';

import * as THREE from "three";
import Stats from 'three/examples/jsm/libs/stats.module.js';

import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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

    private cube:         THREE.Mesh;

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
        this.camera        = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer      = new THREE.WebGLRenderer({ canvas: this.canvas.nativeElement });
        this.clock         = new THREE.Clock();

        this.controls      = new OrbitControls( this.camera, this.renderer.domElement );

        this.renderer.setPixelRatio  ( window.devicePixelRatio );
        this.renderer.setSize        ( window.innerWidth, window.innerHeight );

        const geometry  = new THREE.BoxGeometry( 10, 10, 10 );
        const material  = new THREE.MeshStandardMaterial({ color: 0x484848 });

        this.cube    = new THREE.Mesh( geometry, material );
        this.cube.position.setY(5);
        this.scene.add(this.cube);

        const light = new THREE.PointLight( 0xffffff, 4, 100 );
        light.position.set( 16, 24, 16 );
        this.scene.add( light );

        const light1 = new THREE.AmbientLight( 0x404040 ); // soft white light
        this.scene.add( light1 );

        const gridHelper = new THREE.GridHelper( 1600, 320, 0x484848, 0x484848 );
        this.scene.add( gridHelper );

        this.camera.position.set(10, 18, 30);
        this.camera.lookAt( 0, 0, 0 );

        this.scene.background = new THREE.Color( 0x242424 );

        var animate = () => {
            requestAnimationFrame( animate );
            this.onUpdate        ( this.clock.getDelta() );
            this.renderer.render ( this.scene, this.camera );
        }

        animate();
    }

    onUpdate( delta: any ) {
        this.stats.update();
    }

}