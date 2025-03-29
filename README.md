# BEP20 Token Burner

一键销毁 BSC 链上的代币（BEP20），支持批量操作。

## 功能特点

- 支持连接多种钱包（MetaMask、OKX 等）
- 自动获取钱包中的所有 BEP20 代币（不包括 BNB）
- 默认选中所有可销毁的代币
- 支持批量销毁操作
- 实时显示代币余额
- 销毁后自动刷新代币列表
- 完整的错误处理和用户反馈

## 项目设置

### 前置要求

- Node.js 16.x 或更高版本
- npm 或 yarn
- MetaMask 或其他支持的钱包

### 安装步骤

1. 克隆项目并安装依赖：
```bash
git clone <repository-url>
cd burn-erc20
npm install
```

2. 获取必要的 API 密钥：
   - Moralis API 密钥：访问 [Moralis Admin](https://admin.moralis.io/register) 注册并获取
   - WalletConnect Project ID：访问 [WalletConnect Cloud](https://cloud.walletconnect.com/) 注册并创建项目

3. 在项目根目录创建 `.env.local` 文件并添加你的 API 密钥：
```env
MORALIS_API_KEY=your_moralis_api_key_here 
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

4. 启动开发服务器：
```bash
npm run dev
```

5. 访问 http://localhost:3000 开始使用

## 使用说明

### 连接钱包

1. 点击页面右上角的 "Connect Wallet" 按钮
2. 选择你的钱包（MetaMask、OKX 等）
3. 确认连接请求

### 查看和选择代币

- 连接钱包后，页面会自动加载你的所有 BEP20 代币（不包括 BNB）
- 默认会选中所有代币
- 使用复选框可以手动选择/取消选择特定代币
- 使用 "Select All" 和 "Deselect All" 按钮可以快速选择或取消选择所有代币

### 销毁代币

1. 确认已选择要销毁的代币
2. 点击 "Burn Selected Tokens" 按钮
3. 在钱包中确认每个销毁交易
4. 等待交易完成
5. 代币列表会自动刷新以显示最新余额

### 注意事项

- 确保你的钱包中有足够的 BNB 支付 gas 费用
- 销毁操作是不可逆的，请谨慎操作
- 每个代币的销毁都需要单独的交易确认
- 如果你想要取消某个代币的销毁，可以在钱包中拒绝该交易

## 错误处理

- 如果遇到 "Failed to fetch tokens" 错误，请检查你的网络连接并刷新页面
- 如果某个代币销毁失败，会显示具体的错误信息，你可以稍后重试
- 所有错误消息会在 5 秒后自动消失

## 技术栈

- Next.js 13+
- React
- Wagmi
- Viem
- RainbowKit
- Moralis API
- Tailwind CSS

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开一个 issue 讨论你想要改变的内容。

## 许可证

MIT
