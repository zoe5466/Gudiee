import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { PostFeed } from '@/components/post/post-feed'
import { prisma } from '@/lib/prisma'

interface CreatorPageProps {
  params: {
    userId: string
  }
}

export async function generateMetadata({ params }: CreatorPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    select: { name: true },
  })

  return {
    title: user ? `${user.name} - 創作者頁面` : 'Creator not found',
  }
}

export default async function CreatorPage({ params }: CreatorPageProps) {
  const user = await prisma.user.findUnique({
    where: { id: params.userId },
    include: {
      userProfile: true,
      posts: {
        where: { status: 'published' },
        select: {
          id: true,
        },
      },
      _count: {
        select: {
          posts: { where: { status: 'published' } },
          postLikes: { where: { likeType: 'like' } },
        },
      },
    },
  })

  if (!user) {
    notFound()
  }

  // 計算總瀏覽量
  const totalViews = await prisma.post.aggregate({
    where: {
      authorId: params.userId,
      status: 'published',
    },
    _sum: {
      viewCount: true,
    },
  })

  const profile = user.userProfile
  const postCount = user._count.posts
  const totalViewCount = totalViews._sum.viewCount || 0

  return (
    <div className="bg-[#cfdbe9] min-h-screen py-8">
      <div className="container mx-auto px-4">
        {/* 創作者卡片 */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <div className="flex flex-col md:flex-row gap-8 items-start">
            {/* 頭像和基本資訊 */}
            <div className="flex flex-col items-center md:items-start">
              {user.avatar ? (
                <Image
                  src={user.avatar}
                  alt={user.name}
                  width={120}
                  height={120}
                  className="w-32 h-32 rounded-full object-cover mb-4"
                />
              ) : (
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white text-4xl font-bold mb-4">
                  {user.name[0]}
                </div>
              )}

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold mb-2">{user.name}</h1>
                <div className="flex gap-2 mb-4 justify-center md:justify-start">
                  <span className="inline-block bg-[#002C56] text-white px-3 py-1 rounded-full text-sm font-medium">
                    {user.role === 'GUIDE' ? '認證地陪' : '旅遊愛好者'}
                  </span>
                  {user.isKycVerified && (
                    <span className="inline-block bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                      ✓ 已驗證
                    </span>
                  )}
                </div>

                {profile?.bio && (
                  <p className="text-gray-700 mb-4 max-w-md">{profile.bio}</p>
                )}

                {profile?.location && (
                  <p className="text-gray-600 mb-4">📍 {profile.location}</p>
                )}

                {profile?.languages && profile.languages.length > 0 && (
                  <p className="text-gray-600 mb-4">
                    🗣️ {profile.languages.join(', ')}
                  </p>
                )}
              </div>
            </div>

            {/* 統計資訊 */}
            <div className="flex-1 grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-3xl font-bold text-[#002C56]">{postCount}</p>
                <p className="text-gray-600 text-sm mt-2">貼文</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-3xl font-bold text-purple-600">{totalViewCount}</p>
                <p className="text-gray-600 text-sm mt-2">瀏覽</p>
              </div>
              <div className="text-center p-4 bg-pink-50 rounded-lg">
                <p className="text-3xl font-bold text-pink-600">
                  {user._count.postLikes}
                </p>
                <p className="text-gray-600 text-sm mt-2">個讚</p>
              </div>
            </div>
          </div>

          {/* 關於創作者 */}
          {user.role === 'GUIDE' && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h2 className="text-xl font-bold mb-4">關於我</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile?.specialties && profile.specialties.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-2">專長</h3>
                    <ul className="list-disc list-inside text-gray-700">
                      {profile.specialties.map((spec) => (
                        <li key={spec}>{spec}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {profile?.experienceYears && (
                  <div>
                    <h3 className="font-semibold mb-2">經驗</h3>
                    <p className="text-gray-700">{profile.experienceYears} 年導遊經驗</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 操作按鈕 */}
          <div className="mt-8 flex gap-4">
            <button className="flex-1 bg-[#002C56] text-white py-3 rounded-lg hover:bg-[#001f41] font-medium">
              {user.role === 'GUIDE' ? '查看服務' : '送訊息'}
            </button>
            {user.role === 'GUIDE' && (
              <button className="flex-1 border-2 border-[#002C56] text-[#002C56] py-3 rounded-lg hover:bg-[#cfdbe9] font-medium">
                關注
              </button>
            )}
          </div>
        </div>

        {/* 貼文列表 */}
        <div className="bg-white rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-6">最新貼文</h2>
          <PostFeed authorId={params.userId} displayMode="grid" />
        </div>

        {/* 地陪的服務列表 */}
        {user.role === 'GUIDE' && (
          <div className="bg-white rounded-lg p-6 mt-8">
            <h2 className="text-2xl font-bold mb-6">我的服務</h2>
            <div className="text-center py-12">
              <p className="text-gray-500">地陪服務列表（未來實裝）</p>
              <Link
                href={`/guide/services`}
                className="mt-4 inline-block bg-[#002C56] text-white px-6 py-2 rounded-lg hover:bg-[#001f41]"
              >
                查看所有服務
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
