# Tokenflow - Real-Time Design Token Pipeline

A comprehensive design token pipeline that extracts tokens from Figma in real-time and provides them to your development workflow through a unified monorepo architecture.

## 🎉 What's New

- **Real-time token extraction** from Figma with instant dashboard updates
- **Monorepo architecture** with organized packages and apps
- **WebSocket integration** for live token updates without page refresh
- **MCP server integration** for development tool connectivity
- **Clean token filtering** and processing pipeline

## 🏗️ Monorepo Structure

```
tokenflow/
├── apps/
│   ├── dashboard/          # Real-time token dashboard
│   └── storybook/          # Component documentation
├── packages/
│   ├── bridge/             # Bridge server with WebSocket
│   ├── mcp/                # MCP server for dev tools
│   ├── plugin/             # Figma plugin
│   └── core/               # Core token processing
├── docs/                   # Project documentation
└── scripts/                # Utility scripts
```

## 🚀 Quick Start

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install package dependencies
npm run install:all
```

### 2. Start the Bridge Server

```bash
# Start bridge server (runs on port 4000)
cd packages/bridge && npm start
```

### 3. Start the Dashboard

```bash
# Open dashboard in browser
open http://localhost:4000
```

### 4. Upload Figma Plugin

1. Open Figma
2. Go to Plugins → Development → Import plugin from manifest
3. Select `packages/plugin/manifest.json`
4. Run the plugin to extract tokens

## 🔄 Real-Time Token Pipeline

```
Figma Plugin → Bridge Server → Dashboard (Real-time) → MCP Server
     ↓              ↓              ↓                    ↓
  Extract      Store & Filter   Visual Display    Dev Tools Access
  Tokens       Clean Tokens     Real-time Updates  Cursor Integration
```

### How It Works

1. **Figma Plugin** (`packages/plugin/`)
   - Extracts tokens from Token Studio
   - Filters and cleans token data
   - Sends to bridge server via API

2. **Bridge Server** (`packages/bridge/`)
   - Receives tokens via REST API
   - Stores tokens with timestamps
   - Broadcasts updates via WebSocket
   - Serves dashboard and API endpoints

3. **Dashboard** (`apps/dashboard/`)
   - Real-time token display
   - WebSocket connection for live updates
   - Token history and project management

4. **MCP Server** (`packages/mcp/`)
   - Connects to bridge server
   - Provides tokens to development tools
   - Enables Cursor integration

## 🛠️ Development Setup

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Figma account with Token Studio plugin

### Installation

```bash
# Clone the repository
git clone https://github.com/vedran-inversestudio/tokenflow.git
cd tokenflow

# Install dependencies
npm install

# Install package dependencies
npm run install:all
```

### Running Services

#### Bridge Server
```bash
cd packages/bridge
npm start
# Server runs on http://localhost:4000
```

#### MCP Server
```bash
cd packages/mcp
npm start
# Connects to bridge server automatically
```

#### Dashboard
```bash
# Dashboard is served by bridge server
open http://localhost:4000
```

#### Storybook
```bash
cd apps/storybook
npm start
# Storybook runs on http://localhost:6006
```

## 📦 Package Details

### `packages/bridge/` - Bridge Server
- **Purpose**: Central token storage and API server
- **Features**: 
  - REST API for token storage
  - WebSocket server for real-time updates
  - Dashboard serving
  - Token filtering and processing
- **Port**: 4000
- **Key files**: `server.cjs`, `public/index.html`

### `packages/plugin/` - Figma Plugin
- **Purpose**: Extract tokens from Figma/Token Studio
- **Features**:
  - Token Studio integration
  - Clean token filtering
  - API communication with bridge
- **Key files**: `manifest.json`, `code.js`, `ui.html`

### `packages/mcp/` - MCP Server
- **Purpose**: Development tool integration
- **Features**:
  - Bridge server connection
  - Token access for Cursor
  - Real-time monitoring
- **Key files**: `simple-server.js`, `cursor-config.json`

### `packages/core/` - Core Processing
- **Purpose**: Token processing and components
- **Features**:
  - Style Dictionary configuration
  - Token flattening and aliases
  - CSS post-processing
  - Storybook components
- **Key files**: `style-dictionary.config.mjs`, `src/components/`

### `apps/dashboard/` - Token Dashboard
- **Purpose**: Real-time token visualization
- **Features**:
  - WebSocket connection
  - Live token updates
  - Token history
  - Project management
- **Key files**: `index.html`

### `apps/storybook/` - Component Documentation
- **Purpose**: Component development and documentation
- **Features**:
  - Component stories
  - Token integration
  - Design system documentation
- **Key files**: `.storybook/`, `src/stories/`

## 🔧 Configuration

### Environment Variables

Create `.env` files in package directories as needed:

```bash
# packages/bridge/.env
PORT=4000
NODE_ENV=development

# packages/mcp/.env
BRIDGE_URL=http://localhost:4000
PROJECT_ID=default
```

### Cursor Integration

The project includes a `.cursorrules` file that automatically configures the MCP server when you open this project in Cursor.

#### **Automatic Setup (Recommended)**
1. **Open the project** in Cursor
2. **Restart Cursor** to load the MCP server configuration
3. **Verify connection** - you should see MCP tools available

#### **Manual Setup (Alternative)**
If automatic setup doesn't work, manually configure Cursor:

1. **Open Cursor Settings** → **Tools & Integrations** → **New MCP server**
2. **Configure with these values**:
   ```json
   {
     "name": "tokenflow",
     "command": "node",
     "args": ["/path/to/tokenflow/packages/mcp/simple-server.js"],
     "env": {
       "BRIDGE_URL": "http://localhost:4000"
     }
   }
   ```
   > **Note**: Replace `/path/to/tokenflow/` with your actual project path

#### **Project-Specific Configuration**
The `.cursorrules` file in this project root provides:
- ✅ **Automatic MCP server setup** when project is opened
- ✅ **Relative paths** that work for any user
- ✅ **Version-controlled configuration** shared with the team
- ✅ **Project isolation** - only active in this project

## 🎯 Usage Examples

### Extract Tokens from Figma

1. **Start bridge server**:
   ```bash
   cd packages/bridge && npm start
   ```

2. **Open dashboard**:
   ```bash
   open http://localhost:4000
   ```

3. **Run Figma plugin**:
   - Open Figma
   - Run Tokenflow plugin
   - Tokens appear instantly in dashboard

### Build Components with Tokens

```bash
# Navigate to core package
cd packages/core

# Generate flat token aliases
node generate-flat-aliases.js

# Build CSS tokens
npm run build:tokens

# Start Storybook
cd ../../apps/storybook && npm start
```

### Use MCP Server with Cursor

```bash
# Start MCP server
cd packages/mcp && npm start

# In Cursor, use MCP tools:
# /getCurrentTokens - Get latest tokens
# /getBridgeStatus - Check server status
# /watchForUpdates - Monitor real-time updates
```

## 🚨 Troubleshooting

### Bridge Server Issues

```bash
# Check if server is running
curl http://localhost:4000/health

# Check server logs
cd packages/bridge && npm start

# Kill existing processes
pkill -f "node.*server.cjs"
```

### WebSocket Connection Issues

```bash
# Test WebSocket connection
curl -i -N -H "Connection: Upgrade" -H "Upgrade: websocket" \
     -H "Sec-WebSocket-Key: SGVsbG8sIHdvcmxkIQ==" \
     -H "Sec-WebSocket-Version: 13" \
     http://localhost:4000
```

### Plugin Issues

1. **Check plugin manifest**: Verify `packages/plugin/manifest.json`
2. **Re-upload plugin**: Remove and re-import in Figma
3. **Check console**: Open browser dev tools for errors

### MCP Server Issues

```bash
# Check MCP server status
cd packages/mcp && npm start

# Test bridge connection
node test-bridge-directly.js

# Check configuration
cat cursor-config.json
```

## 📚 API Reference

### Bridge Server API

- `GET /health` - Server health check
- `GET /api/tokens` - Get latest tokens
- `POST /api/tokens` - Store new tokens
- `GET /api/projects` - List projects
- `GET /api/history` - Token history

### WebSocket Events

- `tokenData` - New token data received
- `connection` - Client connected
- `disconnect` - Client disconnected

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test the pipeline
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

- **Issues**: Create GitHub issues for bugs
- **Discussions**: Use GitHub discussions for questions
- **Documentation**: Check `docs/` folder for detailed guides

---

**🎉 Tokenflow is now a production-ready design token pipeline with real-time capabilities!**
