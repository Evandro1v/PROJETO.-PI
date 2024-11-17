  //Código alterado para exibir todas as mensagens de erro em uma única div com a classe error-message.

  function addErrorMessage(message) {
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML += `<p>${message}</p>`;
    }
    
    function validateForm(event) {
    // Resetando mensagens de erro
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML = '';
    
    // Pegando o value dos id
    const password = document.getElementById("password-id").value;
    const firstname = document.getElementById("firstname-id").value;
    const lastname = document.getElementById("lastname-id").value;
    const address = document.getElementById("email-id").value;
    
    let isFieldsValidated = true;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Validar nome (pelo menos 3 caracteres)
    if (firstname.length < 3) {
    addErrorMessage("O nome é muito curto.");
    isFieldsValidated = false;
    }
    // Validar último nome (pelo menos 3 caracteres)
    if (lastname.length < 10) {
    addErrorMessage("Telefone inválido, tente novamente.");
    isFieldsValidated = false;
    }
    // Validar email usando expressão regular simples
    if (!emailRegex.test(address)) {
    addErrorMessage("Email inválido, tente novamente.");
    isFieldsValidated = false;
    }
    // Validar senha (pelo menos 6 caracteres)
    if (password.length < 6) {
    addErrorMessage("Senha curta, use 6 caracteres ou mais.");
    isFieldsValidated = false;
    }
    if (isFieldsValidated) {
    // Redirecionar para a página de login após a validação bem-sucedida
    window.location.href = '/';
    return true;
    }
    // Se todas as validações passarem, o formulário é enviado
    return false;
    }
    
    function validateLOGIN(event) {
    event.preventDefault(); // Evita que o formulário seja enviado antes da validação
    
    // Resetando mensagens de erro
    const errorDiv = document.querySelector('.error-message');
    errorDiv.innerHTML = '';
    
    // Pegando os valores dos campos do formulário
    const email = document.getElementById("email-id").value.trim(); // Remove espaços em branco no início e no final
    const password = document.getElementById("password-id").value.trim();
    
    let isFieldsValidated = true;
    
    // Validar formato do email
    const regexEmail = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!regexEmail.test(email)) {
    addErrorMessage("Formato de email inválido.");
    isFieldsValidated = false;
    }
    
    // Validar se os campos não estão vazios
    if (email === "") {
    addErrorMessage("Por favor, preencha o campo de e-mail.");
    isFieldsValidated = false;
    }
    
    if (password === "") {
    addErrorMessage("Por favor, preencha o campo de senha.");
    isFieldsValidated = false;
    }
    
    return isFieldsValidated;
    }

    
function validateResetPasswordForm(event) {
  event.preventDefault(); // Evita que o formulário seja enviado antes da validação
  
  // Resetando mensagens de erro
  const errorDiv = document.querySelector('.error-message');
  errorDiv.innerHTML = '';
  
  // Pegando o valor do campo de e-mail
  const email = document.getElementById("email-id").value.trim();
  
  let isFieldsValidated = true;
  
  // Validar formato do email
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
  addErrorMessage("Email inválido, tente novamente.");
  isFieldsValidated = false;
  }
  
  if (isFieldsValidated) {
  // Se todas as validações passarem, o formulário é enviado
  event.target.submit();
  }
  }
  
  // Adicionando o evento de validação ao formulário de recuperação de senha
  document.querySelector('form[action="/esqueceusenha"]').addEventListener('submit', validateResetPasswordForm);














    
