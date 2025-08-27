import express from 'express';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables from .env file in the current directory
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const { RELAYER_PRIVATE_KEY, PROVIDER_URL, CONTRACT_ADDRESS } = process.env;

if (!RELAYER_PRIVATE_KEY || !PROVIDER_URL || !CONTRACT_ADDRESS) {
  console.error('Missing environment variables. Make sure RELAYER_PRIVATE_KEY, PROVIDER_URL, and CONTRACT_ADDRESS are in your .env file.');
  process.exit(1);
}

// Set up the blockchain provider and wallet
const provider = new ethers.providers.JsonRpcProvider(PROVIDER_URL);
const relayerWallet = new ethers.Wallet(RELAYER_PRIVATE_KEY, provider);

// Minimal ABI for the EnergyGridDAO contract
const contractABI = [
  "function anonymousVoteQuadratic(uint256 proposalId, address voter, bool support, uint256 intensity)",
  "event AnonymousVoteCast(uint256 indexed proposalId, address indexed voter, bool support, uint256 intensity, uint256 cost)"
];

const contract = new ethers.Contract(CONTRACT_ADDRESS, contractABI, relayerWallet);

console.log(`[Privacy Service] Relayer Address: ${relayerWallet.address}`);
console.log(`[Privacy Service] Interacting with contract at: ${CONTRACT_ADDRESS}`);

// Define the /relay-vote endpoint
app.post('/relay-vote', async (req, res) => {
  const { proposalId, voter, support, intensity } = req.body;

  // Basic validation
  if (proposalId === undefined || !voter || support === undefined || !intensity) {
    return res.status(400).json({ error: 'Missing required fields: proposalId, voter, support, intensity.' });
  }

  console.log(`[Privacy Service] Received anonymous vote request for voter ${voter} on proposal ${proposalId} with intensity ${intensity}`);

  try {
    // Estimate gas before sending the transaction
    const gasEstimate = await contract.estimateGas.anonymousVoteQuadratic(proposalId, voter, support, intensity);
    console.log(`[Privacy Service] Estimated gas: ${gasEstimate.toString()}`);

    // This is where the relayer calls the smart contract
    const tx = await contract.anonymousVoteQuadratic(proposalId, voter, support, intensity, {
        gasLimit: gasEstimate.mul(12).div(10) // Add 20% buffer to gas estimate
    });

    console.log(`[Privacy Service] Transaction sent with hash: ${tx.hash}`);

    // We can return a response here without waiting for it to be mined
    // to make the user experience faster. The client can track the tx hash.
    res.status(202).json({
      message: 'Anonymous vote has been relayed. Transaction is pending.',
      transactionHash: tx.hash,
    });

  } catch (error: any) {
    console.error('[Privacy Service] Error relaying vote:', error);

    // Extract a more meaningful error message from the RPC error if possible
    const reason = error.reason || (error.error && error.error.message) || 'An unknown error occurred.';
    res.status(500).json({ error: `Failed to relay vote: ${reason}` });
  }
});

const PORT = process.env.PRIVACY_SERVICE_PORT || 3002;
app.listen(PORT, () => {
  console.log(`[Privacy Service] Eudaimonic Privacy Service listening on port ${PORT}`);
});
