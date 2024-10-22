import NavBar from "./componentes/pageComponents/Navbar";
import Footer from "./componentes/pageComponents/Footer";
import cakeTest from "./assets/vanilla-cake.jpeg";
import cakeHero from "./assets/cakeHero.jpg";
import { useNavigate } from "react-router-dom";

function Main() {
  const navigate = useNavigate();
  const productStyle =
    "hover:scale-105 transition-transform duration-300 bg-indigo-100 rounded-md px-4 min-h-80 min-w-64 text-center flex flex-col";

  const testCake = {
    title: "Pastel de Vainilla",
    description:
      "Cremoso pastel de vainilla elaborado con los mejores productos a nivel nacional ",
    price: "10.00 $",
    imgurl: [cakeTest],
  };
  const testCake2 = {
    title: "Pastel de Vainilla",
    description:
      "Cremoso pastel de vainilla elaborado con los mejores productos a nivel nacional ",
    price: "12.00 $",
    imgurl: [cakeTest],
  };
  const testCake3 = {
    title: "Pastel de Vainilla",
    description:
      "Cremoso pastel de vainilla elaborado con los mejores productos a nivel nacional ",
    price: "14.00 $",
    imgurl: [cakeTest],
  };
  const testCake4 = {
    title: "Pastel de Vainilla",
    description:
      "Cremoso pastel de vainilla elaborado con los mejores productos a nivel nacional ",
    price: "16.00 $",
    imgurl: [cakeTest],
  };
  const products = [testCake, testCake2, testCake3, testCake4];

  return (
    <div className="flex flex-grow flex-col justify-between h-full w-full gap-0 bg-white-background">
      <NavBar />
      {/** Hero Section */}
      <div className="relative flex flex-col">
        <div
          className="flex flex-col justify-center items-start w-full bg-cover bg-center"
          style={{ backgroundImage: `url(${cakeHero})`, height: 600 }}
        >
          <div className="ml-auto max-w-md mr-8 text-right">
            <h1 className="text-5xl font-bold text-gray-700 mb-4">
              Nene Cakes
            </h1>
            <p className="text-lg text-gray-700 mb-6">
              Descubre nuestra selecion mas fina <br></br> de postres hechos a
              medida
            </p>
            <button className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-800 transition">
              Explore More
            </button>
          </div>
        </div>
      </div>

      <div className="text-center">
        <div className="pt-10 pb-16 bg-gradient-to-b from-purple-600 to-purple-900">
          <div className="flex-grow">
            <h1 className="text-gray-200 font-bold text-center mt-6 mb-6 font-playwrite text-3xl">
              Nuestros productos estrellas
            </h1>

            <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
              {products.map((product, index) => (
                <a
                  className=""
                  onClick={() => {
                    navigate("/");
                  }}
                >
                  <li key={index} className={productStyle}>
                    <label className=" font-playwrite">{product.title}</label>
                    <div className="min-h-0 max-h-0 min-w-full border border-purple-700"></div>
                    <img
                      className="max-w-48 mb-5 self-center object-fit rounded-lg mt-5 border border-purple-950"
                      src={product.imgurl[0]}
                    ></img>
                    <label>Descripcion :</label>
                    <p className="text-wrap max-w-64">{product.description}</p>
                    <div className="text-white justify-center align-middle mb-5 pt-2 px-9 mt-5 bg-purple-600 min-h-10 rounded-md max-w-32 self-center">
                      {product.price}
                    </div>
                  </li>
                </a>
              ))}
            </ul>
          </div>
        </div>
        <p>Promos</p>
        <p>Reserva compra o contacto</p>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
