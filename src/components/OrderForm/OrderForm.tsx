/* eslint-disable @typescript-eslint/no-explicit-any */
import moment from "moment";
import { useEffect, useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore";

import style from "./OrderForm.module.css"

import urlIconClient from "../../assets/images/clientIcon.svg"
import urlIconDelivery from "../../assets/images/deliveryIcon.svg"
import urlIconComment from "../../assets/images/commentIcon.svg"
import urlIconCart from "../../assets/images/cartIcon.svg"
import urlIconPay from "../../assets/images/payIcon.svg"
import { IOrder } from "../../models/type";

import TitleProduct from "../TitleProduct/TitleProduct";
import Filter from "../Filter/Filter";

import { statusOrder } from "../../models/type";




interface IProps {
    edit: boolean,
    data: IOrder,
    id?: string | null,
    refBtn: any,
    sendFormFilters: boolean
}



function OrderForm(props: IProps) {
    const { edit, data, id, refBtn } = props;
    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            address: data.address ? data.address : "Не заполнено",

        }
    })




    const navigate = useNavigate();
    const onSubmit: SubmitHandler<any> = async (dataParam) => {

        const obj: any = {};
        for (const key in dataParam) {
            if (dataParam[key]) obj[key]
                = dataParam[key]
        }
        obj["decsription"] = desc;

        obj["status"] = valueFilter;



        try {
            if (id) {
                const docRef = doc(db, "orders", id);
                await setDoc(docRef, obj, { merge: true });
                // const data = await funcRequest({ id: id, body: formData })
                navigate(`/`)
            }
        } catch (err) {
            navigate(`/404`)

        }

    }
    const [desc, setDesc] = useState(data.comment ? data.comment : edit ? "" : "(пусто)");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }

    function declOfNum(number: number) {
        const titles = ["товар", "товара", "товаров"]
        const cases = [2, 0, 1, 1, 1, 2];
        return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
    }


    const refHead = useRef<HTMLDivElement>(null);
    const refClient = useRef<HTMLDivElement>(null);
    const refDelivery = useRef<HTMLDivElement>(null);
    const refOrder = useRef<HTMLDivElement>(null);
    const [isScroll, setIsScroll] = useState(false);
    useEffect(() => {
        let height = 0;
        if (refHead.current) {
            height += refHead.current.clientHeight
        }
        if (refClient.current) height += refClient.current.clientHeight
        if (refDelivery.current) height += refDelivery.current.clientHeight
        if (refOrder.current && (refOrder.current.clientHeight > height)) {

            refOrder.current.style.height = height + "px"; setIsScroll(true)
        }


    }, [])


    const [valueFilter, setValueFilter] = useState(data.status);
    const setParamsFilter = (_: string, value: string) => {
        setValueFilter(value ? value : data.status)


    }
    const [statusFilter, setStatusFilter] = useState<any[]>([]);
    const filterStatus = {
        title: data.status ? statusOrder[data.status.toUpperCase()] : "",
        nameFilter: "status",
        status: statusFilter,
        id: true
    }
    useEffect(() => {
        const arr = [];
        for (const key in statusOrder) {
            const newObj = {
                name: statusOrder[key],
                id: key
            }
            arr.push(newObj);

        }
        setStatusFilter(arr)
    }, [])





    return (
        <>
            <form className={'form ' + (edit ? "" : "show") + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head" + " " + style.form__head} ref={refHead}>
                    <div className={"form__name " + style.form__name}>
                        <div className={style.form__orderTitle}>
                            <p>Номер заказа: </p>
                            <p>{data.id}</p>

                        </div>
                        {data && data.date && <span>Дата заказа: {moment((data.date as any) * 1000).format("DD.MM")}.2024</span>}

                    </div>
                    {!edit && <div className={style.status}>
                        {filterStatus.title}
                    </div>}
                    {edit && <Filter data={filterStatus as any} setParamsFilter={setParamsFilter}></Filter>}
                </div>
                <div className={style.form__client} ref={refClient}>
                    <h3 className="form__title"><img src={urlIconClient} alt="desc" />О клиенте</h3>

                    <label className="form__label">
                        <span>Имя</span>
                        <input defaultValue={`${data.name}`} type="text" disabled />
                    </label>
                    <label className="form__label">
                        <span>Телефон</span>
                        <input defaultValue={data.phone} type="text" disabled />
                    </label>


                </div>
                <div className={style.form__delivery} ref={refDelivery}>
                    <h3 className="form__title"><img src={urlIconDelivery} alt="desc" />Доставка</h3>


                    <label className="form__label">
                        <span>Адрес</span>
                        <input placeholder="Заполните адрес клиента" type="text"  {...register("address", { validate: (value) => ((value.length > 10) && (value.length < 150)), disabled: edit ? false : true })} />

                        {errors.line1 && <span className="form__error">Длина строки от 10 до 150 символов</span>}
                    </label>



                </div>
                <div className={"form__desc" + " " + style.form__comment}>
                    <h3 className="form__title"> <img src={urlIconComment} alt="desc" />Комментарии</h3>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Комментарии к заказу</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={3} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc} onChange={changeDesc} id="" cols={30} rows={3}></textarea>}
                        </label>
                    </div>

                </div>
                <div className={style.form__pay}>
                    <h3 className="form__title"><img src={urlIconPay} alt="pay" />Оплата</h3>
                    <label className="form__label">
                        <span>{data.totalPrice} ₽</span>
                        <input defaultValue={`${data.order.length} ${declOfNum(data.order.length)}`} type="text" disabled />
                    </label>
                    <label className="form__label">
                        <span>Способ оплаты</span>
                        <input defaultValue={data.pay === "card" ? "Картой курьеру" : "Наличными"} type="text" disabled />
                    </label>
                </div>
                <div className={style.form__cart + " "}>
                    <h3 className="form__title"><img src={urlIconCart} alt="cart" />Детали заказа</h3>
                    <div className={style.order + " " + (isScroll ? "scroll__elem" : "")} ref={refOrder}>

                        {data.order.map((item, index) => <div key={index} className={style.infoOrder}>

                            <TitleProduct active={true} categories={item.id} images={item.img} title={item.name} ></TitleProduct>



                            <div className={style.infoCount}>
                                <span>x {item.count} </span>
                                <span>{item.price} ₽ / шт.</span>
                            </div>
                        </div>
                        )}


                    </div>

                </div>
                <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />

            </form>
        </>
    )
}

export default OrderForm