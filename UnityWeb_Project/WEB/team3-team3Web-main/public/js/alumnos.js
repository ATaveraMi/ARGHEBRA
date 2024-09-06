const deleteForm = document.getElementById('deleteForm');
const deleteMessageDiv = document.getElementById('deleteMessage');
const addForm = document.getElementById('addForm');
const addMessageDiv = document.getElementById('addMessage');

deleteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const deleteNombre = document.getElementById('deleteNombre').value;
  const deleteNumLista = document.getElementById('deleteNumLista').value;

  try {
    const response = await fetch('/delete_alumno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: deleteNombre, numeroLista: deleteNumLista })
    });

    const data = await response.text();
    if (response.ok) {
      deleteMessageDiv.textContent = data;
      deleteMessageDiv.classList.add('success-message'); // Agregar clase para mensaje de éxito
    } else {
      throw new Error(data);
    }
  } catch (error) {
    deleteMessageDiv.textContent = 'Error: ' + error.message;
    deleteMessageDiv.classList.add('error-message'); // Agregar clase para mensaje de error
  }

  // Ocultar el mensaje después de 4 segundos
  setTimeout(function() {
    deleteMessageDiv.textContent = '';
    deleteMessageDiv.classList.remove('success-message', 'error-message'); // Quitar todas las clases
  }, 4000); // 4000 milisegundos = 4 segundos
});

addForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const addNombre = document.getElementById('addNombre').value;
  const addNumLista = document.getElementById('addNumLista').value;
  const addGenero = document.getElementById('addGenero').value;

  try {
    const response = await fetch('/add_alumno', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ nombre: addNombre, numLista: addNumLista, genero: addGenero })
    });

    const data = await response.text();
    if (response.ok) {
      addMessageDiv.textContent = data;
      addMessageDiv.classList.add('success-message'); // Agregar clase para mensaje de éxito
    } else {
      throw new Error(data);
    }
  } catch (error) {
    addMessageDiv.textContent = 'Error: ' + error.message;
    addMessageDiv.classList.add('error-message'); // Agregar clase para mensaje de error
  }

  // Ocultar el mensaje después de 4 segundos
  setTimeout(function() {
    addMessageDiv.textContent = '';
    addMessageDiv.classList.remove('success-message', 'error-message'); // Quitar todas las clases
  }, 4000); // 4000 milisegundos = 4 segundos
});
