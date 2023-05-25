'use client'

import { Box, Button, Center, Heading, Text } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import React  from 'react';
import { useContractRead } from '@/hooks/use-contract-read';
import ERC20 from '@/ERC20.json';

export default function Home() {
  const { ready, authenticated, user, login } = usePrivy();

  const isLoggedIn = ready && authenticated;

  const { data: userDAI } = useContractRead({
    enabled: isLoggedIn,
    abi: ERC20.abi,
    address: '0x073eF624e2a2fB5e24BC047484c22A7c44e2c9CB',
    functionName: 'balanceOf',
    args: ['0xC1A98a78411A9CC71c526EAD8b922a841baF7deD'],
  });

  return isLoggedIn ? (
    <Box>
      <Heading>Account page</Heading>
      <Text>DAI: {userDAI}</Text>
      <Text whiteSpace={'pre-wrap'}>{JSON.stringify(user, null, 2)}</Text>
    </Box>
  ) : (
    <Center minH={'100vh'}>
      <Button isLoading={!ready} onClick={login}>
        Login
      </Button>
    </Center>
  )
}
