const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mysql = require('mysql')
const webtoken = require('jsonwebtoken')

const secret = 'shhhh'

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'test',
})

app.use(bodyParser.json())
app.post('/signup', (request, response) => {
  const { name, email, password } = request.body
  connection.query(
    'INSERT INTO user (name, email, hash) VALUES (?, ?, ?);',
    [name, email, password],
    (error, result) => {
      if (error) {
        console.error(error)
        response.send({
          success: false,
          message: 'Não foi possível realizar o cadastro.',
        })
        return
      }
      response.send({
        success: true,
        message: 'Usuario registrado com sucesso',
      })
    },
  )
})

app.use(bodyParser.json())
app.post('/login', (request, response) => {
  const { email, senha } = request.body
  connection.query('SELECT id, email, hash, name FROM user WHERE email = ? ;', [email], (error, result) => {
    if (error) {
      console.log(error)
      response.send({
        success: false,
        message: 'Não foi possível fazer login',
      })
      return
    }
    if (!result.length) {
      response.send({
        success: false,
        message: 'Erro ao logar, por favor verifique seu email e senha',
      })
    } else {
      if (senha === result[0].hash) {
        const token = webtoken.sign({ id: result[0].id, email: result[0].email, name: result[0].name }, secret)
        response.send({
          success: true,
          message: 'Usuario logado com sucesso',
          token,
        })
      } else {
        response.send({
          success: false,
          message: 'Erro ao logar, por favor verifique seu email e senha',
        })
      }
    }
  })
})

app.get('/users', (request, response) => {
  try {
    const user = webtoken.verify(request.get('Token'), secret)
    if (!user) {
      throw new Error('Login necessário')
    }
  } catch (error) {
    console.log(error)
    response.send({
      success: false,
      message: 'Erro de autenticação',
    })
    return
  }
  connection.query('SELECT id, name FROM user;', (error, result) => {
    if (error) {
      console.log(error)
      response.send({
        success: false,
        message: 'Erro de SQL',
      })
      return
    }
    response.send({
      success: true,
      message: '',
      items: result,
    })
  })
})

app.use('/', express.static('./public'))

app.listen(3000, () => {
  console.log('Servidor inciado na porta 3000')
})
