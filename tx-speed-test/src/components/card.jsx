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
    Link,
    useColorModeValue,
  } from '@chakra-ui/react';
  import React, { useState } from 'react'
  import { useStopwatch } from "react-timer-hook";
  import { toast } from 'react-toastify'
  import BeatLoader from "react-spinners/BeatLoader";
  import { HiOutlineExternalLink } from 'react-icons/hi'
  
  export default function SocialProfileWithImage(props) {
    const [loading, setLoading] = useState(false);
    const [txHash, setTxHash] = useState('');
    const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
    const shortenString = (str, n) => {
      return (str.length > n) ? str.slice(0, n-1) + '...' : str;
    }
    const handleTransfer = async () => {
      const res = await fetchAPI();
      console.log(res);
      setTxHash(res.receipt.transactionHash);
    }
    const fetchAPI = async () => {
      setLoading(true);
      start();
      toast('transaction sended!')
      const data = {
        'address': "0x50B80aa3877fC852f3194a0331177FDDcF0891bf",
        'chain': props.name
      }
      return fetch(`/api/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      .then(resp => {
        if(resp.status === 200) {
          setLoading(false);
          pause();
          toast('transaction confirmed!')
          const data = resp.json()
          console.log(data);
          return data;
        }
      }).catch(e => {
        console.log(e);
        return e;
      })
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
                <Text fontWeight={600}>{seconds}s</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Tx speed
                </Text>
              </Stack>
              <Stack spacing={0} align={'center'}>
                {txHash ? (
                  <Link href={`${props.scanURI}${txHash}`} fontWeight={600}>{shortenString(txHash, 6)}</Link>
                ) : (
                  <Text fontWeight={600}>-</Text>
                )}
                <Text fontSize={'sm'} color={'gray.500'}>
                  Tx Hash
                </Text>
              </Stack>
            </Stack>
            {loading ? (
              <Button
                disabled
                w={'full'}
                mt={8}
                bg={useColorModeValue('#151f21', 'gray.900')}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}
              >
                <BeatLoader color={"#A9A9A9"} />
              </Button>
            ) : (
              <Button
                onClick={handleTransfer}
                w={'full'}
                mt={8}
                bg={useColorModeValue('#151f21', 'gray.900')}
                color={'white'}
                rounded={'md'}
                _hover={{
                  transform: 'translateY(-2px)',
                  boxShadow: 'lg',
                }}>
                Send Tx
              </Button>
            )}
          </Box>
        </Box>
      </Center>
    );
  }