import { WebSocket } from 'ws';
import fetch from 'node-fetch';

// Bridge server configuration
const BRIDGE_URL = 'http://localhost:4000';
const BRIDGE_WS_URL = 'ws://localhost:4000';

// Bridge server connection
let bridgeWebSocket = null;
let lastTokenData = null;
let isConnected = false;

// Connect to bridge server WebSocket for real-time updates
function connectToBridge() {
  try {
    bridgeWebSocket = new WebSocket(BRIDGE_WS_URL);
    
    bridgeWebSocket.on('open', () => {
      console.log('🔌 Connected to Tokenflow Bridge WebSocket');
      isConnected = true;
    });
    
    bridgeWebSocket.on('message', (data) => {
      try {
        const message = JSON.parse(data.toString());
        if (message.type === 'tokenData') {
          lastTokenData = message.data;
          console.log('📦 Received token data update:', {
            cleanTokenCount: lastTokenData.filtered ? Object.keys(lastTokenData.filtered.cleanTokens || {}).length : 0,
            timestamp: message.timestamp
          });
        }
      } catch (error) {
        console.error('Error parsing WebSocket message:', error);
      }
    });
    
    bridgeWebSocket.on('close', () => {
      console.log('🔌 Disconnected from Tokenflow Bridge WebSocket');
      isConnected = false;
      // Attempt to reconnect after 5 seconds
      setTimeout(connectToBridge, 5000);
    });
    
    bridgeWebSocket.on('error', (error) => {
      console.error('WebSocket error:', error);
      isConnected = false;
    });
  } catch (error) {
    console.error('Failed to connect to bridge WebSocket:', error);
  }
}

// Initialize bridge connection
connectToBridge();

// Function to get current tokens
async function getCurrentTokens() {
  try {
    const response = await fetch(`${BRIDGE_URL}/api/tokens`);
    if (!response.ok) {
      throw new Error(`Bridge server error: ${response.status}`);
    }
    
    const data = await response.json();
    lastTokenData = data.data;
    
    console.log('✅ Retrieved current token data from bridge server.');
    console.log('📊 Token Summary:');
    console.log(`- Clean Tokens: ${Object.keys(data.data.filtered?.cleanTokens || {}).length}`);
    console.log(`- Token Studio: ${Object.keys(data.data.filtered?.tokenStudio || {}).length}`);
    console.log(`- Variables: ${Object.keys(data.data.filtered?.variables || {}).length}`);
    console.log(`- Styles: ${Object.keys(data.data.filtered?.styles || {}).length}`);
    console.log(`- Last Updated: ${data.timestamp}`);
    console.log(`🔗 Bridge Server: ${BRIDGE_URL}`);
    console.log(`📊 Dashboard: ${BRIDGE_URL}`);
    
    return data;
  } catch (error) {
    console.error('❌ Error getting tokens:', error.message);
    return null;
  }
}

// Function to get token data
function getTokenData() {
  if (!lastTokenData) {
    console.log('❌ No token data available. Please extract tokens from Figma first using the Tokenflow Bridge plugin.');
    return null;
  }
  
  const filtered = lastTokenData.filtered || {};
  const cleanTokens = filtered.cleanTokens || {};
  
  console.log('📦 Current Token Data');
  console.log(`**Token Studio:** ${Object.keys(filtered.tokenStudio || {}).length} tokens`);
  console.log(`**Variables:** ${Object.keys(filtered.variables || {}).length} variables`);
  console.log(`**Styles:** ${Object.keys(filtered.styles || {}).length} styles`);
  console.log(`**Clean Tokens:** ${Object.keys(cleanTokens).length} tokens`);
  
  if (Object.keys(cleanTokens).length > 0) {
    console.log('\n**Clean Tokens:**');
    Object.entries(cleanTokens).forEach(([key, value]) => {
      console.log(`- \`${key}\`: \`${value}\``);
    });
  }
  
  return lastTokenData;
}

// Function to get bridge status
async function getBridgeStatus() {
  try {
    const healthResponse = await fetch(`${BRIDGE_URL}/health`);
    const healthData = await healthResponse.json();
    
    console.log('🔌 Bridge Server Status');
    console.log(`**Status:** ${healthData.status}`);
    console.log(`**Uptime:** ${Math.round(healthData.uptime)}s`);
    console.log(`**WebSocket:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
    console.log(`**Clients:** ${healthData.clients}`);
    console.log(`**Last Update:** ${lastTokenData ? '✅ Available' : '❌ None'}`);
    console.log(`🔗 Dashboard: ${BRIDGE_URL}`);
    
    return healthData;
  } catch (error) {
    console.error('❌ Error getting bridge status:', error.message);
    return null;
  }
}

// Function to watch for updates
function watchForUpdates() {
  console.log('👀 Watching for token updates...');
  console.log(`**WebSocket Status:** ${isConnected ? '✅ Connected' : '❌ Disconnected'}`);
  console.log(`**Bridge Server:** ${BRIDGE_URL}`);
  console.log('\nThe MCP server is now monitoring for real-time token updates from the Figma plugin.');
  console.log('When you extract tokens in Figma, they will automatically be available here.');
  console.log('\nUse `getTokenData()` to see the latest tokens.');
}

// Start the server
console.log('🚀 Tokenflow Bridge Server started');
console.log('🔌 Connecting to bridge server...');
console.log('📊 Available functions:');
console.log('  - getCurrentTokens(): Get latest tokens from bridge');
console.log('  - getTokenData(): Get current token data');
console.log('  - getBridgeStatus(): Check bridge server status');
console.log('  - watchForUpdates(): Monitor for real-time updates');

// Export functions for use
export { getCurrentTokens, getTokenData, getBridgeStatus, watchForUpdates };

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down Tokenflow Bridge Server...');
  if (bridgeWebSocket) {
    bridgeWebSocket.close();
  }
  process.exit(0);
});

// Test connection on startup
setTimeout(async () => {
  console.log('\n🧪 Testing bridge connection...');
  await getCurrentTokens();
  await getBridgeStatus();
}, 2000); 