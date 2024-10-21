import axios from "axios"

export const api = axios.create({
    baseURL: "http://localhost:3000",
    timeout: 10 * 1000,
})

export const viacep = axios.create({
    baseURL: "https://viacep.com.br/ws",
    timeout: 10 * 1000,
})
