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
      
      // 檢查是否有 optimizeCss 但缺少 critters
      if (config.includes('optimizeCss: true')) {
        const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectRoot, 'package.json')));
        if (!packageJson.devDependencies?.critters) {
          this.issues.push({
            type: 'nextjs',
            category: 'missing_critters',
            message: '啟用 CSS 優化但缺少 critters 依賴',
            autoFix: true
          });
        }
      }
    }
  }

  // 檢查依賴版本衝突
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
          case 'prisma_missing_generate':
            await this.fixPrismaBuildScript();
            break;
          case 'prisma_missing_postinstall':
            await this.fixPrismaPostinstall();
            break;
          case 'nextjs_missing_critters':
            await this.fixCrittersDependency();
            break;
          case 'typescript_enum_mismatch':
            await this.fixEnumMismatch();
            break;
        }
      } catch (error) {
        this.log(`修復 ${issue.message} 失敗: ${error.message}`, 'error');
      }
    }
  }

  async fixPrismaBuildScript() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    
    packageJson.scripts.build = 'prisma generate && next build';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.fixes.push('修復 Prisma build script');
    this.log('已修復 build script', 'success');
  }

  async fixPrismaPostinstall() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    
    packageJson.scripts.postinstall = 'prisma generate';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.fixes.push('新增 postinstall hook');
    this.log('已新增 postinstall hook', 'success');
  }

  async fixCrittersDependency() {
    const packageJsonPath = path.join(this.projectRoot, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath));
    
    packageJson.devDependencies = packageJson.devDependencies || {};
    packageJson.devDependencies.critters = '^0.0.20';
    
    fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2));
    this.fixes.push('新增 critters 依賴');
    this.log('已新增 critters 依賴', 'success');
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
        
        // 自動提交修復
        try {
          execSync('git add .', { cwd: this.projectRoot });
          execSync(`git commit -m "自動修復部署問題

${this.fixes.join('\n- ')}

🤖 Generated by Deployment Doctor"`, { cwd: this.projectRoot });
          this.log('已自動提交修復', 'success');
        } catch (error) {
          this.log('提交修復時發生錯誤', 'warning');
        }
      }
    }
    
    const manualIssues = this.issues.filter(i => !i.autoFix);
    if (manualIssues.length > 0) {
      console.log('\n⚠️  需要手動處理的問題：');
      manualIssues.forEach(issue => {
        this.log(issue.message, 'warning');
      });
    }
  }

  // 監控部署日誌
  async monitorDeployment(logUrl) {
    this.log('開始監控部署...', 'info');
    // 這裡可以實作 Vercel API 監控
  }
}

// CLI 執行
if (require.main === module) {
  const doctor = new DeploymentDoctor();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'diagnose':
    case undefined:
      doctor.diagnose().catch(console.error);
      break;
    case 'monitor':
      const logUrl = process.argv[3];
      doctor.monitorDeployment(logUrl).catch(console.error);
      break;
    default:
      console.log(`
🏥 Guidee 部署診斷醫生

用法:
  node scripts/deployment-doctor.js diagnose    # 診斷並自動修復問題
  node scripts/deployment-doctor.js monitor     # 監控部署狀態
      `);
  }
}

module.exports = DeploymentDoctor;