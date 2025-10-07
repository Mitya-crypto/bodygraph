// Показываем UI пользователю
figma.showUI(__html__, { width: 300, height: 250 });

// Список планет и знаков зодиака
const planets = ['☉', '☽', '☿', '♀', '♂', '♃', '♄', '♅', '♆', '♇'];
const zodiacSigns = ['♈', '♉', '♊', '♋', '♌', '♍', '♎', '♏', '♐', '♑', '♒', '♓'];

// Ждём сообщение от UI
figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-chart') {
    
    const chartSize = 600;
    const centerX = figma.viewport.center.x;
    const centerY = figma.viewport.center.y;
    const chartFrame = figma.createFrame();
    chartFrame.name = "Natal Chart";
    chartFrame.resize(chartSize, chartSize);
    chartFrame.x = centerX - chartSize / 2;
    chartFrame.y = centerY - chartSize / 2;

    // --- Рисуем круги и линии ---
    const mainCircle = figma.createEllipse();
    mainCircle.resize(chartSize, chartSize);
    mainCircle.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // Белый фон
    mainCircle.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
    mainCircle.strokeWeight = 1;
    chartFrame.appendChild(mainCircle);

    // Рисуем 12 домов (простые линии)
    for (let i = 0; i < 6; i++) {
      const angle = i * 30 * (Math.PI / 180);
      const line = figma.createLine();
      line.x = chartSize / 2;
      line.y = chartSize / 2;
      line.resize(chartSize, 0);
      line.rotation = i * 30;
      line.strokes = [{ type: 'SOLID', color: { r: 0.8, g: 0.8, b: 0.8 } }];
      chartFrame.appendChild(line);
    }
    
    // --- Размещаем знаки зодиака ---
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    for (let i = 0; i < 12; i++) {
        const angle = (i * 30 + 15) * (Math.PI / 180); // Угол для центра сектора
        const radius = chartSize / 2 - 25;
        const x = chartSize / 2 + radius * Math.cos(angle) - 12;
        const y = chartSize / 2 + radius * Math.sin(angle) - 12;

        const sign = figma.createText();
        sign.characters = zodiacSigns[i];
        sign.fontSize = 24;
        sign.x = x;
        sign.y = y;
        chartFrame.appendChild(sign);
    }

    // --- Размещаем планеты (ВАЖНО: случайные позиции для демонстрации) ---
    for (const planet of planets) {
        // Генерируем случайный угол и радиус
        const randomAngle = Math.random() * 360 * (Math.PI / 180);
        const randomRadius = Math.random() * (chartSize / 2 - 50) + 30;

        const x = chartSize / 2 + randomRadius * Math.cos(randomAngle) - 10;
        const y = chartSize / 2 + randomRadius * Math.sin(randomAngle) - 10;

        const planetNode = figma.createText();
        planetNode.characters = planet;
        planetNode.fontSize = 20;
        planetNode.x = x;
        planetNode.y = y;
        chartFrame.appendChild(planetNode);
    }
    
    figma.currentPage.selection = [chartFrame];
    figma.viewport.scrollAndZoomIntoView([chartFrame]);

    // Отправляем сообщение обратно в UI и закрываем плагин
    figma.ui.postMessage('chart-created');
    figma.closePlugin("Карта успешно создана!");
  }
};
