import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { IUser } from '../../models/type';

export interface IUserInfo {
    user: IUser;
    isAuth: boolean;
    token: string
}

const initialState: IUserInfo = { token: "", user: { name: "", email: "" }, isAuth: false };

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser(state, action: PayloadAction<IUserInfo>) {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuth = true;
            console.log(state.isAuth);

            console.log(state);
        },


        setIsAuth(state, action: PayloadAction<boolean>) {
            state.isAuth = action.payload;
        },
        resetUser(state) {
            state.token = "";
            state.isAuth = false;
            state.user = initialState.user;
        }

    },
});

export default userSlice.reducer;
export const { setUser, setIsAuth, resetUser } = userSlice.actions;