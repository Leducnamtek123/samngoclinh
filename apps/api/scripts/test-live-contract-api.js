const API_KEY = "local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP";

async function testHttp() {
    const loginRes = await fetch('http://localhost:3000/api/v1/public/user/login/credential', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'x-api-key': API_KEY,
        },
        body: JSON.stringify({
            email: 'superadmin@mail.com',
            password: 'aaAA@123',
            from: 'website',
            device: { fingerprint: 'admin-fp' },
        }),
    });

    const loginData = await loginRes.json();
    const token = loginData.data?.tokens?.accessToken;

    const urls = [
        `http://localhost:3000/api/admin/contracts/873500c8-40d9-4682-8407-b47a3352f031`,
        `http://localhost:3000/api/admin/contracts/CTR-SNL-2026%2F7191`,
        `http://localhost:3000/api/admin/contracts/CTR-SNL-2026/7191`,
    ];

    for (const url of urls) {
        const res = await fetch(url, {
            headers: {
                'x-api-key': API_KEY,
                'Authorization': `Bearer ${token}`,
            },
        });
        const data = await res.json().catch(() => ({}));
        console.log(`${url} -> status ${res.status}:`, data.message || data.statusCodeKey || (data.data ? 'HAS DATA' : 'NO DATA'));
    }
}

testHttp().catch(console.error);
