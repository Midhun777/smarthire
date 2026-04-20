const test = async () => {
    try {
        const rand = Math.random().toString(36).substring(7);
        const email = `test_disc_${rand}@test.com`;
        
        console.log('Registering...', email);
        let res = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                name: 'Test Disc',
                email,
                password: 'password123',
                role: 'job_seeker'
            })
        });
        
        let data = await res.json();
        const token = data.token;
        console.log('Got token:', token);
        
        const headers = { 
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        
        console.log('Fetching recommend...');
        res = await fetch('http://localhost:5000/api/jobs/recommend', { method: 'POST', headers, body: JSON.stringify({}) });
        console.log(res.status, await res.text());
        
        console.log('ALL SUCCESS!');
    } catch (err) {
        console.error('ERROR:', err.message);
    }
}

test();
