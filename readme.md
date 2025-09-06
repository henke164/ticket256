Create game:
fetch('http://localhost:3001/game/start', {
  method: 'POST',
  headers: {
    'content-type': 'application/json',
  },
  body: JSON.stringify({
    tickets: 100
  })
})