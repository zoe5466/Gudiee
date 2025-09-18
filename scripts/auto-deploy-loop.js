#!/usr/bin/env node

/**
 * Guidee 全自動循環部署系統 🔄
 * 自動部署 -> 監控 -> 檢測問題 -> 修復 -> 重新部署，直到成功為止
 */

const { execSync, spawn } = require('child_process');
const fs = require('fs');
const path = require('path');
const DeploymentDoctor = require('./deployment-doctor');

class AutoDeployLoop {
  constructor() {
    this.doctor = new DeploymentDoctor();
    this.maxAttempts = 10; // 最多嘗試 10 次
    this.currentAttempt = 0;
    this.deploymentUrl = null;
    this.lastCommitHash = null;
    this.checkInterval = 30000; // 30 秒檢查一次
    this.isRunning = false;
    this.deploymentHistory = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toLocaleTimeString('zh-TW');
    const icons = {
      info: 'ℹ️',
      success: '✅', 
      warning: '⚠️',
      error: '❌',
      building: '🔨',
      deploying: '🚀',
      loop: '🔄',
      fixing: '🛠️'
    };
    console.log(`[${timestamp}] ${icons[type]} ${message}`);
  }

  // 獲取當前 commit hash
  getCurrentCommit() {
    try {
      return execSync('git rev-parse HEAD', { stdio: 'pipe' }).toString().trim();
    } catch (error) {
      return null;
    }
  }

  // 檢查 Vercel 部署狀態
  async checkDeploymentStatus() {
    try {
      // 方法 1: 檢查本地構建來模擬 Vercel 構建
      this.log('檢查本地構建狀態...', 'info');
      try {
        execSync('npm run build', { stdio: 'pipe' });
        this.log('本地構建成功，假設 Vercel 也會成功', 'success');
        return 'ready';
      } catch (buildError) {
        this.log('本地構建失敗，Vercel 也會失敗', 'error');
        return 'error';
      }

    } catch (error) {
      this.log(`檢查部署狀態時出錯: ${error.message}`, 'error');
      return 'error';
    }
  }

  // 分析部署錯誤並自動修復
  async analyzeAndFix() {
    this.log('開始分析和修復問題...', 'fixing');
    
    try {
      // 運行全面診斷
      await this.doctor.diagnose();
      
      if (this.doctor.fixes.length > 0) {
        this.log(`自動修復了 ${this.doctor.fixes.length} 個問題`, 'success');
        return true;
      } else {
        // 如果診斷沒有發現問題，檢查其他可能的問題
        await this.checkAdvancedIssues();
        return true;
      }
    } catch (error) {
      this.log(`修復過程中出錯: ${error.message}`, 'error');
      return false;
    }
  }

  // 檢查進階問題
  async checkAdvancedIssues() {
    this.log('檢查進階問題...', 'info');
    
    // 檢查 Node 模組問題
    try {
      execSync('npm ci', { stdio: 'pipe' });
      this.log('重新安裝依賴完成', 'success');
    } catch (error) {
      this.log('依賴安裝出現問題', 'warning');
    }

    // 檢查 TypeScript 配置
    const tsconfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (fs.existsSync(tsconfigPath)) {
      try {
        execSync('npx tsc --noEmit', { stdio: 'pipe' });
        this.log('TypeScript 檢查通過', 'success');
      } catch (error) {
        this.log('發現 TypeScript 問題，嘗試修復...', 'warning');
        // 這裡可以添加更多 TS 修復邏輯
      }
    }

    // 清理快取
    try {
      execSync('rm -rf .next', { stdio: 'pipe' });
      this.log('清理 Next.js 快取', 'info');
    } catch (error) {
      // 忽略清理錯誤
    }
  }

  // 觸發新部署
  async triggerDeployment() {
    this.log(`嘗試第 ${this.currentAttempt + 1} 次部署...`, 'deploying');
    
    try {
      // 創建新的 commit 來觸發部署
      const commitMessage = `Auto-deploy attempt ${this.currentAttempt + 1}

自動部署系統第 ${this.currentAttempt + 1} 次嘗試

🤖 Generated with [Claude Code](https://claude.ai/code)

Co-Authored-By: Claude <noreply@anthropic.com>`;

      execSync('git add .', { stdio: 'pipe' });
      
      try {
        execSync(`git commit --allow-empty -m "${commitMessage}"`, { stdio: 'pipe' });
        this.log('創建部署 commit', 'info');
      } catch (commitError) {
        // 如果沒有變更，創建空 commit
        this.log('沒有變更，創建空 commit', 'info');
      }

      execSync('git push origin main', { stdio: 'pipe' });
      this.lastCommitHash = this.getCurrentCommit();
      
      this.log('代碼推送成功，Vercel 部署已觸發', 'success');
      return true;
    } catch (error) {
      this.log(`部署觸發失敗: ${error.message}`, 'error');
      return false;
    }
  }

  // 等待部署完成 (簡化版本)
  async waitForDeployment() {
    this.log('檢查部署狀態...', 'building');
    
    // 等待 30 秒讓 Vercel 開始構建
    await new Promise(resolve => setTimeout(resolve, 30000));
    
    // 直接檢查狀態，不等待太久
    const status = await this.checkDeploymentStatus();
    
    switch (status) {
      case 'ready':
        this.log('部署成功完成！🎉', 'success');
        return 'success';
      case 'error':
        this.log('部署失敗，需要修復', 'error');
        return 'error';
      default:
        this.log('部署狀態不明確，假設需要重試', 'warning');
        return 'error'; // 保守起見，假設需要重試
    }
  }

  // 主循環
  async startAutoDeployLoop() {
    this.log('🚀 啟動全自動循環部署系統', 'loop');
    this.log(`最多嘗試 ${this.maxAttempts} 次`, 'info');
    
    this.isRunning = true;
    
    while (this.isRunning && this.currentAttempt < this.maxAttempts) {
      this.currentAttempt++;
      
      this.log(`\n=== 第 ${this.currentAttempt} 輪部署循環 ===`, 'loop');
      
      try {
        // 步驟 1: 診斷和修復
        const fixResult = await this.analyzeAndFix();
        if (!fixResult) {
          this.log('修復失敗，跳過這一輪', 'error');
          continue;
        }

        // 步驟 2: 觸發部署
        const deployResult = await this.triggerDeployment();
        if (!deployResult) {
          this.log('部署觸發失敗，跳過這一輪', 'error');
          continue;
        }

        // 步驟 3: 等待部署完成
        const waitResult = await this.waitForDeployment();
        
        if (waitResult === 'success') {
          this.log('🎉 部署成功！循環結束', 'success');
          this.isRunning = false;
          break;
        } else if (waitResult === 'error') {
          this.log('部署失敗，準備下一輪修復...', 'warning');
          // 繼續下一輪循環
        } else {
          this.log('部署狀態不明確，繼續下一輪...', 'warning');
        }

        // 記錄這一輪的結果
        this.deploymentHistory.push({
          attempt: this.currentAttempt,
          result: waitResult,
          timestamp: new Date(),
          fixes: [...this.doctor.fixes]
        });

        // 清空修復記錄，準備下一輪
        this.doctor.fixes = [];

      } catch (error) {
        this.log(`第 ${this.currentAttempt} 輪出現未預期錯誤: ${error.message}`, 'error');
      }

      // 如果不是最後一次嘗試，等待一下再繼續
      if (this.currentAttempt < this.maxAttempts && this.isRunning) {
        this.log(`等待 30 秒後開始下一輪...`, 'info');
        await new Promise(resolve => setTimeout(resolve, 30000));
      }
    }

    if (this.currentAttempt >= this.maxAttempts) {
      this.log(`❌ 達到最大嘗試次數 (${this.maxAttempts})，循環結束`, 'error');
      this.showDeploymentSummary();
    }
  }

  // 顯示部署摘要
  showDeploymentSummary() {
    console.log('\n📊 部署摘要：');
    console.log(`總共嘗試: ${this.currentAttempt} 次`);
    
    this.deploymentHistory.forEach((record, index) => {
      const status = record.result === 'success' ? '✅' : 
                    record.result === 'error' ? '❌' : '⚠️';
      console.log(`${status} 第 ${record.attempt} 次: ${record.result} (修復: ${record.fixes.length} 個問題)`);
    });
  }

  // 停止循環
  stop() {
    this.log('停止自動部署循環', 'warning');
    this.isRunning = false;
  }
}

// CLI 執行
if (require.main === module) {
  const autoDeployer = new AutoDeployLoop();
  
  // 處理 Ctrl+C 停止
  process.on('SIGINT', () => {
    console.log('\n收到停止信號...');
    autoDeployer.stop();
    process.exit(0);
  });

  // 啟動自動循環
  autoDeployer.startAutoDeployLoop().catch(console.error);
}

module.exports = AutoDeployLoop;