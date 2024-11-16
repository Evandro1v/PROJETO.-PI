//A função validateEsqueceu é usada para validar o campo de e-mail de um formulário.
//Ela verifica se o e-mail tem um formato válido usando uma expressão regular.
//Se o e-mail for inválido, uma mensagem de erro é exibida e o envio do formulário é impedido.
//Se o e-mail for válido, o formulário é enviado normalmente.

//A função validateEsqueceu é definida para validar o campo de e-mail de um formulário de recuperação de senha.
function validateEsqueceu(form) { 
	const email = form.email.value; //Obtém o valor do campo de e-mail do formulário passado como argumento para a função.
	const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; //Define uma expressão regular (regex) para validar o formato do e-mail. Esta regex verifica se o e-mail tem um formato válido, como exemplo@dominio.com.
	const errorDiv = document.querySelector('.errorValidEmail'); //Seleciona o elemento HTML com a classe errorValidEmail onde as mensagens de erro serão exibidas.
	
	//Limpa mensagens de erro anteriores
	errorDiv.textContent = ''; //Limpa qualquer mensagem de erro anterior que possa estar presente no elemento errorDiv.
	
	//Verifica se o valor do e-mail não corresponde ao padrão definido pela regex.
	//Se o e-mail for inválido a mensagem é mostrada.
	if (!emailRegex.test(email)) {
		errorDiv.innerHTML = "<p>Por favor, insira um e-mail válido.<br> Ex.: exemplo@dominio.com</p>"; //Define a mensagem de erro no elemento errorDiv. ".innerHTML" permite inserir texto HTML dentro do elemento. Assim é possível incluir tags como <p> ou <a> dentro da mensagem, o que não seria possível com .textContent.

		return false; //Se a função retorna false, impede o envio do formulário
	}
	return true; //Permite o envio do formulário se o e-mail for válido. Sendo o e-mail válido, a função retorna true, permitindo o envio do formulário.
}