import { useRef, useState } from "react";
import CreateHead from "../../../components/CreateHead/CreateHead";
import ProductForm from "../../../components/ProductForm/ProductForm";


interface IProps {
    edit: boolean
}

function ProductsCreate(props: IProps) {
    const { edit } = props;
    const btnSubmitRef = useRef<HTMLInputElement>(null);

    const [sendFormFilters, setSendFormFilters] = useState(false);

    const clickSave = () => {
        if (btnSubmitRef.current) { btnSubmitRef.current.click() }
        setSendFormFilters(true)
    }


    return (
        <>
            <CreateHead redirect={false} title={"Карточка товара"} nameFunc="save" namePage="products" saveFunc={clickSave} />
            <ProductForm sendFormFilters={sendFormFilters} edit={edit} funcRequest={console.log} refBtn={btnSubmitRef}></ProductForm>


        </>
    )
}
export default ProductsCreate