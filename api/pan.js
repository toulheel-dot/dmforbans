export default async function handler(request, response) {
  
  const apikey = request.query.key;
  const pan = request.query.pan;

  // 🔑 Key check
  if (!apikey) {
    return response.status(401).json({ 
      status: "error",
      message: "Provide correct key",
      contact: "@Endexed"
    });
  }

  // 🔑 Random Valid Key: PAN-9X2K8
  const VALID_KEYS = {
    "PAN-9X2K8": { active: true }
  };

  if (!VALID_KEYS[apikey]) {
    return response.status(403).json({ 
      status: "error",
      message: "Provide correct key",
      contact: "@Endexed"
    });
  }

  // 🔍 PAN check (query)
  if (!pan) {
    return response.status(400).json({ 
      status: "error", 
      message: "Please provide PAN number (e.g. &pan=BFDPM3277E)", 
      contact: "@Endexed" 
    });
  }

  const upperPan = pan.toUpperCase();

  
  const upstreamUrl = `https://turtlemintloans.com/api/minterprise/v1/products/personal-loan/leads/existing-lead-by-pan?pan=${upperPan}&tokenId=ODY1MDkzMDg3NToyNzdF`;

  try {
    const apiResponse = await fetch(upstreamUrl, {
      method: 'GET',
      headers: {
        "Host": "turtlemintloans.com",
        "x-broker": "turtlemint",
        "Authorization": "Bearer 1b8e9c28aaa14a2d5d327ff9fe534353eb2408133cced696b2459611fb8ec4a1ca4f7558d3aa11b6a04cdee48c63cd2d",
        "x-provider": "signzy",
        "User-Agent": "Mozilla/5.0 (Linux; Android 10; K) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/152.0.0.0 Mobile Safari/537.36",
        "Accept": "*/*",
        "Referer": "https://turtlemintloans.com/products/personal-loan/customer/MULTI/apply",
        "Origin": "https://turtlemintloans.com"
      }
    });

    const data = await apiResponse.json();

    
    if (!apiResponse.ok) {
      return response.status(apiResponse.status).json({ 
        status: "error", 
        message: "API Error or Token Expired", 
        upstream_response: data,
        contact: "@Endexed" 
      });
    }

    // ✅ Success Response
    return response.status(200).json({
      status: "success",
      developer: "@Endexed",
      query: upperPan,
      results: data,
      contact: "@Endexed"
    });

  } catch (error) {
    return response.status(500).json({ 
      status: "error", 
      message: "System Error: " + error.message, 
      contact: "@Endexed" 
    });
  }
                  }
