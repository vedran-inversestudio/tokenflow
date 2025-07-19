# MCP-Bridge Service

A portable MCP (Model Context Protocol) service that connects Cursor to any Tokenflow Bridge server, enabling seamless design token extraction from Figma across multiple projects.

## 🚀 Features

- **Portable**: Drop into any project directory
- **Configurable**: Support for multiple bridge servers and projects
- **Auto-reconnection**: Robust connection handling with retry logic
- **Real-time updates**: WebSocket integration for live token updates
- **Component generation**: Generate React/TypeScript components with design tokens
- **Environment support**: Works with local and remote bridge servers

## 🏗️ Architecture

```
Figma Plugin → Bridge Server → MCP-Bridge Service → Cursor
```

## 📦 Installation

### Option 1: Copy to Project (Recommended)

```bash
# Copy the service to your project
cp -r mcp-bridge-service/ your-project/

# Install dependencies
cd your-project/mcp-bridge-service
npm install

# Start the service
npm start
```

### Option 2: Global Installation

```bash
# Install globally
cd mcp-bridge-service
npm run install-global

# Use from anywhere
mcp-bridge
```

### Option 3: NPM Package (Future)

```bash
npm install -g mcp-bridge-service
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in your project root:

```env
BRIDGE_URL=http://localhost:4000
BRIDGE_WS_URL=ws://localhost:4000
PROJECT_ID=default
RECONNECT_INTERVAL=5000
MAX_RECONNECT_ATTEMPTS=10
```

### Local Configuration

Create `.mcp-bridge-config.json` in your project root:

```json
{
  "bridgeUrl": "http://localhost:4000",
  "bridgeWsUrl": "ws://localhost:4000",
  "projectId": "my-project",
  "reconnectInterval": 5000,
  "maxReconnectAttempts": 10
}
```

### Cursor Configuration

Add to your Cursor settings or `.cursorrules`:

```json
{
  "mcpServers": {
    "tokenflow-bridge": {
      "command": "node",
      "args": ["./mcp-bridge-service/index.js"],
      "env": {
        "BRIDGE_URL": "http://localhost:4000",
        "PROJECT_ID": "my-project"
      }
    }
  }
}
```

## 🛠️ Usage

### Starting the Service

```bash
# From project directory
cd mcp-bridge-service
npm start

# Or globally
mcp-bridge
```

### Available MCP Tools

Once connected to Cursor, you can use these commands:

#### `/getCurrentTokens`
Get the latest token data from the bridge server.

#### `/getTokenData`
Get detailed token data with breakdown.

#### `/generateComponent`
Generate a React/TypeScript component using current design tokens.

**Parameters:**
- `componentType`: `button`, `card`, `input`, or `generic`
- `componentName`: Name for the generated component

#### `/getBridgeStatus`
Check the status of the bridge server and WebSocket connection.

#### `/watchForUpdates`
Start watching for real-time token updates from Figma.

#### `/configureBridge`
Configure bridge connection settings.

**Parameters:**
- `bridgeUrl`: Bridge server URL
- `projectId`: Project ID for token extraction

## 📁 Project Structure

```
your-project/
├── mcp-bridge-service/
│   ├── index.js              # Main service file
│   ├── package.json          # Dependencies
│   ├── README.md             # This file
│   └── cli.js               # CLI interface
├── .mcp-bridge-config.json   # Local configuration
├── .env                      # Environment variables
└── .cursorrules             # Cursor configuration
```

## 🔧 Multiple Projects Setup

### Project A (Local Bridge)
```json
{
  "bridgeUrl": "http://localhost:4000",
  "projectId": "project-a"
}
```

### Project B (Remote Bridge)
```json
{
  "bridgeUrl": "https://my-bridge.vercel.app",
  "projectId": "project-b"
}
```

### Project C (Different Local Bridge)
```json
{
  "bridgeUrl": "http://localhost:4001",
  "projectId": "project-c"
}
```

## 🚨 Troubleshooting

### Connection Issues

```bash
# Check bridge server status
curl http://localhost:4000/health

# Check MCP service logs
npm start

# Verify configuration
cat .mcp-bridge-config.json
```

### Common Issues

1. **Bridge server not running**
   - Start your bridge server first
   - Check the bridge URL in configuration

2. **Wrong project ID**
   - Verify the project ID matches your bridge server
   - Use `/configureBridge` to update settings

3. **Port conflicts**
   - Ensure no other services are using the same ports
   - Check firewall settings

4. **WebSocket connection failed**
   - Verify bridge server supports WebSocket
   - Check network connectivity

## 🔄 Auto-reconnection

The service automatically:
- Reconnects when the bridge server goes down
- Retries failed connections with exponential backoff
- Maintains connection state across reconnections
- Logs connection attempts and failures

## 📊 Monitoring

The service provides real-time status:
- Bridge server health
- WebSocket connection status
- Token data availability
- Reconnection attempts

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test with multiple projects
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

- **Issues**: Create an issue in the repository
- **Documentation**: Check this README and inline comments
- **Configuration**: Use `/configureBridge` tool in Cursor 