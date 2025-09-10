Create draw:
fetch('http://localhost:3001/draw/start', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    tickets: 100
  })
})