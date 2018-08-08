const formRegister = document.querySelector('#formRegister')

formRegister.addEventListener('submit', async event => {
  event.preventDefault()
  const name = formRegister.querySelector('[name="name"]').value
  const email = formRegister.querySelector('[name="email"]').value
  const password = formRegister.querySelector('[name="password"]').value
  const messageElement = formRegister.querySelector('.message')

  messageElement.innerText = 'Registrando...'

  const response = await fetch('/signup', {
    method: 'POST',
    body: JSON.stringify({
      name,
      email,
      password,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })
  const parsedResponse = await response.json()
  messageElement.innerText = parsedResponse.message
  console.log('parsedResponse', parsedResponse)
})

