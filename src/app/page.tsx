'use client'

import { Box, Button, Center, Container, Flex, Heading, Text, VStack } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import Editor from '@monaco-editor/react';
import React, { useMemo } from 'react';
import { utils } from 'ethers';

import { useContractRead } from '@/hooks/use-contract-read';
import ERC20 from '@/ERC20.json';
import XeenonABI from '@/Xeenon.json';
import { useContractWrite } from '@/hooks/use-contract-write';

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const isLoggedIn = ready && authenticated;

  const { data: userDAI } = useContractRead({
    enabled: isLoggedIn,
    abi: ERC20.abi,
    address: '0x073eF624e2a2fB5e24BC047484c22A7c44e2c9CB',
    functionName: 'balanceOf',
    args: ['0xC1A98a78411A9CC71c526EAD8b922a841baF7deD'],
  });

  const {
    write: approve,
    isLoading: isApproving,
  } = useContractWrite({
    abi: ERC20.abi,
    address: '0x073eF624e2a2fB5e24BC047484c22A7c44e2c9CB',
    functionName: 'approve',
  })

  const {
    write: deposit,
    isLoading: isDepositing,
  } = useContractWrite({
    abi: XeenonABI.abi,
    address: '0x82095Bf9586FF437B1f3915509E27Fdf191814f8',
    functionName: 'deposit',
  })

  const formattedUserDAI = useMemo(() => {
    if (!userDAI) {
      return 0;
    }

    return +utils.formatUnits(userDAI.toString());
  }, [userDAI]);

  return isLoggedIn ? (
    <Container p={'20px'}>
      <VStack align={'stretch'}>
        <Flex align={'center'} justify={'space-between'}>
          <Heading>Account page</Heading>
          <Button size={'sm'} onClick={() => logout()}>Logout</Button>
        </Flex>

        <Button
          w={'fit-content'}
          isLoading={isApproving}
          onClick={() => approve(['0x82095Bf9586FF437B1f3915509E27Fdf191814f8', 1])}
        >Approve</Button>

        <Button
          w={'fit-content'}
          isLoading={isDepositing}
          onClick={() => deposit([1])}
        >Deposit</Button>

        <Text>
          <Box as={'span' as any} fontWeight={700}>DAI Balance: </Box>
          {formattedUserDAI}
        </Text>
        {/*<Text whiteSpace={'pre-wrap'}>{JSON.stringify(user, null, 2)}</Text>*/}
        <Editor
          height="500px"
          defaultLanguage="json"
          value={JSON.stringify(user, null, 2)}
          theme="onedark"
          options={{
            readOnly: true,
            minimap: {
              enabled: false,
            },
            scrollBeyondLastLine: false,
          }}
        />
      </VStack>
    </Container>
  ) : (
    <Center minH={'100vh'}>
      <Button isLoading={!ready} onClick={login}>
        Login
      </Button>
    </Center>
  )
}
