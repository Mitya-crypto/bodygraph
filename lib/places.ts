// Places utility for global location search
import { searchPlacesWithPhoton } from './photon'
import { searchPlacesWithAI, getAIPlaceSearchAgent } from './aiPlaceSearch'

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

export interface PlaceSearchResult {
  places: Place[]
  total: number
  hasMore: boolean
}

// Mock global places database
const GLOBAL_PLACES: Place[] = [
  // Russia
  { id: 'moscow', name: 'Москва', country: 'Россия', coordinates: { lat: 55.7558, lng: 37.6176 }, timezone: 'Europe/Moscow', population: 12615000, type: 'city' },
  { id: 'moscow-alt', name: 'Москва', country: 'Россия', coordinates: { lat: 55.7558, lng: 37.6176 }, timezone: 'Europe/Moscow', population: 12615000, type: 'city' },
  { id: 'moscow-lower', name: 'москва', country: 'Россия', coordinates: { lat: 55.7558, lng: 37.6176 }, timezone: 'Europe/Moscow', population: 12615000, type: 'city' },
  { id: 'spb', name: 'Санкт-Петербург', country: 'Россия', coordinates: { lat: 59.9311, lng: 30.3609 }, timezone: 'Europe/Moscow', population: 5383000, type: 'city' },
  { id: 'spb-alt', name: 'Санкт Петербург', country: 'Россия', coordinates: { lat: 59.9311, lng: 30.3609 }, timezone: 'Europe/Moscow', population: 5383000, type: 'city' },
  { id: 'spb-alt2', name: 'Питер', country: 'Россия', coordinates: { lat: 59.9311, lng: 30.3609 }, timezone: 'Europe/Moscow', population: 5383000, type: 'city' },
  { id: 'novosibirsk', name: 'Новосибирск', country: 'Россия', coordinates: { lat: 55.0084, lng: 82.9357 }, timezone: 'Asia/Novosibirsk', population: 1625000, type: 'city' },
  { id: 'ekaterinburg', name: 'Екатеринбург', country: 'Россия', coordinates: { lat: 56.8431, lng: 60.6454 }, timezone: 'Asia/Yekaterinburg', population: 1495000, type: 'city' },
  { id: 'kazan', name: 'Казань', country: 'Россия', coordinates: { lat: 55.8304, lng: 49.0661 }, timezone: 'Europe/Moscow', population: 1257000, type: 'city' },
  
  // Саратовская область
  { id: 'saratov', name: 'Саратов', country: 'Россия', state: 'Саратовская область', coordinates: { lat: 51.5406, lng: 46.0086 }, timezone: 'Europe/Moscow', population: 845000, type: 'city' },
  { id: 'saratov-alt', name: 'саратов', country: 'Россия', state: 'Саратовская область', coordinates: { lat: 51.5406, lng: 46.0086 }, timezone: 'Europe/Moscow', population: 845000, type: 'city' },
  { id: 'saratov-alt2', name: 'Саратов', country: 'Россия', state: 'Саратовская область', coordinates: { lat: 51.5406, lng: 46.0086 }, timezone: 'Europe/Moscow', population: 845000, type: 'city' },
  
  // Другие крупные российские города
  { id: 'nizhny-novgorod', name: 'Нижний Новгород', country: 'Россия', state: 'Нижегородская область', coordinates: { lat: 56.2965, lng: 43.9361 }, timezone: 'Europe/Moscow', population: 1252000, type: 'city' },
  { id: 'samara', name: 'Самара', country: 'Россия', state: 'Самарская область', coordinates: { lat: 53.2001, lng: 50.1500 }, timezone: 'Europe/Moscow', population: 1165000, type: 'city' },
  { id: 'omsk', name: 'Омск', country: 'Россия', state: 'Омская область', coordinates: { lat: 54.9885, lng: 73.3242 }, timezone: 'Asia/Omsk', population: 1174000, type: 'city' },
  { id: 'kazan', name: 'Казань', country: 'Россия', state: 'Республика Татарстан', coordinates: { lat: 55.8304, lng: 49.0661 }, timezone: 'Europe/Moscow', population: 1257000, type: 'city' },
  { id: 'rostov-on-don', name: 'Ростов-на-Дону', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.2357, lng: 39.7015 }, timezone: 'Europe/Moscow', population: 1135000, type: 'city' },
  { id: 'ufa', name: 'Уфа', country: 'Россия', state: 'Республика Башкортостан', coordinates: { lat: 54.7388, lng: 55.9721 }, timezone: 'Asia/Yekaterinburg', population: 1125000, type: 'city' },
  { id: 'krasnoyarsk', name: 'Красноярск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 56.0184, lng: 92.8672 }, timezone: 'Asia/Krasnoyarsk', population: 1092000, type: 'city' },
  { id: 'voronezh', name: 'Воронеж', country: 'Россия', state: 'Воронежская область', coordinates: { lat: 51.6720, lng: 39.1843 }, timezone: 'Europe/Moscow', population: 1058000, type: 'city' },
  { id: 'perm', name: 'Пермь', country: 'Россия', state: 'Пермский край', coordinates: { lat: 58.0105, lng: 56.2502 }, timezone: 'Asia/Yekaterinburg', population: 1051000, type: 'city' },
  { id: 'volgograd', name: 'Волгоград', country: 'Россия', state: 'Волгоградская область', coordinates: { lat: 48.7080, lng: 44.5133 }, timezone: 'Europe/Moscow', population: 1011000, type: 'city' },
  { id: 'krasnodar', name: 'Краснодар', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 45.0448, lng: 38.9760 }, timezone: 'Europe/Moscow', population: 899000, type: 'city' },
  { id: 'saratov', name: 'Саратов', country: 'Россия', state: 'Саратовская область', coordinates: { lat: 51.5406, lng: 46.0086 }, timezone: 'Europe/Moscow', population: 845000, type: 'city' },
  { id: 'tyumen', name: 'Тюмень', country: 'Россия', state: 'Тюменская область', coordinates: { lat: 57.1522, lng: 65.5272 }, timezone: 'Asia/Yekaterinburg', population: 807000, type: 'city' },
  { id: 'tolyatti', name: 'Тольятти', country: 'Россия', state: 'Самарская область', coordinates: { lat: 53.5303, lng: 49.3461 }, timezone: 'Europe/Moscow', population: 707000, type: 'city' },
  { id: 'izhevsk', name: 'Ижевск', country: 'Россия', state: 'Удмуртская Республика', coordinates: { lat: 56.8528, lng: 53.2045 }, timezone: 'Europe/Moscow', population: 646000, type: 'city' },
  { id: 'barnaul', name: 'Барнаул', country: 'Россия', state: 'Алтайский край', coordinates: { lat: 53.3606, lng: 83.7636 }, timezone: 'Asia/Barnaul', population: 632000, type: 'city' },
  { id: 'ulyanovsk', name: 'Ульяновск', country: 'Россия', state: 'Ульяновская область', coordinates: { lat: 54.3142, lng: 48.4032 }, timezone: 'Europe/Moscow', population: 625000, type: 'city' },
  { id: 'irkutsk', name: 'Иркутск', country: 'Россия', state: 'Иркутская область', coordinates: { lat: 52.2871, lng: 104.3055 }, timezone: 'Asia/Irkutsk', population: 617000, type: 'city' },
  { id: 'khabarovsk', name: 'Хабаровск', country: 'Россия', state: 'Хабаровский край', coordinates: { lat: 48.4827, lng: 135.0840 }, timezone: 'Asia/Vladivostok', population: 616000, type: 'city' },
  { id: 'yaroslavl', name: 'Ярославль', country: 'Россия', state: 'Ярославская область', coordinates: { lat: 57.6261, lng: 39.8845 }, timezone: 'Europe/Moscow', population: 608000, type: 'city' },
  { id: 'vladivostok', name: 'Владивосток', country: 'Россия', state: 'Приморский край', coordinates: { lat: 43.1056, lng: 131.8735 }, timezone: 'Asia/Vladivostok', population: 606000, type: 'city' },
  { id: 'makhachkala', name: 'Махачкала', country: 'Россия', state: 'Республика Дагестан', coordinates: { lat: 42.9831, lng: 47.5044 }, timezone: 'Europe/Moscow', population: 604000, type: 'city' },
  { id: 'tomsk', name: 'Томск', country: 'Россия', state: 'Томская область', coordinates: { lat: 56.4846, lng: 84.9476 }, timezone: 'Asia/Tomsk', population: 574000, type: 'city' },
  { id: 'orenburg', name: 'Оренбург', country: 'Россия', state: 'Оренбургская область', coordinates: { lat: 51.7727, lng: 55.0988 }, timezone: 'Asia/Yekaterinburg', population: 572000, type: 'city' },
  { id: 'kemerovo', name: 'Кемерово', country: 'Россия', state: 'Кемеровская область', coordinates: { lat: 55.3331, lng: 86.0833 }, timezone: 'Asia/Krasnoyarsk', population: 558000, type: 'city' },
  { id: 'ryazan', name: 'Рязань', country: 'Россия', state: 'Рязанская область', coordinates: { lat: 54.6269, lng: 39.6916 }, timezone: 'Europe/Moscow', population: 538000, type: 'city' },
  { id: 'naberezhnye-chelny', name: 'Набережные Челны', country: 'Россия', state: 'Республика Татарстан', coordinates: { lat: 55.7436, lng: 52.3958 }, timezone: 'Europe/Moscow', population: 533000, type: 'city' },
  { id: 'astrakhan', name: 'Астрахань', country: 'Россия', state: 'Астраханская область', coordinates: { lat: 46.3479, lng: 48.0336 }, timezone: 'Europe/Moscow', population: 532000, type: 'city' },
  { id: 'penza', name: 'Пенза', country: 'Россия', state: 'Пензенская область', coordinates: { lat: 53.2007, lng: 45.0046 }, timezone: 'Europe/Moscow', population: 523000, type: 'city' },
  { id: 'lipetsk', name: 'Липецк', country: 'Россия', state: 'Липецкая область', coordinates: { lat: 52.6088, lng: 39.5994 }, timezone: 'Europe/Moscow', population: 508000, type: 'city' },
  { id: 'tula', name: 'Тула', country: 'Россия', state: 'Тульская область', coordinates: { lat: 54.1961, lng: 37.6182 }, timezone: 'Europe/Moscow', population: 501000, type: 'city' },
  { id: 'kirov', name: 'Киров', country: 'Россия', state: 'Кировская область', coordinates: { lat: 58.6036, lng: 49.6680 }, timezone: 'Europe/Moscow', population: 501000, type: 'city' },
  { id: 'cheboksary', name: 'Чебоксары', country: 'Россия', state: 'Чувашская Республика', coordinates: { lat: 56.1165, lng: 47.2449 }, timezone: 'Europe/Moscow', population: 495000, type: 'city' },
  { id: 'kaliningrad', name: 'Калининград', country: 'Россия', state: 'Калининградская область', coordinates: { lat: 54.7065, lng: 20.5110 }, timezone: 'Europe/Kaliningrad', population: 489000, type: 'city' },
  { id: 'bryansk', name: 'Брянск', country: 'Россия', state: 'Брянская область', coordinates: { lat: 53.2434, lng: 34.3654 }, timezone: 'Europe/Moscow', population: 485000, type: 'city' },
  { id: 'kursk', name: 'Курск', country: 'Россия', state: 'Курская область', coordinates: { lat: 51.7373, lng: 36.1874 }, timezone: 'Europe/Moscow', population: 450000, type: 'city' },
  { id: 'ivanovo', name: 'Иваново', country: 'Россия', state: 'Ивановская область', coordinates: { lat: 57.0004, lng: 40.9739 }, timezone: 'Europe/Moscow', population: 406000, type: 'city' },
  { id: 'magnitogorsk', name: 'Магнитогорск', country: 'Россия', state: 'Челябинская область', coordinates: { lat: 53.4186, lng: 59.0472 }, timezone: 'Asia/Yekaterinburg', population: 413000, type: 'city' },
  { id: 'tver', name: 'Тверь', country: 'Россия', state: 'Тверская область', coordinates: { lat: 56.8584, lng: 35.9006 }, timezone: 'Europe/Moscow', population: 420000, type: 'city' },
  { id: 'stavropol', name: 'Ставрополь', country: 'Россия', state: 'Ставропольский край', coordinates: { lat: 45.0445, lng: 41.9690 }, timezone: 'Europe/Moscow', population: 450000, type: 'city' },
  { id: 'nizhny-tagil', name: 'Нижний Тагил', country: 'Россия', state: 'Свердловская область', coordinates: { lat: 57.9194, lng: 59.9650 }, timezone: 'Asia/Yekaterinburg', population: 355000, type: 'city' },
  { id: 'belgorod', name: 'Белгород', country: 'Россия', state: 'Белгородская область', coordinates: { lat: 50.5953, lng: 36.5873 }, timezone: 'Europe/Moscow', population: 391000, type: 'city' },
  { id: 'arkhangelsk', name: 'Архангельск', country: 'Россия', state: 'Архангельская область', coordinates: { lat: 64.5401, lng: 40.5433 }, timezone: 'Europe/Moscow', population: 350000, type: 'city' },
  { id: 'vladimir', name: 'Владимир', country: 'Россия', state: 'Владимирская область', coordinates: { lat: 56.1290, lng: 40.4070 }, timezone: 'Europe/Moscow', population: 356000, type: 'city' },
  { id: 'sochi', name: 'Сочи', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 43.5855, lng: 39.7231 }, timezone: 'Europe/Moscow', population: 411000, type: 'city' },
  { id: 'kurgan', name: 'Курган', country: 'Россия', state: 'Курганская область', coordinates: { lat: 55.4410, lng: 65.3411 }, timezone: 'Asia/Yekaterinburg', population: 333000, type: 'city' },
  { id: 'smolensk', name: 'Смоленск', country: 'Россия', state: 'Смоленская область', coordinates: { lat: 54.7818, lng: 32.0401 }, timezone: 'Europe/Moscow', population: 325000, type: 'city' },
  { id: 'kaluga', name: 'Калуга', country: 'Россия', state: 'Калужская область', coordinates: { lat: 54.5293, lng: 36.2754 }, timezone: 'Europe/Moscow', population: 331000, type: 'city' },
  { id: 'chita', name: 'Чита', country: 'Россия', state: 'Забайкальский край', coordinates: { lat: 52.0317, lng: 113.5010 }, timezone: 'Asia/Chita', population: 350000, type: 'city' },
  { id: 'grozny', name: 'Грозный', country: 'Россия', state: 'Чеченская Республика', coordinates: { lat: 43.3116, lng: 45.6886 }, timezone: 'Europe/Moscow', population: 301000, type: 'city' },
  { id: 'sterlitamak', name: 'Стерлитамак', country: 'Россия', state: 'Республика Башкортостан', coordinates: { lat: 53.6333, lng: 55.9500 }, timezone: 'Asia/Yekaterinburg', population: 280000, type: 'city' },
  { id: 'kostroma', name: 'Кострома', country: 'Россия', state: 'Костромская область', coordinates: { lat: 57.7665, lng: 40.9269 }, timezone: 'Europe/Moscow', population: 277000, type: 'city' },
  { id: 'petrozavodsk', name: 'Петрозаводск', country: 'Россия', state: 'Республика Карелия', coordinates: { lat: 61.7849, lng: 34.3469 }, timezone: 'Europe/Moscow', population: 280000, type: 'city' },
  { id: 'tambov', name: 'Тамбов', country: 'Россия', state: 'Тамбовская область', coordinates: { lat: 52.7212, lng: 41.4522 }, timezone: 'Europe/Moscow', population: 293000, type: 'city' },
  { id: 'sterlitamak', name: 'Стерлитамак', country: 'Россия', state: 'Республика Башкортостан', coordinates: { lat: 53.6333, lng: 55.9500 }, timezone: 'Asia/Yekaterinburg', population: 280000, type: 'city' },
  { id: 'sterlitamak-alt', name: 'Стерлитамак', country: 'Россия', state: 'Республика Башкортостан', coordinates: { lat: 53.6333, lng: 55.9500 }, timezone: 'Asia/Yekaterinburg', population: 280000, type: 'city' },
  { id: 'sterlitamak-alt2', name: 'стерлитамак', country: 'Россия', state: 'Республика Башкортостан', coordinates: { lat: 53.6333, lng: 55.9500 }, timezone: 'Asia/Yekaterinburg', population: 280000, type: 'city' },
  
  // Краснодарский край
  { id: 'novorossiysk', name: 'Новороссийск', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 44.7235, lng: 37.7686 }, timezone: 'Europe/Moscow', population: 275000, type: 'city' },
  { id: 'novorossiysk-alt', name: 'новороссийск', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 44.7235, lng: 37.7686 }, timezone: 'Europe/Moscow', population: 275000, type: 'city' },
  { id: 'krasnodar', name: 'Краснодар', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 45.0448, lng: 38.9760 }, timezone: 'Europe/Moscow', population: 899000, type: 'city' },
  { id: 'armavir', name: 'Армавир', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 45.0000, lng: 41.1167 }, timezone: 'Europe/Moscow', population: 190000, type: 'city' },
  { id: 'yeysk', name: 'Ейск', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 46.7000, lng: 38.2667 }, timezone: 'Europe/Moscow', population: 85000, type: 'city' },
  { id: 'gelendzhik', name: 'Геленджик', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 44.5667, lng: 38.0833 }, timezone: 'Europe/Moscow', population: 75000, type: 'city' },
  { id: 'anapa', name: 'Анапа', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 44.8833, lng: 37.3167 }, timezone: 'Europe/Moscow', population: 70000, type: 'city' },
  { id: 'tuapse', name: 'Туапсе', country: 'Россия', state: 'Краснодарский край', coordinates: { lat: 44.1000, lng: 39.0833 }, timezone: 'Europe/Moscow', population: 65000, type: 'city' },
  
  // Другие важные российские города
  { id: 'volgograd', name: 'Волгоград', country: 'Россия', state: 'Волгоградская область', coordinates: { lat: 48.7080, lng: 44.5133 }, timezone: 'Europe/Moscow', population: 1011000, type: 'city' },
  { id: 'volgograd-alt', name: 'Сталинград', country: 'Россия', state: 'Волгоградская область', coordinates: { lat: 48.7080, lng: 44.5133 }, timezone: 'Europe/Moscow', population: 1011000, type: 'city' },
  { id: 'volgograd-alt2', name: 'Царицын', country: 'Россия', state: 'Волгоградская область', coordinates: { lat: 48.7080, lng: 44.5133 }, timezone: 'Europe/Moscow', population: 1011000, type: 'city' },
  { id: 'rostov-on-don', name: 'Ростов-на-Дону', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.2357, lng: 39.7015 }, timezone: 'Europe/Moscow', population: 1135000, type: 'city' },
  { id: 'rostov-alt', name: 'Ростов', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.2357, lng: 39.7015 }, timezone: 'Europe/Moscow', population: 1135000, type: 'city' },
  { id: 'taganrog', name: 'Таганрог', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.2167, lng: 39.7000 }, timezone: 'Europe/Moscow', population: 250000, type: 'city' },
  { id: 'shakhty', name: 'Шахты', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.7000, lng: 40.2167 }, timezone: 'Europe/Moscow', population: 240000, type: 'city' },
  { id: 'novocherkassk', name: 'Новочеркасск', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.4167, lng: 40.0833 }, timezone: 'Europe/Moscow', population: 170000, type: 'city' },
  { id: 'bataysk', name: 'Батайск', country: 'Россия', state: 'Ростовская область', coordinates: { lat: 47.1333, lng: 39.7500 }, timezone: 'Europe/Moscow', population: 120000, type: 'city' },
  
  // Северный Кавказ
  { id: 'grozny', name: 'Грозный', country: 'Россия', state: 'Чеченская Республика', coordinates: { lat: 43.3116, lng: 45.6886 }, timezone: 'Europe/Moscow', population: 301000, type: 'city' },
  { id: 'makhachkala', name: 'Махачкала', country: 'Россия', state: 'Республика Дагестан', coordinates: { lat: 42.9831, lng: 47.5044 }, timezone: 'Europe/Moscow', population: 604000, type: 'city' },
  { id: 'nalchik', name: 'Нальчик', country: 'Россия', state: 'Кабардино-Балкарская Республика', coordinates: { lat: 43.4833, lng: 43.6167 }, timezone: 'Europe/Moscow', population: 240000, type: 'city' },
  { id: 'vladikavkaz', name: 'Владикавказ', country: 'Россия', state: 'Республика Северная Осетия', coordinates: { lat: 43.0167, lng: 44.6833 }, timezone: 'Europe/Moscow', population: 310000, type: 'city' },
  { id: 'cherkessk', name: 'Черкесск', country: 'Россия', state: 'Карачаево-Черкесская Республика', coordinates: { lat: 44.2167, lng: 42.0500 }, timezone: 'Europe/Moscow', population: 130000, type: 'city' },
  { id: 'elista', name: 'Элиста', country: 'Россия', state: 'Республика Калмыкия', coordinates: { lat: 46.3167, lng: 44.2500 }, timezone: 'Europe/Moscow', population: 100000, type: 'city' },
  
  // Сибирь и Дальний Восток
  { id: 'krasnoyarsk', name: 'Красноярск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 56.0184, lng: 92.8672 }, timezone: 'Asia/Krasnoyarsk', population: 1092000, type: 'city' },
  { id: 'norilsk', name: 'Норильск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 69.3333, lng: 88.2167 }, timezone: 'Asia/Krasnoyarsk', population: 180000, type: 'city' },
  { id: 'achinsk', name: 'Ачинск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 56.2667, lng: 90.5000 }, timezone: 'Asia/Krasnoyarsk', population: 100000, type: 'city' },
  { id: 'kansk', name: 'Канск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 56.2000, lng: 95.7167 }, timezone: 'Asia/Krasnoyarsk', population: 90000, type: 'city' },
  { id: 'minusinsk', name: 'Минусинск', country: 'Россия', state: 'Красноярский край', coordinates: { lat: 53.7000, lng: 91.6833 }, timezone: 'Asia/Krasnoyarsk', population: 70000, type: 'city' },
  
  // Иркутская область
  { id: 'irkutsk', name: 'Иркутск', country: 'Россия', state: 'Иркутская область', coordinates: { lat: 52.2871, lng: 104.3055 }, timezone: 'Asia/Irkutsk', population: 617000, type: 'city' },
  { id: 'bratsk', name: 'Братск', country: 'Россия', state: 'Иркутская область', coordinates: { lat: 56.1500, lng: 101.6167 }, timezone: 'Asia/Irkutsk', population: 230000, type: 'city' },
  { id: 'angarsk', name: 'Ангарск', country: 'Россия', state: 'Иркутская область', coordinates: { lat: 52.5667, lng: 103.9167 }, timezone: 'Asia/Irkutsk', population: 220000, type: 'city' },
  { id: 'usolye-sibirskoye', name: 'Усолье-Сибирское', country: 'Россия', state: 'Иркутская область', coordinates: { lat: 52.7500, lng: 103.6500 }, timezone: 'Asia/Irkutsk', population: 80000, type: 'city' },
  
  // Бурятия
  { id: 'ulan-ude', name: 'Улан-Удэ', country: 'Россия', state: 'Республика Бурятия', coordinates: { lat: 51.8333, lng: 107.6000 }, timezone: 'Asia/Irkutsk', population: 430000, type: 'city' },
  { id: 'kyakhta', name: 'Кяхта', country: 'Россия', state: 'Республика Бурятия', coordinates: { lat: 50.3500, lng: 106.4500 }, timezone: 'Asia/Irkutsk', population: 20000, type: 'city' },
  
  // Забайкальский край
  { id: 'chita', name: 'Чита', country: 'Россия', state: 'Забайкальский край', coordinates: { lat: 52.0317, lng: 113.5010 }, timezone: 'Asia/Chita', population: 350000, type: 'city' },
  { id: 'krasnokamensk', name: 'Краснокаменск', country: 'Россия', state: 'Забайкальский край', coordinates: { lat: 50.1000, lng: 118.0333 }, timezone: 'Asia/Chita', population: 55000, type: 'city' },
  
  // Дальний Восток
  { id: 'vladivostok', name: 'Владивосток', country: 'Россия', state: 'Приморский край', coordinates: { lat: 43.1056, lng: 131.8735 }, timezone: 'Asia/Vladivostok', population: 606000, type: 'city' },
  { id: 'khabarovsk', name: 'Хабаровск', country: 'Россия', state: 'Хабаровский край', coordinates: { lat: 48.4827, lng: 135.0840 }, timezone: 'Asia/Vladivostok', population: 616000, type: 'city' },
  { id: 'komsomolsk-na-amure', name: 'Комсомольск-на-Амуре', country: 'Россия', state: 'Хабаровский край', coordinates: { lat: 50.5500, lng: 137.0000 }, timezone: 'Asia/Vladivostok', population: 250000, type: 'city' },
  { id: 'blagoveshchensk', name: 'Благовещенск', country: 'Россия', state: 'Амурская область', coordinates: { lat: 50.2667, lng: 127.5333 }, timezone: 'Asia/Yakutsk', population: 220000, type: 'city' },
  { id: 'yakutsk', name: 'Якутск', country: 'Россия', state: 'Республика Саха (Якутия)', coordinates: { lat: 62.0333, lng: 129.7333 }, timezone: 'Asia/Yakutsk', population: 320000, type: 'city' },
  { id: 'magadan', name: 'Магадан', country: 'Россия', state: 'Магаданская область', coordinates: { lat: 59.5667, lng: 150.8000 }, timezone: 'Asia/Magadan', population: 95000, type: 'city' },
  { id: 'petropavlovsk-kamchatsky', name: 'Петропавловск-Камчатский', country: 'Россия', state: 'Камчатский край', coordinates: { lat: 53.0167, lng: 158.6500 }, timezone: 'Asia/Kamchatka', population: 180000, type: 'city' },
  
  // Пермский край
  { id: 'perm', name: 'Пермь', country: 'Россия', state: 'Пермский край', coordinates: { lat: 58.0105, lng: 56.2502 }, timezone: 'Asia/Yekaterinburg', population: 1051000, type: 'city' },
  { id: 'oktyabrsky', name: 'Октябрьский', country: 'Россия', state: 'Пермский край', coordinates: { lat: 56.5167, lng: 56.8833 }, timezone: 'Asia/Yekaterinburg', population: 15000, type: 'settlement' },
  { id: 'oktyabrsky-pos', name: 'пос. Октябрьский', country: 'Россия', state: 'Пермский край', coordinates: { lat: 56.5167, lng: 56.8833 }, timezone: 'Asia/Yekaterinburg', population: 15000, type: 'settlement' },
  { id: 'oktyabrsky-pos-alt', name: 'Октябрьский поселок', country: 'Россия', state: 'Пермский край', coordinates: { lat: 56.5167, lng: 56.8833 }, timezone: 'Asia/Yekaterinburg', population: 15000, type: 'settlement' },
  { id: 'oktyabrsky-pos-alt2', name: 'п. Октябрьский', country: 'Россия', state: 'Пермский край', coordinates: { lat: 56.5167, lng: 56.8833 }, timezone: 'Asia/Yekaterinburg', population: 15000, type: 'settlement' },
  
  // USA
  { id: 'newyork', name: 'New York', country: 'United States', state: 'New York', coordinates: { lat: 40.7128, lng: -74.0060 }, timezone: 'America/New_York', population: 8336817, type: 'city' },
  { id: 'losangeles', name: 'Los Angeles', country: 'United States', state: 'California', coordinates: { lat: 34.0522, lng: -118.2437 }, timezone: 'America/Los_Angeles', population: 3979576, type: 'city' },
  { id: 'chicago', name: 'Chicago', country: 'United States', state: 'Illinois', coordinates: { lat: 41.8781, lng: -87.6298 }, timezone: 'America/Chicago', population: 2693976, type: 'city' },
  { id: 'houston', name: 'Houston', country: 'United States', state: 'Texas', coordinates: { lat: 29.7604, lng: -95.3698 }, timezone: 'America/Chicago', population: 2320268, type: 'city' },
  
  // Europe
  { id: 'london', name: 'London', country: 'United Kingdom', coordinates: { lat: 51.5074, lng: -0.1278 }, timezone: 'Europe/London', population: 8982000, type: 'city' },
  { id: 'paris', name: 'Paris', country: 'France', coordinates: { lat: 48.8566, lng: 2.3522 }, timezone: 'Europe/Paris', population: 2161000, type: 'city' },
  { id: 'berlin', name: 'Berlin', country: 'Germany', coordinates: { lat: 52.5200, lng: 13.4050 }, timezone: 'Europe/Berlin', population: 3669491, type: 'city' },
  { id: 'madrid', name: 'Madrid', country: 'Spain', coordinates: { lat: 40.4168, lng: -3.7038 }, timezone: 'Europe/Madrid', population: 3223000, type: 'city' },
  { id: 'rome', name: 'Rome', country: 'Italy', coordinates: { lat: 41.9028, lng: 12.4964 }, timezone: 'Europe/Rome', population: 2873000, type: 'city' },
  
  // Asia
  { id: 'tokyo', name: 'Tokyo', country: 'Japan', coordinates: { lat: 35.6762, lng: 139.6503 }, timezone: 'Asia/Tokyo', population: 13960000, type: 'city' },
  { id: 'beijing', name: 'Beijing', country: 'China', coordinates: { lat: 39.9042, lng: 116.4074 }, timezone: 'Asia/Shanghai', population: 21540000, type: 'city' },
  { id: 'seoul', name: 'Seoul', country: 'South Korea', coordinates: { lat: 37.5665, lng: 126.9780 }, timezone: 'Asia/Seoul', population: 9720846, type: 'city' },
  { id: 'mumbai', name: 'Mumbai', country: 'India', coordinates: { lat: 19.0760, lng: 72.8777 }, timezone: 'Asia/Kolkata', population: 12478000, type: 'city' },
  { id: 'delhi', name: 'Delhi', country: 'India', coordinates: { lat: 28.7041, lng: 77.1025 }, timezone: 'Asia/Kolkata', population: 32941000, type: 'city' },
  
  // Other major cities
  { id: 'sydney', name: 'Sydney', country: 'Australia', coordinates: { lat: -33.8688, lng: 151.2093 }, timezone: 'Australia/Sydney', population: 5312000, type: 'city' },
  { id: 'toronto', name: 'Toronto', country: 'Canada', coordinates: { lat: 43.6532, lng: -79.3832 }, timezone: 'America/Toronto', population: 2930000, type: 'city' },
  { id: 'mexicocity', name: 'Mexico City', country: 'Mexico', coordinates: { lat: 19.4326, lng: -99.1332 }, timezone: 'America/Mexico_City', population: 9209000, type: 'city' },
  { id: 'saopaulo', name: 'São Paulo', country: 'Brazil', coordinates: { lat: -23.5505, lng: -46.6333 }, timezone: 'America/Sao_Paulo', population: 12325000, type: 'city' },
  { id: 'buenosaires', name: 'Buenos Aires', country: 'Argentina', coordinates: { lat: -34.6118, lng: -58.3960 }, timezone: 'America/Argentina/Buenos_Aires', population: 3075000, type: 'city' },
  
  // Smaller towns and villages
  { id: 'zurich', name: 'Zurich', country: 'Switzerland', coordinates: { lat: 47.3769, lng: 8.5417 }, timezone: 'Europe/Zurich', population: 415000, type: 'city' },
  { id: 'vienna', name: 'Vienna', country: 'Austria', coordinates: { lat: 48.2082, lng: 16.3738 }, timezone: 'Europe/Vienna', population: 1920000, type: 'city' },
  { id: 'amsterdam', name: 'Amsterdam', country: 'Netherlands', coordinates: { lat: 52.3676, lng: 4.9041 }, timezone: 'Europe/Amsterdam', population: 872000, type: 'city' },
  { id: 'copenhagen', name: 'Copenhagen', country: 'Denmark', coordinates: { lat: 55.6761, lng: 12.5683 }, timezone: 'Europe/Copenhagen', population: 632000, type: 'city' },
  { id: 'stockholm', name: 'Stockholm', country: 'Sweden', coordinates: { lat: 59.3293, lng: 18.0686 }, timezone: 'Europe/Stockholm', population: 975000, type: 'city' },
  
  // African cities
  { id: 'cairo', name: 'Cairo', country: 'Egypt', coordinates: { lat: 30.0444, lng: 31.2357 }, timezone: 'Africa/Cairo', population: 20485000, type: 'city' },
  { id: 'lagos', name: 'Lagos', country: 'Nigeria', coordinates: { lat: 6.5244, lng: 3.3792 }, timezone: 'Africa/Lagos', population: 15388000, type: 'city' },
  { id: 'johannesburg', name: 'Johannesburg', country: 'South Africa', coordinates: { lat: -26.2041, lng: 28.0473 }, timezone: 'Africa/Johannesburg', population: 5634800, type: 'city' },
  { id: 'nairobi', name: 'Nairobi', country: 'Kenya', coordinates: { lat: -1.2921, lng: 36.8219 }, timezone: 'Africa/Nairobi', population: 4397000, type: 'city' },
  
  // Middle East
  { id: 'dubai', name: 'Dubai', country: 'United Arab Emirates', coordinates: { lat: 25.2048, lng: 55.2708 }, timezone: 'Asia/Dubai', population: 3331000, type: 'city' },
  { id: 'telaviv', name: 'Tel Aviv', country: 'Israel', coordinates: { lat: 32.0853, lng: 34.7818 }, timezone: 'Asia/Jerusalem', population: 460000, type: 'city' },
  { id: 'riyadh', name: 'Riyadh', country: 'Saudi Arabia', coordinates: { lat: 24.7136, lng: 46.6753 }, timezone: 'Asia/Riyadh', population: 7676000, type: 'city' },
  { id: 'tehran', name: 'Tehran', country: 'Iran', coordinates: { lat: 35.6892, lng: 51.3890 }, timezone: 'Asia/Tehran', population: 8960000, type: 'city' }
]

// Search places by query using AI-enhanced search
export async function searchPlaces(query: string, limit: number = 10): Promise<PlaceSearchResult> {
  if (!query || query.length < 2) {
    return { places: [], total: 0, hasMore: false }
  }

  try {
    // First try AI-enhanced local search
    const aiResults = await searchPlacesWithAI(query, GLOBAL_PLACES, limit)
    
    if (aiResults.length > 0) {
      return {
        places: aiResults,
        total: aiResults.length,
        hasMore: aiResults.length === limit
      }
    }

    // If AI search doesn't find results, try Photon API
    const photonPlaces = await searchPlacesWithPhoton(query, limit)
    
    if (photonPlaces.length > 0) {
      return {
        places: photonPlaces,
        total: photonPlaces.length,
        hasMore: photonPlaces.length === limit
      }
    }
    
    // Final fallback to local search
    return searchPlacesLocal(query, limit)
  } catch (error) {
    console.error('Search error:', error)
    
    // Fallback to local search if all APIs fail
    return searchPlacesLocal(query, limit)
  }
}

// Local search fallback (keeping the old logic as backup)
function searchPlacesLocal(query: string, limit: number): PlaceSearchResult {
  const normalizedQuery = query.toLowerCase().trim()
  
  // Filter places by name, country, or state with improved matching
  const filteredPlaces = GLOBAL_PLACES.filter(place => {
    const name = place.name.toLowerCase()
    const country = place.country.toLowerCase()
    const state = place.state ? place.state.toLowerCase() : ''
    
    // Различные варианты поиска для российских населенных пунктов
    const queryVariants = [
      normalizedQuery,
      normalizedQuery.replace(/пос\./g, 'поселок'),
      normalizedQuery.replace(/поселок/g, 'пос.'),
      normalizedQuery.replace(/п\./g, 'поселок'),
      normalizedQuery.replace(/пгт/g, 'поселок городского типа'),
      normalizedQuery.replace(/с\./g, 'село'),
      normalizedQuery.replace(/д\./g, 'деревня'),
      normalizedQuery.replace(/октябрьский/g, 'октябрьский'),
      normalizedQuery.replace(/октябрьский/g, 'октябрьский'),
    ]
    
    // Проверяем все варианты
    return queryVariants.some(variant => {
      // Check if query matches any part of the name
      const nameWords = name.split(/[\s\-_]+/) // Split by spaces, hyphens, underscores
      const queryWords = variant.split(/[\s\-_]+/)
      
      // Check if all query words are found in name words
      const nameMatch = queryWords.every(queryWord => 
        nameWords.some(nameWord => nameWord.includes(queryWord))
      )
      
      // Also check direct includes
      const directMatch = name.includes(variant) ||
        country.includes(variant) ||
        state.includes(variant)
      
      return nameMatch || directMatch
    })
  })

  // Sort by relevance (exact matches first, then by population)
  const sortedPlaces = filteredPlaces.sort((a, b) => {
    const aName = a.name.toLowerCase()
    const bName = b.name.toLowerCase()
    
    // Exact match at start
    const aExactStart = aName.startsWith(normalizedQuery)
    const bExactStart = bName.startsWith(normalizedQuery)
    
    if (aExactStart && !bExactStart) return -1
    if (!aExactStart && bExactStart) return 1
    
    // Partial match at start
    const aPartialStart = aName.includes(normalizedQuery) && aName.indexOf(normalizedQuery) < 3
    const bPartialStart = bName.includes(normalizedQuery) && bName.indexOf(normalizedQuery) < 3
    
    if (aPartialStart && !bPartialStart) return -1
    if (!aPartialStart && bPartialStart) return 1
    
    // Then by population
    return (b.population || 0) - (a.population || 0)
  })

  const places = sortedPlaces.slice(0, limit)
  
  return {
    places,
    total: filteredPlaces.length,
    hasMore: filteredPlaces.length > limit
  }
}

// Get place by ID
export function getPlaceById(id: string): Place | null {
  return GLOBAL_PLACES.find(place => place.id === id) || null
}

// Get places by country
export function getPlacesByCountry(country: string): Place[] {
  return GLOBAL_PLACES.filter(place => 
    place.country.toLowerCase().includes(country.toLowerCase())
  )
}

// Get nearby places (within radius)
export function getNearbyPlaces(lat: number, lng: number, radiusKm: number = 50): Place[] {
  return GLOBAL_PLACES.filter(place => {
    const distance = calculateDistance(lat, lng, place.coordinates.lat, place.coordinates.lng)
    return distance <= radiusKm
  })
}

// Calculate distance between two coordinates (Haversine formula)
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371 // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180
  const dLng = (lng2 - lng1) * Math.PI / 180
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLng/2) * Math.sin(dLng/2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
  return R * c
}

// Format place for display
export function formatPlace(place: Place): string {
  if (place.state) {
    return `${place.name}, ${place.state}, ${place.country}`
  }
  return `${place.name}, ${place.country}`
}

// Get timezone offset for a place
export function getTimezoneOffset(place: Place): number {
  // This is a simplified version - in real app, use a proper timezone library
  const timezoneOffsets: { [key: string]: number } = {
    'Europe/Moscow': 3,
    'Europe/London': 0,
    'America/New_York': -5,
    'America/Los_Angeles': -8,
    'Asia/Tokyo': 9,
    'Asia/Shanghai': 8,
    'Australia/Sydney': 10
  }
  
  return timezoneOffsets[place.timezone] || 0
}
