/* eslint-disable @typescript-eslint/no-explicit-any */
import { useRef, useState, useEffect } from "react"
import { useForm, SubmitHandler } from "react-hook-form"
import { useNavigate } from "react-router-dom";

import "./Form.css"
import style from "./ProductForm.module.css"


import urlFileImg from "../../assets/images/default-create.png"
import urlIconGeneral from "../../assets/images/genetalIcon.svg"
import urlIconPhoto from "../../assets/images/photoIcon.svg"
import urlIconDesc from "../../assets/images/descIcon.svg"
import urlFileShowImg from "../../assets/images/default-show.png"
import { IProduct } from "../../models/type";

import { davDamerAPI } from "../../store/api/DavdamerAPI";
import Filter from "../Filter/Filter";

import ErrorPages from "../../pages/Error/ErrorPages";

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

    const inputFiles = useRef<HTMLInputElement>(null);

    const [filesInfo, setFilesInfo] = useState<any[]>([]);

    const [uploadFiles, setUploadFiles] = useState<string[]>([]);
    const [errorFile, setErrorFile] = useState("");



    const { register, handleSubmit, formState: { errors }, getValues } = useForm<any>({
        defaultValues: {
            title: (data && data.title) ? data.title : edit ? "" : "Не заполнено",
            price: (data && data.price) ? data.price.old_price ? data.price.old_price : data.price.incl_tax : edit ? "" : "Не заполнено",
            old_price: (data && data.price.old_price) ? data.price.incl_tax : "",
            location: (data && data.location) ? data.location : edit ? "" : "Не заполнено",
            country: (data && data.country) ? data.country : edit ? "" : "Не заполнено",
            is_vegan: data?.is_vegan,
            is_sugar_free: data?.is_sugar_free,
            is_gluten_free: data?.is_gluten_free,
            is_dietary: data?.is_dietary,

        }
    })




    const { data: categories, error: errorCategory, isLoading: isCategory } = davDamerAPI.useFetchGetCategoryQuery();

    const dataArea: any = {
        categoryChildren: data?.sub_categories[0].child ? data.sub_categories[0].child.name : "",
        category: data ? data.sub_categories[0].full_name.toLocaleString() : "",
        price: (data?.price.incl_tax) ? data?.price.old_price ? data.price.old_price + " ₽" : data.price.incl_tax + " ₽" : "0,00 ₽",
        old_price: (data?.price.old_price) ? data.price.incl_tax + " ₽" : "0,00 ₽",
        desc: (data?.description) ? data.description : edit ? "" : "Не заполнено",
        measurement: (data?.price.measurement) ? data.price.measurement : "",
        country: data ? data.country : "Не заполнено",


    }

    const [idCategoryName, setIdCategoryName] = useState(data?.sub_categories[0].full_name);
    const [titleCategoryChildren, setTitleCategoryChildren] = useState(dataArea.categoryChildren)

    const filterCategory = {
        title: dataArea.category ? dataArea.category : "Выберите категорию",
        nameFilter: "category",
        category: categories ? categories.map((item) => item.full_name) : [],
    }
    const filterCategoryChildren = {
        title: titleCategoryChildren ? titleCategoryChildren : "Выберите подкатегорию",
        nameFilter: "categoryChildren",
        categoryChildren: (idCategoryName && categories) ? categories.filter((item) => item.full_name === idCategoryName)[0].children.map((item) => item.name) : []
    }


    const filterMeasurement = {
        title: data?.price.measurement ? data.price.measurement : "Выберите измерение",
        nameFilter: "measurement",
        measurement: ["100 г", "1 шт.", "1 кг"],
    }



    const [valuesFilter, setValuesFilter] = useState({
        category: dataArea.category ? dataArea.category : "",
        categoryChildren: dataArea.categoryChildren ? dataArea.categoryChildren : "",
        measurement: data?.price.measurement ? data.price.measurement : "",
    })






    const [keyCategoryChildren, setKeyCategoryChildren] = useState(0);
    const setParamsFilter = (key: string, value: string) => {
        const obj: any = Object.assign({}, valuesFilter)
        obj[key] = value ? value : dataArea[key];
        if (key === "category") {
            obj.categoryChildren = value ? "" : dataArea.categoryChildren;
            setIdCategoryName(value ? value : dataArea.category);
            setKeyCategoryChildren(Math.random())
            setTitleCategoryChildren(value ? "Выберите подкатегорию" : dataArea.categoryChildren)
        }
        if (key === "categoryChildren" && !value) {
            setKeyCategoryChildren(Math.random())
            obj.categoryChildren = obj.category === dataArea.category ? dataArea.categoryChildren : ""
            setTitleCategoryChildren(!obj.categoryChildren ? "Выберите подкатегорию" : dataArea.categoryChildren)
        }
        setValuesFilter(obj)
    }

    const [desc, setDesc] = useState((data && data.description) ? data.description.replace(/<\/?[a-zA-Z]+>/gi, '') : "");
    const changeDesc = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setDesc(e.target.value);
    }



    const addFakeFiles = () => {
        if (!edit) return;
        if (inputFiles.current) inputFiles.current.click();
    }
    const filesChange = async (e: React.ChangeEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement;
        const files: FileList | null = (target.files);
        if (files) {
            if ((uploadFiles.length + files.length) > 4) {
                setErrorFile("Выберите не более 4х файлов");
                return
            }
            setErrorFile("");
            setFilesInfo([...filesInfo, ...files])
            const fileBase64Promises = Array.from(files).map((file) => {
                const reader = new FileReader();
                reader.readAsDataURL(file);
                return new Promise((resolve, reject) => {
                    reader.onload = () => {
                        resolve(reader.result);
                    };
                    reader.onerror = () => {
                        reject(reader.error);
                    };
                });
            });
            const fileBase64Arr: any[] = await Promise.all(fileBase64Promises);
            setUploadFiles([...uploadFiles, ...fileBase64Arr])

        }

    }
    const inputFile1 = useRef<HTMLInputElement>(null);
    const inputFile2 = useRef<HTMLInputElement>(null);
    const inputFile3 = useRef<HTMLInputElement>(null);
    const inputFile4 = useRef<HTMLInputElement>(null);
    const arrRefInput = [inputFile1, inputFile2, inputFile3, inputFile4]
    const addFakeFile = (index: number) => {
        if (!edit) return;
        const ref = arrRefInput[index]

        if (ref.current) ref.current.click();

    }
    const [arrIdImg, setArrIdImg] = useState<Set<number>>(new Set())
    const fileChange = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        const target = e.target as HTMLInputElement;
        const files = (target.files) ? target.files[0] : "";
        const idImg = target.getAttribute("data-id");
        if (files) {
            if (!/\.(jpe?g|png|gif)$/i.test(files.name)) {
                setErrorFile("Неверный формат");
                return
            }
            setErrorFile("");
            setFilesInfo(filesInfo.map((item, i) => {
                if (i === index) return files as any
                return item
            }))
            const reader = new FileReader();
            reader.addEventListener("load", function () {

                setUploadFiles(uploadFiles.map((item, i) => {
                    if (i === index) return this.result as any
                    return item
                }))
            });

            reader.readAsDataURL(files);
        }
        if (idImg) {
            setArrIdImg(arrIdImg.add(+idImg))
        }

    }
    const closeFile = (e: React.MouseEvent<HTMLSpanElement>, index: number) => {
        e.stopPropagation()
        const target = e.target as HTMLElement;
        const idImg = target.getAttribute("data-id");
        if (idImg) {
            setArrIdImg(arrIdImg.add(+idImg))
        }

        setUploadFiles(uploadFiles.filter((_, i) => i !== index))
        setFilesInfo(filesInfo.filter((_, i) => i !== index))

    }
    useEffect(() => {
        if (data && data.images.length !== 0) {
            setUploadFiles(data.images.map((item) => item.original))
            setFilesInfo(data.images.map(() => undefined))
        }
    }, [data])


    const { data: attr, error: errorAttr, isLoading: isAttr } = davDamerAPI.useFetchGetAttrQuery();

    const navigate = useNavigate();

    const onSubmit: SubmitHandler<any> = async (dataParam) => {
        if (errorFile) return
        if (!valuesFilter.category || !valuesFilter.measurement || !valuesFilter.categoryChildren) return

        const formData = new FormData();

        if (filesInfo) {
            filesInfo.filter((i) => i).forEach((item) => {
                formData.append("uploaded_images", item);
            })
        }

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

        if (formData.get("old_price")) {
            const price = formData.get("price");
            const newPrice = formData.get("old_price");
            formData.set("old_price", price as any)
            formData.set("price", newPrice as any)
        }


        formData.append("attributes", JSON.stringify(arrAttr))
        formData.append("categories", [`${valuesFilter.category} > ${valuesFilter.categoryChildren}`] as any);
        formData.append("measurement ", valuesFilter.measurement as any)


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
            const arrDeleImg = Array.from(arrIdImg);
            try {
                if (funcRequest && data) {
                    formData.append("deleted_images", JSON.stringify(arrDeleImg));

                    const dataRequest = await funcRequest({ id: data.id, body: formData });
                    if (dataRequest.error) return
                    navigate(`/products`)
                }
            } catch {
                navigate(`/404`)

            }

        }
    }

    const getAttrValue = (edit: boolean, attrCode: string) => {
        if (!data && edit) return "";
        if (!data) return;
        const value = data.attributes.find((item) => item.code === attrCode)?.value;
        return value ? value : edit ? "" : "Не заполнено"
    }


    if (errorCategory || errorAttr) return <ErrorPages></ErrorPages>

    if (isCategory || isAttr) return <h2>Загрузка данных</h2>

    return (
        <>
            <form className={'form ' + (edit ? "" : "show") + " " + style.form} encType="multipart/form-data" onSubmit={handleSubmit(onSubmit)}>
                <div className={"form__head " + style.form__head}>
                    {data && !edit && <div className="form__file">
                        <div className="form__addFile">
                            <img src={(data.images.length > 0 && data.images[0].original) ? data.images[0].original : urlFileShowImg} alt="addFile" />
                            {errorFile && <span className="form__error">{errorFile}</span>}
                        </div>

                    </div>
                    }
                    <label className="form__name form__label">
                        {edit && <span>Название</span>}
                        <input placeholder="Заполните название" type="text"  {...register("title", { validate: (value) => ((value.length > 2) && (value.length < 30)), disabled: edit ? false : true })} />
                        {errors.title && <span className="form__error">Длина строки от 3 до 30 символов</span>}
                    </label>
                </div>
                <div className={style.form__general}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Общее</h3>
                    <label className="form__label">
                        <span>Страна</span>
                        <input placeholder="Заполните страну" type="text"  {...register("country", { validate: (value) => ((value.length > 2) && (value.length < 30)), disabled: edit ? false : true })} />
                        {errors.country && <span className="form__error">Длина строки от 3 до 30 символов</span>}
                    </label>
                    <div className={"form__label" + " " + (valuesFilter.category ? "value" : "")}>
                        <span>Категория</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.category}</span>}
                        {edit && <Filter data={filterCategory as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.category && <span className="form__error">Выберите категорию</span>}
                    </div>
                    {valuesFilter.category && <div key={keyCategoryChildren} className={"form__label" + " " + (valuesFilter.categoryChildren ? "value" : "")}>
                        <span>Подкатегория</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.categoryChildren ? dataArea.categoryChildren : "Не заполнено"}</span>}
                        {edit && <Filter data={filterCategoryChildren as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.categoryChildren && <span className="form__error">Выберите подкатегорию</span>}
                    </div>}

                    <div className={"form__label " + style.form__price}>
                        <span>Стоимость</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("price", {
                            validate: (value) => ((value > 10) && ((value <= 100000))), disabled: edit ? false : true
                        }
                        )} />}
                        {errors.price && <span className="form__error">Введите стоимость от 10 ₽ до 100 000 ₽ </span>}
                    </div>
                    {(edit || (data?.price.old_price)) && <div className={"form__label " + style.form__price}>
                        <span>Акционная цена</span>
                        {!edit && data && <span className={style.spanName + " "}>{dataArea.old_price}</span>}
                        {edit && <input placeholder="0.00 ₽" type="number"  {...register("old_price", {

                            validate: { count: (value) => (!value || (value > 10) && ((value <= 100000))), checkPrice: (value) => (value < +getValues("price")) }, disabled: edit ? false : true
                        }
                        )} />}

                        {errors.old_price && errors.old_price.type === "count" && <span className="form__error">Акционная цена должна быть от 10 ₽ до 100 000 ₽ </span>}
                        {errors.old_price && errors.old_price.type === "checkPrice" && <span className="form__error">Акционная цена должна быть ниже стоимости товара </span>}
                    </div>}
                    <div className={"form__label" + " " + (valuesFilter.measurement ? "value" : "")}>
                        <span>Единица измерения</span>
                        {!edit && data && <span className={style.spanName}>{dataArea.measurement}</span>}
                        {edit && <Filter data={filterMeasurement as any} setParamsFilter={setParamsFilter}></Filter>}

                        {sendFormFilters && edit && !valuesFilter.measurement && <span className="form__error">Выберите единицу измерения</span>}
                    </div>

                    <label className="form__label">
                        <span>Расположение</span>
                        <input placeholder="Заполните расположение товара" type="text"  {...register("location", { validate: (value) => ((value.length > 4) && (value.length < 150)), disabled: edit ? false : true })} />
                        {errors.location && <span className="form__error">Длина строки от 5 до 150 символов</span>}
                    </label>

                </div>
                <div className={style.form__attr}>
                    <h3 className="form__title"><img src={urlIconGeneral} alt="desc" />Характеристики</h3>
                    {attr && attr.map((item, index) => {
                        // if (item.code === "sex") return <div key={index} className={"form__label" + " " + (valuesFilter.sex ? "value" : "")}>
                        //     <span>Пол</span>
                        //     {!edit && data && <span className={style.spanName}>{sexProduct}</span>}
                        //     {edit && <Filter data={stateFilterSex as any} setParamsFilter={setParamsFilter}></Filter>}
                        //     {sendFormFilters && edit && !valuesFilter.sex && <span className="form__error">Выберите пол</span>}
                        // </div>
                        // if (item.code === "size") return <div className={"form__label " + style.form__price} key={index}>
                        //     <span>{item.name}</span>
                        //     {!edit && data && <span className={style.spanName + " "}>{getAttrValue(edit, item.code)}</span>}
                        //     {edit && <input defaultValue={getAttrValue(edit, item.code)} placeholder={item.name} type="text"  {...register("A" + item.code, {
                        //         validate: (value) => ((value.trim().length > 0) && ((value.trim().length <= 10))), disabled: edit ? false : true
                        //     }
                        //     )} />}
                        //     {errors["A" + item.code] && <span className="form__error">Длина строки от 1 до 10 символов</span>}
                        // </div>
                        return <div className={"form__label " + style.form__price} key={index}>
                            <span>{item.name}</span>
                            {!edit && data && <span className={style.spanName + " "}>{getAttrValue(edit, item.code)}</span>}
                            {edit && <input defaultValue={getAttrValue(edit, item.code)} placeholder={item.name} type="text"  {...register("A" + item.code, {
                                validate: (value) => ((value.trim().length > 2) && ((value.trim().length <= 50))), disabled: edit ? false : true
                            }
                            )} />}
                            {errors["A" + item.code] && <span className="form__error">Длина строки от 3 до 50 символов</span>}
                        </div>
                    })}

                    <div className={style.form__check}>
                        <label className={"form__label label__check"}>
                            <input type="checkbox" {...register("is_vegan", { disabled: edit ? false : true })} />
                            <span>Для вегетарианцев</span>
                        </label>
                        <label className={"form__label label__check"}>
                            <input type="checkbox" {...register("is_dietary", { disabled: edit ? false : true })} />
                            <span>Диетический</span>
                        </label>
                        <label className={"form__label label__check"}>
                            <input type="checkbox" {...register("is_sugar_free", { disabled: edit ? false : true })} />
                            <span>Без сахара</span>
                        </label>
                        <label className={"form__label label__check"}>
                            <input type="checkbox" {...register("is_gluten_free", { disabled: edit ? false : true })} />
                            <span>Без глютена</span>
                        </label>
                    </div>




                </div>

                <div className={style.form__files}>
                    <h3 className="form__title"> <img src={urlIconPhoto} alt="photoIcon" />Фото товара</h3>
                    <div className={style.form__addFile}>
                        <div className={"form__file " + style.form__fileImg}>
                            {uploadFiles.map((item, index) => {
                                return <div key={index} onClick={() => addFakeFile(index)} className={"form__addFile " + style.file}>
                                    <div className={style.wrapImg}>
                                        <img src={item} alt="" />
                                    </div>

                                    {edit && <span className="file__close" data-id={data?.images[index] ? data.images[index].id : ""} onClick={(e) => closeFile(e, index)}>X</span>}
                                    <input accept="image/png, image/jpeg" type="file" id="file" data-id={data?.images[index] ? data.images[index].id : ""} ref={arrRefInput[index]} onChange={(e) => fileChange(e, index)} />
                                </div>
                            })}
                            {(uploadFiles.length < 4) && edit &&
                                <div onClick={addFakeFiles} className={"form__addFile " + style.file}>
                                    <div className={style.wrapImg}>
                                        <img src={urlFileImg} alt="addFile" /></div>
                                    {errorFile && <span className="form__error">{errorFile}</span>}
                                    <input accept="image/png, image/jpeg" type="file" multiple id="files" ref={inputFiles} onChange={filesChange} />
                                </div>



                            }
                        </div>
                        <input type="submit" value="Отправить" className="form__submit" ref={refBtn} />

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

                </div>

            </form>
        </>
    )
}

export default ProductForm