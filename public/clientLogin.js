const formLogin = document.querySelector('#formLogin')

formLogin.addEventListener('submit', async event => {
  event.preventDefault()

  const email = formLogin.querySelector('[name="email"]').value
  const senha = formLogin.querySelector('[name="senha"]').value
  const messageElement = formLogin.querySelector('.message')

  messageElement.innerText = 'Tentando fazer login...'

  const response = await fetch('/login', {
    method: 'POST',
    body: JSON.stringify({
      email,
      senha,
    }),
    headers: {
      'Content-Type': 'application/json',
    },
  })

  const parsedResponse = await response.json()
  messageElement.innerText = parsedResponse.message
  if (parsedResponse.success) {
    localStorage.setItem('token', parsedResponse.token)
    location.href = '/user.html'
  }
  console.log('parsedResponse', parsedResponse)
})
