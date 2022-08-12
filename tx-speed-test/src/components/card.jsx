import {
    Heading,
    Avatar,
    Box,
    Center,
    Image,
    Flex,
    Text,
    Stack,
    Button,
    useColorModeValue,
    Link,
    Icon,
    chakra,
  } from '@chakra-ui/react';
  import React, { useState } from 'react'
  import { useStopwatch } from "react-timer-hook";
  import { toast } from 'react-toastify'
  import BeatLoader from "react-spinners/BeatLoader";
  import { HiOutlineExternalLink } from 'react-icons/hi'
  import { motion, useAnimation } from 'framer-motion'
  
  export default function Card(props) {
    const [confirmed, setConfirmed] = useState(false)
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const { seconds, minutes, start, pause, reset } = useStopwatch({ autoStart: false });

    const MotionBox = motion(chakra.div)

    const variants = {
      confirmed: { scale: [1, 1.4, 1.8, 1.4, 1]}
    }

    const shortenString = (str, n) => {
      return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    }

    const handleTransfer = async () => { 
      seconds ? reset() : '';
      setTxHash('');
      const transactionHash = await fetchTransactionHash('transfer');
      console.log(transactionHash);
      setTxHash(transactionHash);
    }

    const handleOhaiyoTransfer = async () => { 
      seconds ? reset() : '';
      setTxHash('');
      const transactionHash = await fetchTransactionHash('transferOhio');
      console.log(transactionHash);
      setTxHash(transactionHash);
    }

    const fetchTransactionHash = async (path) => {
      setConfirmed(false);
      setLoading(true);
      start();
      toast('transaction sended!')
      const data = {
        'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf",
        'chain': props.name
      }
      const resp = await fetch(`/api/${path}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      if(resp.status !== 200) {
        throw Error("Server error");
      }
      setLoading(false);
      pause();
      toast('transaction confirmed!')
      setConfirmed(true);
      return (await resp.json()).receipt.transactionHash;
    }
    
    return (
      <Center py={6}>
        <Box
          maxW={'270px'}
          w={'full'}
          bg={useColorModeValue('white', 'gray.800')}
          boxShadow={'2xl'}
          rounded={'md'}
          overflow={'hidden'}>
          <Image
            h={'120px'}
            w={'full'}
            src={props.img}
            objectFit={'cover'}
          />
          <Flex justify={'center'} mt={-12}>
            <Avatar
              size={'xl'}
              src={props.icon}
              alt={'Author'}
              css={{
                border: '2px solid white',
              }}
            />
          </Flex>
  
          <Box p={6}>
            <Stack spacing={0} align={'center'} mb={5}>
              <Heading fontSize={'2xl'} fontWeight={500} fontFamily={'body'}>
                {props.name}
              </Heading>
            </Stack>
  
            <Stack direction={'row'} justify={'center'} spacing={6}>
              <Stack spacing={0} align={'center'}>
                <MotionBox
                  cursor="pointer"
                  animate={confirmed ? 'confirmed' : '' }
                  transition={{ duration: 0.5 }}
                  variants={variants}
                >
                  <Text fontWeight={600}>{minutes ? <>{minutes}m</> : (<></>)}{seconds}s</Text>
                </MotionBox>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Tx speed
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                {txHash ? (
                  <Link href={props.scanURI + txHash} fontWeight={600}>{shortenString(txHash, 6)}<Icon ml='2px' verticalAlign="-15%" as={HiOutlineExternalLink} /></Link>
                ) : (
                  <Text fontWeight={600}>-</Text>
                )}
                <Text fontSize={'sm'} color={'gray.500'}>
                  Tx Hash
                </Text>
              </Stack>
            </Stack>
              <Button
                disabled={loading}
                onClick={props.name === 'ohio' ? handleOhaiyoTransfer : handleTransfer}
                w="full"
                mt={8}
                bg={useColorModeValue('#151f21', 'gray.900')}
                color="white"
                rounded="md"
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                {loading ? (
                  <BeatLoader color={"#A9A9A9"} />
                ) : (
                  <>Send Tx</>
                )}
              </Button>
          </Box>
        </Box>
      </Center>
    );
  }