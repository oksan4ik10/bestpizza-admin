

import style from "./ProductsPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import dataFood from "../../../assets/db/food-band.json"
import dataGusi from "../../../assets/db/gusi-lebedi.json"
import dataPalki from "../../../assets/db/palki-skalki.json"
import dataPizzaBurger from "../../../assets/db/pizza-burger.json"
import dataPizzaPlus from "../../../assets/db/pizza-plus.json"
import dataTanuki from "../../../assets/db/tanuki.json"

export const dataProducts = [...dataPizzaPlus, ...dataTanuki, ...dataFood, ...dataPalki, ...dataGusi, ...dataPizzaBurger];

function ProductsPage() {



    return (
        <TablePage style={style} nameTable="products" products={dataProducts} lengthRow={dataProducts.length}></TablePage>)
}

export default ProductsPage