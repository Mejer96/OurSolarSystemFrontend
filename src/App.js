import { useGLTF, useTexture, useAnimations } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { OrbitControls } from '@react-three/drei';
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { useLoader } from '@react-three/fiber';
import { EXRLoader } from 'three/examples/jsm/loaders/EXRLoader';
import { useSpring, a } from '@react-spring/three';
import { PointLight, Box3, Vector3 } from 'three';
import * as THREE from 'three';


  const NavigationHeader = () => {
    const [hoverIndex, setHoverIndex] = useState(null);

    return (
      <header style={navHeadStyles.header}>
        <div style={navHeadStyles.logo}>Our Solar System</div>
        <nav style={navHeadStyles.nav}>
        </nav>
      </header>
    );
  };

  const navHeadStyles = {
    header: {
      position: 'fixed',
      top: 0,
      width: '100%',
      height: '60px',
      backgroundColor: 'black',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '0 20px',
      zIndex: 1000,
      boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)',
    },
    logo: {
      fontSize: '1.5rem',
      color: '#ffffff',
      fontWeight: 'bold',
      textShadow: '0 0 10px #ffffff, 0 0 20px #ffffff, 0 0 30px #ffffff',
      cursor: 'pointer',
    },
    nav: {
      position: 'absolute',
      right: '20px',
      display: 'flex',
      gap: '15px',
    },
    navLink: {
      color: '#ffffff',
      textDecoration: 'none',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '10px 15px',
      borderRadius: '5px',
      transition: 'background-color 0.3s, color 0.3s, text-shadow 0.3s',
      textShadow: '0 0 5px #ffffff',
    },
    navLinkHover: {
      backgroundColor: '#0fefef',
      color: '#000',
      textShadow: '0 0 15px #ffffff, 0 0 30px #ffffff',
    },
  };

  const popupStyles = {
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000, 
    },
    content: {
      backgroundColor: '#ffffff',
      borderRadius: '8px',
      padding: '20px',
      boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
      maxWidth: '500px',
      width: '90%',
      textAlign: 'center',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '20px',
    },
    cell: {
      border: '1px solid #ddd',
      padding: '8px',
      textAlign: 'left',
      fontSize: '0.9rem',
      color: '#333',
    },
    closeButton: {
      marginTop: '10px',
      padding: '8px 15px',
      backgroundColor: 'black',
      color: 'white',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
    },
  };

  const listStyles = {
    container: {
      position: 'fixed',
      bottom: '20px',
      left: '20px',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      padding: '10px',
      borderRadius: '8px',
      boxShadow: '0 4px 10px rgba(255, 255, 255, 0.2)',
      zIndex: 1000, 
    },
    item: {
      color: '#ffffff',
      fontSize: '1rem',
      fontWeight: '500',
      padding: '8px 10px',
      margin: '5px 0',
      borderRadius: '5px',
      textShadow: '0 0 5px #ffffff',
      cursor: 'pointer',
      transition: 'background-color 0.3s, color 0.3s, text-shadow 0.3s',
    },
    itemHover: {
      backgroundColor: '#0fefef',
      color: '#000',
      textShadow: '0 0 15px #ffffff, 0 0 30px #ffffff',
    },
  };

  const TableRow = ({ label, value }) => {
    return (
      <tr>
        <td style={popupStyles.cell}>{label}</td>
        <td style={popupStyles.cell}>{value}</td>
      </tr>
    );
  };

  const PlanetList = ({ planets }) => {
    const [selectedPlanet, setSelectedPlanet] = useState(null);


    const handlePlanetClick = (planet) => {
      setSelectedPlanet(planet);
    };
  
    const closePopup = () => {
      setSelectedPlanet(null);
    };
    return (
      <>
      <div style={listStyles.container}>
        {planets.map((planet, index) => (
          <div
            key={index}
            style={listStyles.item}
            onClick={() => handlePlanetClick(planet)}
          >
            {planet.name}
          </div>
        ))}
      </div>

      {selectedPlanet && (
        <div style={popupStyles.overlay} onClick={closePopup}>
          <div style={popupStyles.content} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPlanet.name}</h2>
            <table style={popupStyles.table}>
              <tbody>
                {/* Manually define rows */}
                <TableRow label="Density" value={selectedPlanet.planet.density} />
                <TableRow label="Volume" value={selectedPlanet.planet.volume} />
                {/* Add more rows as needed */}
              </tbody>
            </table>
            <button style={popupStyles.closeButton} onClick={closePopup}>
              Close
            </button>
          </div>
        </div>
      )}
    </>
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

  const Slider = ({ value, onChange }) => {
    return (
      <div
        style={{
          position: 'absolute',
          bottom: '10px', 
          left: '50%', 
          transform: 'translateX(-50%)', 
          width: '300px',
          backgroundColor: 'rgba(0, 0, 0, 0.5)', 
          padding: '10px',
          borderRadius: '8px',
          color: 'white',
          zIndex: 100, 
        }}
      >
        <label htmlFor="slider" style={{ display: 'block', marginBottom: '5px' }}>
          {value}
        </label>
        <input
          id="slider"
          type="range"
          min="1"
          max="10"
          value={value}
          onChange={onChange}
          style={{ width: '100%' }}
        />
      </div>
    );
  };

  const Model = ({ modelPath, speed = 5, scale = 0.01, horizonId = 399, rotationSpeed = 0.01 }) => {
    const gltf = useLoader(GLTFLoader, modelPath);
    const sizeScalar = 1;
    const objectRef = useRef(); 
    const dataLength = useRef();
    const planetData = useRef()
    const nextIndex = useRef(1);

  
    const currentPosition = useRef(new THREE.Vector3(0, 0, 0));
    const targetPosition = useRef(new THREE.Vector3(0, 0, 0));
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
          targetPosition.current.set(
            planetData.current.ephemeris[1].scaledPositionX * sizeScalar,
            planetData.current.ephemeris[1].scaledPositionY * sizeScalar,
            planetData.current.ephemeris[1].scaledPositionZ * sizeScalar
          );

          dataIsFetched.current = true
          console.log(targetPosition.current)

        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
    },  []);
  

    useFrame((_, delta) => {
      if (!dataIsFetched.current) return;
  
      const currentPosition = objectRef.current.position.clone();
      const direction = new THREE.Vector3()
          .subVectors(targetPosition.current, currentPosition)
          .normalize();
  
      const remainingDistance = currentPosition.distanceTo(targetPosition.current);
      const stepDistance = Math.min(speed * delta, remainingDistance);
  
      currentPosition.add(direction.multiplyScalar(stepDistance));
  
      if (remainingDistance <= stepDistance) {
          nextIndex.current = nextIndex.current + 1;

          if (nextIndex.current >= dataLength.current) 
            {
              nextIndex.current = 1;
              objectRef.current.position.set(
                planetData.current.ephemeris[0].scaledPositionX * sizeScalar,
                planetData.current.ephemeris[0].scaledPositionY * sizeScalar,
                planetData.current.ephemeris[0].scaledPositionZ * sizeScalar
              );

              targetPosition.current.set(
                planetData.current.ephemeris[nextIndex.current].scaledPositionX * sizeScalar,
                planetData.current.ephemeris[nextIndex.current].scaledPositionY * sizeScalar,
                planetData.current.ephemeris[nextIndex.current].scaledPositionZ * sizeScalar
            );

            }
          objectRef.current.position.copy(targetPosition.current);
          console.log("updating position")
  
          targetPosition.current.set(
              planetData.current.ephemeris[nextIndex.current].scaledPositionX * sizeScalar,
              planetData.current.ephemeris[nextIndex.current].scaledPositionY * sizeScalar,
              planetData.current.ephemeris[nextIndex.current].scaledPositionZ * sizeScalar
          );
  
      } else {
          objectRef.current.position.copy(currentPosition);
          objectRef.current.rotation.y += rotationSpeed;
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



function App() {
  const [sliderValue, setSliderValue] = useState(5);
  const [mercury, setMercury] = useState(null);
  const [venus, setVenus] = useState(null);
  const [earth, setEarth] = useState(null)
  const [mars, setMars] = useState(null)
  const [jupiter, setJupiter] = useState(null)
  const [saturn, setSaturn] = useState(null)
  const [uranus, setUranus] = useState(null)
  const [neptune, setNeptune] = useState(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`http://localhost:5259/mysql/api/planet/get-all`);
        const json = await response.json();
        console.log(json)

        setMercury(json[0]);
        setVenus(json[1]);
        setEarth(json[2]);
        setMars(json[3]);
        setJupiter(json[4]);
        setSaturn(json[5]);
        setUranus(json[6]);
        setNeptune(json[7]);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  },  []);

  



  const handleSliderChange = (event) => {
    setSliderValue(event.target.value);
  };

  return (
    <div>
      <NavigationHeader />
      <Slider onChange={handleSliderChange} value={sliderValue}/>
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
        <perspectiveCamera makeDefault position={[100, 100, 100]} />
        <Skybox />

        <OrbitControls
          enableDamping
          dampingFactor={0.1}
          rotateSpeed={0.7}
          minDistance={20}
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
      <PlanetList
      planets={[
        { name: "Mercury", planet: mercury},
        { name: "Venus", planet: venus},
        { name: "Earth", planet: earth},
        { name: "Mars", planet: mars},
        { name: "Jupiter", planet: jupiter},
        { name: "Saturn", planet: saturn},
        { name: "Uranus", planet: uranus},
        { name: "Neptune", planet: neptune},
      ]}
    />
    </div>
  );
}

export default App;