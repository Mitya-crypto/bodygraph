// City to region mapping utility
// import { searchCitiesWithFallback, convertGeoDBCityToPlace } from './geodb'

export interface CityRegionMapping {
  city: string
  region: string
  country: string
}

// Simple city to region mappings for major cities
const RUSSIAN_CITY_REGION_MAPPINGS: { [key: string]: string } = {
  'Москва': 'Московская область',
  'Санкт-Петербург': 'Ленинградская область',
  'Новосибирск': 'Новосибирская область',
  'Екатеринбург': 'Свердловская область',
  'Нижний Новгород': 'Нижегородская область',
  'Казань': 'Республика Татарстан',
  'Челябинск': 'Челябинская область',
  'Омск': 'Омская область',
  'Самара': 'Самарская область',
  'Ростов-на-Дону': 'Ростовская область',
  'Уфа': 'Республика Башкортостан',
  'Красноярск': 'Красноярский край',
  'Воронеж': 'Воронежская область',
  'Пермь': 'Пермский край',
  'Волгоград': 'Волгоградская область'
}

const US_CITY_STATE_MAPPINGS: { [key: string]: string } = {
  'New York': 'New York',
  'Los Angeles': 'California',
  'Chicago': 'Illinois',
  'Houston': 'Texas',
  'Phoenix': 'Arizona',
  'Philadelphia': 'Pennsylvania',
  'San Antonio': 'Texas',
  'San Diego': 'California',
  'Dallas': 'Texas',
  'San Jose': 'California',
  'Austin': 'Texas',
  'Jacksonville': 'Florida',
  'Fort Worth': 'Texas',
  'Columbus': 'Ohio',
  'Charlotte': 'North Carolina',
  'San Francisco': 'California',
  'Indianapolis': 'Indiana',
  'Seattle': 'Washington',
  'Denver': 'Colorado',
  'Washington': 'District of Columbia',
  'Boston': 'Massachusetts',
  'El Paso': 'Texas',
  'Nashville': 'Tennessee',
  'Detroit': 'Michigan',
  'Oklahoma City': 'Oklahoma',
  'Portland': 'Oregon',
  'Las Vegas': 'Nevada',
  'Memphis': 'Tennessee',
  'Louisville': 'Kentucky',
  'Baltimore': 'Maryland',
  'Milwaukee': 'Wisconsin',
  'Albuquerque': 'New Mexico',
  'Tucson': 'Arizona',
  'Fresno': 'California',
  'Sacramento': 'California',
  'Mesa': 'Arizona',
  'Kansas City': 'Missouri',
  'Atlanta': 'Georgia',
  'Long Beach': 'California',
  'Colorado Springs': 'Colorado',
  'Raleigh': 'North Carolina',
  'Miami': 'Florida',
  'Virginia Beach': 'Virginia',
  'Omaha': 'Nebraska',
  'Oakland': 'California',
  'Minneapolis': 'Minnesota',
  'Tulsa': 'Oklahoma',
  'Arlington': 'Texas',
  'Tampa': 'Florida',
  'New Orleans': 'Louisiana',
  'Wichita': 'Kansas',
  'Bakersfield': 'California',
  'Cleveland': 'Ohio',
  'Aurora': 'Colorado',
  'Anaheim': 'California',
  'Honolulu': 'Hawaii',
  'Santa Ana': 'California',
  'Corpus Christi': 'Texas',
  'Riverside': 'California',
  'Lexington': 'Kentucky',
  'Stockton': 'California',
  'Henderson': 'Nevada',
  'Saint Paul': 'Minnesota',
  'St. Louis': 'Missouri'
}

// German city to state mappings
const GERMAN_CITY_STATE_MAPPINGS: { [key: string]: string } = {
  'Berlin': 'Berlin',
  'Hamburg': 'Hamburg',
  'München': 'Bayern',
  'Köln': 'Nordrhein-Westfalen',
  'Frankfurt': 'Hessen',
  'Stuttgart': 'Baden-Württemberg',
  'Düsseldorf': 'Nordrhein-Westfalen',
  'Dortmund': 'Nordrhein-Westfalen',
  'Essen': 'Nordrhein-Westfalen',
  'Leipzig': 'Sachsen',
  'Bremen': 'Bremen',
  'Dresden': 'Sachsen',
  'Hannover': 'Niedersachsen',
  'Nürnberg': 'Bayern',
  'Duisburg': 'Nordrhein-Westfalen',
  'Bochum': 'Nordrhein-Westfalen',
  'Wuppertal': 'Nordrhein-Westfalen',
  'Bielefeld': 'Nordrhein-Westfalen',
  'Bonn': 'Nordrhein-Westfalen',
  'Mannheim': 'Baden-Württemberg',
  'Karlsruhe': 'Baden-Württemberg',
  'Augsburg': 'Bayern',
  'Wiesbaden': 'Hessen',
  'Mönchengladbach': 'Nordrhein-Westfalen',
  'Gelsenkirchen': 'Nordrhein-Westfalen',
  'Braunschweig': 'Niedersachsen',
  'Chemnitz': 'Sachsen',
  'Kiel': 'Schleswig-Holstein',
  'Aachen': 'Nordrhein-Westfalen',
  'Halle': 'Sachsen-Anhalt',
  'Magdeburg': 'Sachsen-Anhalt',
  'Freiburg': 'Baden-Württemberg',
  'Krefeld': 'Nordrhein-Westfalen',
  'Lübeck': 'Schleswig-Holstein',
  'Oberhausen': 'Nordrhein-Westfalen',
  'Erfurt': 'Thüringen',
  'Mainz': 'Rheinland-Pfalz',
  'Rostock': 'Mecklenburg-Vorpommern',
  'Kassel': 'Hessen',
  'Hagen': 'Nordrhein-Westfalen',
  'Hamm': 'Nordrhein-Westfalen',
  'Saarbrücken': 'Saarland',
  'Mülheim': 'Nordrhein-Westfalen',
  'Potsdam': 'Brandenburg',
  'Ludwigshafen': 'Rheinland-Pfalz',
  'Oldenburg': 'Niedersachsen',
  'Leverkusen': 'Nordrhein-Westfalen',
  'Osnabrück': 'Niedersachsen',
  'Solingen': 'Nordrhein-Westfalen',
  'Heidelberg': 'Baden-Württemberg',
  'Herne': 'Nordrhein-Westfalen',
  'Neuss': 'Nordrhein-Westfalen',
  'Darmstadt': 'Hessen',
  'Paderborn': 'Nordrhein-Westfalen',
  'Regensburg': 'Bayern',
  'Ingolstadt': 'Bayern',
  'Würzburg': 'Bayern',
  'Fürth': 'Bayern',
  'Wolfsburg': 'Niedersachsen',
  'Offenbach': 'Hessen',
  'Ulm': 'Baden-Württemberg',
  'Heilbronn': 'Baden-Württemberg',
  'Pforzheim': 'Baden-Württemberg',
  'Göttingen': 'Niedersachsen',
  'Bottrop': 'Nordrhein-Westfalen',
  'Trier': 'Rheinland-Pfalz',
  'Recklinghausen': 'Nordrhein-Westfalen',
  'Reutlingen': 'Baden-Württemberg',
  'Bremerhaven': 'Bremen',
  'Koblenz': 'Rheinland-Pfalz',
  'Bergisch Gladbach': 'Nordrhein-Westfalen',
  'Jena': 'Thüringen',
  'Remscheid': 'Nordrhein-Westfalen',
  'Erlangen': 'Bayern',
  'Moers': 'Nordrhein-Westfalen',
  'Siegen': 'Nordrhein-Westfalen',
  'Hildesheim': 'Niedersachsen',
  'Salzgitter': 'Niedersachsen',
  'Cottbus': 'Brandenburg',
  'Gera': 'Thüringen',
  'Kaiserslautern': 'Rheinland-Pfalz',
  'Schwerin': 'Mecklenburg-Vorpommern',
  'Gütersloh': 'Nordrhein-Westfalen',
  'Düren': 'Nordrhein-Westfalen',
  'Esslingen': 'Baden-Württemberg',
  'Ludwigsburg': 'Baden-Württemberg',
  'Marburg': 'Hessen',
  'Flensburg': 'Schleswig-Holstein',
  'Gießen': 'Hessen',
  'Ratingen': 'Nordrhein-Westfalen',
  'Tübingen': 'Baden-Württemberg',
  'Villingen-Schwenningen': 'Baden-Württemberg',
  'Konstanz': 'Baden-Württemberg',
  'Worms': 'Rheinland-Pfalz',
  'Viersen': 'Nordrhein-Westfalen',
  'Lüneburg': 'Niedersachsen',
  'Minden': 'Nordrhein-Westfalen',
  'Velbert': 'Nordrhein-Westfalen',
  'Neumünster': 'Schleswig-Holstein',
  'Norderstedt': 'Schleswig-Holstein',
  'Delmenhorst': 'Niedersachsen',
  'Wilhelmshaven': 'Niedersachsen',
  'Gladbeck': 'Nordrhein-Westfalen',
  'Dorsten': 'Nordrhein-Westfalen',
  'Rheine': 'Nordrhein-Westfalen',
  'Detmold': 'Nordrhein-Westfalen',
  'Troisdorf': 'Nordrhein-Westfalen',
  'Castrop-Rauxel': 'Nordrhein-Westfalen',
  'Lünen': 'Nordrhein-Westfalen',
  'Marl': 'Nordrhein-Westfalen',
  'Bocholt': 'Nordrhein-Westfalen',
  'Datteln': 'Nordrhein-Westfalen',
  'Bergheim': 'Nordrhein-Westfalen',
  'Sindelfingen': 'Baden-Württemberg',
  'Schwäbisch Gmünd': 'Baden-Württemberg',
  'Lahr': 'Baden-Württemberg',
  'Friedrichshafen': 'Baden-Württemberg',
  'Offenburg': 'Baden-Württemberg',
  'Göppingen': 'Baden-Württemberg',
  'Waiblingen': 'Baden-Württemberg',
  'Heidenheim': 'Baden-Württemberg',
  'Singen': 'Baden-Württemberg',
  'Baden-Baden': 'Baden-Württemberg',
  'Schwäbisch Hall': 'Baden-Württemberg',
  'Fellbach': 'Baden-Württemberg',
  'Backnang': 'Baden-Württemberg',
  'Böblingen': 'Baden-Württemberg',
  'Aalen': 'Baden-Württemberg',
  'Kornwestheim': 'Baden-Württemberg',
  'Schorndorf': 'Baden-Württemberg',
  'Leinfelden-Echterdingen': 'Baden-Württemberg',
  'Filderstadt': 'Baden-Württemberg',
  'Ostfildern': 'Baden-Württemberg'
}

// Function to get region for a city in a specific country
export async function getCityRegion(city: string, country: string): Promise<string | null> {
  try {
    const normalizedCity = city.trim()
    const normalizedCountry = country.trim()
    
    // Check Russian cities
    if (normalizedCountry.toLowerCase() === 'russia' || normalizedCountry.toLowerCase() === 'россия') {
      return RUSSIAN_CITY_REGION_MAPPINGS[normalizedCity] || null
    }
    
    // Check US cities
    if (normalizedCountry.toLowerCase() === 'united states' || normalizedCountry.toLowerCase() === 'usa' || normalizedCountry.toLowerCase() === 'us') {
      return US_CITY_STATE_MAPPINGS[normalizedCity] || null
    }
    
    // Check German cities
    if (normalizedCountry.toLowerCase() === 'germany' || normalizedCountry.toLowerCase() === 'deutschland') {
      return GERMAN_CITY_STATE_MAPPINGS[normalizedCity] || null
    }
    
    return null
  } catch (error) {
    console.error('Error getting city region:', error)
    return null
  }
}

// Function to get region suggestions for a city
export async function getRegionSuggestions(city: string, country: string): Promise<string[]> {
  try {
    const region = await getCityRegion(city, country)
    if (region) {
      return [region]
    }
    
    return []
  } catch (error) {
    console.warn('Error getting region suggestions:', error)
    return []
  }
}