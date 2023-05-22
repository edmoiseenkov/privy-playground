'use client'

import { Button, Center } from '@chakra-ui/react';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const { ready, authenticated, login } = usePrivy();

  useEffect(() => {
    if (authenticated) {
      router.push('/account');
    }
  }, [authenticated])

  return (
    <Center minH={'100vh'}>
      <Button isLoading={!ready} onClick={login}>
        Login
      </Button>
    </Center>
  )
}
