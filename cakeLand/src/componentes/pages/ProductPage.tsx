import NavBar from "../pageComponents/Navbar";
import Footer from "../pageComponents/Footer";
import List from "../pageComponents/List";
import { useEffect, useState } from "react";
import { getProductsByType } from "../../services/userQueries";
import { Product } from "../../types";
function Productos() {
  const [tortas, setTortas] = useState<Product[]>([]);
  const [pies, setPies] = useState<Product[]>([]);
  const [frios, setFrios] = useState<Product[]>([]);
  const [otros, setOtros] = useState<Product[]>([]);

    useEffect(() => {
      const fetchProducts = async () =>{
         setTortas( await fetchProductsbyType('torta'))
         setPies( await fetchProductsbyType('pie'))
         setFrios( await fetchProductsbyType('frio'))
         setOtros( await fetchProductsbyType('otro'))
    }
    fetchProducts();
    console.log(tortas)
  }, []);

    const fetchProductsbyType = async (type:string) =>{
      const tmp = await getProductsByType(type);
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
    <div className="flex flex-col min-h-screen">
      <NavBar></NavBar>

      <div className="flex-grow">
        <h1 className="text-center mt-6 mb-6 font-playwrite text-3xl">Tortas</h1>
        <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
          <List products={tortas}></List>
        </ul>
      </div>

      <div className="flex-grow">
        <h1 className="text-center mt-6 mb-6 font-playwrite text-3xl">Pies</h1>
        <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
          <List products={pies}></List>
        </ul>
      </div>

      <div className="flex-grow">
        <h1 className="text-center mt-6 mb-6 font-playwrite text-3xl">Frios</h1>
        <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
          <List products={frios}></List>
        </ul>
      </div>

      <div className="flex-grow">
        <h1 className="text-center mt-6 mb-6 font-playwrite text-3xl">Otros</h1>
        <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
          <List products={otros}></List>
        </ul>
      </div>

      <Footer></Footer>
    </div>
  );
}

export default Productos;
