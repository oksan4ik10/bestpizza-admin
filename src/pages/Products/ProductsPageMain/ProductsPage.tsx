

import style from "./ProductsPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";
import dataFood from "../../../assets/db/food-band.json"
import dataGusi from "../../../assets/db/gusi-lebedi.json"
import dataPalki from "../../../assets/db/palki-skalki.json"
import dataPizzaBurger from "../../../assets/db/pizza-burger.json"
import dataPizzaPlus from "../../../assets/db/pizza-plus.json"
import dataTanuki from "../../../assets/db/tanuki.json"



function ProductsPage() {

    const data = [...dataPizzaPlus, ...dataTanuki, ...dataFood, ...dataPalki, ...dataGusi, ...dataPizzaBurger];

    return (
        <TablePage style={style} nameTable="products" products={data} lengthRow={data.length}></TablePage>)
}

export default ProductsPage