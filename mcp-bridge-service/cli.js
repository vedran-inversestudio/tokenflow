#!/usr/bin/env node

import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// CLI commands
const commands = {
  start: () => {
    console.log('🚀 Starting MCP-Bridge Service...');
    const servicePath = join(__dirname, 'index.js');
    const child = spawn('node', [servicePath], {
      stdio: 'inherit',
      env: { ...process.env }
    });
    
    child.on('error', (error) => {
      console.error('❌ Failed to start service:', error.message);
      process.exit(1);
    });
    
    child.on('exit', (code) => {
      if (code !== 0) {
        console.error(`❌ Service exited with code ${code}`);
        process.exit(code);
      }
    });
  },
  
  configure: () => {
    console.log('⚙️  MCP-Bridge Service Configuration');
    console.log('');
    
    const configPath = join(process.cwd(), '.mcp-bridge-config.json');
    let config = {};
    
    if (fs.existsSync(configPath)) {
      try {
        config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('📁 Current configuration:');
        console.log(JSON.stringify(config, null, 2));
      } catch (error) {
        console.error('❌ Could not read current configuration:', error.message);
      }
    } else {
      console.log('📁 No configuration file found. Creating new one...');
    }
    
    console.log('');
    console.log('💡 To configure the service:');
    console.log('1. Create .mcp-bridge-config.json in your project root');
    console.log('2. Add environment variables to .env file');
    console.log('3. Use /configureBridge tool in Cursor');
    console.log('');
    console.log('📝 Example configuration:');
    console.log(JSON.stringify({
      bridgeUrl: 'http://localhost:4000',
      bridgeWsUrl: 'ws://localhost:4000',
      projectId: 'my-project',
      reconnectInterval: 5000,
      maxReconnectAttempts: 10
    }, null, 2));
  },
  
  status: () => {
    console.log('📊 MCP-Bridge Service Status');
    console.log('');
    
    // Check if service is running
    const configPath = join(process.cwd(), '.mcp-bridge-config.json');
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
        console.log('✅ Configuration file found');
        console.log(`🔗 Bridge URL: ${config.bridgeUrl || 'Not set'}`);
        console.log(`📊 Project ID: ${config.projectId || 'default'}`);
      } catch (error) {
        console.error('❌ Could not read configuration:', error.message);
      }
    } else {
      console.log('⚠️  No configuration file found');
    }
    
    console.log('');
    console.log('💡 To check bridge server status:');
    console.log('curl http://localhost:4000/health');
  },
  
  help: () => {
    console.log('🆘 MCP-Bridge Service CLI');
    console.log('');
    console.log('Usage: mcp-bridge <command>');
    console.log('');
    console.log('Commands:');
    console.log('  start     Start the MCP-Bridge service');
    console.log('  configure Show configuration options');
    console.log('  status    Check service status');
    console.log('  help      Show this help message');
    console.log('');
    console.log('Examples:');
    console.log('  mcp-bridge start');
    console.log('  mcp-bridge configure');
    console.log('  mcp-bridge status');
    console.log('');
    console.log('📁 Files:');
    console.log('  .mcp-bridge-config.json  Local configuration');
    console.log('  .env                     Environment variables');
    console.log('  .cursorrules             Cursor configuration');
  }
};

// Parse command line arguments
const command = process.argv[2] || 'help';

if (commands[command]) {
  commands[command]();
} else {
  console.error(`❌ Unknown command: ${command}`);
  console.log('');
  commands.help();
  process.exit(1);
} 