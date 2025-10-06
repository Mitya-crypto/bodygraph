/**
 * Nominatim API integration for global city search
 * Free alternative to Yandex for Russian cities
 * Based on OpenStreetMap data with excellent coverage
 */

export interface NominatimPlace {
  place_id: number
  licence: string
  osm_type: string
  osm_id: number
  boundingbox: [string, string, string, string]
  lat: string
  lon: string
  display_name: string
  class: string
  type: string
  importance: number
  icon?: string
  address?: {
    house_number?: string
    road?: string
    neighbourhood?: string
    suburb?: string
    city?: string
    town?: string
    village?: string
    municipality?: string
    county?: string
    state?: string
    region?: string
    postcode?: string
    country?: string
    country_code?: string
  }
}

export interface Place {
  id: string
  name: string
  country: string
  state?: string
  coordinates: {
    lat: number
    lng: number
  }
  timezone: string
  population?: number
  type: 'city' | 'town' | 'village' | 'settlement'
}

/**
 * Search cities using Nominatim API (OpenStreetMap)
 * Excellent free alternative for Russian cities
 */
export async function searchCitiesNominatim(query: string, limit: number = 10): Promise<Place[]> {
  if (!query || query.length < 2) return []

  try {
    console.log(`🔍 Nominatim: Searching for "${query}"`)
    
    // Convert Cyrillic to transliteration for better API compatibility
    let searchQuery = query
    if (/[а-яё]/i.test(query)) {
      console.log(`🔄 Converting Cyrillic query "${query}" to transliteration`)
      // Simple transliteration for common Russian cities
      const transliterationMap: { [key: string]: string } = {
        'москва': 'moscow',
        'санкт-петербург': 'saint petersburg',
        'санкт': 'saint',
        'новосибирск': 'novosibirsk',
        'екатеринбург': 'yekaterinburg',
        'нижний новгород': 'nizhny novgorod',
        'казань': 'kazan',
        'челябинск': 'chelyabinsk',
        'омск': 'omsk',
        'самара': 'samara',
        'ростов-на-дону': 'rostov on don',
        'уфа': 'ufa',
        'красноярск': 'krasnoyarsk',
        'пермь': 'perm',
        'волгоград': 'volgograd',
        'воронеж': 'voronezh',
        'саратов': 'saratov',
        'краснодар': 'krasnodar',
        'тольятти': 'tolyatti',
        'барнаул': 'barnaul',
        'ижевск': 'izhevsk',
        'ульяновск': 'ulyanovsk',
        'владивосток': 'vladivostok',
        'ярославль': 'yaroslavl',
        'иркутск': 'irkutsk',
        'тула': 'tula',
        'хабаровск': 'khabarovsk',
        'новокузнецк': 'novokuznetsk',
        'рязань': 'ryazan',
        'пенза': 'penza',
        'астрахань': 'astrakhan',
        'липецк': 'lipetsk',
        'тула': 'tula',
        'киров': 'kirov',
        'чебоксары': 'cheboksary',
        'калининград': 'kaliningrad',
        'брянск': 'bryansk',
        'курск': 'kursk',
        'иваново': 'ivanovo',
        'магнитогорск': 'magnitogorsk',
        'тверь': 'tver',
        'ставрополь': 'stavropol',
        'белгород': 'belgorod',
        'сочи': 'sochi',
        'курган': 'kurgan',
        'орёл': 'orel',
        'череповец': 'cherepovets',
        'мурманск': 'murmansk',
        'сургут': 'surgut',
        'волжский': 'volzhsky',
        'владимир': 'vladimir',
        'чита': 'chita',
        'архангельск': 'arkhangelsk',
        'калуга': 'kaluga',
        'смоленск': 'smolensk',
        'курган': 'kurgan',
        'оренбург': 'orenburg',
        'тамбов': 'tambov',
        'севастополь': 'sevastopol',
        'стерлитамак': 'sterlitamak',
        'грозный': 'grozny',
        'якутск': 'yakutsk',
        'кострома': 'kostroma',
        'комсомольск-на-амуре': 'komsomolsk on amur',
        'петрозаводск': 'petrozavodsk',
        'таганрог': 'taganrog',
        'нижневартовск': 'nizhnevartovsk',
        'йошкар-ола': 'yoshkar ola',
        'братск': 'bratsk',
        'новороссийск': 'novorossiysk',
        'шахты': 'shakhty',
        'дзержинск': 'dzerzhinsk',
        'орск': 'orsk',
        'ангарск': 'angarsk',
        'благовещенск': 'blagoveshchensk',
        'сыктывкар': 'syktyvkar',
        'псков': 'pskov',
        'бийск': 'biysk',
        'прокопьевск': 'prokopyevsk',
        'южно-сахалинск': 'yuzhno sakhalinsk',
        'балтийск': 'baltiysk',
        'энгельс': 'engels',
        'сызрань': 'syzran',
        'каменск-уральский': 'kamensk ural',
        'пятигорск': 'pyatigorsk',
        'майкоп': 'maykop',
        'коломна': 'kolomna',
        'камышин': 'kamyshin',
        'муром': 'murom',
        'новочеркасск': 'novocherkassk',
        'нефтеюганск': 'nefteyugansk',
        'серпухов': 'serpukhov',
        'первоуральск': 'pervouralsk',
        'дмитров': 'dmitrov',
        'камышин': 'kamyshin',
        'невинномысск': 'nevinnomyssk',
        'качканар': 'kachkanar',
        'кызыл': 'kyzyl',
        'серов': 'serov',
        'новомосковск': 'novomoskovsk',
        'зеленодольск': 'zelenodolsk',
        'соликамск': 'solikamsk',
        'мелеуз': 'meleuz',
        'абакан': 'abakan',
        'прокопьевск': 'prokopyevsk',
        'ухта': 'ukhta',
        'мытищи': 'mytishchi',
        'сергиев посад': 'sergiyev posad',
        'новокузнецк': 'novokuznetsk',
        'мичуринск': 'michurinsk',
        'киселёвск': 'kiselevsk',
        'новотроицк': 'novotroitsk',
        'зеленогорск': 'zelenogorsk',
        'бугульма': 'bugulma',
        'ессентуки': 'essentuki',
        'балашиха': 'balashikha',
        'северодвинск': 'severodvinsk',
        'пушкино': 'pushkino',
        'оренбург': 'orenburg',
        'норильск': 'nорильск',
        'симферополь': 'simferopol',
        'петропавловск-камчатский': 'petropavlovsk kamchatsky',
        'ленск': 'lensk',
        'салават': 'salavat',
        'минеральные воды': 'mineralnye vody',
        'альметьевск': 'almetyevsk',
        'новый уренгой': 'novy urengoy',
        'покров': 'pokrov',
        'южно-сахалинск': 'yuzhno sakhalinsk',
        'мурманск': 'murmansk',
        'волжский': 'volzhsky',
        'уссурийск': 'ussuriysk',
        'балаково': 'balakovo',
        'электросталь': 'elektrostal',
        'королёв': 'korolev',
        'химки': 'khimki',
        'псков': 'pskov',
        'сыктывкар': 'syktyvkar',
        'бийск': 'biysk',
        'прокопьевск': 'prokopyevsk',
        'балтийск': 'baltiysk',
        'энгельс': 'engels',
        'сызрань': 'syzran',
        'каменск-уральский': 'kamensk ural',
        'пятигорск': 'pyatigorsk',
        'майкоп': 'maykop',
        'коломна': 'kolomna',
        'камышин': 'kamyshin',
        'муром': 'murom',
        'новочеркасск': 'novocherkassk',
        'нефтеюганск': 'nefteyugansk',
        'серпухов': 'serpukhov',
        'первоуральск': 'pervouralsk',
        'дмитров': 'dmitrov',
        'камышин': 'kamyshin',
        'невинномысск': 'nevinnomyssk',
        'качканар': 'kachkanar',
        'кызыл': 'kyzyl',
        'серов': 'serov',
        'новомосковск': 'novomoskovsk',
        'зеленодольск': 'zelenodolsk',
        'соликамск': 'solikamsk',
        'мелеуз': 'meleuz',
        'абакан': 'abakan',
        'прокопьевск': 'prokopyevsk',
        'ухта': 'ukhta',
        'мытищи': 'mytishchi',
        'сергиев посад': 'sergiyev posad',
        'новокузнецк': 'novokuznetsk',
        'мичуринск': 'michurinsk',
        'киселёвск': 'kiselevsk',
        'новотроицк': 'novotroitsk',
        'зеленогорск': 'zelenogorsk',
        'бугульма': 'bugulma',
        'ессентуки': 'essentuki',
        'балашиха': 'balashikha',
        'северодвинск': 'severodvinsk',
        'пушкино': 'pushkino',
        'оренбург': 'orenburg',
        'норильск': 'nорильск',
        'симферополь': 'simferopol',
        'петропавловск-камчатский': 'petropavlovsk kamchatsky',
        'ленск': 'lensk',
        'салават': 'salavat',
        'минеральные воды': 'mineralnye vody',
        'альметьевск': 'almetyevsk',
        'новый уренгой': 'novy urengoy',
        'покров': 'pokrov',
        'южно-сахалинск': 'yuzhno sakhalinsk',
        'мурманск': 'murmansk',
        'волжский': 'volzhsky',
        'уссурийск': 'ussuriysk',
        'балаково': 'balakovo',
        'электросталь': 'elektrostal',
        'королёв': 'korolev',
        'химки': 'khimki'
      }
      
      // Try exact match first
      const lowerQuery = query.toLowerCase()
      if (transliterationMap[lowerQuery]) {
        searchQuery = transliterationMap[lowerQuery]
        console.log(`✅ Exact match found: "${query}" -> "${searchQuery}"`)
      } else {
        // Try partial matches
        for (const [russian, english] of Object.entries(transliterationMap)) {
          if (lowerQuery.includes(russian) || russian.includes(lowerQuery)) {
            searchQuery = english
            console.log(`✅ Partial match found: "${query}" -> "${searchQuery}" (via "${russian}")`)
            break
          }
        }
        if (searchQuery === query) {
          console.log(`❌ No transliteration found for "${query}"`)
        }
      }
    }
    
    const encodedQuery = encodeURIComponent(searchQuery)
    const url = `https://nominatim.openstreetmap.org/search?` +
      `q=${encodedQuery}&` +
      `format=json&` +
      `addressdetails=1&` +
      `limit=${limit}&` +
      // No country restriction for global search
      `featuretype=city,town,village&` +
      `accept-language=en&` +
      `email=bodygraph@example.com&` + // Required for Nominatim
      `dedupe=1`

    const response = await fetch(url, {
      headers: {
        'User-Agent': 'BodyGraph/1.0 (bodygraph@example.com)',
        'Accept': 'application/json'
      }
    })

    if (!response.ok) {
      console.error(`❌ Nominatim API error: ${response.status}`)
      return []
    }

    const data: NominatimPlace[] = await response.json()
    
    const places: Place[] = data
      .filter(place => {
        // Filter for cities, towns, villages
        return (place.class === 'place' && ['city', 'town', 'village', 'municipality'].includes(place.type)) &&
               place.lat && place.lon
      })
      .map(place => {
        // Extract city name and try to get Russian name if available
        let cityName = place.display_name.split(',')[0]
        if (place.address?.city) {
          cityName = place.address.city
        } else if (place.address?.town) {
          cityName = place.address.town
        } else if (place.address?.village) {
          cityName = place.address.village
        }

        // If we searched with transliteration but got English result, try to convert back
        if (/[а-яё]/i.test(query) && !/[а-яё]/i.test(cityName)) {
          cityName = convertToRussianName(cityName, query)
        }

        // Extract country and state
        let country = 'Unknown'
        let state: string | undefined

        if (place.address?.country) {
          country = place.address.country
        }
        if (place.address?.state || place.address?.region) {
          state = place.address.state || place.address.region
        }

        // Determine place type
        let type: 'city' | 'town' | 'village' | 'settlement' = 'city'
        if (place.class === 'village') {
          type = 'village'
        } else if (place.class === 'town') {
          type = 'town'
        } else if (place.class === 'municipality') {
          type = 'settlement'
        }

        return {
          id: `nominatim-${place.place_id}`,
          name: cityName,
          country: country,
          state: state,
          coordinates: {
            lat: parseFloat(place.lat),
            lng: parseFloat(place.lon)
          },
          timezone: getTimezoneForCoordinates(parseFloat(place.lat), parseFloat(place.lon)),
          type
        }
      })

    console.log(`✅ Nominatim returned ${places.length} results`)
    return places

  } catch (error) {
    console.error('❌ Nominatim API error:', error)
    return []
  }
}

/**
 * Convert English city name back to Russian if we searched with Russian query
 */
function convertToRussianName(englishName: string, originalQuery: string): string {
  const reverseTransliterationMap: { [key: string]: string } = {
    'moscow': 'Москва',
    'saint petersburg': 'Санкт-Петербург',
    'saint': 'Санкт',
    'novosibirsk': 'Новосибирск',
    'yekaterinburg': 'Екатеринбург',
    'nizhny novgorod': 'Нижний Новгород',
    'kazan': 'Казань',
    'chelyabinsk': 'Челябинск',
    'omsk': 'Омск',
    'samara': 'Самара',
    'rostov on don': 'Ростов-на-Дону',
    'ufa': 'Уфа',
    'krasnoyarsk': 'Красноярск',
    'perm': 'Пермь',
    'volgograd': 'Волгоград',
    'voronezh': 'Воронеж',
    'saratov': 'Саратов',
    'krasnodar': 'Краснодар',
    'tolyatti': 'Тольятти',
    'barnaul': 'Барнаул',
    'izhevsk': 'Ижевск',
    'ulyanovsk': 'Ульяновск',
    'vladivostok': 'Владивосток',
    'yaroslavl': 'Ярославль',
    'irkutsk': 'Иркутск',
    'tula': 'Тула',
    'khabarovsk': 'Хабаровск',
    'novokuznetsk': 'Новокузнецк',
    'ryazan': 'Рязань',
    'penza': 'Пенза',
    'astrakhan': 'Астрахань',
    'lipetsk': 'Липецк',
    'kirov': 'Киров',
    'cheboksary': 'Чебоксары',
    'kaliningrad': 'Калининград',
    'bryansk': 'Брянск',
    'kursk': 'Курск',
    'ivanovo': 'Иваново',
    'magnitogorsk': 'Магнитогорск',
    'tver': 'Тверь',
    'stavropol': 'Ставрополь',
    'belgorod': 'Белгород',
    'sochi': 'Сочи',
    'kurgan': 'Курган',
    'orel': 'Орёл',
    'cherepovets': 'Череповец',
    'murmansk': 'Мурманск',
    'surgut': 'Сургут',
    'volzhsky': 'Волжский',
    'vladimir': 'Владимир',
    'chita': 'Чита',
    'arkhangelsk': 'Архангельск',
    'kaluga': 'Калуга',
    'smolensk': 'Смоленск',
    'orenburg': 'Оренбург',
    'tambov': 'Тамбов',
    'sevastopol': 'Севастополь',
    'sterlitamak': 'Стерлитамак',
    'grozny': 'Грозный',
    'yakutsk': 'Якутск',
    'kostroma': 'Кострома',
    'komsomolsk on amur': 'Комсомольск-на-Амуре',
    'petrozavodsk': 'Петрозаводск',
    'taganrog': 'Таганрог',
    'nizhnevartovsk': 'Нижневартовск',
    'yoshkar ola': 'Йошкар-Ола',
    'bratsk': 'Братск',
    'novorossiysk': 'Новороссийск',
    'shakhty': 'Шахты',
    'dzerzhinsk': 'Дзержинск',
    'orsk': 'Орск',
    'angarsk': 'Ангарск',
    'blagoveshchensk': 'Благовещенск',
    'syktyvkar': 'Сыктывкар',
    'pskov': 'Псков',
    'biysk': 'Бийск',
    'prokopyevsk': 'Прокопьевск',
    'yuzhno sakhalinsk': 'Южно-Сахалинск',
    'baltiysk': 'Балтийск',
    'engels': 'Энгельс',
    'syzran': 'Сызрань',
    'kamensk ural': 'Каменск-Уральский',
    'pyatigorsk': 'Пятигорск',
    'maykop': 'Майкоп',
    'kolomna': 'Коломна',
    'kamyshin': 'Камышин',
    'murom': 'Муром',
    'novocherkassk': 'Новочеркасск',
    'nefteyugansk': 'Нефтеюганск',
    'serpukhov': 'Серпухов',
    'pervouralsk': 'Первоуральск',
    'dmitrov': 'Дмитров',
    'nevinnomyssk': 'Невинномысск',
    'kachkanar': 'Качканар',
    'kyzyl': 'Кызыл',
    'serov': 'Серов',
    'novomoskovsk': 'Новомосковск',
    'zelenodolsk': 'Зеленодольск',
    'solikamsk': 'Соликамск',
    'meleuz': 'Мелеуз',
    'abakan': 'Абакан',
    'ukhta': 'Ухта',
    'mytishchi': 'Мытищи',
    'sergiyev posad': 'Сергиев Посад',
    'michurinsk': 'Мичуринск',
    'kiselevsk': 'Киселёвск',
    'novotroitsk': 'Новотроицк',
    'zelenogorsk': 'Зеленогорск',
    'bugulma': 'Бугульма',
    'essentuki': 'Ессентуки',
    'balashikha': 'Балашиха',
    'severodvinsk': 'Северодвинск',
    'pushkino': 'Пушкино',
    'nорильск': 'Норильск',
    'simferopol': 'Симферополь',
    'petropavlovsk kamchatsky': 'Петропавловск-Камчатский',
    'lensk': 'Ленск',
    'salavat': 'Салават',
    'mineralnye vody': 'Минеральные Воды',
    'almetyevsk': 'Альметьевск',
    'novy urengoy': 'Новый Уренгой',
    'pokrov': 'Покров',
    'ussuriysk': 'Уссурийск',
    'balakovo': 'Балаково',
    'elektrostal': 'Электросталь',
    'korolev': 'Королёв',
    'khimki': 'Химки'
  }

  const lowerEnglishName = englishName.toLowerCase()
  const russianName = reverseTransliterationMap[lowerEnglishName]
  
  if (russianName) {
    return russianName
  }
  
  // If no direct match, return original English name
  return englishName
}

/**
 * Simple timezone detection based on coordinates
 */
function getTimezoneForCoordinates(lat: number, lng: number): string {
  // Simple timezone mapping for Russia and CIS
  if (lng >= 19 && lng < 40) return 'Europe/Moscow'        // Moscow time
  if (lng >= 40 && lng < 55) return 'Europe/Samara'        // Samara time  
  if (lng >= 55 && lng < 70) return 'Asia/Yekaterinburg'   // Yekaterinburg time
  if (lng >= 70 && lng < 85) return 'Asia/Omsk'            // Omsk time
  if (lng >= 85 && lng < 100) return 'Asia/Krasnoyarsk'    // Krasnoyarsk time
  if (lng >= 100 && lng < 115) return 'Asia/Irkutsk'       // Irkutsk time
  if (lng >= 115 && lng < 130) return 'Asia/Yakutsk'       // Yakutsk time
  if (lng >= 130 && lng < 145) return 'Asia/Vladivostok'   // Vladivostok time
  if (lng >= 145) return 'Asia/Magadan'                    // Magadan time
  
  // For other CIS countries
  if (lng >= 20 && lng <= 40 && lat >= 44 && lat <= 52) return 'Europe/Kiev'     // Ukraine
  if (lng >= 23 && lng <= 33 && lat >= 53 && lat <= 57) return 'Europe/Minsk'    // Belarus
  if (lng >= 46 && lng <= 87 && lat >= 40 && lat <= 55) return 'Asia/Almaty'     // Kazakhstan
  
  return 'UTC' // Default fallback
}

/**
 * Check if query should use Nominatim (contains Cyrillic characters)
 */
export function shouldUseNominatim(query: string): boolean {
  return /[а-яё]/i.test(query)
}
