'use client'

import React, { useEffect } from 'react';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { Box, Heading, Text } from '@chakra-ui/react';

import { useContractRead } from '@/hooks/use-contract-read';
import ERC20 from '@/ERC20.json';

const AccountPage: React.FC = () => {
  const router = useRouter();
  const { ready, authenticated, user } = usePrivy();

  const { data: userDAI } = useContractRead({
    abi: ERC20.abi,
    address: '0x073eF624e2a2fB5e24BC047484c22A7c44e2c9CB',
    functionName: 'balanceOf',
    args: ['0xC1A98a78411A9CC71c526EAD8b922a841baF7deD'],
  });

  useEffect(() => {
    if (ready && !authenticated) {
      router.push('/');
    }
  }, [ready, authenticated])

  return !authenticated ? null : (
    <Box>
      <Heading>Account page</Heading>
      <Text>DAI: {userDAI}</Text>
      <Text whiteSpace={'pre-wrap'}>{JSON.stringify(user, null, 2)}</Text>
    </Box>
  );
}

export default AccountPage;