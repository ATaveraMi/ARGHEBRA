const signupForm = document.getElementById('signupForm');
const messageDiv = document.getElementById('message');

signupForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const nombre = document.getElementById('nombre').value;
  const contraseña = document.getElementById('contraseña').value;
  const confirmContraseña = document.getElementById('confirmContraseña').value;
  const escuelaContraseñaIngresada = document.getElementById('escuelaContraseña').value;

  if (contraseña !== confirmContraseña) {
    messageDiv.textContent = 'Las contraseñas no coinciden';
    messageDiv.classList.add('error-message'); // Agregar la clase 'error-message' al mensaje de error
    return;
  }

  try {
    const response = await fetch('/signup', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre, contraseña, escuelaContraseñaIngresada })
    });

    const data = await response.text();
    if (response.ok) {
      // Si el registro es exitoso, iniciar sesión automáticamente y redirigir al dashboard
      await fetch('/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nombre, contraseña })
      });
      
      // Guardar el nombre en sessionStorage si el inicio de sesión es exitoso
      sessionStorage.setItem('nombre', nombre);
      alert('Cuenta creada con exito, acepte para ir al dashboard')
      // Redirigir al dashboard
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