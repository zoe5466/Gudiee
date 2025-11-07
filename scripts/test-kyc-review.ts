import { prisma } from '../src/lib/prisma';

async function testKYCReview() {
  console.log('測試 KYC 審核功能...\n');

  // 1. 獲取待審核的申請
  console.log('1. 獲取待審核申請：');
  const pendingSubmissions = await prisma.kycSubmission.findMany({
    where: { status: 'pending' },
    include: { user: { select: { id: true, name: true, email: true, isKycVerified: true, isCriminalRecordVerified: true } } }
  });

  console.log(`找到 ${pendingSubmissions.length} 個待審核申請：`);
  pendingSubmissions.forEach((sub, index) => {
    console.log(`  ${index + 1}. ${sub.user.name} (${sub.user.email})`);
    console.log(`     良民證: ${sub.criminalRecordUrl ? '已上傳' : '未上傳'}`);
  });

  if (pendingSubmissions.length === 0) {
    console.log('沒有待審核申請，結束測試。');
    return;
  }

  // 2. 批准第一個申請
  const firstSubmission = pendingSubmissions[0];
  if (!firstSubmission) {
    console.log('沒有待審核申請，結束測試。');
    return;
  }
  console.log(`\n2. 批准申請：${firstSubmission.user.name}`);

  // 模擬管理員審核 - 批准
  const result = await prisma.$transaction(async (prisma) => {
    // 更新 KYC 申請狀態
    const updatedSubmission = await prisma.kycSubmission.update({
      where: { id: firstSubmission.id },
      data: {
        status: 'approved',
        reviewedBy: '182d859f-2630-4357-9676-bae8a8fe95a2', // 管理員 ID
        reviewedAt: new Date()
      }
    });

    // 更新用戶驗證狀態
    const updateData: any = {
      isKycVerified: true,
      updatedAt: new Date()
    };

    // 如果有良民證，也更新良民證驗證狀態
    if (firstSubmission.criminalRecordUrl) {
      updateData.isCriminalRecordVerified = true;
    }

    const updatedUser = await prisma.user.update({
      where: { id: firstSubmission.userId },
      data: updateData
    });

    return { submission: updatedSubmission, user: updatedUser };
  });

  console.log(`   申請狀態: ${result.submission.status}`);
  console.log(`   KYC 驗證: ${result.user.isKycVerified}`);
  console.log(`   良民證驗證: ${result.user.isCriminalRecordVerified}`);

  // 3. 拒絕第二個申請（如果存在）
  if (pendingSubmissions.length > 1) {
    const secondSubmission = pendingSubmissions[1];
    if (!secondSubmission) return;
    console.log(`\n3. 拒絕申請：${secondSubmission.user.name}`);

    const rejectionResult = await prisma.$transaction(async (prisma) => {
      // 更新 KYC 申請狀態
      const updatedSubmission = await prisma.kycSubmission.update({
        where: { id: secondSubmission.id },
        data: {
          status: 'rejected',
          reviewedBy: '182d859f-2630-4357-9676-bae8a8fe95a2', // 管理員 ID
          reviewedAt: new Date(),
          rejectionReason: '提供的身分證照片不清晰，請重新上傳高品質照片'
        }
      });

      // 確保驗證狀態為 false
      const updatedUser = await prisma.user.update({
        where: { id: secondSubmission.userId },
        data: {
          isKycVerified: false,
          isCriminalRecordVerified: false,
          updatedAt: new Date()
        }
      });

      return { submission: updatedSubmission, user: updatedUser };
    });

    console.log(`   申請狀態: ${rejectionResult.submission.status}`);
    console.log(`   拒絕原因: ${rejectionResult.submission.rejectionReason}`);
    console.log(`   KYC 驗證: ${rejectionResult.user.isKycVerified}`);
    console.log(`   良民證驗證: ${rejectionResult.user.isCriminalRecordVerified}`);
  }

  // 4. 檢查最終狀態
  console.log('\n4. 最終審核狀態統計：');
  const stats = await prisma.kycSubmission.groupBy({
    by: ['status'],
    _count: { status: true }
  });

  stats.forEach(stat => {
    const statusText = stat.status === 'pending' ? '等待審核' : 
                      stat.status === 'approved' ? '已通過' : 
                      stat.status === 'rejected' ? '已拒絕' : stat.status;
    console.log(`   ${statusText}: ${stat._count.status} 個`);
  });

  console.log('\nKYC 審核功能測試完成！');
}

testKYCReview()
  .catch((e) => {
    console.error('測試錯誤:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });