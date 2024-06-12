let allCountriesCities = []; // array all data from the CSV file
let countries= [{ countryCode : "", countryName : ""}]; // codes and names of the countries
let citiesCodes =  []; // array of cities with codes in format - code, city, coordinate


(async function(){

    let dataCountries = await parseFile('https://practicaldeveloper.github.io/parseCsvCities/files/UNLOCODE1.csv');
    let dataCountries2 = await parseFile('https://practicaldeveloper.github.io/parseCsvCities/files/UNLOCODE2.csv');
    let dataCountries3 = await parseFile('https://practicaldeveloper.github.io/parseCsvCities/files/UNLOCODE3.csv');
    allCountriesCities = [...dataCountries, ...dataCountries2, ...dataCountries3]; 
    
    countries = [];
    countries = GetCountriesCodes(allCountriesCities);

    citiesCodes = [];
    citiesCodes = GetCitiesWithCodes(allCountriesCities);
})();

/** CSV file parsing */
async function parseFile(file){
    return new Promise(resolve => {
        Papa.parse(file, {
                header: false,
                download: true,
                encoding: "utf8",
            complete: (results) => {
                resolve(results.data);
            }
        } );
    });
}

/** Save CSV file with cities names */
async function unParseCSV() {

    let onlyCities = citiesCodes.map(function(val) {
        return val.slice(2, 3);
    });
    const dataString = Papa.unparse(onlyCities);
    const blob = new Blob([dataString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'myfile.csv');
}


/** Save CSV file with countries names */
async function unParseCSVCountries() {

    let onlyCountries = countries.map(function(val) {

        return val.slice(1, 2);
    });
    const dataString = Papa.unparse(onlyCountries);
    const blob = new Blob([dataString], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'countries.csv');
}


/** Merge CSV file with countries names */
async function mergeCSVCountries() {
    // gets translated countries names
    let targetUrlRus = 'https://practicaldeveloper.github.io/parseCsvCities/files/countriesRus.csv';
    let dataRus = await parseFile(targetUrlRus);

    // gets countries names
    let targetUrlEng = 'https://practicaldeveloper.github.io/parseCsvCities/files/countries.csv';
    let dataEng = await parseFile(targetUrlEng);
    
    let onlyCountriesCodes = countries.map(function(val) {
        return val.slice(0, 1);
    });

    // merges countries codes, countries, countries names in Russian
    let result = onlyCountriesCodes.map(function(item, index, array) {
        let newItem = [item[0],  dataEng[index], dataRus[index] ];
        return newItem;
  });

  const dataString = Papa.unparse(result);

  const blob = new Blob(["\ufeff", dataString])
  saveAs(blob, 'allCountriesWithRus.csv');

}


/** Gets array of countries codes and countries names */
function GetCountriesCodes(allCountries) {
    let countries = [];

    allCountries.filter(function(itemCountry) {

        let country= itemCountry[3] != undefined ? itemCountry[3][0] : "";

        // if '.', then it is country name
        if(country == '.')
        {
            let countryName = itemCountry[3].substring(1).toLowerCase();

            let newItem = [ itemCountry[1], countryName.charAt(0).toUpperCase() + countryName.slice(1) ];// remove '.' from the name

            countries.push(newItem);
            return ;
        }
    });

    return countries;
}


/** Gets array of countries codes, cities names and coordinates */
function GetCitiesWithCodes(allCountries) {
    let cities = [];
    let prevCountryCode = '';
    let prevCity = '';
    
    allCountries.filter(function(itemCountry) {
        if(itemCountry.length > 1)
        {   
            let country= itemCountry[3] != undefined ? itemCountry[3][0] : "";
            let city = itemCountry[4];
            // if '.', then it is country name
            if(country != '.')
            {
                if(city != '')
                {
                    let newItem = [ itemCountry[1], city, itemCountry[10] ];

                    // don't add city duplicate 
                    if(!(itemCountry[1] == prevCountryCode && city.toLowerCase() == prevCity.toLowerCase()))
                    {
                        cities.push(newItem);
                    }

                    prevCountryCode = itemCountry[1];
                    prevCity = city;

                    return;
                }

            }
        }
    });

return cities;
}


/** Save CSV file with cities names */
async function parseCsvCoord() {
    // gets translated cities names
    let targetUrlRus = 'https://practicaldeveloper.github.io/parseCsvCities/files/Cities_Ru.csv';
    let dataRus = await parseFile(targetUrlRus);

    // gets countries codes, cities and coordinates
    let onlyCities = citiesCodes.map(function(val) {
        return val.slice(0, 3);
    });

    // merges countries codes, cities, cities names in Russian and coordinates
    let result = onlyCities.map(function(item, index, array) {
            let newItem = [item[0], item[1], dataRus[index], item[2]];
            return newItem;
      });

      const dataString = Papa.unparse(result);
      const blob = new Blob(["\ufeff", dataString])

      saveAs(blob, 'allCitiesWithRus.csv');
}