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
        'User-Agent': 'Mozilla/5.0 (compatible; AH-Tracker/1.0)',
        'Accept': 'text/calendar, */*',
      },
    });

    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: `GRS returned ${response.status}` }),
      };
    }

    const icalText = await response.text();

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/calendar; charset=utf-8',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'no-cache',
      },
      body: icalText,
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
