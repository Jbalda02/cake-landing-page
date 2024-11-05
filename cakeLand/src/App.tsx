import NavBar from "./componentes/pageComponents/Navbar";
import Footer from "./componentes/pageComponents/Footer";
import cakeHero from "./assets/cakeHero.jpg";
import List from "./componentes/pageComponents/List";
import { useEffect, useState } from "react";
import { Product } from "./types";
import { getProductsByStarred } from "./services/userQueries";
import { useNavigate } from "react-router-dom";
function Main() {
  const navigate = useNavigate();
  const [starredProducts, setStarredProducts] = useState<Product[]>([])
  useEffect(() => {
    const fetchProducts = async () =>{
      const products = await fetchStarred(true)
      setStarredProducts(products);
      console.log("Starred Products:", products); 
  }
  fetchProducts();
},[])

const fetchStarred = async (starred:boolean) =>{
    const tmp = await getProductsByStarred(starred);
    const productos: Product[] = tmp.map((item: any) => ({
      id: item.id,
      name: item.name,
      descripcion: item.descripcion,
      precio: item.precio,
      imgurl: item.imgurl,
      alergenos: item.alergenos,
      disponible: item.disponible,
      ingredientes: item.ingredientes,
      numPorciones: item.numPorciones,
      starred: item.starred,
      type: item.type,
    }));
    return productos;
  

}
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
                <List products={starredProducts}></List>
            </div>
        </div>
        <div className="bg-purple-900 min-h-32 justify-center align-middle flex">
          <div className="cursor-pointer hover:bg-purple-800 max-h-20 rounded-xl bg-purple-600 max-w-52 px-5 py-5 text-white text-center">
            <p onClick={() => navigate('/products')}> Menu Completo</p>
            </div>
          </div>
      </div>
      <Footer />
    </div>
  );
}

export default Main;
