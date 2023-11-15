const tiposPredeterminados = ['Esqueleto', 'Zombie', 'Fantasma', 'Vampiro', 'Bruja', 'Hombre Lobo'];
if (!localStorage.getItem('tipos')) 
{
  localStorage.setItem('tipos', JSON.stringify(tiposPredeterminados));
}

const tablaMonstruos = document.getElementById('tablaMonstruos');
const monsterForm = document.getElementById("monsterForm");
const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];

document.addEventListener('DOMContentLoaded', function () 
{

  const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];
  llenarTablaMonstruos(monstruosGuardados);

  const spinner = document.getElementById("spinner");
  spinner.style.display = 'none';

  const tipoSelect = document.getElementById('tipo');
  const tiposGuardados = JSON.parse(localStorage.getItem('tipos')) || [];
  tiposGuardados.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = tipo;
    tipoSelect.appendChild(option);
  });

  
  monsterForm.addEventListener('submit', function (event) 
  {
      event.preventDefault();
      spinner.style.display = 'block';

      const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];

      const nombre = monsterForm.nombre.value;
      const alias = monsterForm.alias.value;
      const defensa = obtenerDefensaSeleccionada();
      const miedo = monsterForm.miedo.value;
      const tipo = monsterForm.tipo.value;

      let monstruoSeleccionado = monstruosGuardados.find(monstruo => 
        monstruo.nombre == nombre &&
        monstruo.alias == alias &&
        monstruo.defensa == defensa &&
        monstruo.miedo == miedo &&
        monstruo.tipo == tipo);

      if(monstruoSeleccionado != undefined)
      {
        monstruoSeleccionado.nombre = nombre;
        monstruoSeleccionado.alias = alias;
        monstruoSeleccionado.defensa = defensa;
        monstruoSeleccionado.miedo = miedo;
        monstruoSeleccionado.tipo = tipo;
        window.confirm("Se modifico correctamente.");
      }
      else
      {
        if(defensa == "")
        {
          window.confirm("Falta el campo defensa");
        }
        else
        {
          monstruoSeleccionado =
          {
            id: 1,
            nombre: nombre,
            alias: alias,
            defensa: defensa,
            miedo: miedo,
            tipo: tipo,
          };
          monstruosGuardados.push(monstruoSeleccionado); 
          window.confirm("Se agrego correctamente.");
        }
    
      }

      localStorage.setItem('monstruos', JSON.stringify(monstruosGuardados));
      setTimeout(() => {
        llenarTablaMonstruos(monstruosGuardados);
        spinner.style.display = 'none';
      }, 2000);
   
  });

  tablaMonstruos.addEventListener('click', function (event) 
  {
    if (event.target.tagName === 'TD') 
    {
      const filaClicada = event.target.parentElement;
      const nombre = filaClicada.getElementsByTagName('td')[0].textContent;
      const monstruoSeleccionado = monstruosGuardados.find(monstruo =>  monstruo.nombre == nombre)

      monsterForm.nombre.value = monstruoSeleccionado.nombre;
      monsterForm.alias.value = monstruoSeleccionado.alias;
      monsterForm.defensa.value = monstruoSeleccionado.defensa;
      monsterForm.miedo.value = monstruoSeleccionado.miedo;
      monsterForm.tipo.value = monstruoSeleccionado.tipo;
    }
  });

});

function eliminarMonstruo()
{
  spinner.style.display = 'block';
  monstruosGuardados.forEach((monstruo, index) => 
  {
    if(monstruo.nombre == monsterForm.nombre.value &&
      monstruo.alias == monsterForm.alias.value &&
      monstruo.defensa == monsterForm.defensa.value &&
      monstruo.miedo == monsterForm.miedo.value &&
      monstruo.tipo == monsterForm.tipo.value)
    {
      monstruosGuardados.splice(index, 1);
    }
  });

  localStorage.setItem('monstruos', JSON.stringify(monstruosGuardados));
  setTimeout(() => {
    llenarTablaMonstruos(monstruosGuardados);
    spinner.style.display = 'none';
    window.confirm("Eliminado correctamente");
  }, 2000);
}

  function obtenerDefensaSeleccionada() 
  {
    const opcionesDefensa = document.getElementsByName('defensa');
    let defensaSeleccionada = '';

    opcionesDefensa.forEach(opcion => 
    {
      if(opcion.checked) 
      {
        defensaSeleccionada = opcion.value;
      }
    });

    return defensaSeleccionada;
  }    

  function llenarTablaMonstruos(monstruos) {
    const tbody = document.querySelector('#tablaMonstruos tbody');

    while (tbody.firstChild) {
        tbody.removeChild(tbody.firstChild);
    }

    monstruos.forEach(monstruo => 
    {
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

        fila.appendChild(columnaNombre);
        fila.appendChild(columnaAlias);
        fila.appendChild(columnaDefensa);
        fila.appendChild(columnaMiedo);
        fila.appendChild(columnaTipo);


        tbody.appendChild(fila);
      }

        
    });
}


  