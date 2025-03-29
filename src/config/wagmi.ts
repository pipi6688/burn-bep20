'use client'
import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { bsc } from 'wagmi/chains'
import { http } from 'viem'

export const config = getDefaultConfig({
  appName: 'Burn BEP20 Tokens',
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID!, // Get one from https://cloud.walletconnect.com
  chains: [bsc],
  transports: {
    [bsc.id]: http()
  }
}) 