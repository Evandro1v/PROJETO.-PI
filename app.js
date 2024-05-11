const express = require('express');
const { engine } = require('express-handlebars');
const mysql = require('mysql2');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');
// const multer = require('multer'); // Parte relacionada ao multer comentada
const fs = require('fs');
const path = require('path');
const nodemailer = require('nodemailer');

const app = express();
app.engine('handlebars', engine());
app.set('view engine', 'handlebars');
app.set('images', './images');
app.set('views', './views');
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const conexao = mysql.createConnection({
  host: 'viaduct.proxy.rlwy.net',
  user: 'root',
  password: 'AFbeOCXwSRcGAYpjDLkIAUuAAflBiOWd',
  database: 'railway',
  port:'46402'
});

// Código de conexão e configuração de sessão e autenticação continua aqui...

// const upload = multer({ dest: 'uploads/' }); // Parte relacionada ao multer comentada

// Middleware para processar formulários multipart
// app.use(upload.fields([
//   { name: 'foto_da_ocorrencia', maxCount: 1 },
//   { name: 'foto_mapa_da_localizacao', maxCount: 1 }
// ]));

// Rota para processar o formulário e enviar ocorrência
// app.post('/enviar-formulario', isLoggedIn, function (req, res) {
//   Parte do código relacionada ao formulário e envio de ocorrência continua aqui...
// });

// Middleware para servir arquivos estáticos CSS, JavaScript e imagens
app.use('/css', express.static('./css'))
app.use('/js', express.static('./js'));
app.use('/images', express.static('./images'));

// Rota para exibir imagens
app.get('/exibir-imagem', function (req, res) {
  // Parte do código relacionada à exibição de imagens continua aqui...
});

// Restante do código, incluindo as rotas e configurações do Express, permanece igual
