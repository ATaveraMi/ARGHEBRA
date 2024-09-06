
const user = sessionStorage.getItem("nombre");
if (user == null) {
  location.replace("/login");
}

