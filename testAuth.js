(async ()=>{
  try{
    const fetch = global.fetch || (await import('node-fetch')).default;
    const registerRes = await fetch('http://localhost:3000/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: 'Test User', email: 'test@example.com', password: 'pass123' })
    });
    const registerText = await registerRes.text();
    console.log('REGISTER', registerRes.status, registerText);

    const loginRes = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'test@example.com', password: 'pass123' })
    });
    const loginText = await loginRes.text();
    console.log('LOGIN', loginRes.status, loginText);
  }catch(err){
    console.error('ERROR', err);
  }
})();
