import { useEffect, useRef, useState } from 'react';
import { useParams } from 'react-router-dom'
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../../firebase';

import CreateHead from '../../../components/CreateHead/CreateHead';
import OrderForm from '../../../components/OrderForm/OrderForm';
import { IOrder } from '../../../models/type';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function OrdersShowEdit(props: IProps) {
    const { id } = useParams();

    const { edit, nameFunc } = props;

    const [data, setData] = useState<IOrder>()

    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const [sendFormFilters, setSendFormFilters] = useState(false);
    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }

    const [isLoading, setIsLoading] = useState(true);

    const getData = async () => {
        if (!id) return
        const docRef = doc(db, "orders", id);
        const infoOrder = await getDoc(docRef);
        if (!infoOrder.exists()) {
            throw new Error("Not data")
        }
        setData(infoOrder.data() as IOrder)
        setIsLoading(false)
    }
    useEffect(() => {
        getData()
    }, [])

    return (
        <>
            <CreateHead title="Карточка заказа" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="orders" />
            {isLoading && <h2>Загрузка данных</h2>}
            {data && !isLoading && <OrderForm sendFormFilters={sendFormFilters} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></OrderForm>}
        </>
    )
}


export default OrdersShowEdit