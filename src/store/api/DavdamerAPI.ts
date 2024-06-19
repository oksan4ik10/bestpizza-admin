

import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const davDamerAPI = createApi({
    reducerPath: 'davDamerAPI',
    baseQuery: fetchBaseQuery({ baseUrl: 'https://foodcity.ecorp.fyi/api' }),
    tagTypes: ['Products', 'Orders'],
    endpoints: () => ({
    })
})