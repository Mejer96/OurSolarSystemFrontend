import SolarSystemCanvas from './SolarSystemCanvas'
import { useEffect, useState } from 'react';

const SolarSystem = () => {
    const [sliderValue, setSliderValue] = useState(1);
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
            <Slider onChange={handleSliderChange} value={sliderValue}/>
            <SolarSystemCanvas sliderValue={sliderValue}/>
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

    )
}

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
      <div style={listStyles.container} id="planet-list">
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
        <div style={popupStyles.overlay} onClick={closePopup} id='planet-popup'>
          <div style={popupStyles.content} onClick={(e) => e.stopPropagation()}>
            <h2>{selectedPlanet.name}</h2>
            <table style={popupStyles.table} id='planet-attribue-table'>
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

  export default SolarSystem;