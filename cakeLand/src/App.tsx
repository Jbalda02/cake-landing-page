import NavBar from "./componentes/pageComponents/Navbar";

function Main() {
  return (
    <div className="flex flex-col justify-between h-full w-full gap-20 bg-white-background">
      <NavBar />
      <h1 className="text-3xl font-bold underline">Cake Sell Page</h1>
      <p>Promos</p>
      <p>Productos</p>
      <p>Reserva compra o contacto</p>
    </div>
  );
}

export default Main;