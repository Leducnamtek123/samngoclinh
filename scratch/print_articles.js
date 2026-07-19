// native fetch used

async function checkArticles() {
  const headers = {
    'x-api-key': 'local_fyFGb7ywyM37TqDY8nuhAmGW5:qbp7LmCxYUTHFwKvHnxGW1aTyjSNU6ytN21etK89MaP2Dj2KZP'
  };
  try {
    const res = await fetch('http://localhost:3000/api/public/content/articles', { headers });
    if (res.ok) {
      const json = await res.json();
      console.log('API Articles:', JSON.stringify(json.data?.items, null, 2));
    } else {
      console.log('Failed to fetch:', res.status, res.statusText);
    }
  } catch (error) {
    try {
      const res = await fetch('http://localhost:3002/api/public/content/articles', { headers });
      if (res.ok) {
        const json = await res.json();
        console.log('API Articles (3002):', JSON.stringify(json, null, 2));
      }
    } catch (err) {
      console.error('Error fetching:', err);
    }
  }
}
checkArticles();
