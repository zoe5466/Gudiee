#!/usr/bin/env node

/**
 * Vercel 部署監控器 📡
 * 自動監控 Vercel 部署狀態並診斷錯誤
 */

const https = require('https');
const { execSync } = require('child_process');
const DeploymentDoctor = require('./deployment-doctor');

class VercelMonitor {
  constructor() {
    this.doctor = new DeploymentDoctor();
    this.deploymentId = null;
    this.projectId = null;
    this.checkInterval = 10000; // 10 秒檢查一次
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('zh-TW');
    const icons = {
      info: '📡',
      success: '✅', 
      warning: '⚠️',
      error: '❌',
      building: '🔨',
      deploying: '🚀'
    };
    console.log(`[${timestamp}] ${icons[type]} ${message}`);
  }

  // 獲取 Vercel 專案資訊
  async getProjectInfo() {
    try {
      const result = execSync('npx vercel --version', { stdio: 'pipe' });
      this.log('Vercel CLI 已安裝', 'success');
      
      // 獲取專案 ID (如果 .vercel/project.json 存在)
      try {
        const fs = require('fs');
        const vercelConfig = JSON.parse(fs.readFileSync('.vercel/project.json'));
        this.projectId = vercelConfig.projectId;
        this.log(`專案 ID: ${this.projectId}`, 'info');
      } catch (e) {
        this.log('未找到 .vercel/project.json，請先執行 vercel link', 'warning');
      }
    } catch (error) {
      this.log('請先安裝 Vercel CLI: npm i -g vercel', 'error');
    }
  }

  // 觸發部署
  async triggerDeploy() {
    this.log('觸發 Vercel 部署...', 'deploying');
    
    try {
      // 先診斷問題
      await this.doctor.diagnose();
      
      // 推送到 Git (觸發 Vercel 部署)
      execSync('git push origin main', { stdio: 'inherit' });
      
      this.log('Git 推送成功，Vercel 部署已觸發', 'success');
      
      // 開始監控
      setTimeout(() => this.startMonitoring(), 5000);
      
    } catch (error) {
      this.log(`部署觸發失敗: ${error.message}`, 'error');
    }
  }

  // 開始監控部署
  async startMonitoring() {
    this.log('開始監控部署狀態...', 'info');
    
    const checkDeployment = async () => {
      try {
        // 獲取最新部署狀態
        const deployments = execSync(`npx vercel ls --scope team_guidee || npx vercel ls`, { 
          stdio: 'pipe' 
        }).toString();
        
        const lines = deployments.split('\n');
        const latestDeployment = lines[1]; // 跳過標題行
        
        if (latestDeployment) {
          const status = this.parseDeploymentStatus(latestDeployment);
          this.handleDeploymentStatus(status);
        }
        
      } catch (error) {
        this.log('獲取部署狀態失敗', 'error');
      }
    };
    
    // 每 10 秒檢查一次
    const interval = setInterval(checkDeployment, this.checkInterval);
    
    // 30 分鐘後停止監控
    setTimeout(() => {
      clearInterval(interval);
      this.log('監控時間結束', 'info');
    }, 30 * 60 * 1000);
    
    // 立即檢查一次
    await checkDeployment();
  }

  parseDeploymentStatus(deploymentLine) {
    // 解析 vercel ls 輸出格式
    const parts = deploymentLine.trim().split(/\s+/);
    
    return {
      url: parts[0],
      status: parts[1],
      age: parts[2],
      source: parts[3]
    };
  }

  async handleDeploymentStatus(status) {
    switch (status.status?.toLowerCase()) {
      case 'building':
        this.log('部署構建中...', 'building');
        break;
        
      case 'ready':
        this.log(`部署成功！🎉 URL: ${status.url}`, 'success');
        break;
        
      case 'error':
      case 'failed':
        this.log('部署失敗！開始診斷問題...', 'error');
        await this.handleDeploymentFailure(status);
        break;
        
      default:
        this.log(`部署狀態: ${status.status || 'unknown'}`, 'info');
    }
  }

  async handleDeploymentFailure(status) {
    this.log('分析部署失敗原因...', 'error');
    
    try {
      // 獲取部署日誌 (需要實作)
      // const logs = await this.getDeploymentLogs(status.url);
      
      // 運行診斷
      await this.doctor.diagnose();
      
      // 如果有自動修復，重新部署
      if (this.doctor.fixes.length > 0) {
        this.log('發現可修復的問題，準備重新部署...', 'info');
        setTimeout(() => this.triggerDeploy(), 5000);
      }
      
    } catch (error) {
      this.log(`診斷失敗: ${error.message}`, 'error');
    }
  }

  // 智能部署：診斷 -> 修復 -> 部署 -> 監控
  async smartDeploy() {
    console.log(`
🚀 Guidee 智能部署系統啟動
===========================
`);
    
    // 1. 獲取專案資訊
    await this.getProjectInfo();
    
    // 2. 觸發部署（包含診斷和修復）
    await this.triggerDeploy();
  }

  // 僅診斷模式
  async diagnoseOnly() {
    console.log(`
🏥 Guidee 部署診斷模式
====================
`);
    
    await this.doctor.diagnose();
  }
}

// CLI 執行
if (require.main === module) {
  const monitor = new VercelMonitor();
  const command = process.argv[2];
  
  switch (command) {
    case 'deploy':
    case 'smart-deploy':
    case undefined:
      monitor.smartDeploy().catch(console.error);
      break;
      
    case 'diagnose':
      monitor.diagnoseOnly().catch(console.error);
      break;
      
    case 'monitor':
      monitor.startMonitoring().catch(console.error);
      break;
      
    default:
      console.log(`
🚀 Guidee Vercel 監控系統

用法:
  npm run deploy              # 智能部署 (診斷 -> 修復 -> 部署 -> 監控)
  npm run deploy:diagnose     # 僅診斷問題
  npm run deploy:monitor      # 僅監控現有部署
      `);
  }
}

module.exports = VercelMonitor;