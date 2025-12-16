'use client'

import { Community } from '../components/home/Community'
import { Features } from '../components/home/Features'
import { Header } from '../components/home/Header'
import { Hero } from '../components/home/Hero'
import Layout from '../components/Layout'
import Providers from '../contexts'

export default function Home() {
    return (
        <Layout>
            <Providers>
                <Header />
                <Hero />
                <Features />
                <Community />
            </Providers>
        </Layout>
    )
}
