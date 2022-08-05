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
  } from '@chakra-ui/react';
  import React, { useState } from 'react'
  import { useStopwatch } from "react-timer-hook";
  import { toast } from 'react-toastify'
  
  export default function SocialProfileWithImage(props) {
    // const [loading, setLoading] = useState(false);
    // const [polygonTimer, setPolygonTimer] = useState(0);
    const { seconds, minutes, hours, isRunning, start, pause, reset } = useStopwatch({ autoStart: false });
    const handleTransfer = async () => {
      start();
      toast('transaction sended!')
      fetch(`/api/transfer`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then(resp => {
        if(resp.status === 200) {
          pause();
          toast('transaction confirmed!')
        }
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
                <Text fontWeight={600}>s</Text>
                <Text fontSize={'sm'} color={'gray.500'}>
                  Deploy speed
                </Text>
              </Stack>
            </Stack>
  
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
          </Box>
        </Box>
      </Center>
    );
  }