# Figma Plugin Upload Guide

## 📦 Plugin Location
The complete plugin is now located in the monorepo at:
```
packages/plugin/
├── manifest.json      # Plugin manifest
├── code.js           # Plugin logic
├── ui.html           # Plugin UI
└── *.js              # Supporting files
```

## 🚀 Upload Steps

### 1. Create Plugin in Figma
1. Open Figma
2. Go to **Plugins** → **Development** → **New Plugin**
3. Choose **Import plugin from manifest**
4. Select the `manifest.json` file from `packages/plugin/`

### 2. Update Existing Plugin
If you already have the plugin installed:
1. Go to **Plugins** → **Development** → **Tokenflow Bridge**
2. Click **Update** or **Reload**
3. Select the updated `manifest.json` file

### 3. Test the Plugin
1. Open a design file with tokens
2. Run the **Tokenflow Bridge** plugin
3. Extract tokens from your design
4. Verify tokens appear in the bridge server dashboard

## 🔧 Plugin Configuration
The plugin is configured to send tokens to:
- **Bridge Server**: `http://localhost:4000/api/tokens`
- **Method**: POST
- **Content-Type**: application/json

## ✅ Verification
After uploading, test by:
1. Running the plugin in Figma
2. Checking `http://localhost:4000` for the dashboard
3. Verifying tokens are received by the bridge server

## 📝 Notes
- Make sure the bridge server is running (`npm run bridge`)
- The plugin will automatically filter and clean tokens before sending
- All token data is stored in the bridge server for MCP access 