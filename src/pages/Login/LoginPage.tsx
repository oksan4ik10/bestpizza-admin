/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from "react-hook-form"
import { getAuth, Auth, signInWithEmailAndPassword } from 'firebase/auth';
import { db } from '../../firebase';
import { doc, getDoc } from 'firebase/firestore';


import { ILoginAPI, IUser } from '../../models/type';
import { setUser } from '../../store/reducers/userReducer';

import style from "./LoginPage.module.css"


import { useAppDispatch } from '../../store/store';


const LoginPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { register, handleSubmit, formState: { errors } } = useForm<any>()
    const dispatch = useAppDispatch();




    const fromPage = location.state?.from?.pathname || '/';




    const [error, setError] = useState(false);

    const auth = getAuth();


    // !Qq345678 efimov2024@gmail.ru

    const funcSubmit = async (auth: Auth, email: string, password?: string) => {

        if (!password) return
        try {
            const authUser = await signInWithEmailAndPassword(auth, email, password);

            const token = authUser.user.uid;
            const docRef = doc(db, "userInfo", token);
            const infoUser = await getDoc(docRef);
            if (!infoUser.exists()) {
                throw new Error("Not data")
            }
            const dataUser = infoUser.data() as IUser;
            if (!dataUser.isAdmin) {
                throw new Error("Not admin")
            }


            localStorage.setItem("tokenAuth", token)

            if (token) {
                dispatch(setUser({
                    token: token,
                    user: {
                        name: dataUser.name,
                        email: authUser.user.email ? authUser.user.email : ""
                    },
                    isAuth: true
                }))

            }
        } catch (e) {
            setError(true);


        }
    }

    const onSubmit: SubmitHandler<ILoginAPI> = async (dataParam) => {
        await funcSubmit(auth, dataParam.username, dataParam.password)
        navigate(fromPage, { replace: true })

    }

    return (
        <div className={" form " + style.form}>
            <div className={style.formWrapper}>
                <h1>Авторизация</h1>
                <form onSubmit={handleSubmit(onSubmit)} className={style.formElem}>
                    <label className='form__label form__name'>
                        <span>Логин:</span>
                        <input autoComplete="username" placeholder='Введите логин' {...register("username", { validate: (value) => (value.length > 0) })} />
                        {errors.username && <span className="form__error">Заполните поле логин</span>}
                    </label>
                    <label className='form__label form__name'>
                        <span>Пароль:</span>
                        <input autoComplete="current-password" placeholder="Введите пароль" type='password' {...register("password", { validate: (value) => (value.length > 3) })} />
                        {errors.password && <span className="form__error">Длина пароля от 4 символов</span>}
                    </label>
                    <span className={"form__error " + " " + style.form__error + " " + (error ? style.errorNone : "")}>Неверно введен логин или пароль</span>
                    <button type="submit" className='btn__active btn__head'>Войти</button>
                </form>
            </div>

        </div>
    )
}

export { LoginPage };
