import { useNavigate } from "react-router-dom";
import { Product } from "../../types";

interface ListProps {
  products: Product[];
}
export default function List({ products }: ListProps) {
  const formatToDollarString = (amount:number) => {
    const formattedDollarString = new Intl.NumberFormat('en-US', {
      style: 'decimal',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount) + '$';
  
    return formattedDollarString;
  }
  const navigate = useNavigate();
  const productStyle =
    "hover:scale-105 transition-transform duration-300 bg-indigo-100 rounded-md px-4 min-h-80 min-w-64 text-center flex flex-col";
  return (
    <ul className="flex flex-row gap-4 min-w-full max-w-full flex-wrap justify-center space-around align-middle">
      {products.map((product, index) => (
        <a
        key={product.id}
          className=""
          onClick={() => {
            navigate("/");
          }}
        >
          <li className={productStyle}>
            <label className=" font-playwrite">{product.name}</label>
            <div className="min-h-0 max-h-0 min-w-full border border-purple-700"></div>
            <img
              className="max-w-48 mb-5 self-center object-fit rounded-lg mt-5 border border-purple-950"
              src={product.imgurl[0]}
            ></img>
            <label>Descripcion :</label>
            <p className="text-wrap max-w-64">{product.descripcion}</p>
            <div className="text-white justify-center align-middle mb-5 pt-2 px-9 mt-5 bg-purple-600 min-h-10 rounded-md max-w-32 self-center">
              {formatToDollarString(product.precio)}
            </div>
          </li>
        </a>
      ))}
    </ul>
  );
}
