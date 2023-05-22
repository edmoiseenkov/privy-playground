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

  const { user, getEthersProvider } = usePrivy();

  const provider = getEthersProvider();

  return useQuery({
    retry: false,
    enabled: enabled && !!provider && !!user?.wallet?.address,
    queryKey: [address, functionName, args],
    queryFn: async () => {
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