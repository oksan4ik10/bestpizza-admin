
import { useEffect, useState } from "react";
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../../firebase";

import { IOrder } from "../../../models/type";
import style from "./OrdersPage.module.css";

import TablePage from "../../../components/TablePage/TablePage";



function OrdersPage() {

    const [data, setData] = useState<IOrder[]>([])
    const getData = async () => {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const orders = querySnapshot.docs.map((d) => ({ id: d.id, ...d.data() })) as IOrder[];
        setData(orders)
    }
    useEffect(() => {
        getData()
    }, [])



    return (data.length > 0) && <TablePage style={style} nameTable="orders" orders={data} lengthRow={data.length}></TablePage>

}

export default OrdersPage