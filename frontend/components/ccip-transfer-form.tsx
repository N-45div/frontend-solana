// frontend/components/ccip-transfer-form.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import { PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { ChainId, CHAIN_SELECTORS, FeeTokenType as ConfigFeeTokenType, getCCIPSVMConfig } from "../../../ccip-scripts/config"; // Adjust path as needed
import { CCIPRouterClient, EVMRouterClient, TokenAmount } from "@chainlink/solana-sdk"; // Ensure this path is correct or use the EVM SDK if more appropriate for client-side
import { ethers } from "ethers"; // For EVM address validation and types

// Placeholder for actual chain and token data - this should ideally come from a config or be more dynamic
const supportedSourceChains = [
  { id: ChainId.SOLANA_DEVNET, name: "Solana Devnet" },
];

const supportedDestinationChains = [
  { id: ChainId.ETHEREUM_SEPOLIA, name: "Ethereum Sepolia" },
];

// Example token - replace with actual token data or fetch dynamically
const solanaDevnetConfig = getCCIPSVMConfig(ChainId.SOLANA_DEVNET);
const availableTokens = [
  {
    id: "bnm-solana-devnet",
    name: "BnM Token (Solana Devnet)",
    address: solanaDevnetConfig.bnmTokenMint, // Use from config
    decimals: 9 // Assuming 9 decimals for BnM token, adjust if necessary
  },
];

export default function CCIPTransferForm() {
  const { connection } = useConnection();
  const { publicKey, sendTransaction, connected, select } = useWallet();
  const { toast } = useToast();

  const [sourceChainId, setSourceChainId] = useState<ChainId>(ChainId.SOLANA_DEVNET);
  const [destinationChainId, setDestinationChainId] = useState<ChainId>(ChainId.ETHEREUM_SEPOLIA);
  const [selectedTokenAddress, setSelectedTokenAddress] = useState<string>(availableTokens[0]?.address || "");
  const [tokenAmount, setTokenAmount] = useState<string>("");
  const [receiverAddress, setReceiverAddress] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const selectedToken = availableTokens.find(t => t.address === selectedTokenAddress);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!connected || !publicKey || !selectedToken) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your Solana wallet to proceed.",
        variant: "destructive",
      });
      return;
    }

    if (!ethers.isAddress(receiverAddress)) {
      toast({
        title: "Invalid Receiver Address",
        description: "Please enter a valid EVM receiver address (e.g., 0x...).",
        variant: "destructive",
      });
      return;
    }

    const amount = parseFloat(tokenAmount);
    if (isNaN(amount) || amount <= 0) {
      toast({
        title: "Invalid Token Amount",
        description: "Please enter a valid token amount.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    toast({ title: "Processing Transfer", description: "Please wait..." });

    try {
      const ccipConfig = getCCIPSVMConfig(sourceChainId);
      if (!ccipConfig) {
        throw new Error(`Configuration not found for chain ${sourceChainId}`);
      }

      const routerClient = new CCIPRouterClient(
        connection,
        publicKey,
        new PublicKey(ccipConfig.routerAddress)
      );

      const tokenDecimals = selectedToken.decimals;
      const rawAmount = ethers.parseUnits(tokenAmount, tokenDecimals).toString();

      const tokenAmounts: TokenAmount[] = [{
        tokenMint: new PublicKey(selectedTokenAddress),
        amount: rawAmount,
      }];

      const feeTokenAddress = ConfigFeeTokenType.NATIVE; // Using SOL for fees

      const message = {
        destinationChainSelector: CHAIN_SELECTORS[destinationChainId].toString(),
        receiver: ethers.getBytes(ethers.zeroPadValue(receiverAddress, 32)), // Must be 32 bytes
        tokenAmounts: tokenAmounts,
        feeToken: feeTokenAddress, // Address of fee token, or SystemProgram.programId for native
        extraArgs: {
          gasLimit: BigInt(0), // No execution on destination for token transfers
          allowOutOfOrderExecution: true,
        }
      };

      console.log("Preparing CCIP message:", message);

      // 1. Get CCIP Fee
      const fee = await routerClient.getFee(message);
      console.log("Calculated CCIP Fee:", fee.toString());
      toast({ title: "CCIP Fee Calculated", description: `Fee: ${ethers.formatUnits(fee, 'gwei')} GWEI (approx)` }); // SOL fees are in lamports

      // 2. Build Transaction (this part is highly simplified and needs proper error handling and user confirmation)
      // The actual `sendTokens` or equivalent method from the SDK would build this.
      // For now, this is a placeholder for the actual transaction creation.
      // The SDK's `sendTokens` method would typically handle token approvals (delegation) as well.
      // This example assumes approvals are already handled or are part of the `sendTokens` internal logic.

      // const transaction = await routerClient.sendTokens(message, fee); // Ideal SDK usage
      // For demonstration, let's assume `sendTokens` returns a transaction object.
      // Since we don't have a full `sendTokens` that returns a transaction directly for `sendTransaction`
      // this part will be a placeholder. The actual SDK might require multiple transactions or specific instructions.

      // Placeholder: The actual transaction building and sending would be more complex
      // and should use methods from `@chainlink/solana-sdk` like `routerClient.sendTokens(...)`
      // which internally constructs and sends the transaction.
      // The `sendTransaction` from `useWallet` expects a `Transaction` object.

      // This is a conceptual placeholder. The actual SDK usage might be different.
      // The `CCIPRouterClient` from `@chainlink/solana-sdk`'s `sendTokens` method
      // likely handles the transaction creation and sending internally or returns instructions.
      // For now, we'll simulate the success path.

      // Simulate transaction sending
      await new Promise(resolve => setTimeout(resolve, 3000)); // Simulate network delay
      const mockTxSignature = `simulated_tx_${Date.now()}`;

      console.log("Transaction sent (simulated), signature:", mockTxSignature);

      toast({
        title: "Transfer Initiated (Simulation)",
        description: `Transfer of ${tokenAmount} ${selectedToken.name} to ${receiverAddress} on ${supportedDestinationChains.find(c => c.id === destinationChainId)?.name}. Tx: ${mockTxSignature.substring(0, 20)}...`,
      });
      setTokenAmount("");
      // setReceiverAddress(""); // Keep receiver address for subsequent transfers if user wants

    } catch (error) {
      console.error("Transfer failed:", error);
      toast({
        title: "Transfer Failed",
        description: error instanceof Error ? error.message : "An unknown error occurred during the transfer process.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (!publicKey) {
      // Prompt wallet selection if not connected and no wallet is selected yet.
      // select(PhantomWalletName); // Or your preferred default wallet
    }
  }, [publicKey, select]);

  return (
    <div className="space-y-6 max-w-lg mx-auto p-6 border rounded-lg shadow-md">
      <div className="flex justify-end">
        <WalletMultiButton />
      </div>

      {connected && publicKey && (
        <p className="text-sm text-muted-foreground">Connected: {publicKey.toBase58().substring(0,6)}...{publicKey.toBase58().slice(-4)}</p>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="sourceChain">Source Chain</Label>
          <Select value={sourceChainId} onValueChange={(value) => setSourceChainId(value as ChainId)} disabled>
            <SelectTrigger id="sourceChain">
              <SelectValue placeholder="Select source chain" />
            </SelectTrigger>
            <SelectContent>
              {supportedSourceChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id} disabled={chain.id !== ChainId.SOLANA_DEVNET}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">Currently supports Solana Devnet only.</p>
        </div>

        <div>
          <Label htmlFor="destinationChain">Destination Chain</Label>
          <Select value={destinationChainId} onValueChange={(value) => setDestinationChainId(value as ChainId)} disabled>
            <SelectTrigger id="destinationChain">
              <SelectValue placeholder="Select destination chain" />
            </SelectTrigger>
            <SelectContent>
              {supportedDestinationChains.map((chain) => (
                <SelectItem key={chain.id} value={chain.id} disabled={chain.id !== ChainId.ETHEREUM_SEPOLIA}>
                  {chain.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-sm text-muted-foreground mt-1">Currently supports Ethereum Sepolia only.</p>
        </div>

        <div>
          <Label htmlFor="tokenAddress">Token (Solana)</Label>
          <Select value={selectedTokenAddress} onValueChange={setSelectedTokenAddress}>
            <SelectTrigger id="tokenAddress">
              <SelectValue placeholder="Select token" />
            </SelectTrigger>
            <SelectContent>
              {availableTokens.map((token) => (
                <SelectItem key={token.id} value={token.address}>
                  {token.name} ({token.address.substring(0, 6)}...)
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedToken && <p className="text-sm text-muted-foreground mt-1">Decimals: {selectedToken.decimals}</p>}
        </div>

        <div>
          <Label htmlFor="tokenAmount">Token Amount</Label>
          <Input
            id="tokenAmount"
            type="number"
            value={tokenAmount}
            onChange={(e) => setTokenAmount(e.target.value)}
            placeholder="e.g., 10.0"
            required
            step="any"
          />
          <p className="text-sm text-muted-foreground mt-1">Enter the amount of tokens to transfer.</p>
        </div>

        <div>
          <Label htmlFor="receiverAddress">Receiver Address (EVM)</Label>
          <Input
            id="receiverAddress"
            type="text"
            value={receiverAddress}
            onChange={(e) => setReceiverAddress(e.target.value)}
            placeholder="0x..."
            required
          />
          <p className="text-sm text-muted-foreground mt-1">Enter the recipient's Ethereum address (e.g., 0x123...).</p>
        </div>

        <Button type="submit" className="w-full" disabled={isLoading || !connected}>
          {isLoading ? "Processing..." : (connected ? "Initiate Transfer" : "Connect Wallet to Transfer")}
        </Button>
      </form>
    </div>
  );
}
