'use client'
import { useState, useEffect } from 'react'
import { useAccount, useWriteContract } from 'wagmi'
import { type Hex } from 'viem'

const BURN_ADDRESS = '0x000000000000000000000000000000000000dEaD' as const

interface TokenInfo {
  address: Hex
  symbol: string
  balance: bigint
  decimals: number
}

interface ErrorState {
  message: string
  type: 'error' | 'success'
}

export function BurnTokens() {
  const { address, isConnected } = useAccount()
  const [tokens, setTokens] = useState<TokenInfo[]>([])
  const [selectedTokens, setSelectedTokens] = useState<Hex[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isBurning, setIsBurning] = useState(false)
  const [error, setError] = useState<ErrorState | null>(null)
  const { writeContractAsync } = useWriteContract()

  const showError = (message: string) => {
    setError({ message, type: 'error' })
    setTimeout(() => setError(null), 5000)
  }

  const showSuccess = (message: string) => {
    setError({ message, type: 'success' })
    setTimeout(() => setError(null), 5000)
  }

  useEffect(() => {
    const fetchTokens = async () => {
      if (!address) return
      setIsLoading(true)
      setError(null)

      try {
        const response = await fetch(`/api/tokens?address=${address}`)
        const data = await response.json()

        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch tokens')
        }

        const tokenList: TokenInfo[] = data.map((token: any) => ({
          address: token.token_address as Hex,
          symbol: token.symbol,
          balance: BigInt(token.balance),
          decimals: Number(token.decimals),
        }))

        setTokens(tokenList)
        // 默认选择所有代币
        setSelectedTokens(tokenList.map(token => token.address))
      } catch (error) {
        console.error('Error fetching tokens:', error)
        showError('Failed to fetch tokens. Please try again.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchTokens()
  }, [address])

  const handleBurnTokens = async () => {
    if (!address || selectedTokens.length === 0) return
    setIsBurning(true)
    setError(null)

    try {
      const selectedTokensData = tokens.filter(token => 
        selectedTokens.includes(token.address) && token.balance > 0n
      )

      if (selectedTokensData.length === 0) {
        showError('No tokens selected or all selected tokens have zero balance')
        return
      }

      // 批量执行所有交易
      for (const token of selectedTokensData) {
        try {
          await writeContractAsync({
            abi: [{
              type: 'function',
              name: 'transfer',
              inputs: [
                { type: 'address', name: 'to' },
                { type: 'uint256', name: 'value' }
              ],
              outputs: [{ type: 'bool' }],
              stateMutability: 'nonpayable'
            }],
            address: token.address,
            functionName: 'transfer',
            args: [BURN_ADDRESS as Hex, token.balance]
          })
          showSuccess(`Successfully burned ${token.symbol}`)
        } catch (error) {
          console.error(`Error burning ${token.symbol}:`, error)
          showError(`Failed to burn ${token.symbol}. Please try again.`)
        }
      }

      // 刷新代币列表
      const response = await fetch(`/api/tokens?address=${address}`)
      const data = await response.json()
      
      if (response.ok) {
        const tokenList: TokenInfo[] = data.map((token: any) => ({
          address: token.token_address as Hex,
          symbol: token.symbol,
          balance: BigInt(token.balance),
          decimals: Number(token.decimals),
        }))
        setTokens(tokenList)
        setSelectedTokens(tokenList.map(token => token.address))
      }
    } catch (error) {
      console.error('Error burning tokens:', error)
      showError('Failed to burn tokens. Please try again.')
    } finally {
      setIsBurning(false)
    }
  }

  const handleTokenSelect = (tokenAddress: Hex) => {
    setSelectedTokens(prev =>
      prev.includes(tokenAddress)
        ? prev.filter(addr => addr !== tokenAddress)
        : [...prev, tokenAddress]
    )
  }

  const handleSelectAll = () => {
    setSelectedTokens(tokens.map(token => token.address))
  }

  const handleDeselectAll = () => {
    setSelectedTokens([])
  }

  if (!isConnected) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Please connect your wallet to burn tokens</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {error && (
        <div
          className={`p-4 rounded-lg ${
            error.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {error.message}
        </div>
      )}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Your BEP20 Tokens</h2>
          <div className="space-x-2">
            <button
              onClick={handleSelectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Select All
            </button>
            <button
              onClick={handleDeselectAll}
              className="text-sm text-blue-600 hover:text-blue-800"
            >
              Deselect All
            </button>
          </div>
        </div>
        {isLoading ? (
          <div className="text-center py-8">
            <p className="text-gray-500">Loading tokens...</p>
          </div>
        ) : tokens.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No tokens found in your wallet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {tokens.map(token => (
              <div
                key={token.address}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <input
                    type="checkbox"
                    checked={selectedTokens.includes(token.address)}
                    onChange={() => handleTokenSelect(token.address)}
                    className="w-5 h-5 rounded border-gray-300"
                  />
                  <div>
                    <p className="font-medium">{token.symbol}</p>
                    <p className="text-sm text-gray-500">
                      Balance: {(Number(token.balance) / 10 ** token.decimals).toFixed(4)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleBurnTokens}
          disabled={selectedTokens.length === 0 || isBurning}
          className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isBurning ? 'Burning...' : 'Burn Selected Tokens'}
        </button>
      </div>
    </div>
  )
} 