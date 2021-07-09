import axios from 'axios'
import { LaunchType } from '../types/types'

export const instance = axios.create({
    baseURL: 'https://api.spacexdata.com/v4/'
})

export type APIResponseType = {
    docs: Array<LaunchType>
    totalDocs: number,
    limit: number,
    totalPages: number,
    page: number,
    pagingCounter: number,
    hasPrevPage: boolean,
    hasNextPage: boolean,
    prevPage: number,
    nextPage: number
}
