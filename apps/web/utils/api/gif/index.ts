import { GifResponse } from '@repo/api'

const BASE_URL = 'https://api.giphy.com/v1/gifs'
const API_KEY = process.env.NEXT_PUBLIC_GIPHY_API_KEY

export const getTrendingGifs = async (limit: number = 25, offset: number = 0) =>
    <Promise<GifResponse>>await fetch(
        `${BASE_URL}/trending?api_key=${API_KEY}&limit=${limit}&offset=${offset}`,
        {
            method: 'GET',
        },
    ).then(async (res) => res.json())

export const searchGifs = async (
    query: string,
    limit: number = 25,
    offset: number = 0,
) => <Promise<GifResponse>>await fetch(
        `${BASE_URL}/search?api_key=${API_KEY}&q=${encodeURIComponent(
            query,
        )}&limit=${limit}&offset=${offset}`,
        {
            method: 'GET',
        },
    ).then(async (res) => res.json())
