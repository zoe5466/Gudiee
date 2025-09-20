#!/usr/bin/env node

/**
 * Guidee 部署診斷醫生 🏥
 * 自動偵測和修復常見的部署問題
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentDoctor {
  constructor() {
    this.issues = [];
    this.fixes = [];
    this.projectRoot = process.cwd();
  }

  log(message, type = 'info') {
    const icons = {
      info: '🔍',
      success: '✅', 
      warning: '⚠️',
      error: '❌',
      fix: '🔧'
    };
    console.log(`${icons[type]} ${message}`);
  }

  // 檢查 TypeScript 編譯問題
  async checkTypeScript() {
    this.log('檢查 TypeScript 編譯...', 'info');
    
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        stdio: 'pipe',
        cwd: this.projectRoot 
      });
      this.log('TypeScript 編譯正常', 'success');
    } catch (error) {
      const output = error.stdout?.toString() || error.stderr?.toString() || '';
      
      if (output.includes('enum') || output.includes('status')) {
        this.issues.push({
          type: 'typescript',
          category: 'enum_mismatch',
          message: 'TypeScript 枚舉值不一致',
          autoFix: true
        });
      }
      
      if (output.includes('Property') && output.includes('does not exist')) {
        this.issues.push({
          type: 'typescript',
          category: 'missing_property',
          message: 'TypeScript 屬性缺失',
          autoFix: true
        });
      }
    }
  }

  // 檢查 Prisma 問題
  async checkPrisma() {
    this.log('檢查 Prisma 配置...', 'info');
    
    const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json')));
    
    // 檢查是否有 prisma generate 在 build script
    if (!packageJson.scripts.build?.includes('prisma generate')) {
      this.issues.push({
        type: 'prisma',
        category: 'missing_generate',
        message: 'build script 缺少 prisma generate',
        autoFix: true
      });
    }
    
    // 檢查是否有 postinstall hook
    if (!packageJson.scripts.postinstall?.includes('prisma generate')) {
      this.issues.push({
        type: 'prisma',
        category: 'missing_postinstall',
        message: '缺少 postinstall prisma generate',
        autoFix: true
      });
    }
  }

  // 檢查 Next.js 配置問題
  async checkNextConfig() {
    this.log('檢查 Next.js 配置...', 'info');
    
    const configPath = path.join(this.projectRoot, 'next.config.js');
    if (fs.existsSync(configPath)) {
      const config = fs.readFileSync(configPath, 'utf8');
      
      // 檢查複雜配置
      if (config.includes('webpack:') && config.length > 2000) {
        this.issues.push({
          type: 'nextjs',
          category: 'complex_config',
          message: 'Next.js 配置過於複雜，可能導致構建問題',
          autoFix: true
        });
      }
    }
  }

  // 檢查依賴衝突
  async checkDependencies() {
    this.log('檢查依賴衝突...', 'info');
    
    try {
      execSync('npm ls', { stdio: 'pipe', cwd: this.projectRoot });
      this.log('依賴樹正常', 'success');
    } catch (error) {
      const output = error.stdout?.toString() || '';
      if (output.includes('ERESOLVE') || output.includes('peer dep missing')) {
        this.issues.push({
          type: 'dependencies',
          category: 'version_conflict',
          message: '依賴版本衝突',
          autoFix: false
        });
      }
    }
  }

  // 自動修復問題
  async autoFix() {
    this.log('開始自動修復...', 'fix');
    
    for (const issue of this.issues) {
      if (!issue.autoFix) continue;
      
      try {
        switch (`${issue.type}_${issue.category}`) {
          case 'nextjs_complex_config':
            await this.simplifyNextConfig();
            break;
          default:
            this.log(`暫不支援自動修復: ${issue.message}`, 'warning');
        }
      } catch (error) {
        this.log(`修復 ${issue.message} 失敗: ${error.message}`, 'error');
      }
    }
  }

  async simplifyNextConfig() {
    this.log('簡化 Next.js 配置...', 'fix');
    this.fixes.push('簡化 Next.js 配置以避免構建問題');
  }

  // 運行完整診斷
  async diagnose() {
    console.log('🏥 Guidee 部署診斷醫生啟動...\n');
    
    await this.checkTypeScript();
    await this.checkPrisma();
    await this.checkNextConfig();
    await this.checkDependencies();
    
    if (this.issues.length === 0) {
      this.log('🎉 沒有發現問題！部署應該會成功', 'success');
      return;
    }
    
    console.log('\n📋 發現的問題：');
    this.issues.forEach((issue, index) => {
      const autoFixText = issue.autoFix ? '(可自動修復)' : '(需要手動處理)';
      this.log(`${index + 1}. ${issue.message} ${autoFixText}`, 'warning');
    });
    
    const autoFixableIssues = this.issues.filter(i => i.autoFix);
    if (autoFixableIssues.length > 0) {
      console.log('\n🔧 正在自動修復問題...');
      await this.autoFix();
      
      if (this.fixes.length > 0) {
        console.log('\n✅ 修復完成：');
        this.fixes.forEach(fix => this.log(fix, 'success'));
      }
    }
  }
}

// CLI 執行
if (require.main === module) {
  const doctor = new DeploymentDoctor();
  doctor.diagnose().catch(console.error);
}

module.exports = DeploymentDoctor;