import { NextResponse } from 'next/server'
import Moralis from 'moralis'

const BNB_ADDRESS = '0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c' // BSC 上的 WBNB 地址

// 初始化 Moralis
let isMoralisInitialized = false
const initMoralis = async () => {
  if (!isMoralisInitialized) {
    await Moralis.start({
      apiKey: process.env.MORALIS_API_KEY,
    })
    isMoralisInitialized = true
  }
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const address = searchParams.get('address')

  if (!address) {
    return NextResponse.json({ error: 'Address is required' }, { status: 400 })
  }

  if (!process.env.MORALIS_API_KEY) {
    return NextResponse.json(
      { error: 'Moralis API key not configured' },
      { status: 500 }
    )
  }

  try {
    await initMoralis()

    const response = await Moralis.EvmApi.token.getWalletTokenBalances({
      address,
      chain: '0x38', // BSC mainnet
    })

    // 过滤掉 BNB/WBNB
    const tokens = response.toJSON().filter(
      token => token.token_address.toLowerCase() !== BNB_ADDRESS.toLowerCase()
    )

    return NextResponse.json(tokens)
  } catch (error) {
    console.error('Error fetching tokens:', error)
    return NextResponse.json(
      { error: 'Failed to fetch tokens' },
      { status: 500 }
    )
  }
} 