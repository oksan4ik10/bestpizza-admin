import ClampLines from "react-clamp-lines";
import { useNavigate } from "react-router-dom";
import style from "./TitleProducts.module.css"

import dataCategories from "../../assets/db/partners.json"



interface IProps {
    id?: number
    images: string;
    className?: string,
    active: boolean,
    categories: string,
    title: string,
}

function TitleProduct(props: IProps) {
    const { images, active, categories, title, id, className } = props;

    const partner = ["pp", "tn", "fb", "pl", "gl", "pb"]

    const navigate = useNavigate()
    const clickProduct = () => {
        if (id) {
            navigate(`products/${id}`)
        }
    }
    const indexDataCat = partner.findIndex((item) => categories.slice(0, 2) === item);
    return (
        <div onClick={clickProduct} className={"col " + className + " " + style.col + " " + (images.length === 0 ? style.default : (images.length > 1 && active) ? style.active : "")}>
            <div className={style.col__images}>
                <img src={images} alt="img" />
                {images.length > 1 && <div className={style.count_img}><span>+{images.length - 1}</span></div>}
            </div>
            <div className={style.titles}>
                <ClampLines text={title} lines={2} className={style.title} ellipsis="" id="custom" buttons={false} />
                <p className={style.category}>{indexDataCat === -1 ? "Без категории" : dataCategories[indexDataCat].name}</p>
            </div>
        </div>
    );
}

export default TitleProduct;