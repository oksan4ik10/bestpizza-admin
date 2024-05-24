/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import "./Form.css"
import style from "./ProductForm.module.css"
import dataCategories from "../../assets/db/partners.json"


import urlFileImg from "../../assets/images/default-create.png"
import urlIconGeneral from "../../assets/images/genetalIcon.svg"

import urlIconDesc from "../../assets/images/descIcon.svg"

import { IProduct } from "../../models/type";

import Filter from "../Filter/Filter";


interface IProps {
    edit: boolean,
    data?: IProduct
    id?: string | null,
    refBtn: any,
    funcRequest?: any,
    sendFormFilters: boolean
}



function ProductForm(props: IProps) {
    const { edit, data, refBtn, funcRequest, sendFormFilters, id } = props;


    const { register, handleSubmit, formState: { errors } } = useForm<any>({
        defaultValues: {
            title: (data && data.name) ? data.name : edit ? "" : "Не заполнено",
            price: (data && data.price) ? data.price : edit ? "" : "Не заполнено",

        }
    })


    const partner = ["pp", "tn", "fb", "pl", "gl", "pb"]



    const dataArea: any = {
        category: id ? dataCategories[partner.findIndex((item) => id.slice(0, 2) === item)].name : "",
        price: (data?.price) ? edit ? data.price : data.price + "₽" : "",

        desc: (data?.description) ? data.description : edit ? "" : "Не заполнено",



    }



    const filterCategory = {
        title: dataArea.category ? dataArea.category : "Выберите категорию",
        nameFilter: "category",
        category: dataCategories.map((item) => item.name)
    }





    const [valuesFilter, setValuesFilter] = useState({
        category: dataArea.category ? dataArea.category : "",
    })






    const setParamsFilter = (key: string, value: string) => {
        const obj: any = Object.assign({}, valuesFilter)
        obj[key] = value ? value : dataArea[key];
        setValuesFilter(obj)
    }

    const [desc, setDesc] = useState((data && data.description) ? data.description.replace(/<\/?[a-zA-Z]+>/gi, '') : "");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }


    const inputFile = useRef<HTMLInputElement>(null);

    const [fileInfo, setFileInfo] = useState<File>();

    const [uploadFile, setUploadFile] = useState<string>();
    const [errorFile, setErrorFile] = useState("");


    const addFakeFile = () => {

        if (inputFile.current) inputFile.current.click();
    }
    const fileChange = (e: React.ChangeEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement;
        const files = (target.files) ? target.files[0] : "";
        if (files) {
            if (!/\.(jpe?g|png|gif)$/i.test(files.name)) {
                setErrorFile("Неверный формат");
                return
            }
            setErrorFile("");
            setFileInfo(files)
            const reader = new FileReader();
            reader.addEventListener("load", function () {

                setUploadFile(this.result as string);
            });

            reader.readAsDataURL(files);
        }
    }



    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        if (errorFile) return
        if (!valuesFilter.category) return

        const formData = new FormData();


        if (desc) formData.append("description", desc);
        const arrAttr: any[] = [];
        for (const key in dataParam) {
            if (key[0] === "A") {
                arrAttr.push({
                    code: key.slice(1),
                    value: dataParam[key]
                })
                continue
            }

            if (dataParam[key]) formData.append(key, dataParam[key] as any)
        }
        if (fileInfo) formData.append("image", fileInfo);

        if (formData.get("old_price")) {
            const price = formData.get("price");
            const newPrice = formData.get("old_price");
            formData.set("old_price", price as any)
            formData.set("price", newPrice as any)
        }


        formData.append("attributes", JSON.stringify(arrAttr))
        formData.append("categories", valuesFilter.category);


        if (!id) {

            try {
                if (funcRequest) {
                    const data = await funcRequest({ body: formData });
                    if (data.error) return
                    navigate(`/products`)
                }
            }
            catch {
                navigate(`/404`)

            }
        } else {

            try {
                if (funcRequest && data) {


                    const dataRequest = await funcRequest({ id: data.id, body: formData });
                    if (dataRequest.error) return
                    navigate(`/products`)
                }
            } catch {
                navigate(`/404`)

            }

        }
    }
    return (
        <>
            <form className={'form ' + (edit ? "" : "show") + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head " + style.form__head}>
                    <div className="form__file">
                        <div onClick={addFakeFile} className="form__addFile">
                            <img src={(uploadFile && !errorFile) ? uploadFile : (!data || !data.image) ? urlFileImg : data.image} alt="addFile" />
                            {errorFile && <span className="form__error">{errorFile}</span>}
                        </div>
                        <input accept="image/png, image/jpeg" type="file" {...register("image")} id="" ref={inputFile} onChange={fileChange} />

                    </div>
                    <label className="form__name form__label">
                        {edit && <span>Название</span>}
                        <input placeholder="Заполните название" type="text"  {...register("title", { validate: (value) => ((value.length > 2) && (value.length < 30)), disabled: edit ? false : true })} />
                        {errors.title && <span className="form__error">Длина строки от 3 до 30 символов</span>}
                    </label>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>

                    <div className={"form__label" + " " + (valuesFilter.category ? "value" : "")}>
                        <span>Категория</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.category}</span>}
                        {edit && <Filter data={filterCategory as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.category && <span className="form__error">Выберите категорию</span>}
                    </div>


                    <div className={"form__label " + style.form__price}>
                        <span>Стоимость</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("price", {
                            validate: (value) => ((value > 10) && ((value <= 100000))), disabled: edit ? false : true
                        }
                        )} />}
                        {errors.price && <span className="form__error">Введите стоимость от 10 ₽ до 100 000 ₽ </span>}
                    </div>

                </div>

                <div className={"form__desc " + style.form__desc}>
                    <h3 className="form__title"> <img src={urlIconDesc} alt="desc" />Описание</h3>
                    <div className="form__textarea">
                        <label className="form__label">
                            <span>Общее описание товара</span>
                            {edit && <textarea name="description" onChange={changeDesc} id="" cols={30} rows={3} value={desc}></textarea>}
                            {!edit && <textarea disabled name="description" value={desc ? desc : "Не заполнено"} onChange={changeDesc} id="" cols={30} rows={3}></textarea>}
                        </label>
                    </div>
                    <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />
                </div>

            </form>
        </>
    )
}

export default ProductForm