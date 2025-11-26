'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, X } from 'lucide-react'
import { useAuth } from '@/hooks/use-auth'

interface CreatePostFormData {
  title: string
  content: string
  coverImage: string
  category: string
  tags: string[]
  location: string
  status: 'draft' | 'published'
  embeddedServices: Array<{
    serviceId: string
    embedType: 'card' | 'inline'
    customText: string
  }>
}

const CATEGORIES = [
  { id: 'food', label: '美食' },
  { id: 'culture', label: '文化' },
  { id: 'nature', label: '自然' },
  { id: 'city', label: '城市' },
  { id: 'nightlife', label: '夜生活' },
  { id: 'shopping', label: '購物' },
  { id: 'history', label: '歷史' },
  { id: 'beach', label: '海岸' },
]

export default function CreatePostPage() {
  const router = useRouter()
  const { user } = useAuth()
  const [formData, setFormData] = useState<CreatePostFormData>({
    title: '',
    content: '',
    coverImage: '',
    category: 'culture',
    tags: [],
    location: '',
    status: 'published',
    embeddedServices: [],
  })
  const [tagInput, setTagInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [availableServices, setAvailableServices] = useState<any[]>([])
  const [loadingServices, setLoadingServices] = useState(false)

  // 獲取可用服務列表
  useEffect(() => {
    if (!user) return

    const fetchServices = async () => {
      try {
        setLoadingServices(true)
        const params = new URLSearchParams()
        if (user.role === 'guide') {
          params.append('guideId', user.id)
        }

        const response = await fetch(`/api/services?${params}`)
        if (!response.ok) throw new Error('Failed to fetch services')

        const { data } = await response.json()
        setAvailableServices(data || [])
      } catch (err) {
        console.error('Error fetching services:', err)
      } finally {
        setLoadingServices(false)
      }
    }

    fetchServices()
  }, [user])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, tagInput.trim()],
      }))
      setTagInput('')
    }
  }

  const handleRemoveTag = (tag: string) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((t) => t !== tag),
    }))
  }

  const handleAddService = (serviceId: string) => {
    if (!formData.embeddedServices.find((s) => s.serviceId === serviceId)) {
      setFormData((prev) => ({
        ...prev,
        embeddedServices: [
          ...prev.embeddedServices,
          {
            serviceId,
            embedType: 'card',
            customText: '',
          },
        ],
      }))
    }
  }

  const handleRemoveService = (serviceId: string) => {
    setFormData((prev) => ({
      ...prev,
      embeddedServices: prev.embeddedServices.filter((s) => s.serviceId !== serviceId),
    }))
  }

  const handleUpdateService = (serviceId: string, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      embeddedServices: prev.embeddedServices.map((s) =>
        s.serviceId === serviceId ? { ...s, [field]: value } : s
      ),
    }))
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published') => {
    e.preventDefault()

    if (!formData.title.trim()) {
      setError('請輸入標題')
      return
    }

    if (!formData.content.trim()) {
      setError('請輸入內容')
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          status,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create post')
      }

      const { data } = await response.json()
      router.push(`/posts/${data.id}`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[#cfdbe9]">
        <div className="text-center">
          <p className="text-gray-700 mb-4">請先登入</p>
          <Link href="/auth/login" className="text-[#002C56] hover:underline">
            前往登入
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-[#cfdbe9] min-h-screen py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        {/* 返回按鈕 */}
        <Link href="/my-content" className="flex items-center gap-2 text-[#002C56] hover:underline mb-6">
          <ArrowLeft size={20} />
          返回
        </Link>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-8">建立新貼文</h1>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 text-red-700">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleSubmit(e, formData.status)}>
            {/* 標題 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                標題 *
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="輸入貼文標題"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56]"
                required
              />
            </div>

            {/* 分類 */}
            <div className="mb-6 grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  分類 *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  位置
                </label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  placeholder="例：台北市信義區"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56]"
                />
              </div>
            </div>

            {/* 封面圖片 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                封面圖片 URL
              </label>
              <input
                type="url"
                name="coverImage"
                value={formData.coverImage}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56]"
              />
              {formData.coverImage && (
                <div className="mt-4 rounded-lg overflow-hidden">
                  <img
                    src={formData.coverImage}
                    alt="Cover preview"
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
            </div>

            {/* 內容 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                內容 *
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleChange}
                placeholder="輸入貼文內容（支援 HTML）"
                rows={12}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56] font-mono text-sm"
                required
              />
              <p className="text-xs text-gray-500 mt-2">支援 HTML 標籤進行格式設置</p>
            </div>

            {/* 標籤 */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                標籤
              </label>
              <div className="flex gap-2 mb-3">
                <input
                  type="text"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
                  placeholder="輸入標籤後按 Enter"
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-[#002C56]"
                />
                <button
                  type="button"
                  onClick={handleAddTag}
                  className="px-4 py-2 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41]"
                >
                  <Plus size={20} />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {formData.tags.map((tag) => (
                  <div
                    key={tag}
                    className="flex items-center gap-2 bg-blue-100 text-blue-700 px-3 py-1 rounded-full"
                  >
                    {tag}
                    <button
                      type="button"
                      onClick={() => handleRemoveTag(tag)}
                      className="hover:text-blue-900"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* 嵌入商品 */}
            <div className="mb-8">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                嵌入商品/服務
              </label>

              {/* 可用商品列表 */}
              {user.role === 'guide' || user.role === 'customer' ? (
                <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="font-semibold text-gray-900 mb-3">
                    {loadingServices ? '載入中...' : `可用服務 (${availableServices.length})`}
                  </h3>
                  {availableServices.length > 0 ? (
                    <div className="grid grid-cols-2 gap-3">
                      {availableServices.map((service) => (
                        <button
                          key={service.id}
                          type="button"
                          onClick={() => handleAddService(service.id)}
                          disabled={formData.embeddedServices.some(
                            (s) => s.serviceId === service.id
                          )}
                          className={`p-3 rounded-lg border-2 text-left transition-colors ${
                            formData.embeddedServices.some((s) => s.serviceId === service.id)
                              ? 'border-[#002C56] bg-blue-50'
                              : 'border-gray-300 hover:border-[#002C56]'
                          }`}
                        >
                          <p className="font-medium text-gray-900">{service.title}</p>
                          <p className="text-sm text-gray-600">${service.price}</p>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-600">
                      {user.role === 'guide'
                        ? '沒有商品，請先'
                        : '暫無可嵌入的商品'}
                      {user.role === 'guide' && (
                        <Link href="/guide/services/create" className="text-[#002C56] hover:underline">
                          {' '}
                          建立服務
                        </Link>
                      )}
                    </p>
                  )}
                </div>
              ) : null}

              {/* 已嵌入商品 */}
              {formData.embeddedServices.length > 0 && (
                <div className="space-y-4">
                  {formData.embeddedServices.map((embed) => {
                    const service = availableServices.find((s) => s.id === embed.serviceId)
                    return (
                      <div key={embed.serviceId} className="p-4 border border-gray-200 rounded-lg">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h4 className="font-semibold text-gray-900">{service?.title}</h4>
                            <p className="text-sm text-gray-600">${service?.price}</p>
                          </div>
                          <button
                            type="button"
                            onClick={() => handleRemoveService(embed.serviceId)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <X size={20} />
                          </button>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-semibold text-gray-700 block mb-1">
                              顯示方式
                            </label>
                            <select
                              value={embed.embedType}
                              onChange={(e) =>
                                handleUpdateService(embed.serviceId, 'embedType', e.target.value)
                              }
                              className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                            >
                              <option value="card">卡片</option>
                              <option value="inline">行內</option>
                            </select>
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="text-xs font-semibold text-gray-700 block mb-1">
                            推薦文案
                          </label>
                          <textarea
                            value={embed.customText}
                            onChange={(e) =>
                              handleUpdateService(embed.serviceId, 'customText', e.target.value)
                            }
                            placeholder="為什麼推薦這個商品？"
                            rows={3}
                            className="w-full px-3 py-1 border border-gray-300 rounded text-sm"
                          />
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>

            {/* 操作按鈕 */}
            <div className="flex gap-4">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={loading}
                className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium disabled:opacity-50"
              >
                {loading ? '保存中...' : '儲存為草稿'}
              </button>
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#002C56] text-white rounded-lg hover:bg-[#001f41] font-medium disabled:opacity-50"
              >
                {loading ? '發布中...' : '發布貼文'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
