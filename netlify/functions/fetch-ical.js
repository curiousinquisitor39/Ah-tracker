// Netlify Function: fetch-ical
// Proxies iCal requests server-side to bypass CORS restrictions

exports.handler = async (event) => {
  const url = event.queryStringParameters?.url;

  if (!url) {
    return {
      statusCode: 400,
      body: JSON.stringify({ error: 'Missing url parameter' }),
    };
  }

  // Only allow GRS iCal URLs for security
  if (!url.startsWith('https://grsmob.londonambulance.nhs.uk/grscal/api/ical/')) {
    return {
      statusCode: 403,
      body: JSON.stringify({ error: 'Only GRS iCal URLs are permitted' }),
    };
  }

  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/calendar, text/plain, */*',
        'Accept-Language': 'en-GB,en;q=0.9',
        'Cache-Control': 'no-cache',
      },
    });

    const body = await response.text();

    if (!response.ok) {
      return {
        statusCode: response.status,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          error: `GRS returned ${response.status}`,
          detail: body.substring(0, 200),
        }),
      };
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
      body,
    };
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        error: 'Function fetch error',
        detail: err.message,
      }),
    };
  }
};
