const token = localStorage.getItem('token')
const setarNome = document.querySelector('#receberNome')
const messageElement = document.querySelector('.message')
const listaUsers = document.querySelector('.users-list')

if (token) {
  loadUsers()
  const [security, json] = token.split('.')
  const payload = JSON.parse(atob(json))

  setarNome.innerText = payload.name

} else {
  messageElement.innerHTML = `<a href="/index.html">Faça login para continuar</a>`
}

async function loadUsers() {
  messageElement.innerText = 'Carregando...'
  const response = await fetch('/users', {
    method: 'GET',
    headers: {
      Token: token,
    }
  })

  const parsedResponse = await response.json()
  messageElement.innerText = parsedResponse.message

  if(parsedResponse.success){
    parsedResponse.items.forEach(element => {
      const li = document.createElement('li')
      li.innerText = element.name
      li.addEventListener('click', () => alert(element.id))
      listaUsers.appendChild(li)
    });
  }
}
