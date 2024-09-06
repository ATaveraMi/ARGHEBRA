const loginForm = document.getElementById('loginForm');
const messageDiv = document.getElementById('message');

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const contraseña = document.getElementById('contraseña').value;

  try {
    const response = await fetch('/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, contraseña })
    });

    const data = await response.text();
    if (response.ok) {
      // Guardar el nombre en sessionStorage si el inicio de sesión es exitoso
      sessionStorage.setItem('nombre', nombre);
      messageDiv.textContent = data;
      location.replace("/dashboard");
      
    } else {
      throw new Error(data);
    }
  } catch (error) {
    messageDiv.textContent = 'Error: ' + error.message;
    messageDiv.classList.add('error-message'); // Agregar la clase 'error-message' al mensaje de error
  }

  // Ocultar el mensaje de error después de 5 segundos
  setTimeout(function() {
    messageDiv.textContent = '';
    messageDiv.classList.remove('error-message'); // Remover la clase 'error-message'
  }, 5000); // 5000 milisegundos = 5 segundos
});

const back_btn = document.getElementById('back_btn');

back_btn.addEventListener('click', function() {
    location.replace("/");
});
