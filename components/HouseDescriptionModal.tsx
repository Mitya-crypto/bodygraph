'use client'

import { motion } from 'framer-motion'
import { X } from 'lucide-react'

interface HouseDescriptionModalProps {
  isOpen: boolean
  onClose: () => void
  houseNumber: number
  language: 'en' | 'ru'
}

export function HouseDescriptionModal({ isOpen, onClose, houseNumber, language }: HouseDescriptionModalProps) {
  console.log('🏠 HouseDescriptionModal props:', { isOpen, houseNumber, language })
  if (!isOpen) return null

  const houseDescriptions = {
    ru: {
      1: {
        title: 'Дом 1 - Личность и Самовыражение',
        description: 'Первый дом представляет вашу личность, внешность, характер и то, как вы проявляете себя в мире. Это дом самосознания, первого впечатления и вашего подхода к жизни.',
        keywords: ['личность', 'внешность', 'характер', 'самосознание', 'первое впечатление'],
        influences: [
          'Как вас видят другие люди',
          'Ваш стиль и внешний вид',
          'Основные черты характера',
          'Подход к новым начинаниям',
          'Личная инициатива и независимость'
        ],
        advice: 'Работайте над развитием уверенности в себе и позитивного самовосприятия. Ваша личность - это ваша визитная карточка в мире.'
      },
      2: {
        title: 'Дом 2 - Материальные Ценности и Ресурсы',
        description: 'Второй дом связан с материальными ценностями, финансами, имуществом и вашим отношением к деньгам. Также включает таланты и способности, которые приносят доход.',
        keywords: ['деньги', 'имущество', 'таланты', 'ресурсы', 'ценности'],
        influences: [
          'Финансовая стабильность',
          'Отношение к деньгам',
          'Материальные владения',
          'Таланты и способности',
          'Самооценка через достижения'
        ],
        advice: 'Развивайте свои природные таланты и создавайте стабильную финансовую основу. Цените не только материальные, но и духовные богатства.'
      },
      3: {
        title: 'Дом 3 - Коммуникация и Обучение',
        description: 'Третий дом отвечает за коммуникацию, обучение, ближайшее окружение и краткосрочные поездки. Это дом ментальной активности и обмена информацией.',
        keywords: ['коммуникация', 'обучение', 'ближайшее окружение', 'братья и сестры', 'поездки'],
        influences: [
          'Стиль общения',
          'Отношения с братьями и сестрами',
          'Образование и обучение',
          'Ближайшее окружение',
          'Краткосрочные поездки'
        ],
        advice: 'Развивайте навыки общения и будьте открыты для обучения. Ваше ближайшее окружение играет важную роль в вашем развитии.'
      },
      4: {
        title: 'Дом 4 - Семья и Корни',
        description: 'Четвертый дом представляет семью, дом, эмоциональную основу и внутренний мир. Это дом корней, традиций и того, что дает вам чувство безопасности.',
        keywords: ['семья', 'дом', 'корни', 'традиции', 'безопасность'],
        influences: [
          'Отношения с семьей',
          'Дом и домашняя обстановка',
          'Эмоциональная безопасность',
          'Семейные традиции',
          'Внутренний мир и интуиция'
        ],
        advice: 'Создавайте уютный дом и поддерживайте семейные связи. Ваша эмоциональная основа важна для общего благополучия.'
      },
      5: {
        title: 'Дом 5 - Творчество и Удовольствия',
        description: 'Пятый дом связан с творчеством, романтикой, детьми, хобби и самовыражением. Это дом радости, игр и творческих проявлений.',
        keywords: ['творчество', 'романтика', 'дети', 'хобби', 'самовыражение'],
        influences: [
          'Творческие способности',
          'Романтические отношения',
          'Отношения с детьми',
          'Хобби и развлечения',
          'Спортивные способности'
        ],
        advice: 'Не бойтесь выражать свою творческую натуру. Играйте, творите и находите радость в жизни.'
      },
      6: {
        title: 'Дом 6 - Здоровье и Служение',
        description: 'Шестой дом отвечает за здоровье, работу, распорядок дня и заботу о других. Это дом служения, здоровья и ежедневных обязанностей.',
        keywords: ['здоровье', 'работа', 'служение', 'распорядок', 'обязанности'],
        influences: [
          'Физическое здоровье',
          'Рабочая среда',
          'Ежедневные привычки',
          'Отношения с коллегами',
          'Забота о других'
        ],
        advice: 'Поддерживайте здоровый образ жизни и находите баланс между работой и отдыхом. Помогайте другим, но не забывайте о себе.'
      },
      7: {
        title: 'Дом 7 - Партнерство и Отношения',
        description: 'Седьмой дом представляет брак, деловые партнерства, открытых врагов и все виды отношений один-на-один. Это дом баланса и компромиссов.',
        keywords: ['брак', 'партнерство', 'отношения', 'компромиссы', 'баланс'],
        influences: [
          'Брачные отношения',
          'Деловые партнерства',
          'Открытые конфликты',
          'Публичные отношения',
          'Способность к компромиссу'
        ],
        advice: 'Учитесь строить гармоничные отношения. Баланс и компромисс - ключи к успешному партнерству.'
      },
      8: {
        title: 'Дом 8 - Трансформация и Общие Ресурсы',
        description: 'Восьмой дом связан с трансформацией, наследством, общими ресурсами, интимностью и глубокими изменениями. Это дом смерти и возрождения.',
        keywords: ['трансформация', 'наследство', 'интимность', 'изменения', 'тайны'],
        influences: [
          'Совместные финансы',
          'Наследство и инвестиции',
          'Интимные отношения',
          'Психологические изменения',
          'Тайны и оккультизм'
        ],
        advice: 'Принимайте изменения как возможность для роста. Работайте с глубокими психологическими процессами.'
      },
      9: {
        title: 'Дом 9 - Философия и Дальние Путешествия',
        description: 'Девятый дом представляет философию, высшее образование, дальние путешествия, веру и расширение горизонтов. Это дом мудрости и поиска смысла.',
        keywords: ['философия', 'образование', 'путешествия', 'вера', 'мудрость'],
        influences: [
          'Высшее образование',
          'Философские взгляды',
          'Дальние путешествия',
          'Религиозные убеждения',
          'Публикации и преподавание'
        ],
        advice: 'Расширяйте свои горизонты через образование и путешествия. Ищите смысл жизни и делитесь мудростью.'
      },
      10: {
        title: 'Дом 10 - Карьера и Общественный Статус',
        description: 'Десятый дом отвечает за карьеру, репутацию, общественный статус и жизненные цели. Это дом достижений и признания в обществе.',
        keywords: ['карьера', 'репутация', 'статус', 'достижения', 'признание'],
        influences: [
          'Профессиональная карьера',
          'Общественная репутация',
          'Жизненные цели',
          'Взаимодействие с властью',
          'Публичный имидж'
        ],
        advice: 'Работайте над построением прочной репутации и достижением карьерных целей. Ваш профессиональный успех влияет на общественное признание.'
      },
      11: {
        title: 'Дом 11 - Дружба и Надежды',
        description: 'Одиннадцатый дом связан с дружбой, групповой деятельностью, мечтами о будущем и гуманитарными идеалами. Это дом надежд и дружеских связей.',
        keywords: ['дружба', 'группы', 'мечты', 'идеалы', 'будущее'],
        influences: [
          'Дружеские отношения',
          'Групповая деятельность',
          'Мечты и цели',
          'Гуманитарные проекты',
          'Инновации и технологии'
        ],
        advice: 'Окружайте себя единомышленниками и работайте над реализацией своих мечтаний. Дружба и коллективная деятельность приносят радость.'
      },
      12: {
        title: 'Дом 12 - Подсознание и Уединение',
        description: 'Двенадцатый дом представляет подсознание, духовность, уединение, тайны и скрытых врагов. Это дом завершения и духовного роста.',
        keywords: ['подсознание', 'духовность', 'уединение', 'тайны', 'завершение'],
        influences: [
          'Подсознательные процессы',
          'Духовная практика',
          'Тайные дела',
          'Изоляция и уединение',
          'Мистические переживания'
        ],
        advice: 'Развивайте духовность и работайте с подсознанием. Периоды уединения необходимы для внутреннего роста.'
      }
    },
    en: {
      1: {
        title: 'House 1 - Personality and Self-Expression',
        description: 'The first house represents your personality, appearance, character, and how you present yourself to the world. This is the house of self-awareness, first impressions, and your approach to life.',
        keywords: ['personality', 'appearance', 'character', 'self-awareness', 'first impression'],
        influences: [
          'How others see you',
          'Your style and appearance',
          'Core character traits',
          'Approach to new beginnings',
          'Personal initiative and independence'
        ],
        advice: 'Work on developing self-confidence and positive self-perception. Your personality is your calling card in the world.'
      },
      2: {
        title: 'House 2 - Material Values and Resources',
        description: 'The second house is related to material values, finances, property, and your relationship with money. It also includes talents and abilities that generate income.',
        keywords: ['money', 'property', 'talents', 'resources', 'values'],
        influences: [
          'Financial stability',
          'Relationship with money',
          'Material possessions',
          'Talents and abilities',
          'Self-esteem through achievements'
        ],
        advice: 'Develop your natural talents and create a stable financial foundation. Value not only material but also spiritual wealth.'
      },
      3: {
        title: 'House 3 - Communication and Learning',
        description: 'The third house governs communication, learning, immediate environment, and short trips. This is the house of mental activity and information exchange.',
        keywords: ['communication', 'learning', 'immediate environment', 'siblings', 'travel'],
        influences: [
          'Communication style',
          'Relationships with siblings',
          'Education and learning',
          'Immediate environment',
          'Short trips'
        ],
        advice: 'Develop communication skills and be open to learning. Your immediate environment plays an important role in your development.'
      },
      4: {
        title: 'House 4 - Family and Roots',
        description: 'The fourth house represents family, home, emotional foundation, and inner world. This is the house of roots, traditions, and what gives you a sense of security.',
        keywords: ['family', 'home', 'roots', 'traditions', 'security'],
        influences: [
          'Family relationships',
          'Home and domestic environment',
          'Emotional security',
          'Family traditions',
          'Inner world and intuition'
        ],
        advice: 'Create a cozy home and maintain family connections. Your emotional foundation is important for overall well-being.'
      },
      5: {
        title: 'House 5 - Creativity and Pleasures',
        description: 'The fifth house is related to creativity, romance, children, hobbies, and self-expression. This is the house of joy, play, and creative manifestations.',
        keywords: ['creativity', 'romance', 'children', 'hobbies', 'self-expression'],
        influences: [
          'Creative abilities',
          'Romantic relationships',
          'Relationships with children',
          'Hobbies and entertainment',
          'Athletic abilities'
        ],
        advice: 'Don\'t be afraid to express your creative nature. Play, create, and find joy in life.'
      },
      6: {
        title: 'House 6 - Health and Service',
        description: 'The sixth house governs health, work, daily routine, and caring for others. This is the house of service, health, and daily responsibilities.',
        keywords: ['health', 'work', 'service', 'routine', 'responsibilities'],
        influences: [
          'Physical health',
          'Work environment',
          'Daily habits',
          'Relationships with colleagues',
          'Caring for others'
        ],
        advice: 'Maintain a healthy lifestyle and find balance between work and rest. Help others but don\'t forget about yourself.'
      },
      7: {
        title: 'House 7 - Partnership and Relationships',
        description: 'The seventh house represents marriage, business partnerships, open enemies, and all types of one-on-one relationships. This is the house of balance and compromise.',
        keywords: ['marriage', 'partnership', 'relationships', 'compromise', 'balance'],
        influences: [
          'Marital relationships',
          'Business partnerships',
          'Open conflicts',
          'Public relationships',
          'Ability to compromise'
        ],
        advice: 'Learn to build harmonious relationships. Balance and compromise are keys to successful partnership.'
      },
      8: {
        title: 'House 8 - Transformation and Shared Resources',
        description: 'The eighth house is related to transformation, inheritance, shared resources, intimacy, and deep changes. This is the house of death and rebirth.',
        keywords: ['transformation', 'inheritance', 'intimacy', 'changes', 'secrets'],
        influences: [
          'Shared finances',
          'Inheritance and investments',
          'Intimate relationships',
          'Psychological changes',
          'Secrets and occultism'
        ],
        advice: 'Accept changes as opportunities for growth. Work with deep psychological processes.'
      },
      9: {
        title: 'House 9 - Philosophy and Long Journeys',
        description: 'The ninth house represents philosophy, higher education, long journeys, faith, and expanding horizons. This is the house of wisdom and the search for meaning.',
        keywords: ['philosophy', 'education', 'travel', 'faith', 'wisdom'],
        influences: [
          'Higher education',
          'Philosophical views',
          'Long journeys',
          'Religious beliefs',
          'Publications and teaching'
        ],
        advice: 'Expand your horizons through education and travel. Seek meaning in life and share wisdom.'
      },
      10: {
        title: 'House 10 - Career and Public Status',
        description: 'The tenth house governs career, reputation, public status, and life goals. This is the house of achievements and recognition in society.',
        keywords: ['career', 'reputation', 'status', 'achievements', 'recognition'],
        influences: [
          'Professional career',
          'Public reputation',
          'Life goals',
          'Interaction with authority',
          'Public image'
        ],
        advice: 'Work on building a solid reputation and achieving career goals. Your professional success affects public recognition.'
      },
      11: {
        title: 'House 11 - Friendship and Hopes',
        description: 'The eleventh house is related to friendship, group activities, dreams for the future, and humanitarian ideals. This is the house of hopes and friendly connections.',
        keywords: ['friendship', 'groups', 'dreams', 'ideals', 'future'],
        influences: [
          'Friendly relationships',
          'Group activities',
          'Dreams and goals',
          'Humanitarian projects',
          'Innovations and technology'
        ],
        advice: 'Surround yourself with like-minded people and work on realizing your dreams. Friendship and collective activities bring joy.'
      },
      12: {
        title: 'House 12 - Subconscious and Seclusion',
        description: 'The twelfth house represents the subconscious, spirituality, seclusion, secrets, and hidden enemies. This is the house of completion and spiritual growth.',
        keywords: ['subconscious', 'spirituality', 'seclusion', 'secrets', 'completion'],
        influences: [
          'Subconscious processes',
          'Spiritual practice',
          'Secret affairs',
          'Isolation and seclusion',
          'Mystical experiences'
        ],
        advice: 'Develop spirituality and work with the subconscious. Periods of seclusion are necessary for inner growth.'
      }
    }
  }

  const houseInfo = houseDescriptions[language][houseNumber as keyof typeof houseDescriptions[typeof language]]

  if (!houseInfo) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="cosmic-card max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="cosmic-title text-2xl">{houseInfo.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-space-700 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-cosmic-400" />
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <p className="cosmic-text text-lg leading-relaxed">
            {houseInfo.description}
          </p>

          <div>
            <h3 className="cosmic-subtitle text-lg mb-3">
              {language === 'ru' ? 'Ключевые слова' : 'Keywords'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {houseInfo.keywords.map((keyword, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-cosmic-600/30 text-cosmic-300 rounded-full text-sm"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h3 className="cosmic-subtitle text-lg mb-3">
              {language === 'ru' ? 'Основные влияния' : 'Main Influences'}
            </h3>
            <ul className="space-y-2">
              {houseInfo.influences.map((influence, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-cosmic-400 mt-1">•</span>
                  <span className="cosmic-text">{influence}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-cosmic-600/20 p-4 rounded-lg border border-cosmic-600/30">
            <h3 className="cosmic-subtitle text-lg mb-2">
              {language === 'ru' ? 'Совет' : 'Advice'}
            </h3>
            <p className="cosmic-text italic">{houseInfo.advice}</p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
