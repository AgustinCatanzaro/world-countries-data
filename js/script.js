// I didnt found a way to fetch the data once and then use it for both functions (Population / Languages), i think there must be a way to just call it once and use it for both but i couldnt make it work idk.

const populationButton = async() => {
    let sectionDiv = document.getElementById("section")
    sectionDiv.innerHTML = ''
    let body = document.getElementsByTagName("body")
    body[0].style.overflowY = 'visible'

    let nav_parag = document.getElementById("nav-parag")
    nav_parag.textContent = "10 Most populated countries"

    try {
        const countriesAPI = 'https://restcountries.com/v2/all'
        const response = await fetch(countriesAPI)
        const countries = await response.json()
        const totalWorldPop = totalWorldPopulation(countries)

        createCountryBar("WORLD", totalWorldPop, 100)
        const countriesToCreate = tenMostPopulatedCountries(countries)
        countriesToCreate.forEach(element => {
            createCountryBar(element.name, element.population, calculatePercentage(totalWorldPop, element.population))
        });

    } catch (error) {
        console.log(error)
    }
}

const languagesButton = async() => {
    let sectionDiv = document.getElementById("section")
    sectionDiv.innerHTML = ''
    let body = document.getElementsByTagName("body")
    body[0].style.overflowY = 'visible'

    let nav_parag = document.getElementById("nav-parag")
    nav_parag.textContent = "10 Most spoken languages"

    try {
        const countriesAPI = 'https://restcountries.com/v2/all'
        const response = await fetch(countriesAPI)
        const countries = await response.json()
        const totalWorldLangs = totalWorldLanguages(countries)
        createCountryBar("COUNTRIES", countries.length, 100)
        for (let i = 0; i < 10; i++) {
            let language = Array.from(totalWorldLangs.keys())[i]
            let languageAmmount = totalWorldLangs.get(Array.from(totalWorldLangs.keys())[i])
            let langPercentage = calculatePercentage(countries.length, languageAmmount)
            createCountryBar(language, languageAmmount, langPercentage)
        }

    } catch (error) {
        console.log(error)
    }
}

function totalWorldPopulation(countries) {
    // Get the Total Population of the World
    let worldPop = 0
    for (const {population} of countries) {
        worldPop += population
    }
    return worldPop
}

function totalWorldLanguages(countries) {
    // Get the Total Languages of the World
    // I use a map to count every coincidence
    let languagesSet = new Map()
    for (const {languages} of countries) {
        for (const {name} of languages) {
            // If the language already existe i add +1 to that key, if not i create the key and add 1
            languagesSet.has(name) 
            ? languagesSet.set(name, languagesSet.get(name)+1) 
            : languagesSet.set(name, 1)
        }
    }
    languagesSet = mapSorting(languagesSet)
    return languagesSet
}
function mapSorting(languagesMap) {
    // Map sorting High > Low
    const mapSort = new Map([...languagesMap.entries()].sort((a, b) => b[1] - a[1]));
    return mapSort
}

function tenMostPopulatedCountries(countries) {
    // Order Countries by population High > Low
    countries.sort(function (first, second){
    if (first.population > second.population){
        return -1
    }if(first.population < second.population){
        return 1
    }
    return 0
    })
    // Slice the now ordered array and keep the top Ten.
    return countries.slice(0, 10)
}

function createCountryBar(countryName, countryPop, popPercentage){
    let sectionDiv = document.getElementById("section")
    // Creating a new Country Container, which will have 3 childs, name,bar and population
    let newCountry = document.createElement("div")
    newCountry.classList.add("country-div")
    // Creating the 'name' 'child' and appending it to the country parent
    let newCountryName = document.createElement("div")
    newCountryName.classList.add("country-name")
    newCountry.appendChild(newCountryName)
    // Creating the 'bar' 'child' and appending it to the country parent
    let newCountryBar = document.createElement("div")
    newCountryBar.classList.add("country-bar")
    newCountry.appendChild(newCountryBar)
    // Creating the 'population' 'child' and appending it to the country parent
    let newCountryPopulation = document.createElement("div")
    newCountryPopulation.classList.add("country-population")
    newCountry.appendChild(newCountryPopulation)
    // Once country-div is created with all of its children appended, i append the whole creation to the 'Section Div'
    sectionDiv.appendChild(newCountry)

    let color_orange = getComputedStyle(document.documentElement).getPropertyValue('--orangeColor');
    let color_white = getComputedStyle(document.documentElement).getPropertyValue('--bckgColor');

    // Assigning respective name, population and bar percentage to the country-bar
    newCountryName.textContent = countryName
    newCountryPopulation.textContent = countryPop

    // background: linear-gradient(to right, #efe3af 75%, #ffffff 75%);
    popPercentage = popPercentage.toFixed(2)
    newCountryBar.style.background = "linear-gradient(to right, "+color_orange+" "+popPercentage+"%, "+color_white+" "+popPercentage+"%)"
}

function calculatePercentage(maxPercentageValue, percentageToCalculate) {
    return ((100 * percentageToCalculate) / maxPercentageValue)
}


// // TEST
// languagesButton()