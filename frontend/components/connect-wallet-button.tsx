// frontend/components/connect-wallet-button.tsx
"use client";

import { WalletMultiButton } from '@solana/wallet-adapter-react-ui';
import { useWallet } from '@solana/wallet-adapter-react'; // Keep useWallet to check connection status for styling if needed

export function ConnectWalletButton({ className }: { className?: string }) {
  const { connected } = useWallet();

  // WalletMultiButton provides its own styling, but we can pass a className to override/extend.
  // The @solana/wallet-adapter-react-ui/styles.css should be imported in a global layout file (e.g., solana-wallet-provider.tsx or layout.tsx)
  // which I did in solana-wallet-provider.tsx.
  // The button will dynamically change its text and behavior based on wallet state.

  // If you need highly custom styling, you might need to fork WalletMultiButton or build your own
  // using useWallet and useWalletModal hooks. For most cases, WalletMultiButton is sufficient.

  return (
    <div className={className}>
      <WalletMultiButton
        style={{
            // Basic styles to somewhat match the theme, can be customized further or via CSS
            // These are examples and might not perfectly match the original button's gradient/hover effects
            // For more precise styling, you'd typically use CSS targeting the classes WalletMultiButton applies.
            backgroundColor: connected ? 'transparent' : '#0d9488', // approx teal-600 for disconnected
            color: 'white',
            borderRadius: '0.375rem', // rounded-md
            paddingLeft: '0.75rem',
            paddingRight: '0.75rem',
            paddingTop: '0.5rem',
            paddingBottom: '0.5rem',
            fontSize: '0.875rem',
            lineHeight: '1.25rem',
            fontWeight: 500,
            border: connected ? '1px solid #2dd4bf' : 'none', // approx teal-500 border for connected
        }}
      />
    </div>
  );
}
