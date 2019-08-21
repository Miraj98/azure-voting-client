export const fetchQrCode = (endpoint, payload) => {
  const payload_json = JSON.stringify(payload);
  return fetch(endpoint, {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: payload_json
  })
  .then(res => res.json())
  .then(json => json);
}

export const fetchVerificationQrCode = (endpoint) => {
  const REQUEST_URL = endpoint + "/start-verification";
  return fetch(REQUEST_URL)
  .then(res => {
    return res.json()
  })
  .then(json => {
    return json
  });
}

export const fetchGenerateOtpState = (endpoint, setState) => {
  const REQUEST_URL = endpoint + "/otpstate";
  return fetch(REQUEST_URL)
  .then(res => res.json())
  .then(json => {
    if(json.state === "done") {
      setState(json);
      return;
    } else {
      setState(json);
      setTimeout(() => fetchGenerateOtpState(endpoint, setState), 1000);
    }
  });
}

export const postNewCandidateRegistration = (endpoint, payload, setState) => {
  setState("started");
  const REQUEST_URL = endpoint + "/registercandidate"
  const payload_json = JSON.stringify(payload);
  return fetch(REQUEST_URL, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: payload_json
  })
  .then(res => res.json())
  .then(json => {
    setState("done");
    return json
  });
}