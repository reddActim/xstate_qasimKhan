import React, { useEffect, useState } from 'react';
import './App.css';

function App() {
  
  const [selectedValue, setSelectedValue] = useState({
    first : "",
    second : "",
    third : ""
  });

  const [countries, setCountries] = useState([]);
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(()=>{
    fetch("https://location-selector.labs.crio.do/countries")
    .then((rawData)=> rawData.json())
    .then((apiRes)=>setCountries(apiRes))
    .catch(apiError => console.error("failed to get response from countries api, error :", apiError));
  }, [])

useEffect(() => {
  if (selectedValue.first) {
    fetch(`https://location-selector.labs.crio.do/country=${selectedValue.first}/states`)
      .then((rawData) => rawData.json())
      .then((apiRes) => {
        if (Array.isArray(apiRes)) {
          setStates(apiRes);
        } else {
          setStates([]);
          console.error("Unexpected response format for states:", apiRes);
        }
      })
      .catch((apiError) => {
        console.error("State API error:", apiError);
        setStates([]); 
      });
  }
}, [selectedValue.first]);


 useEffect(()=>{
  if (selectedValue.second){
    fetch(`https://location-selector.labs.crio.do/country=${selectedValue.first}/state=${selectedValue.second}/cities`)
    .then((rawData)=> rawData.json())
    .then((apiRes)=>setCities(apiRes))
    .catch(apiError => console.error("failed to get response from State api, error :", apiError));
  }
  }, [selectedValue.first, selectedValue.second])

  const handleChange = (event) => {
    event.preventDefault();
    // console.log(event.target);
    setSelectedValue((prev) => ({...prev, [event.target.id]:event.target.value}))
  }

  return (
    <>
      <div style={{display : "flex", }}>
        <h1 style={{ margin: "auto", padding : "3rem 0px"}}>Select Location</h1>
      </div>
      <div style={{paddingLeft : "1rem", display: 'flex', gap:"10px"}}>
        <select id='first' value={selectedValue.first} onChange= {(event)=> handleChange(event)} 
        style={{width : "40vw", height : "50px"}}>
          <option value="" >Select Country</option>
          {countries.map((country)=>(<option key={country} value={country.toLowerCase()} >{country}</option>))}
        </select>
        
        <select id="second" value={selectedValue.second} onChange={(event)=> handleChange(event)}
          style={{width : "20vw", height : "50px"}} 
          disabled={selectedValue.first === ""}>
          <option value="">Select State</option>
          {states.map((state)=>(<option key={state} value={state.toLowerCase()} >{state}</option>))}
        </select> 

        <select id="third" value={selectedValue.third} onChange={(event)=> handleChange(event)}
          style={{width : "20vw", height : "50px"}} disabled={selectedValue.second === ""}>
          <option  >Select City</option>
          {cities.map((city)=> (<option key={city} value={city.toLowerCase()}>{city}</option>))}
        </select>   
      </div>
    {selectedValue.third !== "" ?  <h3 style={{paddingLeft :"20px"}}>You selected {selectedValue.third[0].toUpperCase() + selectedValue.third.slice(1)}
, {selectedValue.second[0].toUpperCase() + selectedValue.second.slice(1)}
, {selectedValue.first[0].toUpperCase() + selectedValue.first.slice(1)}
</h3> : ""}

    </>
  );
}

export default App;
