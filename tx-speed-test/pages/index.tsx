import type { NextPage } from 'next'
import React from 'react'
import { Center, Grid } from '@chakra-ui/react'
import Card from '../src/components/card'
import Navbar from '../src/components/navbar'

const Home: NextPage = () => {  
  return (
    <>
      <Navbar />
      <Center>
        <Grid gridTemplateColumns={{sm: 'repeat(1, 1fr)', lg: 'repeat(3, 1fr)'}} gap={6}>
          <Card
            name="ethereum"
            icon="https://s2.coinmarketcap.com/static/img/coins/200x200/1027.png"
            img="https://www.coindeskjapan.com/wp-content/uploads/2022/01/shutterstock_776426233-710x458.jpg"
            scanURI="https://goerli.etherscan.io/tx/"
          ></Card>
          <Card
            name="polygon"
            icon="https://cdn.todayscrypto.news/wp-content/uploads/2022/03/1.polygon-matic-logo.png"
            img="https://bittimes.net/wp-content/uploads/2022/05/Polygon-MATIC-Logo-450.jpg"
            scanURI="https://mumbai.polygonscan.com/tx/"
          ></Card>
          <Card
            name="ohaiyo"
            icon="https://cdn-images-1.medium.com/max/1200/1*aEUc1bvEC4etWj6JTg6VMg.png"
            img="https://imgs.coinpost-ext.com/uploads/2022/07/aptos-ftx.jpeg"
            scanURI="https://mumbai.polygonscan.com/tx/"
          ></Card>
        </Grid>
      </Center>
    </>
  )
}

export default Home