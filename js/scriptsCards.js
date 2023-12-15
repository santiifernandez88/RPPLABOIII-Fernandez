const tablaMonstruos = document.getElementById('tablaMonstruos');
const monsterForm = document.getElementById("monsterForm");
const url = "http://localhost:3000/monstruos";
const contenedorMonstruos = document.getElementById('contenedorMonstruos');

document.addEventListener('DOMContentLoaded', function () 
{
    getFetchMonstruos(url)
    .then((data) => 
    {
        data.forEach((monster) => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.innerHTML = `
            <h2>${monster.nombre}</h2>
            <p>Alias: ${monster.alias}</p>
            <p>Tipo: ${monster.tipo}</p>
            <p>Miedo: ${monster.miedo}</p>
            <p>Defensa: ${monster.defensa}</p>
            <p>Habilidades: ${monster.habilidades}</p>
            <p>Indumentaria: ${monster.indumentaria}</p>
          `;
          contenedorMonstruos.appendChild(card);
        });
    })
    .catch((error) => 
    {
        console.error('Error al obtener los datos:', error);
    });
});

function getFetchMonstruos(url)
{
  return new Promise(async (resolve, reject) =>
  {
    try
    {
      const res = await fetch(url);
      if(!res.ok) 
      {
        console.error(`Error ${res.status}: ${res.statusText}`);
        reject(res);
      }
      const data = await res.json();
      resolve(data);
    } 
    catch(error) 
    {
      console.error(`Error: ${error}`);
      reject(error);
    }
  });
}