'use client'

import { Box, Button, Center, Container, Flex, Heading, HStack, Input, Text, VStack } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import Editor from '@monaco-editor/react';
import React, { useMemo } from 'react';
import { utils } from 'ethers';

import { useContractRead } from '@/hooks/use-contract-read';
import ERC20 from '@/ERC20.json';
import XeenonABI from '@/Xeenon.json';
import { useContractWrite } from '@/hooks/use-contract-write';

const ERC20_CONTRACT_ADDRESS = '0x073eF624e2a2fB5e24BC047484c22A7c44e2c9CB';
const XEENON_CONTRACT_ADDRESS = '0x82095Bf9586FF437B1f3915509E27Fdf191814f8';

export default function Home() {
  const { ready, authenticated, user, login, logout } = usePrivy();

  const isLoggedIn = ready && authenticated;

  const [amount, setAmount] = React.useState('10');

  const { data: userDAI } = useContractRead({
    enabled: isLoggedIn,
    abi: ERC20.abi,
    address: ERC20_CONTRACT_ADDRESS,
    functionName: 'balanceOf',
    args: [user?.wallet?.address],
  });

  const {
    data: allowance,
    refetch: refetchAllowance
  } = useContractRead({
    enabled: !!isLoggedIn,
    abi: ERC20.abi,
    address: ERC20_CONTRACT_ADDRESS,
    functionName: 'allowance',
    args: [
      user?.wallet?.address,
      XEENON_CONTRACT_ADDRESS,
    ],
  });

  const {
    write: approve,
    isLoading: isApproving,
  } = useContractWrite({
    abi: ERC20.abi,
    address: ERC20_CONTRACT_ADDRESS,
    functionName: 'approve',
    onSuccess: () => refetchAllowance(),
  })

  const {
    write: deposit,
    isLoading: isDepositing,
  } = useContractWrite({
    abi: XeenonABI.abi,
    address: XEENON_CONTRACT_ADDRESS,
    functionName: 'deposit',
  })

  const hasEnoughAllowance = useMemo(() => {
    if (!allowance) {
      return false;
    }

    if (!amount) {
      return true;
    }

    try {
      return allowance?.gte(utils.parseUnits(`${amount}`));
    } catch (e) {
      return true;
    }
  }, [allowance, amount]);

  const formattedUserDAI = useMemo(() => {
    if (!userDAI) {
      return 0;
    }

    return +utils.formatUnits(userDAI.toString());
  }, [userDAI]);

  const formattedAllowance = useMemo(() => {
    if (!allowance) {
      return 0;
    }

    return +utils.formatUnits(allowance.toString());
  }, [allowance]);


  return isLoggedIn ? (
    <Container p={'20px'}>
      <VStack align={'stretch'}>
        <Flex align={'center'} justify={'space-between'}>
          <Heading>Account page</Heading>
          <Button size={'sm'} onClick={() => logout()}>Logout</Button>
        </Flex>

        <Text>
          <Box as={'span' as any} fontWeight={700}>DAI Balance: </Box>
          {formattedUserDAI}
        </Text>

        <Text>
          <Box as={'span' as any} fontWeight={700}>Allowance: </Box>
          {formattedAllowance}
        </Text>

        <Text>
          <Box as={'span' as any} fontWeight={700}>Amount in WEI: </Box>
          {!!amount && utils.parseUnits(`${amount}`).toString()}
        </Text>

        <HStack>
          <Input
            placeholder={'Type DAI amount to deposit'}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            w={'fit-content'}
            isDisabled={!amount || hasEnoughAllowance}
            isLoading={isApproving}
            onClick={() => approve([XEENON_CONTRACT_ADDRESS, 1])}
          >Approve</Button>

          <Button
            colorScheme={'teal'}
            w={'fit-content'}
            isDisabled={!amount || !hasEnoughAllowance}
            isLoading={isDepositing}
            onClick={() => {
              const amountInWei = utils.parseUnits(`${amount}`).toString();
              console.log('amountInWei', amountInWei);
              deposit([amountInWei]);
            }}
          >Deposit</Button>
        </HStack>

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
