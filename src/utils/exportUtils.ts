import { Alert } from 'react-native';
// import RNPrint from 'react-native-print';
// import Share from 'react-native-share';
// import RNFS from 'react-native-fs';

interface ExportData {
  title: string;
  timeframe: string;
  childName?: string;
  totalMeals: number;
  acceptanceRate: number;
  foodTrends: Array<{
    name: string;
    acceptance: number;
    attempts: number;
  }>;
  nutritionSummary: Array<{
    group: string;
    count: number;
    recommended: number;
  }>;
  insights: string[];
}

// Generate HTML content for PDF
const generatePDFContent = (data: ExportData): string => {
  const { title, timeframe, childName, totalMeals, acceptanceRate, foodTrends, nutritionSummary, insights } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>LittleMeals Report</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'SF Pro Display', sans-serif;
          line-height: 1.6;
          color: hsl(160, 8%, 15%);
          background: hsl(35, 20%, 98%);
          margin: 0;
          padding: 20px;
        }
        .header {
          text-align: center;
          border-bottom: 2px solid hsl(140, 25%, 45%);
          padding-bottom: 20px;
          margin-bottom: 30px;
        }
        .header h1 {
          color: hsl(140, 25%, 45%);
          margin: 0;
          font-size: 28px;
        }
        .header p {
          color: hsl(160, 6%, 50%);
          margin: 10px 0 0 0;
          font-size: 16px;
        }
        .section {
          background: white;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 20px;
          box-shadow: 0 2px 12px hsla(160, 8%, 15%, 0.08);
        }
        .section h2 {
          color: hsl(140, 25%, 45%);
          margin: 0 0 15px 0;
          font-size: 20px;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 20px;
          margin: 20px 0;
        }
        .stat-card {
          text-align: center;
          padding: 15px;
          background: hsl(35, 25%, 96%);
          border-radius: 8px;
        }
        .stat-number {
          font-size: 24px;
          font-weight: bold;
          color: hsl(140, 25%, 45%);
          margin: 0;
        }
        .stat-label {
          color: hsl(160, 6%, 50%);
          font-size: 14px;
          margin: 5px 0 0 0;
        }
        .food-trends table {
          width: 100%;
          border-collapse: collapse;
          margin-top: 15px;
        }
        .food-trends th,
        .food-trends td {
          text-align: left;
          padding: 10px;
          border-bottom: 1px solid hsl(35, 15%, 88%);
        }
        .food-trends th {
          background: hsl(35, 25%, 96%);
          font-weight: 600;
          color: hsl(140, 25%, 45%);
        }
        .acceptance-bar {
          width: 100px;
          height: 8px;
          background: hsl(35, 15%, 88%);
          border-radius: 4px;
          overflow: hidden;
          margin-top: 4px;
        }
        .acceptance-fill {
          height: 100%;
          border-radius: 4px;
        }
        .acceptance-high { background: hsl(120, 40%, 50%); }
        .acceptance-medium { background: hsl(45, 80%, 60%); }
        .acceptance-low { background: hsl(0, 60%, 60%); }
        .insights ul {
          list-style: none;
          padding: 0;
        }
        .insights li {
          background: hsl(140, 20%, 90%);
          padding: 12px 15px;
          margin: 10px 0;
          border-radius: 8px;
          border-left: 4px solid hsl(140, 25%, 45%);
        }
        .nutrition-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 15px;
          margin-top: 15px;
        }
        .nutrition-item {
          padding: 15px;
          background: hsl(35, 25%, 96%);
          border-radius: 8px;
          border-left: 4px solid hsl(140, 25%, 45%);
        }
        .footer {
          text-align: center;
          margin-top: 40px;
          padding-top: 20px;
          border-top: 1px solid hsl(35, 15%, 88%);
          color: hsl(160, 6%, 50%);
          font-size: 12px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>${title}</h1>
        <p>${timeframe}${childName ? ` • ${childName}` : ''} • Generated ${new Date().toLocaleDateString()}</p>
      </div>

      <div class="section">
        <h2>📊 Overview</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-number">${totalMeals}</p>
            <p class="stat-label">Total Meals</p>
          </div>
          <div class="stat-card">
            <p class="stat-number">${acceptanceRate}%</p>
            <p class="stat-label">Average Acceptance</p>
          </div>
          <div class="stat-card">
            <p class="stat-number">${foodTrends.length}</p>
            <p class="stat-label">Foods Tracked</p>
          </div>
        </div>
      </div>

      <div class="section food-trends">
        <h2>🍎 Food Acceptance Trends</h2>
        <table>
          <thead>
            <tr>
              <th>Food</th>
              <th>Acceptance Rate</th>
              <th>Attempts</th>
            </tr>
          </thead>
          <tbody>
            ${foodTrends.map(food => `
              <tr>
                <td>${food.name}</td>
                <td>
                  ${food.acceptance}%
                  <div class="acceptance-bar">
                    <div class="acceptance-fill ${
                      food.acceptance >= 80 ? 'acceptance-high' : 
                      food.acceptance >= 60 ? 'acceptance-medium' : 'acceptance-low'
                    }" style="width: ${food.acceptance}%"></div>
                  </div>
                </td>
                <td>${food.attempts}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>🥗 Nutrition Summary</h2>
        <div class="nutrition-grid">
          ${nutritionSummary.map(item => `
            <div class="nutrition-item">
              <strong>${item.group}</strong><br>
              <span>${item.count} of ${item.recommended} recommended servings</span>
            </div>
          `).join('')}
        </div>
      </div>

      <div class="section insights">
        <h2>💡 Key Insights</h2>
        <ul>
          ${insights.map(insight => `<li>${insight}</li>`).join('')}
        </ul>
      </div>

      <div class="footer">
        <p>Generated by LittleMeals • Family Meal Tracking App</p>
        <p>This report is intended for healthcare professionals and family use.</p>
      </div>
    </body>
    </html>
  `;
};

// Generate simple text summary
export const generateTextSummary = (data: ExportData): string => {
  const { title, timeframe, childName, totalMeals, acceptanceRate, foodTrends, insights } = data;
  
  const topFoods = foodTrends
    .sort((a, b) => b.acceptance - a.acceptance)
    .slice(0, 3)
    .map(food => `${food.name} (${food.acceptance}%)`)
    .join(', ');
  
  const challengingFoods = foodTrends
    .sort((a, b) => a.acceptance - b.acceptance)
    .slice(0, 2)
    .map(food => `${food.name} (${food.acceptance}%)`)
    .join(', ');

  return `
${title}
${timeframe}${childName ? ` - ${childName}` : ''}

📊 SUMMARY
• ${totalMeals} meals logged
• ${acceptanceRate}% average acceptance rate
• ${foodTrends.length} different foods tracked

🌟 TOP ACCEPTED FOODS
${topFoods}

🔍 NEEDS ATTENTION
${challengingFoods}

💡 KEY INSIGHTS
${insights.map(insight => `• ${insight}`).join('\n')}

Generated by LittleMeals on ${new Date().toLocaleDateString()}
  `.trim();
};

// Export as PDF (placeholder for now - requires platform-specific implementation)
export const exportAsPDF = async (data: ExportData): Promise<void> => {
  try {
    // For now, show an alert. In a real implementation, you would use RNPrint
    Alert.alert(
      'PDF Export',
      'PDF export functionality will be available once the app is fully configured with native dependencies.',
      [
        {
          text: 'Share Text Summary',
          onPress: () => shareTextSummary(data),
        },
        { text: 'OK' }
      ]
    );

    // Real implementation would look like this:
    /*
    const htmlContent = generatePDFContent(data);
    const results = await RNPrint.print({
      html: htmlContent,
      fileName: `littlemeals-report-${Date.now()}`,
    });
    */
  } catch (error) {
    console.error('PDF export error:', error);
    Alert.alert('Export Error', 'Unable to generate PDF report.');
  }
};

// Share text summary
export const shareTextSummary = async (data: ExportData): Promise<void> => {
  try {
    const textSummary = generateTextSummary(data);
    
    // For now, just copy to clipboard concept - in real implementation use Share
    Alert.alert(
      'Share Summary',
      'Text summary generated! In a fully configured app, this would open your device sharing options.',
      [
        {
          text: 'View Summary',
          onPress: () => {
            Alert.alert('Text Summary', textSummary);
          }
        },
        { text: 'OK' }
      ]
    );

    // Real implementation would look like this:
    /*
    const shareOptions = {
      title: data.title,
      message: textSummary,
      subject: `LittleMeals Report - ${data.timeframe}`,
    };
    
    await Share.open(shareOptions);
    */
  } catch (error) {
    console.error('Share error:', error);
    Alert.alert('Share Error', 'Unable to share summary.');
  }
};

// Export chart as image (placeholder - would require react-native-view-shot)
export const exportChartAsImage = async (): Promise<void> => {
  try {
    Alert.alert(
      'Image Export',
      'Chart image export will be available once view capture is implemented.',
      [{ text: 'OK' }]
    );

    // Real implementation would use react-native-view-shot:
    /*
    const result = await captureRef(chartRef, {
      format: 'png',
      quality: 0.8,
      result: 'tmpfile',
    });
    
    const shareOptions = {
      title: 'Chart from LittleMeals',
      url: result,
      type: 'image/png',
    };
    
    await Share.open(shareOptions);
    */
  } catch (error) {
    console.error('Image export error:', error);
    Alert.alert('Export Error', 'Unable to export chart image.');
  }
};