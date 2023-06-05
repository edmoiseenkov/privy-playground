import { Contract } from 'ethers';
import { useQuery } from 'react-query'
import { usePrivy } from '@privy-io/react-auth';

interface IUsePrepareContractReadOptions  {
  address: string;
  abi: any;
  functionName: string;
  args: any[];
  enabled?: boolean;
  onSuccess?: (result: any) => void;
}

export const useContractRead = (options: IUsePrepareContractReadOptions) => {
  const { address, abi, functionName, args = [], enabled = true, onSuccess } = options;

  const { user, getEthersProvider, signMessage, walletConnectors } = usePrivy();

  return useQuery({
    retry: false,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    enabled: enabled && !!walletConnectors && !!user?.wallet?.address,
    queryKey: [address, functionName, args],
    queryFn: async () => {

      await signMessage('hello world');

      const embeddedWallet = walletConnectors!.walletConnectors.find((wallet) => wallet.walletClientType === 'privy');

      console.log('embeddedWallet', embeddedWallet)

      await embeddedWallet!.connect({
        showPrompt: false,
        chainId: 0x66EED
      });

      await walletConnectors?.setActiveWallet(embeddedWallet.wallets[0]!.address);

      console.log(embeddedWallet);

      const provider = getEthersProvider();

      const network = await provider.getNetwork();

      console.log('network', network);

      if (!provider || !user?.wallet?.address) {
        return;
      }

      const contract = new Contract(
        address,
        abi,
        provider.getSigner(user.wallet.address) as any,
      );

      const fn = contract[functionName];

      const res = await fn(...args);

      return res;
    },
    onSuccess,
  });
};