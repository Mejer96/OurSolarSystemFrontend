import React from 'react';
import { Canvas } from '@react-three/fiber';
import { useEffect, useRef, useState } from 'react';
import { useGLTF, useTexture, useAnimations } from '@react-three/drei';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { useThree, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import * as THREE from 'three';

const SolarSystemCanvas = ({sliderValue}) => {
  return (
<Canvas
        camera={{ position: [0, 0, 5], fov: 75 }}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}
      >
        <perspectiveCamera makeDefault position={[150, 150, 150]} />
        <Skybox />

        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.7}
          minDistance={35}
          maxDistance={500}
        />
    
        <Sun modelPath={"planets/sun1.glb"}/>
        <Model modelPath={"/planets/mercury.glb"} horizonId={199} speed={sliderValue} scale={0.001}/>
        <Model modelPath={"/planets/venus.glb"} horizonId={299} speed={sliderValue} scale={0.001}/>
        <Model modelPath={"/planets/earth.glb"} horizonId={399} speed={sliderValue} scale={0.001}/>
        <Model modelPath={"/planets/mars.glb"} horizonId={499} speed={sliderValue} scale={0.001}/>
        <Model modelPath={"/planets/jupiter.glb"} horizonId={599} speed={sliderValue} scale={0.01}/>
        <Model modelPath={"/planets/saturn.glb"} horizonId={699} speed={sliderValue} scale={0.01}/>
        <Model modelPath={"/planets/uranus.glb"} horizonId={799} speed={sliderValue} scale={0.01}/>
        <Model modelPath={"/planets/neptune.glb"} horizonId={899} speed={sliderValue} scale={0.01}/>
    
        <SunLightSource position={[0, 0, 0]}/>

        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]}/>
      </Canvas>
  );
};

  function Skybox() {
    const { scene } = useThree();
    
    const texture = useLoader(EXRLoader, "space-bg.exr"); 
  
    useEffect(() => {
      texture.mapping = THREE.EquirectangularReflectionMapping;
      scene.background = texture;
  
      return () => {
        scene.background = null; 
      };
    }, [scene, texture]);
  
    return null; 
  }

  const SunLightSource = ({ position = [0, 0, 0] }) => {
  
    return (
      <>
        <pointLight
          position={position}
          intensity={5}
          color={new THREE.Color(0xFFFFFF)}
          distance={10000}
          decay={0}
        />
      </>
    );
  };

  const Sun = ({ modelPath, position = [0, 0, 0], scale = 5, rotationSpeed = 0.01 }) => {
    const gltf = useLoader(GLTFLoader, modelPath);
    const modelRef = useRef();
  
    useFrame(() => {
      if (modelRef.current) {
        modelRef.current.rotation.y += rotationSpeed;
      }
    });
  
    return (
      <>
        <primitive object={gltf.scene} position={position} scale={scale} ref={modelRef} />
        <OrbitControls />
      </>
    );
  };

  const Model = ({ modelPath, speed = 1, scale = 0.01, horizonId = 399, rotationSpeed = 0.01 }) => {
    const gltf = useLoader(GLTFLoader, modelPath);
    const sizeScalar = 1;
    const objectRef = useRef(); 
    const dataLength = useRef();
    const planetData = useRef()
    const currentIndex = useRef(0);
    const accumulatedTime = useRef(0);
    const dataIsFetched = useRef(false)

    useEffect(() => {
      const fetchData = async () => {
        try {
          const response = await fetch(`http://localhost:5259/mysql/api/planet/get-locations-by-horizon-id?horizonId=${horizonId}`);
          const json = await response.json();
          console.log(json)
          
          planetData.current = json;
          dataLength.current = planetData.current.ephemeris.length
          objectRef.current.position.set(
            planetData.current.ephemeris[0].scaledPositionX * sizeScalar,
            planetData.current.ephemeris[0].scaledPositionY * sizeScalar,
            planetData.current.ephemeris[0].scaledPositionZ * sizeScalar
          );

          dataIsFetched.current = true
          console.log("data fetched")
        
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    },  []);
  

    useFrame((_, delta) => {
      if (!dataIsFetched.current) return;
 
      accumulatedTime.current += delta * speed;
      objectRef.current.rotation.y += rotationSpeed;
    
    
      if (accumulatedTime.current >= 1) {
        currentIndex.current = currentIndex.current + 1;
        accumulatedTime.current = 0;
        console.log("updating position")

        if (currentIndex.current >= dataLength.current) 
          {
            currentIndex.current = 0;
            objectRef.current.position.set(
              planetData.current.ephemeris[0].scaledPositionX * sizeScalar,
              planetData.current.ephemeris[0].scaledPositionY * sizeScalar,
              planetData.current.ephemeris[0].scaledPositionZ * sizeScalar
            );


          } else {
            objectRef.current.position.set(
              planetData.current.ephemeris[currentIndex.current].scaledPositionX * sizeScalar,
              planetData.current.ephemeris[currentIndex.current].scaledPositionY * sizeScalar,
              planetData.current.ephemeris[currentIndex.current].scaledPositionZ * sizeScalar
            );

          }
        
      } 
  });
  
    return (
      <primitive
        ref={objectRef}
        object={gltf.scene}
        scale={scale}
      />
    );
  }

export default SolarSystemCanvas;