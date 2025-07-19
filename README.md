# Tokenflow - Design Token Pipeline

A comprehensive design token pipeline that integrates Figma/Token Studio tokens with your codebase and Storybook, featuring real-time token extraction via MCP server integration.

## 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the MCP server:**
   ```bash
   npm run mcp
   ```

3. **Build tokens:**
   ```bash
   npm run tokens:all
   ```

4. **Start Storybook:**
   ```bash
   npm run storybook
   ```

## 🔗 MCP Server Integration

The Tokenflow project includes an integrated MCP (Model Context Protocol) server that connects Cursor to the Tokenflow Bridge, enabling seamless design token extraction from Figma.

### 🛠️ MCP Server Setup

#### **Option 1: Integrated Setup (Recommended)**
The MCP server is already integrated into this project:

```bash
# Start the MCP server
npm run mcp

# Or navigate to the server directory
cd mcp-server && npm start
```

#### **Option 2: Global MCP Server**
For use across multiple projects, set up a global MCP server:

1. **Clone the tokenflow-bridge project:**
   ```bash
   git clone <tokenflow-bridge-repo>
   cd tokenflow-bridge
   ```

2. **Install and start the MCP server:**
   ```bash
   cd mcp-server
   npm install
   npm start
   ```

3. **Configure Cursor globally:**
   Add to your Cursor settings:
   ```json
   {
     "mcpServers": {
       "tokenflow": {
         "command": "node",
         "args": ["/path/to/tokenflow-bridge/mcp-server/server.js"],
         "env": {}
       }
     }
   }
   ```

#### **Option 3: Project-specific Setup**
Copy the MCP server to your project:

1. **Copy the MCP server:**
   ```bash
   cp -r mcp-server/ your-project/
   ```

2. **Add to package.json:**
   ```json
   {
     "scripts": {
       "mcp": "cd mcp-server && npm start"
     }
   }
   ```

3. **Configure Cursor for the project:**
   Create `.cursorrules` in your project root:
   ```json
   {
     "mcpServers": {
       "tokenflow": {
         "command": "node",
         "args": ["./mcp-server/server.js"],
         "env": {}
       }
     }
   }
   ```

### 🌐 Bridge Server Configuration

#### **Local Development:**
- **URL**: `http://localhost:4000`
- **Use case**: Local development and testing
- **Setup**: Run the bridge server locally

#### **Remote Projects:**
- **URL**: Deploy to Vercel/Netlify
- **Use case**: Production environments
- **Setup**: Deploy bridge server and update MCP configuration

#### **Multiple Projects:**
- Each project can have its own bridge server
- Configure different URLs in MCP server settings
- Use environment variables for dynamic configuration

### 🔧 Cursor Integration

#### **Automatic Integration:**
The MCP server automatically connects to your bridge URL and provides:
- Real-time token access from Figma
- Component generation with accurate styling
- Bridge server monitoring
- WebSocket integration for live updates

#### **Manual Configuration:**
If automatic integration doesn't work, manually configure Cursor:

1. **Open Cursor settings**
2. **Add MCP server configuration:**
   ```json
   {
     "mcpServers": {
       "tokenflow": {
         "command": "node",
         "args": ["/path/to/mcp-server/server.js"],
         "env": {
           "BRIDGE_URL": "http://localhost:4000"
         }
       }
     }
   }
   ```

### 📋 Available MCP Tools

Once connected, you can use these commands in Cursor:

- `/getCurrentTokens` - Get latest token data
- `/getTokenData` - Detailed token breakdown
- `/generateComponent` - Generate React/TypeScript components
- `/getBridgeStatus` - Check bridge server health
- `/watchForUpdates` - Monitor real-time updates

### 🚨 Troubleshooting

#### **MCP Server Issues:**
```bash
# Check if MCP server is running
curl http://localhost:4000/api/status

# Restart MCP server
npm run mcp

# Check logs
cd mcp-server && npm run dev
```

#### **Bridge Server Issues:**
```bash
# Check bridge server status
curl http://localhost:4000/api/tokens

# Restart bridge server
# (Follow bridge server documentation)
```

#### **Cursor Integration Issues:**
1. **Verify MCP server is running**
2. **Check Cursor configuration**
3. **Restart Cursor**
4. **Check network connectivity**

## 📁 Project Structure

```
tokenflow/
├── mcp-server/           # MCP server for Cursor integration
│   ├── server.js         # Main MCP server
│   ├── package.json      # MCP server dependencies
│   └── README.md         # MCP server documentation
├── src/
│   ├── tokens/           # Design token definitions
│   ├── components/       # Storybook components
│   └── utils/            # Utility functions
├── public/               # Static assets
├── .storybook/           # Storybook configuration
├── generate-flat-aliases.js    # Token flattening script
├── postprocess-sanitize-tokens-css.js  # CSS post-processing
└── style-dictionary.config.mjs # Style Dictionary config
```

## 🔄 Token Pipeline

1. **Extract**: Figma plugin extracts tokens
2. **Bridge**: Local API bridge processes tokens
3. **MCP**: MCP server provides tokens to Cursor
4. **Flatten**: Generate flat alias tokens
5. **Build**: Style Dictionary generates CSS
6. **Sanitize**: Post-process CSS for compatibility
7. **Integrate**: Use in Storybook components

## 🎯 Usage Examples

### **Using MCP Tools in Cursor:**

```bash
# Get current tokens from Figma
/getCurrentTokens

# Generate a button component
/generateComponent componentType="button" componentName="PrimaryButton"

# Check bridge server status
/getBridgeStatus
```

### **Building Tokens:**

```bash
# Build and process all tokens
npm run tokens:all

# Build only
npm run tokens:build

# Post-process only
npm run tokens:postprocess
```

### **Storybook Development:**

```bash
# Start Storybook
npm run storybook

# Access at http://localhost:6006
```

## 📚 Documentation

- **MCP Server**: See `mcp-server/README.md` for detailed MCP server documentation
- **Bridge Server**: See bridge server documentation for API details
- **Token Pipeline**: See token processing scripts for customization
- **Components**: See Storybook stories for component usage

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the MCP integration
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.
