// Test script to verify admin registration

async function testAdminRegistration() {
  try {
    console.log('Testing admin registration...');
    
    // Test 1: Register with isAdmin: true
    console.log('\n--- Test 1: Register with isAdmin: true ---');
    const response1 = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test Admin',
        email: 'admin@test.com',
        password: 'password123',
        isAdmin: true
      })
    });
    
    const result1 = await response1.json();
    console.log('Response status:', response1.status);
    console.log('Response body:', result1);
    
    // Test 2: Register with isAdmin: false
    console.log('\n--- Test 2: Register with isAdmin: false ---');
    const response2 = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User',
        email: 'user@test.com',
        password: 'password123',
        isAdmin: false
      })
    });
    
    const result2 = await response2.json();
    console.log('Response status:', response2.status);
    console.log('Response body:', result2);
    
    // Test 3: Register without isAdmin (undefined)
    console.log('\n--- Test 3: Register without isAdmin ---');
    const response3 = await fetch('http://localhost:4000/api/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test User 2',
        email: 'user2@test.com',
        password: 'password123'
      })
    });
    
    const result3 = await response3.json();
    console.log('Response status:', response3.status);
    console.log('Response body:', result3);
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testAdminRegistration();
