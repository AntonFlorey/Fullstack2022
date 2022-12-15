import { useState, useEffect, useSyncExternalStore} from 'react'
import axios from 'axios'

const apiid = process.env.REACT_APP_API_KEY

const Weather = ({name, data}) => {
  console.log(name)
  console.log(data)
  console.log(data.weather[0].icon)
  return (
    <>
      <h3>Weather in {name}</h3>
      temparature: {data.main.temp} Celsius <br/>
      <img src={`http://openweathermap.org/img/wn/${data.weather[0]["icon"]}@2x.png`} /> <br/>
      wind: {data.wind.speed} m/s
    </>
  )
}

const SingleCountry = ({country, weather}) => {
  return (
    <>
      <h2>{country.name.common}</h2>
      capital {country.capital[0]} <br/>
      area {country.area} <br/>

      <h3>Languages:</h3>
      <ul>
        {Object.keys(country.languages).map(k => <li key={k}>{country.languages[k]}</li>)}
      </ul>
      <img src={country.flags.svg} width="250" height="150"/>
      <Weather name={country.capital[0]} data={weather} />
    </>
  )
}

const CountryName = ({cname, filterChange}) => {
  const onButton = () => {
    filterChange(cname)
  }
  return (
    <>
      <tr>
        <td>
          {cname} <button onClick={onButton}>select</button>
        </td>
      </tr>
    </>
  )
}

const ListNames = ({countries, setFilter}) => {
  return (
    <>
    <table>
      <tbody>
        {countries.map(c => <CountryName cname={c.name.common} key={c.name.common} filterChange={setFilter} />)}
      </tbody>
    </table>
  </>
  )
}

const CountryList = ({countries, maxDisplay, setFilter, weather}) => {
  const l = countries.length
  if (l > maxDisplay){
    return (
      <>Too many matches, specify another filter</>
    )
  }
  if (l === 1){
    return (
      <SingleCountry country={countries[0]} weather={weather}/>
    )
  }
  return (
    <>
    <ListNames countries={countries} setFilter={setFilter}/> 
    </>
  )
}

const App = () => {
  const [countries, setCountries] = useState([])
  const [filterString, setFilter] = useState('')
  const [weatherData, setWeather] = useState([])
  const [currentCapital, setCapital] = useState("")
  const [latLong, setLatLong] = useState([0,0])
  const [lon, setLon] = useState(0)

  const filteredCountries = filterString === '' ? countries : countries.filter(c => c.name.common.toLowerCase().includes(filterString.toLowerCase()))
  
  if (filteredCountries.length === 1 && filteredCountries[0].capital[0] != currentCapital){
    setCapital(filteredCountries[0].capital[0])
    setLatLong(filteredCountries[0].capitalInfo.latlng)
    console.log(filteredCountries[0].capital[0])
    console.log(filteredCountries[0].capitalInfo.latlng)
  }

  // load the countires
  useEffect(() => {
    console.log('countries effect')
    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        setCountries(response.data)
        console.log(response.data[0])
      })
  }, [])

  // load the weather
  useEffect(() => {
    console.log('weather effect')
    axios
      .get(`https://api.openweathermap.org/data/2.5/weather?lat=${latLong[0]}&lon=${latLong[1]}&appid=${apiid}&units=metric`)
      .then(response => {
        console.log(response.data)
        setWeather(response.data)
      })
  }, [currentCapital])

  const handleFilterChange = (event) => {
    setFilter(event.target.value)
  }

  // filteredCountries.forEach(elem => {
  //   console.log(elem.name.common)
  // })

  return (
    <div>
      <h1>Country Finder</h1>
      <form>
        <div>
          search for a country <input value={filterString} onChange={handleFilterChange}/>
        </div>
      </form>
      <CountryList countries={filteredCountries} maxDisplay={10} setFilter={setFilter} weather={weatherData}/>
    </div>
  )
}

export default App