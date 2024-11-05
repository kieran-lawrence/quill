'use client'

import { Community } from './components/home/Community'
import { Features } from './components/home/Features'
import { Header } from './components/home/Header'
import { Hero } from './components/home/Hero'
import Layout from './components/Layout'

export default function Index() {
    return (
        <Layout>
            <Header />
            <Hero />
            <Features />
            <Community />
        </Layout>
    )
}
