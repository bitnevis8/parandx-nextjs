// Test script for tarot utility functions
const fs = require('fs');
const path = require('path');

// Mock the utility functions (simplified version for testing)
function getCardMeaning(card, orientation, readingType = 'daily') {
  const meaningObject = orientation === 'reversed' && card.reversed_meaning 
    ? card.reversed_meaning 
    : card.meaning;
  
  // اگر نوع فال خاصی درخواست شده، آن را برگردان
  if (readingType && meaningObject && meaningObject[readingType]) {
    return meaningObject[readingType];
  }
  
  // در غیر این صورت، معنی کلی را برگردان
  return meaningObject && meaningObject.general ? meaningObject.general : 'معنی موجود نیست';
}

function getDetailedCardMeaning(card, orientation) {
  const meaningObject = orientation === 'reversed' && card.reversed_meaning 
    ? card.reversed_meaning 
    : card.meaning;
  
  return {
    general: meaningObject && meaningObject.general ? meaningObject.general : '',
    daily: meaningObject && meaningObject.daily ? meaningObject.daily : '',
    love: meaningObject && meaningObject.love ? meaningObject.love : '',
    career: meaningObject && meaningObject.career ? meaningObject.career : '',
    health: meaningObject && meaningObject.health ? meaningObject.health : ''
  };
}

// Load tarot data
try {
  const tarotDataPath = path.join(__dirname, 'app', 'entertainment', 'fortune-telling', 'tarot', 'tarot-data.json');
  const tarotData = JSON.parse(fs.readFileSync(tarotDataPath, 'utf8'));
  
  console.log('✅ Tarot data loaded successfully');
  console.log(`📊 Total cards: ${tarotData.length}`);
  
  // Test with a specific card (The Emperor)
  const emperorCard = tarotData.find(card => card.id === '04_emperor');
  
  if (emperorCard) {
    console.log('\n🎴 Testing The Emperor card:');
    console.log(`📝 Persian name: ${emperorCard.persian_name}`);
    console.log(`📖 Description: ${emperorCard.description_fa ? '✅ Available' : '❌ Missing'}`);
    console.log(`🔮 Interpretation: ${emperorCard.interpretation_fa ? '✅ Available' : '❌ Missing'}`);
    
    // Test upright meaning
    const uprightMeaning = getCardMeaning(emperorCard, 'upright', 'love');
    console.log(`💕 Love meaning (upright): ${uprightMeaning ? '✅ Available' : '❌ Missing'}`);
    
    // Test reversed meaning
    const reversedMeaning = getCardMeaning(emperorCard, 'reversed', 'love');
    console.log(`💕 Love meaning (reversed): ${reversedMeaning ? '✅ Available' : '❌ Missing'}`);
    
    // Test detailed meaning
    const detailedMeaning = getDetailedCardMeaning(emperorCard, 'upright');
    console.log(`✨ Detailed meanings:`, {
      general: detailedMeaning.general ? '✅' : '❌',
      daily: detailedMeaning.daily ? '✅' : '❌',
      love: detailedMeaning.love ? '✅' : '❌',
      career: detailedMeaning.career ? '✅' : '❌',
      health: detailedMeaning.health ? '✅' : '❌'
    });
    
    // Test a few more cards
    const testCards = ['00_fool', '01_magician', '02_high_priestess'];
    console.log('\n🧪 Testing multiple cards:');
    
    testCards.forEach(cardId => {
      const card = tarotData.find(c => c.id === cardId);
      if (card) {
        const loveMeaning = getCardMeaning(card, 'upright', 'love');
        const hasDescription = card.description_fa && card.description_fa.length > 0;
        const hasInterpretation = card.interpretation_fa && card.interpretation_fa.length > 0;
        
        console.log(`${card.persian_name}: Description ${hasDescription ? '✅' : '❌'}, Interpretation ${hasInterpretation ? '✅' : '❌'}, Love meaning ${loveMeaning ? '✅' : '❌'}`);
      }
    });
    
    console.log('\n🎉 Test completed successfully!');
  } else {
    console.log('❌ Emperor card not found in data');
  }
  
} catch (error) {
  console.error('❌ Error loading tarot data:', error.message);
} 