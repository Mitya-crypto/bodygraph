import { calculateBodyGraph } from './calculator';
import { UserData } from './types';

/**
 * Тестовая функция для проверки работы калькулятора
 */
export async function testCalculator() {
  console.log('🧪 Тестируем калькулятор BodyGraph...');
  
  // Тестовые данные пользователя
  const testUserData: UserData = {
    name: 'Тестовый Пользователь',
    birthDate: '1990-05-15',
    birthTime: '14:30',
    birthLocation: {
      latitude: 55.7558,
      longitude: 37.6176,
      timezone: 'Europe/Moscow'
    }
  };

  try {
    console.log('📊 Начинаем расчет для:', testUserData.name);
    const startTime = Date.now();
    
    const result = await calculateBodyGraph(testUserData);
    
    const endTime = Date.now();
    console.log(`⏱️ Расчет завершен за ${endTime - startTime}ms`);
    
    if (result.success && result.data) {
      console.log('✅ Расчет успешен!');
      console.log('📈 Результаты:');
      console.log('  🔢 Нумерология:', result.data.numerology.lifePathNumber);
      console.log('  🧬 Human Design:', result.data.humanDesign.type);
      console.log('  ⭐ Астрология:', result.data.astrology.sunSign);
      console.log('  📅 Ежедневные метрики:', result.data.dailyMetrics.length, 'дней');
      
      if (result.errors && result.errors.length > 0) {
        console.log('⚠️ Предупреждения:');
        result.errors.forEach(error => {
          console.log(`  - ${error.module}: ${error.error}`);
        });
      }
    } else {
      console.log('❌ Ошибка расчета:');
      if (result.errors) {
        result.errors.forEach(error => {
          console.log(`  - ${error.module}: ${error.error}`);
        });
      }
    }
    
    return result;
  } catch (error) {
    console.error('💥 Критическая ошибка теста:', error);
    throw error;
  }
}

/**
 * Тест кэширования
 */
export async function testCaching() {
  console.log('🔄 Тестируем кэширование...');
  
  const testUserData: UserData = {
    name: 'Тест Кэша',
    birthDate: '1985-03-20',
    birthTime: '10:15',
    birthLocation: {
      latitude: 59.9311,
      longitude: 30.3609,
      timezone: 'Europe/Moscow'
    }
  };

  // Первый расчет
  console.log('🔄 Первый расчет (без кэша)...');
  const start1 = Date.now();
  const result1 = await calculateBodyGraph(testUserData);
  const time1 = Date.now() - start1;
  console.log(`⏱️ Время первого расчета: ${time1}ms`);

  // Второй расчет (должен использовать кэш)
  console.log('🔄 Второй расчет (с кэшем)...');
  const start2 = Date.now();
  const result2 = await calculateBodyGraph(testUserData);
  const time2 = Date.now() - start2;
  console.log(`⏱️ Время второго расчета: ${time2}ms`);

  console.log(`📊 Ускорение: ${Math.round(time1 / time2)}x`);
  
  return { result1, result2, time1, time2 };
}

/**
 * Запуск всех тестов
 */
export async function runAllTests() {
  console.log('🚀 Запускаем все тесты калькулятора...\n');
  
  try {
    await testCalculator();
    console.log('\n' + '='.repeat(50) + '\n');
    await testCaching();
    console.log('\n✅ Все тесты завершены успешно!');
  } catch (error) {
    console.error('\n❌ Тесты завершились с ошибкой:', error);
    throw error;
  }
}
