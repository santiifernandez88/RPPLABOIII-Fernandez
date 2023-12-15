const tiposPredeterminados = ['Esqueleto', 'Zombie', 'Fantasma', 'Vampiro', 'Bruja', 'Hombre Lobo'];
if (!localStorage.getItem('tipos')) 
{
  localStorage.setItem('tipos', JSON.stringify(tiposPredeterminados));
}

const tipoFiltro = ['Todos', 'Esqueleto', 'Zombie', 'Fantasma', 'Vampiro', 'Bruja', 'Hombre Lobo'];
if (!localStorage.getItem('tiposFiltro')) 
{
  localStorage.setItem('tiposFiltro', JSON.stringify(tipoFiltro));
}

const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];
const tablaMonstruos = document.getElementById('tablaMonstruos');
const monsterForm = document.getElementById("monsterForm");
const eliminarBtn = document.getElementById('eliminarBtn');
const url = "http://localhost:3000/monstruos";
const orderMiedo = (a, b) => b.miedo - a.miedo;

getMonstruos(url)
  .then((data) => {
    data.sort(orderMiedo);
    llenarTablaMonstruos(data);
  })
  .catch((error) => {
    console.error('Error al obtener los monstruos:', error);
  });

document.addEventListener('DOMContentLoaded', function () 
{
  const spinner = document.getElementById('spinner');
  spinner.style.display = 'none';
  document.getElementById('nombre').disabled = false;
  document.getElementById('alias').disabled = false;

  const tipoSelect = document.getElementById('tipo');
  const tiposGuardados = JSON.parse(localStorage.getItem('tipos')) || [];
  tiposGuardados.forEach(tipo => 
  {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = tipo;
    tipoSelect.appendChild(option);
  });

  cargarOpciones();
  const dropdownTipo = document.getElementById('dropdownTipo');
  const opcionesTipo = document.getElementById('opcionesTipo');
  opcionesTipo.addEventListener('click', function (event) 
  {
    event.stopPropagation();
    if (event.target.classList.contains('dropdown-item')) 
    {
      const opcionSeleccionada = event.target.textContent;
      dropdownTipo.textContent = opcionSeleccionada;
      const dropdownInstance = new bootstrap.Dropdown(opcionesTipo);
      filtrarTablaPorTipo(opcionSeleccionada);
      dropdownInstance.hide();
    }
  });
  dropdownTipo.textContent = 'Todos';

  manejarFiltroColumnas();
  setTimeout(mostrarResultadosMiedo, 3000);

  cargarCheckboxesSeleccionados();
  setTimeout(() => 
  {
    mostrarOcultarColumnasDinamico(); 
  }, 2000);
  const checkboxesFiltros = document.querySelectorAll('.filtros-check input[type="checkbox"]');
  checkboxesFiltros.forEach(checkbox => 
  {
    checkbox.addEventListener('change', function () 
    {
      guardarCheckboxesSeleccionados(); // Guardar los estados de los checkboxes en localStorage
      mostrarOcultarColumnasDinamico(); // Mostrar u ocultar las columnas según los checkboxes
    });
  });

});

function guardarCheckboxesSeleccionados() 
{
  const checkboxesFiltros = document.querySelectorAll('.filtros-check input[type="checkbox"]');
  const valoresSeleccionados = [];

  checkboxesFiltros.forEach(checkbox => 
  {
    if(checkbox.checked) 
    {
      valoresSeleccionados.push(checkbox.value);
    }
  });

  localStorage.setItem('valoresCheckboxes', JSON.stringify(valoresSeleccionados));
}

function cargarCheckboxesSeleccionados() 
{
  const valoresGuardados = JSON.parse(localStorage.getItem('valoresCheckboxes')) || [];
  const checkboxesFiltros = document.querySelectorAll('.filtros-check input[type="checkbox"]');

  checkboxesFiltros.forEach(checkbox => 
  {
    if(valoresGuardados.includes(checkbox.value)) 
    {
      checkbox.checked = true;
    }
  });
}

function filtrarTablaPorTipo(tipo) 
{
  filasVisibles = [];

  const filas = Array.from(document.querySelectorAll('#tablaMonstruos tbody tr'));

  filas.forEach(fila => 
  {
    const tipoFila = fila.querySelector('td:nth-child(5)').textContent; // Ajusta el índice según la estructura real de tu tabla

    if(tipo === 'Todos' || tipoFila === tipo) 
    {
      fila.style.display = '';
      filasVisibles.push(fila);
    } 
    else 
    {
      fila.style.display = 'none';
    }
  });

  mostrarResultadosMiedo();
}

monsterForm.addEventListener('reset', function(event)
{
  event.preventDefault();
  document.getElementById('nombre').disabled = false;
  document.getElementById('alias').disabled = false;

  monsterForm.nombre.value = '';
  monsterForm.alias.value = '';

  let radios = monsterForm.querySelectorAll('input[type="radio"]');
  radios.forEach(function(radio) {
    if (radio.defaultChecked) {
      radio.checked = true;
    } else {
      radio.checked = false;
    }
  });

let checkboxes = monsterForm.querySelectorAll('input[type="checkbox"]');
checkboxes.forEach(function(checkbox) {
  checkbox.checked = checkbox.defaultChecked;
});
});

monsterForm.addEventListener('submit', function (event) 
{
  event.preventDefault();
  spinner.style.display = 'block';

  const nombre = monsterForm.nombre.value;
  const alias = monsterForm.alias.value;
  const defensa = obtenerDefensaSeleccionada();
  const miedo = monsterForm.miedo.value;
  const tipo = monsterForm.tipo.value;
  const habilidades = obtenerHabilidadesSelecionadas()
  const indumentaria = obtenerIndumentariaSeleccionada();


  obtenerMonstruoPorNombreYAlias(nombre, alias)
  .then(monstruo => 
  {
    if(monstruo)
    {
      console.log('Monstruo seleccionado:', monstruo);
      monstruo.defensa = defensa;
      monstruo.miedo = miedo;
      monstruo.tipo = tipo;
      monstruo.habilidades = habilidades;
      monstruo.indumentaria = indumentaria;
      updateMonstruo(url,monstruo);
      mostrarCustomAlerta("Se modifico correctamente!!");
    }
    else
    {
      if (defensa == false && habilidades.length == 0 && indumentaria == false) 
      {
        mostrarCustomAlerta('Falta el campo defensa y/o el de habilidades y/o indumentaria');
      } 
      else 
      {
        getMonstruos(url)
        .then(data => 
        {  
          const ultimoId = data.reduce((maxId, objeto) => 
          {
            return objeto.id > maxId ? objeto.id : maxId;
          }, 0);
          monstruo.id = ultimoId + 1;
          return Promise.resolve();
        })
        nuevoMonstruo = 
        {
          nombre: nombre,
          alias: alias,
          defensa: defensa,
          miedo: miedo,
          tipo: tipo,
          habilidades: habilidades,
          indumentaria: indumentaria
        };
        postMonstruo(url, nuevoMonstruo);
        console.log('Monstruo agregado correctamente');
        mostrarCustomAlerta('Se agregó correctamente!!');
      }
    }
  })
  .catch(error => 
  {
    console.error('Error al obtener el monstruo:', error);
  });

  setTimeout(() => 
  {
    document.getElementById('nombre').disabled = false;
    document.getElementById('alias').disabled = false;
    spinner.style.display = 'none';
    monsterForm.reset();
    getMonstruos(url)
    .then((data) => 
    {
      llenarTablaMonstruos(data);
    })
    .catch((error) => 
    {
      console.error('Error al obtener los monstruos:', error);
    });
  }, 2000);
});

eliminarBtn.addEventListener('click', function(event) {
  event.preventDefault();
  const nombre = monsterForm.nombre.value;
  const alias = monsterForm.alias.value;

  spinner.style.display = 'block';

  getMonstruoPorNombreYAlias(url, nombre, alias)
  .then(monstruo => 
  {
    if (monstruo) 
    {
      deleteMonstruo(url, monstruo.id);
      document.getElementById('nombre').disabled = false;
      document.getElementById('alias').disabled = false;
      mostrarCustomAlerta("El monstruo se elimino correctamente");
      spinner.style.display = 'none';
      monsterForm.reset();
    } 
    else 
    {
      throw new Error('No se encontró el monstruo');
    }
  })
  .catch(error => 
  {
    console.error('Error:', error.message);
    spinner.style.display = 'none'; 
  });
});



function mostrarCustomAlerta(message) {
const customAlert = document.getElementById('customAlerta');
const customAlertMessage = document.getElementById('customAlertaMensaje');

customAlertMessage.textContent = message;
customAlert.classList.add('show');

setTimeout(() => {
  cerrarCustomAlerta();
}, 10000); 
}

function cerrarCustomAlerta() {
const customAlert = document.getElementById('customAlerta');
customAlert.classList.remove('show');
}


function llenarTablaMonstruos(monstruos) {
const tbody = document.querySelector('#tablaMonstruos tbody');

while (tbody.firstChild) {
  tbody.removeChild(tbody.firstChild);
}

monstruos.forEach(monstruo => {
  if (monstruo) {
    const fila = document.createElement('tr');

    const columnaNombre = document.createElement('td');
    columnaNombre.textContent = monstruo.nombre;

    const columnaAlias = document.createElement('td');
    columnaAlias.textContent = monstruo.alias;

    const columnaDefensa = document.createElement('td');
    columnaDefensa.textContent = monstruo.defensa;

    const columnaMiedo = document.createElement('td');
    columnaMiedo.textContent = monstruo.miedo;

    const columnaTipo = document.createElement('td');
    columnaTipo.textContent = monstruo.tipo;

    const columnaHabilidades = document.createElement('td');
    columnaHabilidades.textContent = monstruo.habilidades;

    const columnaIndumentaria = document.createElement('td');
    columnaIndumentaria.textContent = monstruo.indumentaria;

    fila.appendChild(columnaNombre);
    fila.appendChild(columnaAlias);
    fila.appendChild(columnaDefensa);
    fila.appendChild(columnaMiedo);
    fila.appendChild(columnaTipo);
    fila.appendChild(columnaHabilidades);
    fila.appendChild(columnaIndumentaria);

    tbody.appendChild(fila);
  }
});
}

tablaMonstruos.addEventListener('click', function (event) {

if (event.target.tagName === 'TD' && event.target.closest('tbody')) {
  const filaClickeada = event.target.parentElement;
  const nombre = filaClickeada.getElementsByTagName('td')[0].textContent;
  const alias = filaClickeada.getElementsByTagName('td')[1].textContent;
  const checkboxesHabilidades = document.getElementsByName('habilidades');
  obtenerMonstruoPorNombreYAlias(nombre, alias)
      .then(monstruo => {
        console.log('Monstruo seleccionado:', monstruo);
        monsterForm.nombre.value = monstruo.nombre;
        monsterForm.alias.value = monstruo.alias;
        monsterForm.defensa.value = monstruo.defensa;
        monsterForm.miedo.value = monstruo.miedo;
        monsterForm.tipo.value = monstruo.tipo;
        monsterForm.indumentaria.value = monstruo.indumentaria;
        const habilidadesSeleccionadas = monstruo.habilidades;
    
        checkboxesHabilidades.forEach(checkbox => {
          if (Array.isArray(habilidadesSeleccionadas) && habilidadesSeleccionadas.includes(checkbox.value)) {
            checkbox.checked = true;
          } else {
            checkbox.checked = false;
          }
        }); 
        
        document.getElementById('nombre').disabled = true;
        document.getElementById('alias').disabled = true;
      })
      .catch(error => {
        console.error('Error al obtener el monstruo:', error);
      });
}
});

function obtenerDefensaSeleccionada() {
const opcionesDefensa = document.getElementsByName('defensa');
let defensaSeleccionada = '';

opcionesDefensa.forEach(opcion => {
  if (opcion.checked) {
    defensaSeleccionada = opcion.value;
  }
});

return defensaSeleccionada;
}

function obtenerIndumentariaSeleccionada() {
const opcionesIndumentaria = document.getElementsByName('indumentaria');
let indumentariaSeleccionada = '';

opcionesIndumentaria.forEach(opcion => {
  if (opcion.checked) {
    indumentariaSeleccionada = opcion.value;
  }
});

return indumentariaSeleccionada;
}

function obtenerHabilidadesSelecionadas()
{
  const $opcionesHabilidades = document.getElementsByName("habilidades");
  let habilidades = [];
  $opcionesHabilidades.forEach((element) =>
  {
    if (element.checked)
    {
      console.log(element.value);
      habilidades.push(element.value);
    }
  });
  return habilidades;
}

function obtenerMiedosEnTabla() {
  const filasVisibles = Array.from(document.querySelectorAll('#tablaMonstruos tbody tr'))
    .filter(row => row.style.display !== 'none');

  const miedos = filasVisibles.map(row => {
    const miedoCell = row.querySelector('td:nth-child(4)'); // Ajusta el índice según la estructura real de tu tabla

    if (miedoCell) {
      const miedo = parseFloat(miedoCell.textContent.trim());

      if (!isNaN(miedo)) {
        return miedo;
      }
    }
    return 0; // Devuelve 0 si no se encuentra un valor numérico en la celda de miedo
  });

  console.log('Miedos encontrados:', miedos);
  return miedos.filter(miedo => miedo !== 0); // Filtra los valores no numéricos
}



function calcularPromedioMiedo() {
  const miedos = obtenerMiedosEnTabla();

  if (miedos.length === 0) {
    return "Sin valores";
  }

  const suma = miedos.reduce((anterior, actual) => anterior + actual, 0);
  const promedio = suma / miedos.length;
  return promedio.toFixed(2); // Redondear a dos decimales
}

function calcularMaximoMiedo() 
{
  const miedos = obtenerMiedosEnTabla();

  if (miedos.length === 0) {
    return "Sin valores";
  }

  const maximo = Math.max(...miedos);
  return maximo;
}

function calcularMinimoMiedo() 
{
  const miedos = obtenerMiedosEnTabla();

  if (miedos.length === 0) 
  {
    return "Sin valores";
  }

  const minimo = Math.min(...miedos);
  return minimo;
}

function mostrarResultadosMiedo() 
{
  const promedio = calcularPromedioMiedo();
  const maximo = calcularMaximoMiedo();
  const minimo = calcularMinimoMiedo();

  document.getElementById('promedio-miedo').value = promedio;
  document.getElementById('miedo-max').value = maximo;
  document.getElementById('miedo-min').value = minimo;
}

function cargarOpciones() 
{
  const dropdown = document.getElementById("opcionesTipo");
  tipoFiltro.forEach((tipo) => 
  {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "javascript:void(0)";
    a.className = "dropdown-item";
    a.textContent = tipo;
    li.appendChild(a);
    dropdown.appendChild(li);
  });
}

function manejarFiltroColumnas() {
  const checkboxesFiltros = document.querySelectorAll('.filtros-check input[type="checkbox"]');

  checkboxesFiltros.forEach(checkbox => {
    checkbox.addEventListener('change', function () {
      const columna = this.value.toLowerCase();
      mostrarOcultarColumnasDinamico()
    });
  });

  //marcarTodosCheckboxes(true); // Marcar todos los checkboxes al cargar la página
}

function mostrarOcultarColumnasDinamico() {
  const checkboxesFiltros = document.querySelectorAll('.filtros-check input[type="checkbox"]');
  const headers = document.querySelectorAll('#tablaMonstruos th');
  const filas = document.querySelectorAll('#tablaMonstruos tbody tr');

  checkboxesFiltros.forEach(checkbox => {
    const columna = checkbox.value.toLowerCase();

    const indexColumna = Array.from(headers).findIndex(th => th.textContent.toLowerCase().trim() === columna);

    if (indexColumna !== -1) {
      headers[indexColumna].style.display = checkbox.checked ? 'table-cell' : 'none';
      filas.forEach(fila => {
        fila.cells[indexColumna].style.display = checkbox.checked ? 'table-cell' : 'none';
      });
    }
  });
}


function obtenerMonstruoPorNombreYAlias(nombre, alias) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4) {
        if (xhr.status === 200) {
          const monstruos = JSON.parse(xhr.responseText);
          const monstruoEncontrado = monstruos.find(
            monstruo => monstruo.nombre === nombre && monstruo.alias === alias
          );
          resolve(monstruoEncontrado || null);
        } else {
          reject(new Error(`Error ${xhr.status}: ${xhr.statusText}`));
        }
      }
    };

    xhr.open('GET', `${url}?nombre=${nombre}&alias=${alias}`, true);
    xhr.send();
  });
}

//Get Ajax Monstruos para monstruos.html
function getMonstruos(url)
{
  return new Promise((resolve, reject) => 
  {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = ()=>
    {
      if(xhr.readyState == 4)
      {
        if(xhr.status >= 200 && xhr.status < 300)
        {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        }
        else
        {
          reject(`ERROR ${xhr.status}: ${xhr.statusText}`);
        }
      }
    }
    xhr.open("GET", url, true);
    try
    {                    
      xhr.send();        
    }
    catch(error)
    {
      console.log(error);
    }
  });
}

//Post Ajax Monstruo para monstruos.html
 function postMonstruo(url,nuevoMonstruo)
 {
  return new Promise((resolve, reject) =>
  {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => 
    {
      if(xhr.readyState == 4)
      {
        if (xhr.status >= 200 && xhr.status < 300)
        {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } 
        else 
        {
          console.error(`ERROR ${xhr.status}: ${xhr.statusText}`);
          reject({ status: xhr.status, statusText: xhr.statusText });
        }
      }
    };
    xhr.open("POST",url, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    try 
    {
      xhr.send(JSON.stringify(nuevoMonstruo));
    } 
    catch (error)
    {
      console.log(error);
      reject(error);
    }
  });
}

function updateMonstruo(url, objeto) 
{
  return new Promise((resolve, reject) => 
  {
    const xhr = new XMLHttpRequest();
    xhr.onreadystatechange = () => 
    {
      if (xhr.readyState == 4) 
      {
        if (xhr.status >= 200 && xhr.status < 300) 
        {
          const data = JSON.parse(xhr.responseText);
          resolve(data);
        } 
        else 
        {
          const error = new Error(`ERROR ${xhr.status}: ${xhr.statusText}`);
          console.error(error);
          reject(error);
        }
      }
    };
    xhr.open("PATCH", url + `/${objeto.id}`, true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    try 
    {
      xhr.send(JSON.stringify(objeto));
    } 
    catch(error) 
    {
      console.log(error);
      reject(error);
    }
  });
}

//axios get un monstruo para monstruos.hmtl
function getMonstruoPorNombreYAlias(url, nombre, alias) {
  const params = { nombre, alias };

  return axios.get(url, { params })
    .then(response => {
      if (response && response.data && Array.isArray(response.data) && response.data.length > 0) {
        const monstruoEncontrado = response.data.find(monstruo => monstruo.nombre === nombre && monstruo.alias === alias);
        if (monstruoEncontrado) {
          console.log('Monstruo encontrado:', monstruoEncontrado);
          return monstruoEncontrado;
        }
      }
      console.log('Monstruo no encontrado o respuesta vacía');
      return null;
    })
    .catch(error => {
      console.error('Error al obtener el monstruo:', error.message);
      throw new Error('No se pudo obtener el monstruo');
    });
}


//Delete axios para monstruos.html
function deleteMonstruo(url, id) 
{
  return new Promise((resolve, reject) => 
  {
    console.log(url + "/" + id);
    axios.delete(url + "/" + id)
    .then(({ data }) => 
    {
      resolve(data);
    })
    .catch(({ message }) => 
    {
      console.error(message);
      reject(message);
    });
  });
}




  