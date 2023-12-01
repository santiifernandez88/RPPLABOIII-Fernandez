const tiposPredeterminados = ['Esqueleto', 'Zombie', 'Fantasma', 'Vampiro', 'Bruja', 'Hombre Lobo'];
if (!localStorage.getItem('tipos')) 
{
  localStorage.setItem('tipos', JSON.stringify(tiposPredeterminados));
}

const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];
const tablaMonstruos = document.getElementById('tablaMonstruos');
const monsterForm = document.getElementById("monsterForm");
const eliminarBtn = document.getElementById('eliminarBtn');
let modificando;

document.addEventListener('DOMContentLoaded', function () {
 
 llenarTablaMonstruos(monstruosGuardados);

  const spinner = document.getElementById('spinner');
  spinner.style.display = 'none';

  const tipoSelect = document.getElementById('tipo');
  const tiposGuardados = JSON.parse(localStorage.getItem('tipos')) || [];
  tiposGuardados.forEach(tipo => {
    const option = document.createElement('option');
    option.value = tipo;
    option.textContent = tipo;
    tipoSelect.appendChild(option);
    document.getElementById('nombre').disabled = false;
    document.getElementById('alias').disabled = false;
  });

  monsterForm.addEventListener('submit', function (event) {
    event.preventDefault();
    spinner.style.display = 'block';

    const nombre = monsterForm.nombre.value;
    const alias = monsterForm.alias.value;
    const defensa = obtenerDefensaSeleccionada();
    const miedo = monsterForm.miedo.value;
    const tipo = monsterForm.tipo.value;
    const habilidades = obtenerHabilidadesSelecionadas()

    let monstruoSeleccionado = monstruosGuardados.find(monstruo => 
      monstruo.nombre === nombre &&
      monstruo.alias === alias
    );

    if(monstruoSeleccionado !== undefined) {
      monstruoSeleccionado.defensa = defensa;
      monstruoSeleccionado.miedo = miedo;
      monstruoSeleccionado.tipo = tipo;
      monstruoSeleccionado.habilidades = habilidades;
      window.confirm('Se modificó correctamente.');
    } else {
      if (defensa === '' && habilidades.length == 0) {
        window.confirm('Falta el campo defensa y/o el de habilidades');
      } else {
        monstruoSeleccionado = {
          id: 1,
          nombre: nombre,
          alias: alias,
          defensa: defensa,
          miedo: miedo,
          tipo: tipo,
          habilidades: habilidades
        };
        monstruosGuardados.push(monstruoSeleccionado); 
        window.confirm('Se agregó correctamente.');
      }
    }

    localStorage.setItem('monstruos', JSON.stringify(monstruosGuardados));
    console.log('Monstruos guardados:', monstruosGuardados);
    setTimeout(() => {
      llenarTablaMonstruos(monstruosGuardados);
      document.getElementById('nombre').disabled = false;
      document.getElementById('alias').disabled = false;
      spinner.style.display = 'none';
      monsterForm.reset();
    }, 2000);
  });

  tablaMonstruos.addEventListener('click', function (event) {
    
    if (event.target.tagName === 'TD' && event.target.closest('tbody')) {
      const filaClickeada = event.target.parentElement;
      const nombre = filaClickeada.getElementsByTagName('td')[0].textContent;
      const alias = filaClickeada.getElementsByTagName('td')[1].textContent;
      const monstruoSeleccionado = monstruosGuardados.find(monstruo =>
        monstruo.nombre === nombre && monstruo.alias === alias
      );
      console.log(monstruosGuardados);
      console.log(nombre);
      console.log(alias);

      if (monstruoSeleccionado) {
        console.log('Monstruo seleccionado:', monstruoSeleccionado);
        monsterForm.nombre.value = monstruoSeleccionado.nombre;
        monsterForm.alias.value = monstruoSeleccionado.alias;
        monsterForm.defensa.value = monstruoSeleccionado.defensa;
        monsterForm.miedo.value = monstruoSeleccionado.miedo;
        monsterForm.tipo.value = monstruoSeleccionado.tipo;
        const habilidadesSeleccionadas = monstruoSeleccionado.habilidades;
        const checkboxesHabilidades = document.getElementsByName('habilidades');

        checkboxesHabilidades.forEach(checkbox =>
        {
          if (habilidadesSeleccionadas.includes(checkbox.value))
          {
            checkbox.checked = true;
          } 
          else
          {
            checkbox.checked = false;
          }
        });
        document.getElementById('nombre').disabled = true;
        document.getElementById('alias').disabled = true;

      } else {
        console.log('Monstruo no encontrado');
      }
    }
  });

  eliminarBtn.addEventListener('click', function() {
    eliminarMonstruo();
    document.getElementById('nombre').disabled = false;
    document.getElementById('alias').disabled = false;
  });

  function eliminarMonstruo() {
    spinner.style.display = 'block';
    monstruosGuardados.forEach((monstruo, index) => {
      if (
        monstruo.nombre === monsterForm.nombre.value &&
        monstruo.alias === monsterForm.alias.value &&
        monstruo.defensa === monsterForm.defensa.value &&
        monstruo.miedo === monsterForm.miedo.value &&
        monstruo.tipo === monsterForm.tipo.value
      ) {
        monstruosGuardados.splice(index, 1);
      }
    });

    localStorage.setItem('monstruos', JSON.stringify(monstruosGuardados));
    setTimeout(() => {
      llenarTablaMonstruos(monstruosGuardados);
      spinner.style.display = 'none';
      window.confirm('Eliminado correctamente');
      monsterForm.reset();
    }, 2000);
  }

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
  
  function obtenerHabilidadesSelecionadas()
  {
    const $opcionesHabilidades = document.getElementsByName("habilidades");
    let habilidades = [];
    $opcionesHabilidades.forEach((element) => {
      if (element.checked) {
        console.log(element.value);
        habilidades.push(element.value);
      }
    });
    return habilidades;
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
        console.log(columnaHabilidades.textContent);

        fila.appendChild(columnaNombre);
        fila.appendChild(columnaAlias);
        fila.appendChild(columnaDefensa);
        fila.appendChild(columnaMiedo);
        fila.appendChild(columnaTipo);
        fila.appendChild(columnaHabilidades);

        tbody.appendChild(fila);
      }
    });
  }
});



  