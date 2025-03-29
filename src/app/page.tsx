import { ConnectButton } from '@rainbow-me/rainbowkit'
import { BurnTokens } from '@/components/BurnTokens'

export default function Home() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Burn BEP20 Tokens</h1>
          <ConnectButton />
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <BurnTokens />
        </div>
      </div>
    </main>
  )
}
