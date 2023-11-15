class Personaje
{
    constructor(id, nombre, tipo)
    {
        this.id = id;
        this.nombre = nombre; 
        this.tipo = tipo;
    }
}


spinner.style.display = 'none';


setTimeout(() => {
    llenarTablaMonstruos(monstruosGuardados);
    spinner.style.display = 'none';
  }, 2000);
