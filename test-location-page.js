const axios = require('axios');

/**
 * Simple test script for location page functionality
 */

async function testLocationPage() {
  try {
    console.log('🧪 Testing Location Page functionality...\n');

    // Test 1: Get location data for Khuzestan province
    console.log('1️⃣ Testing location data for Khuzestan...');
    const locationResponse = await axios.get('http://localhost:3000/api/location/getBySlug/استان-خوزستان');
    console.log('✅ Location Response:', {
      success: locationResponse.data.success,
      locationName: locationResponse.data.data?.name,
      divisionType: locationResponse.data.data?.divisionType
    });

    // Test 2: Get wiki details with Wikidata
    console.log('\n2️⃣ Testing wiki details with Wikidata...');
    const wikiResponse = await axios.get(`http://localhost:3000/api/location/getWikiDetails/${locationResponse.data.data.id}`);
    console.log('✅ Wiki Details Response:', {
      success: wikiResponse.data.success,
      hasWiki: !!wikiResponse.data.data?.wiki,
      hasWikidata: !!wikiResponse.data.data?.wikidata,
      wikidataId: wikiResponse.data.data?.wikidata?.id || 'Not found'
    });

    // Test 3: Test the frontend URL
    console.log('\n3️⃣ Testing frontend URL...');
    console.log('Frontend URL: http://localhost:3001/location/استان-خوزستان');
    console.log('Expected features:');
    console.log('- Loading states for wiki and wikidata');
    console.log('- Location image in header');
    console.log('- Wikidata information display');
    console.log('- Wikipedia extract');

    console.log('\n🎉 All tests completed!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
  }
}

// Run the test if this file is executed directly
if (require.main === module) {
  testLocationPage();
}

module.exports = { testLocationPage }; 