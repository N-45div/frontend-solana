// frontend/app/ccip-transfer/page.tsx
import CCIPTransferForm from "@/components/ccip-transfer-form";

export default function CCIPTransferPage() {
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">CCIP Token Transfer (Solana to EVM)</h1>
      <CCIPTransferForm />
    </div>
  );
}
