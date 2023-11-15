const tablaMonstruos = document.getElementById('tablaMonstruos');
const monsterForm = document.getElementById("monsterForm");
const monstruosGuardados = JSON.parse(localStorage.getItem('monstruos')) || [];

document.addEventListener('DOMContentLoaded', function () 
{
    llenarCardsMonstruos(monstruosGuardados);    
});


function llenarCardsMonstruos(monstruos)
{
    const contenedorMonstruos = document.getElementById('contenedorMonstruos');
    
    while (contenedorMonstruos.hasChildNodes()) {
        contenedorMonstruos.removeChild(contenedorMonstruos.firstChild);
    }

    monstruos.forEach(monstruo => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.onclick = function () {
            mostrarDetallesMonstruo(monstruo.nombre, monstruo.alias, monstruo.defensa, monstruo.miedo, monstruo.tipo);
        };

        const cardContent = document.createElement('div');
        cardContent.classList.add('card-content');

        const nombreMonstruo = document.createElement('h3');
        nombreMonstruo.textContent = monstruo.nombre;

        const aliasMonstruo = document.createElement('p');
        aliasMonstruo.classList.add('monster-details');
        aliasMonstruo.textContent = `Alias: ${monstruo.alias}`;

        const defensaMonstruo = document.createElement('p');
        defensaMonstruo.classList.add('monster-details');
        defensaMonstruo.textContent = `Defensa: ${monstruo.defensa}`;

        const miedoMonstruo = document.createElement('p');
        miedoMonstruo.classList.add('monster-details');
        miedoMonstruo.textContent = `Miedo: ${monstruo.miedo}`;

        const tipoMonstruo = document.createElement('p');
        tipoMonstruo.classList.add('monster-details');
        tipoMonstruo.textContent = `Tipo: ${monstruo.tipo}`;

        cardContent.appendChild(nombreMonstruo);
        cardContent.appendChild(aliasMonstruo);
        cardContent.appendChild(defensaMonstruo);
        cardContent.appendChild(miedoMonstruo);
        cardContent.appendChild(tipoMonstruo);

        card.appendChild(cardContent);
        contenedorMonstruos.appendChild(card);
    });
}