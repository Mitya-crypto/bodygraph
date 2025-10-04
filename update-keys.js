#!/usr/bin/env node

/**
 * Интерактивный скрипт для обновления API ключей
 * Помогает быстро и безопасно обновить .env.local
 */

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔑 Обновление API ключей в .env.local\n');

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer.trim());
    });
  });
}

async function updateEnvFile() {
  const envPath = path.join(process.cwd(), '.env.local');
  
  // Проверяем существование файла
  if (!fs.existsSync(envPath)) {
    console.log('❌ Файл .env.local не найден!');
    console.log('Создайте файл .env.local в корне проекта.');
    rl.close();
    return;
  }

  console.log('📋 Введите ваши API ключи (или нажмите Enter для пропуска):\n');

  // Получаем ключи от пользователя
  const yandexKey = await askQuestion('🇷🇺 Yandex Geocoder API ключ: ');
  const mapboxToken = await askQuestion('🌍 MapBox Access Token: ');

  if (!yandexKey && !mapboxToken) {
    console.log('\n⚠️ Ключи не введены. Файл не изменен.');
    rl.close();
    return;
  }

  try {
    // Читаем текущий файл
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Обновляем ключи
    if (yandexKey) {
      if (envContent.includes('YANDEX_GEOCODER_API_KEY=')) {
        envContent = envContent.replace(/YANDEX_GEOCODER_API_KEY=.*$/m, `YANDEX_GEOCODER_API_KEY=${yandexKey}`);
        console.log('✅ Yandex Geocoder ключ обновлен');
      } else {
        envContent += `\nYANDEX_GEOCODER_API_KEY=${yandexKey}`;
        console.log('✅ Yandex Geocoder ключ добавлен');
      }
    }

    if (mapboxToken) {
      if (envContent.includes('MAPBOX_ACCESS_TOKEN=')) {
        envContent = envContent.replace(/MAPBOX_ACCESS_TOKEN=.*$/m, `MAPBOX_ACCESS_TOKEN=${mapboxToken}`);
        console.log('✅ MapBox токен обновлен');
      } else {
        envContent += `\nMAPBOX_ACCESS_TOKEN=${mapboxToken}`;
        console.log('✅ MapBox токен добавлен');
      }
    }

    // Сохраняем файл
    fs.writeFileSync(envPath, envContent);
    
    console.log('\n🎉 Файл .env.local успешно обновлен!');
    console.log('\n🧪 Проверьте работу API:');
    console.log('   node test-yandex-api.js');
    console.log('\n🚀 Перезапустите сервер:');
    console.log('   npm run dev');

  } catch (error) {
    console.log('\n❌ Ошибка при обновлении файла:', error.message);
  }

  rl.close();
}

// Показываем инструкции
console.log('💡 Как получить ключи:');
console.log('   Yandex: https://developer.tech.yandex.ru/ → Создать приложение → Геокодер');
console.log('   MapBox: https://mapbox.com/ → Sign up → Account → Access tokens');
console.log('');

updateEnvFile().catch(console.error);
