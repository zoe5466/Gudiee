'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Plus, 
  Minus, 
  MapPin, 
  Calendar, 
  DollarSign, 
  Clock,
  AlertCircle,
  ChevronDown,
  X
} from 'lucide-react';

export default function CreateTaskPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    type: 'normal',
    priority: 'medium',
    budget: {
      min: '',
      max: '',
      currency: 'TWD'
    },
    location: {
      city: '',
      district: '',
      address: ''
    },
    timeline: {
      startDate: '',
      endDate: '',
      estimatedHours: '8'
    },
    requirements: [''],
    skills: [''],
    languages: [],
    tags: []
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = [
    { id: 'delivery', name: '送件配送', icon: '🚚' },
    { id: 'guide', name: '導遊服務', icon: '🗺️' },
    { id: 'translation', name: '翻譯服務', icon: '🗣️' },
    { id: 'photography', name: '攝影服務', icon: '📸' },
    { id: 'other', name: '其他服務', icon: '💼' }
  ];

  const types = [
    { id: 'urgent', name: '緊急任務', description: '需要立即完成' },
    { id: 'normal', name: '一般任務', description: '正常時程完成' },
    { id: 'long_term', name: '長期任務', description: '持續性工作' }
  ];

  const priorities = [
    { id: 'low', name: '低優先級', color: 'text-gray-600' },
    { id: 'medium', name: '中優先級', color: 'text-blue-600' },
    { id: 'high', name: '高優先級', color: 'text-orange-600' },
    { id: 'urgent', name: '緊急', color: 'text-red-600' }
  ];

  const commonLanguages = ['中文', '英文', '日文', '韓文', '西班牙文', '法文'];
  const commonSkills = ['導遊', '翻譯', '攝影', '設計', '寫作', '程式設計', '行銷', '客服'];

  const handleInputChange = (field: string, value: any) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent as string]: {
          ...(prev[parent as keyof typeof prev] as any),
          [child as string]: value
        }
      }));
    } else {
      setFormData(prev => ({ ...prev, [field]: value }));
    }
    
    // 清除相關錯誤
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const handleArrayChange = (field: 'requirements' | 'skills', index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? value : item)
    }));
  };

  const addArrayItem = (field: 'requirements' | 'skills') => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayItem = (field: 'requirements' | 'skills', index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const addTag = (tag: string, field: 'languages' | 'tags') => {
    const fieldValue = formData[field] as string[];
    if (!fieldValue.includes(tag)) {
      setFormData(prev => ({
        ...prev,
        [field]: [...fieldValue, tag]
      }));
    }
  };

  const removeTag = (tag: string, field: 'languages' | 'tags') => {
    const fieldValue = formData[field] as string[];
    setFormData(prev => ({
      ...prev,
      [field]: fieldValue.filter(t => t !== tag)
    }));
  };

  const validateStep = (stepNumber: number): boolean => {
    const newErrors: Record<string, string> = {};

    if (stepNumber === 1) {
      if (!formData.title.trim() || formData.title.length < 5) {
        newErrors.title = '任務標題至少需要5個字元';
      }
      if (!formData.description.trim() || formData.description.length < 20) {
        newErrors.description = '任務描述至少需要20個字元';
      }
      if (!formData.category) {
        newErrors.category = '請選擇任務分類';
      }
    }

    if (stepNumber === 2) {
      if (!formData.budget.min || parseFloat(formData.budget.min) <= 0) {
        newErrors['budget.min'] = '請輸入有效的最低預算';
      }
      if (!formData.budget.max || parseFloat(formData.budget.max) <= 0) {
        newErrors['budget.max'] = '請輸入有效的最高預算';
      }
      if (formData.budget.min && formData.budget.max && 
          parseFloat(formData.budget.min) > parseFloat(formData.budget.max)) {
        newErrors['budget.max'] = '最高預算不能低於最低預算';
      }
      if (!formData.location.city.trim()) {
        newErrors['location.city'] = '請輸入任務城市';
      }
      if (!formData.timeline.startDate) {
        newErrors['timeline.startDate'] = '請選擇開始日期';
      }
      if (!formData.timeline.endDate) {
        newErrors['timeline.endDate'] = '請選擇結束日期';
      }
      if (formData.timeline.startDate && formData.timeline.endDate &&
          new Date(formData.timeline.startDate) > new Date(formData.timeline.endDate)) {
        newErrors['timeline.endDate'] = '結束日期不能早於開始日期';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep(step + 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(2)) return;

    setIsSubmitting(true);
    
    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          requirements: formData.requirements.filter(r => r.trim()),
          skills: formData.skills.filter(s => s.trim())
        })
      });

      const data = await response.json();

      if (data.success) {
        router.push('/tasks');
      } else {
        if (data.errors) {
          setErrors(data.errors);
        } else {
          alert(data.message || '創建任務失敗');
        }
      }
    } catch (error) {
      console.error('Create task error:', error);
      alert('創建任務失敗，請稍後重試');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#cfdbe9] py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex items-center">
            {[1, 2, 3].map((num) => (
              <div key={num} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= num ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {num}
                </div>
                {num < 3 && (
                  <div className={`w-20 h-1 mx-2 ${
                    step > num ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between mt-2 text-sm text-gray-600">
            <span>基本資訊</span>
            <span>詳細設定</span>
            <span>發佈確認</span>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          {/* Step 1: 基本資訊 */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">基本資訊</h2>
              
              {/* 任務標題 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任務標題 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="簡潔明確地描述您的任務需求"
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.title ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.title && (
                  <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                )}
              </div>

              {/* 任務描述 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任務描述 *
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="詳細描述您的需求、期望和注意事項"
                  rows={4}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* 任務分類 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任務分類 *
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {categories.map((category) => (
                    <button
                      key={category.id}
                      type="button"
                      onClick={() => handleInputChange('category', category.id)}
                      className={`p-4 border rounded-lg text-left transition-colors ${
                        formData.category === category.id
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="text-2xl mb-2">{category.icon}</div>
                      <div className="font-medium">{category.name}</div>
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="mt-1 text-sm text-red-600">{errors.category}</p>
                )}
              </div>

              {/* 任務類型 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任務類型
                </label>
                <div className="space-y-2">
                  {types.map((type) => (
                    <label key={type.id} className="flex items-center">
                      <input
                        type="radio"
                        name="type"
                        value={type.id}
                        checked={formData.type === type.id}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                        className="mr-3"
                      />
                      <div>
                        <div className="font-medium">{type.name}</div>
                        <div className="text-sm text-gray-600">{type.description}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* 優先級 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  優先級
                </label>
                <select
                  value={formData.priority}
                  onChange={(e) => handleInputChange('priority', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  {priorities.map((priority) => (
                    <option key={priority.id} value={priority.id}>
                      {priority.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Step 2: 詳細設定 */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">詳細設定</h2>
              
              {/* 預算設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  預算範圍 (TWD) *
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <input
                      type="number"
                      value={formData.budget.min}
                      onChange={(e) => handleInputChange('budget.min', e.target.value)}
                      placeholder="最低預算"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['budget.min'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['budget.min'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['budget.min']}</p>
                    )}
                  </div>
                  <div>
                    <input
                      type="number"
                      value={formData.budget.max}
                      onChange={(e) => handleInputChange('budget.max', e.target.value)}
                      placeholder="最高預算"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['budget.max'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['budget.max'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['budget.max']}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* 地點設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  任務地點 *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <input
                      type="text"
                      value={formData.location.city}
                      onChange={(e) => handleInputChange('location.city', e.target.value)}
                      placeholder="城市"
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['location.city'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['location.city'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['location.city']}</p>
                    )}
                  </div>
                  <input
                    type="text"
                    value={formData.location.district}
                    onChange={(e) => handleInputChange('location.district', e.target.value)}
                    placeholder="區域（選填）"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <input
                  type="text"
                  value={formData.location.address}
                  onChange={(e) => handleInputChange('location.address', e.target.value)}
                  placeholder="詳細地址（選填）"
                  className="w-full mt-2 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* 時間設定 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  時間安排 *
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">開始日期</label>
                    <input
                      type="date"
                      value={formData.timeline.startDate}
                      onChange={(e) => handleInputChange('timeline.startDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['timeline.startDate'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['timeline.startDate'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['timeline.startDate']}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">結束日期</label>
                    <input
                      type="date"
                      value={formData.timeline.endDate}
                      onChange={(e) => handleInputChange('timeline.endDate', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                        errors['timeline.endDate'] ? 'border-red-500' : 'border-gray-300'
                      }`}
                    />
                    {errors['timeline.endDate'] && (
                      <p className="mt-1 text-sm text-red-600">{errors['timeline.endDate']}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">預估時數</label>
                    <input
                      type="number"
                      value={formData.timeline.estimatedHours}
                      onChange={(e) => handleInputChange('timeline.estimatedHours', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* 需求條件 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  需求條件
                </label>
                {formData.requirements.map((req, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={req}
                      onChange={(e) => handleArrayChange('requirements', index, e.target.value)}
                      placeholder="輸入需求條件"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.requirements.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('requirements', index)}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('requirements')}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新增需求條件
                </button>
              </div>

              {/* 所需技能 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  所需技能
                </label>
                {formData.skills.map((skill, index) => (
                  <div key={index} className="flex items-center mb-2">
                    <input
                      type="text"
                      value={skill}
                      onChange={(e) => handleArrayChange('skills', index, e.target.value)}
                      placeholder="輸入所需技能"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    {formData.skills.length > 1 && (
                      <button
                        type="button"
                        onClick={() => removeArrayItem('skills', index)}
                        className="ml-2 p-2 text-red-600 hover:bg-red-50 rounded"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => addArrayItem('skills')}
                  className="flex items-center text-blue-600 hover:text-blue-700 text-sm"
                >
                  <Plus className="w-4 h-4 mr-1" />
                  新增技能要求
                </button>
              </div>

              {/* 語言要求 */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  語言要求
                </label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {commonLanguages.map((lang) => (
                    <button
                      key={lang}
                      type="button"
                      onClick={() => addTag(lang, 'languages')}
                      disabled={(formData.languages as string[]).includes(lang)}
                      className={`px-3 py-1 rounded-full text-sm border ${
                        (formData.languages as string[]).includes(lang)
                          ? 'bg-blue-100 border-blue-300 text-blue-700'
                          : 'bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
                <div className="flex flex-wrap gap-2">
                  {(formData.languages as string[]).map((lang) => (
                    <span
                      key={lang}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-700"
                    >
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeTag(lang, 'languages')}
                        className="ml-2 text-blue-600 hover:text-blue-800"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: 發佈確認 */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">發佈確認</h2>
              
              <div className="bg-[#cfdbe9] rounded-lg p-6">
                <h3 className="text-lg font-semibold mb-4">任務摘要</h3>
                <div className="space-y-3">
                  <div>
                    <span className="text-sm text-gray-600">標題：</span>
                    <span className="font-medium">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">分類：</span>
                    <span className="font-medium">
                      {categories.find(c => c.id === formData.category)?.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">預算：</span>
                    <span className="font-medium">
                      NT$ {formData.budget.min} - {formData.budget.max}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">地點：</span>
                    <span className="font-medium">
                      {formData.location.city}
                      {formData.location.district && `, ${formData.location.district}`}
                    </span>
                  </div>
                  <div>
                    <span className="text-sm text-gray-600">時間：</span>
                    <span className="font-medium">
                      {formData.timeline.startDate} 至 {formData.timeline.endDate}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <div className="flex">
                  <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5 mr-3" />
                  <div className="text-sm text-yellow-800">
                    <p className="font-medium mb-1">發佈前請確認</p>
                    <ul className="list-disc list-inside space-y-1">
                      <li>任務資訊是否正確完整</li>
                      <li>預算範圍是否合理</li>
                      <li>時間安排是否可行</li>
                      <li>需求描述是否清楚</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-between pt-6 border-t">
            <button
              type="button"
              onClick={() => step > 1 ? setStep(step - 1) : router.back()}
              className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-[#cfdbe9] transition-colors"
            >
              {step > 1 ? '上一步' : '取消'}
            </button>
            
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                下一步
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? '發佈中...' : '發佈任務'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}