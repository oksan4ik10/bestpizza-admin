import { useRef, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'

import { dataProducts } from '../ProductsPageMain/ProductsPage';

import CreateHead from '../../../components/CreateHead/CreateHead';
import ProductForm from '../../../components/ProductForm/ProductForm';
import { IProduct } from '../../../models/type';

interface IProps {
    edit: boolean;
    nameFunc: string;
}
function ProductsShowEdit(props: IProps) {
    const { id } = useParams();
    const { edit, nameFunc } = props;
    const [data, setData] = useState<IProduct>()



    const btnSubmitRef = useRef<HTMLInputElement>(null)
    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }
    useEffect(() => {
        setData(dataProducts.find((item) => item.id === id))
    }, [])


    return (
        <>
            <CreateHead title="Карточка товара" redirect={false} nameFunc={nameFunc} saveFunc={clickSave} namePage="products" />
            {data && <ProductForm sendFormFilters={sendFormFilters} data={data} edit={edit} refBtn={btnSubmitRef} id={id} ></ProductForm>}
        </>
    )
}

export default ProductsShowEdit