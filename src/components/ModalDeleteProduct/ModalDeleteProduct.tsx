


import style from "./ModalDeleteProduct.module.css"

interface IProps {
    id: number;
    closeModal: () => void;
}
function ModalDeleteProduct(props: IProps) {
    const { closeModal } = props;




    const clickDelete = () => {

        closeModal();
    }


    return (
        <div className={style.modal}>
            <div className={style.modal__wrapper}>
                <p className={style.text}>Удалить товар?</p>
                <div className={style.btns}>
                    <button onClick={clickDelete} className="btn__head btn__active btn__error">Да</button>
                    <button onClick={closeModal} className="btn__head btn__cancel">Отмена</button>
                </div>
            </div>

        </div>
    );
}

export default ModalDeleteProduct;