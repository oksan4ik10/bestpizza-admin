/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ClampLines from 'react-clamp-lines'

import moment from "moment";
import styles from "./TablePage.module.css";



import { useMatchMedia } from "../../hooks/use-match-media";
import { IOrder, IProduct } from "../../models/type";
import Pages from "../PagesHead/PagesHead";

import { statusOrder } from "../../models/type";
import { statusOrderColor } from "../../models/type";

import TitleProduct from "../TitleProduct/TitleProduct";


import ModalDeleteProduct from "../ModalDeleteProduct/ModalDeleteProduct";
import { disablePageScroll, enablePageScroll } from 'scroll-lock';




type TSortingState = "asc" | "desc" | "none"
interface IColumns {
    nameColumn: string,
    stateSort: TSortingState,
    nameResponse: string
}

interface ITable {
    nameColumns: {
        nameColumn: string,
        nameResponse: string
    }[],
    countRow: number,
    title: string
}

interface ITables {
    products: ITable,
    orders: ITable
}



const dataTables: ITables = {
    products: {
        title: "Товары",
        nameColumns: [{ nameColumn: "Наименование", nameResponse: "name" }, { nameColumn: "Описание", nameResponse: "description" }, { nameColumn: "Стоимость", nameResponse: "price" }],
        countRow: 4,

    },
    orders: {
        title: "Заказы",
        nameColumns: [{ nameColumn: "№ заказа", nameResponse: "number" }, { nameColumn: "Дата и время", nameResponse: "date_placed" }, { nameColumn: "Статус", nameResponse: "status" }, { nameColumn: "ID Клиента", nameResponse: "user" }, { nameColumn: "Сумма", nameResponse: "total" }],
        countRow: 4,

    },

}

export interface IDataFilter {
    [key: string]: any,
}

type TNameTable = "products" | "orders"
interface IStyle { [key: string]: string }
interface IProps {
    nameTable: TNameTable,
    orders?: IOrder[],
    products?: IProduct[],
    lengthRow: number,
    style: IStyle,
}

function TablePage(props: IProps) {
    const { nameTable, orders, style, lengthRow, products } = props;
    const [arrRowActive, setArrRowActive] = useState<boolean[]>(Array(lengthRow).fill(false));
    const [nameColumns, setNameColumns] = useState<IColumns[]>([]);



    useEffect(() => {

        setArrRowActive(Array(lengthRow).fill(false))
        setNameColumns(dataTables[nameTable].nameColumns.map((item) => {

            return {
                nameColumn: item.nameColumn,
                nameResponse: item.nameResponse,
                stateSort: "none"
            }
        }))

    }, [lengthRow])


    const { isMobile } = useMatchMedia();
    const hasScroll = !isMobile && lengthRow > dataTables[nameTable].countRow;



    const clickRow = (id: number) => {
        if (arrRowActive)
            setArrRowActive(arrRowActive.map((_, index) => {
                if (index === id) return true;
                return false
            }));
    }
    const clickTable = (e: React.MouseEvent<HTMLElement>) => {
        const target = e.target as HTMLElement;
        if (target.closest(".row") && (!target.closest(".row__title"))) return;
        setArrRowActive(arrRowActive.map(() => false));

    }



    const [idDelProduct, setIdDelProduct] = useState<number>();
    const clickDel = (id: number) => {
        setIdDelProduct(id);
        disablePageScroll();
    }

    const closeModal = () => {
        setIdDelProduct(undefined);
        enablePageScroll()
    }



    return (
        <div onClick={clickTable} className={styles.table}>
            {idDelProduct && <ModalDeleteProduct id={idDelProduct} closeModal={closeModal}></ModalDeleteProduct>}
            <Pages title={dataTables[nameTable].title} />
            <div className={styles.head__table}>
                <div>
                    {(products) && <Link to={`/${nameTable}/create`} className={"btn__head btn__active " + styles.btn}>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M19 12.998H13V18.998H11V12.998H5V10.998H11V4.99805H13V10.998H19V12.998Z" fill="white" />
                        </svg>
                        <span>Добавить</span>
                    </Link>}
                </div>

            </div>

            <div className="page__tables">
                <div className="page__panel">

                    <div className="filters"></div>
                </div>

                <div className="tables">
                    <div className={"row row__title " + style.row}>
                        {nameColumns && nameColumns.map((item, index) => {
                            return <div className={"col__title " + (item.stateSort === "asc" ? "desc" : "") + " " + (item.stateSort === "none" ? "" : "active")} key={index} >

                                {item.nameColumn}
                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M2 12V10.6667H6V12H2ZM2 8.66667V7.33333H10V8.66667H2ZM2 5.33333V4H14V5.33333H2Z" />
                                </svg>

                            </div>

                        })}
                        <div className="col__title"></div>
                    </div>
                    <div style={{ height: hasScroll ? '60vh' : 'auto', minHeight: '80%', paddingRight: "20px" }} className="tables__wrapper scroll__elem">


                        {products && products.length > 0 && products.map((item, index) => {
                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <TitleProduct active={arrRowActive[index]} categories={item.id} images={item.image} title={item.name} ></TitleProduct>
                                <div className={"col " + style.col + " " + style.col__desc}>
                                    <ClampLines text={item.description ? item.description.replace(/<\/?[a-zA-Z]+>/gi, '') : "(пусто)"} lines={3} ellipsis="" id="custom" buttons={false} />
                                </div>

                                <div className={"col " + style.col + " " + style.col__count}>

                                    {(+item.price).toFixed(2).toLocaleString() + " ₽"}
                                </div>
                                <div className={"col " + style.col}>
                                    <Link to={`/products/${item.id}`} className="btn btn__table">
                                        Перейти
                                    </Link>
                                    <button onClick={() => clickDel(index)} className="btn btn__table btn__error">
                                        Удалить
                                    </button>
                                </div>
                            </div>
                        })}

                        {orders && orders.length > 0 && orders.map((item, index) => {

                            return <div className={"row " + style.row} onClick={() => clickRow(index)} key={item.id}>
                                <div className={"row__bg " + ((arrRowActive && arrRowActive[index]) ? "active" : "")}></div>
                                <div className={"col " + style.col}>{item.id}</div>
                                <div className={"col " + style.col}>

                                    {item.date && <>
                                        <span>{moment.unix(item.date as any).format("DD.MM")}.2024</span>
                                        <span>{moment((item.date as any) * 1000).format("HH:mm")}</span>
                                    </>
                                    }
                                    {!item.date && <>
                                        <span>{moment(new Date()).format("DD.MM.YYYY")}</span>
                                        <span>{moment(new Date()).format("HH:mm")}</span>
                                    </>
                                    }

                                </div>

                                <div className={"col " + style.col} style={{ background: statusOrderColor[item.status.toUpperCase()] }}>{statusOrder[item.status.toUpperCase()]}</div>
                                <div className={"col " + style.col}>{item.uid}</div>
                                <div className={"col " + style.col}>{(item.totalPrice ? item.totalPrice : 1970) + " ₽"}</div>
                                <div className={"col " + style.col}>
                                    <Link to={`/orders/${item.id}`} className="btn btn__table">
                                        Перейти
                                    </Link>

                                </div>
                            </div>

                        })}
                    </div>
                </div>
            </div >



        </div>
    )
}

export default TablePage