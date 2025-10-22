// 任務模擬數據存儲
// 功能：為開發階段提供任務相關的模擬數據

export interface MockTask {
  id: string;
  title: string;
  description: string;
  category: 'delivery' | 'guide' | 'translation' | 'photography' | 'other';
  type: 'urgent' | 'normal' | 'long_term';
  status: 'OPEN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  budget: {
    min: number;
    max: number;
    currency: string;
  };
  location: {
    city: string;
    district?: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  timeline: {
    startDate: string;
    endDate: string;
    estimatedHours: number;
  };
  requirements: string[];
  skills: string[];
  languages?: string[];
  clientId: string;
  assignedWorkerId?: string;
  applicants: Array<{
    workerId: string;
    workerName: string;
    workerAvatar?: string;
    appliedAt: string;
    proposedPrice: number;
    message: string;
    rating: number;
    completedTasks: number;
  }>;
  client: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTasks: number;
    isVerified: boolean;
    joinedAt: string;
  };
  assignedWorker?: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
    completedTasks: number;
    skills: string[];
  };
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    type: 'image' | 'document' | 'other';
    size: number;
  }>;
  tags: string[];
  views: number;
  applications: number;
  createdAt: string;
  updatedAt: string;
}

// 生成模擬任務數據
const mockTasks: MockTask[] = [
  {
    id: 'task-001',
    title: '台北市區半日導遊服務',
    description: '需要一位熟悉台北市區的導遊，帶領2位日本遊客參觀台北101、信義商圈等景點，需要日語溝通能力。',
    category: 'guide',
    type: 'normal',
    status: 'OPEN',
    priority: 'medium',
    budget: {
      min: 2000,
      max: 3500,
      currency: 'TWD'
    },
    location: {
      city: '台北市',
      district: '信義區',
      address: '台北101周邊'
    },
    timeline: {
      startDate: '2024-01-15',
      endDate: '2024-01-15',
      estimatedHours: 4
    },
    requirements: [
      '具備日語溝通能力',
      '熟悉台北市區景點',
      '有導遊經驗優先',
      '準時且親切'
    ],
    skills: ['導遊', '日語', '台北在地'],
    languages: ['中文', '日語'],
    clientId: 'client-001',
    applicants: [
      {
        workerId: 'worker-001',
        workerName: '王小美',
        workerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-10T10:30:00Z',
        proposedPrice: 2800,
        message: '我有5年台北導遊經驗，日語流利，可以提供專業且親切的服務。',
        rating: 4.9,
        completedTasks: 156
      },
      {
        workerId: 'worker-002',
        workerName: '李大明',
        workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-10T14:15:00Z',
        proposedPrice: 3000,
        message: '在台北從事導遊工作8年，對日本文化很了解，能提供深度文化交流體驗。',
        rating: 4.8,
        completedTasks: 203
      }
    ],
    client: {
      id: 'client-001',
      name: '田中先生',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.7,
      completedTasks: 12,
      isVerified: true,
      joinedAt: '2023-06-15T10:30:00Z'
    },
    attachments: [],
    tags: ['導遊', '日語', '台北', '半日遊'],
    views: 45,
    applications: 2,
    createdAt: '2024-01-08T09:00:00Z',
    updatedAt: '2024-01-10T14:15:00Z'
  },
  {
    id: 'task-002',
    title: '文件翻譯：中文轉英文商業合約',
    description: '需要將一份10頁的商業合約從中文翻譯成英文，要求專業且準確，有法律文件翻譯經驗優先。',
    category: 'translation',
    type: 'urgent',
    status: 'OPEN',
    priority: 'high',
    budget: {
      min: 5000,
      max: 8000,
      currency: 'TWD'
    },
    location: {
      city: '台北市',
      district: '中正區'
    },
    timeline: {
      startDate: '2024-01-12',
      endDate: '2024-01-14',
      estimatedHours: 12
    },
    requirements: [
      '具備專業翻譯資格',
      '有法律文件翻譯經驗',
      '英文母語或接近母語水準',
      '保密協議簽署'
    ],
    skills: ['翻譯', '英文', '法律文件', '商業合約'],
    languages: ['中文', '英文'],
    clientId: 'client-002',
    applicants: [
      {
        workerId: 'worker-003',
        workerName: 'Sarah Chen',
        workerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-09T16:20:00Z',
        proposedPrice: 7500,
        message: '我是專業翻譯師，有10年法律文件翻譯經驗，可以確保翻譯品質和時效。',
        rating: 4.9,
        completedTasks: 234
      }
    ],
    client: {
      id: 'client-002',
      name: '張總經理',
      avatar: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=100&h=100&fit=crop&crop=face',
      rating: 4.6,
      completedTasks: 8,
      isVerified: true,
      joinedAt: '2023-08-22T14:15:00Z'
    },
    attachments: [
      {
        id: 'att-001',
        name: 'contract_draft.pdf',
        url: '/attachments/contract_draft.pdf',
        type: 'document',
        size: 2048000
      }
    ],
    tags: ['翻譯', '英文', '法律', '急件'],
    views: 67,
    applications: 1,
    createdAt: '2024-01-09T08:30:00Z',
    updatedAt: '2024-01-09T16:20:00Z'
  },
  {
    id: 'task-003',
    title: '商品攝影：手工藝品拍攝',
    description: '需要專業攝影師為我的手工藝品店拍攝約50件商品，用於網路銷售，要求高畫質且風格一致。',
    category: 'photography',
    type: 'normal',
    status: 'IN_PROGRESS',
    priority: 'medium',
    budget: {
      min: 8000,
      max: 12000,
      currency: 'TWD'
    },
    location: {
      city: '台中市',
      district: '西區',
      address: '台中市西區五權路123號'
    },
    timeline: {
      startDate: '2024-01-16',
      endDate: '2024-01-18',
      estimatedHours: 16
    },
    requirements: [
      '具備商品攝影經驗',
      '擁有專業攝影器材',
      '能提供後製修圖服務',
      '作品集展示'
    ],
    skills: ['攝影', '商品攝影', '後製', '修圖'],
    clientId: 'client-003',
    assignedWorkerId: 'worker-004',
    applicants: [
      {
        workerId: 'worker-004',
        workerName: '林攝影師',
        workerAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-11T11:45:00Z',
        proposedPrice: 10000,
        message: '專業商品攝影師，有豐富的手工藝品拍攝經驗，可提供完整的拍攝和後製服務。',
        rating: 4.8,
        completedTasks: 89
      }
    ],
    client: {
      id: 'client-003',
      name: '陳手作',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      completedTasks: 15,
      isVerified: true,
      joinedAt: '2023-09-10T08:45:00Z'
    },
    assignedWorker: {
      id: 'worker-004',
      name: '林攝影師',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      completedTasks: 89,
      skills: ['攝影', '商品攝影', '後製', 'Photoshop']
    },
    attachments: [
      {
        id: 'att-002',
        name: 'product_samples.jpg',
        url: '/attachments/product_samples.jpg',
        type: 'image',
        size: 1536000
      }
    ],
    tags: ['攝影', '商品', '手工藝', '電商'],
    views: 34,
    applications: 1,
    createdAt: '2024-01-11T08:00:00Z',
    updatedAt: '2024-01-12T15:30:00Z'
  },
  {
    id: 'task-user-001',
    title: '高雄港區導遊服務',
    description: '需要熟悉高雄港區和駁二藝術特區的導遊，帶領韓國旅客進行文化體驗之旅，需具備韓語溝通能力。',
    category: 'guide',
    type: 'normal',
    status: 'OPEN',
    priority: 'medium',
    budget: {
      min: 2500,
      max: 4000,
      currency: 'TWD'
    },
    location: {
      city: '高雄市',
      district: '鹽埕區',
      address: '駁二藝術特區'
    },
    timeline: {
      startDate: '2024-02-01',
      endDate: '2024-02-01',
      estimatedHours: 6
    },
    requirements: [
      '具備韓語溝通能力',
      '熟悉高雄港區歷史文化',
      '有導遊證照優先',
      '服務態度親切'
    ],
    skills: ['導遊', '韓語', '文化解說'],
    languages: ['中文', '韓語'],
    clientId: 'client-123',
    applicants: [
      {
        workerId: 'worker-005',
        workerName: '張韓語',
        workerAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-20T09:00:00Z',
        proposedPrice: 3200,
        message: '韓語系畢業，在高雄從事導遊工作3年，對韓國文化和高雄在地文化都很熟悉。',
        rating: 4.7,
        completedTasks: 78
      },
      {
        workerId: 'worker-006',
        workerName: '林文化',
        workerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-20T15:30:00Z',
        proposedPrice: 3500,
        message: '具備韓語導遊證照，專精於港區文化導覽，能提供深度的文化交流體驗。',
        rating: 4.9,
        completedTasks: 134
      }
    ],
    client: {
      id: 'client-123',
      name: '測試用戶',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.5,
      completedTasks: 12,
      isVerified: true,
      joinedAt: '2023-12-01T09:00:00Z'
    },
    attachments: [],
    tags: ['導遊', '韓語', '高雄', '文化'],
    views: 28,
    applications: 2,
    createdAt: '2024-01-18T14:20:00Z',
    updatedAt: '2024-01-20T15:30:00Z'
  },
  {
    id: 'task-user-002',
    title: '產品說明書翻譯：中翻英',
    description: '需要將電子產品說明書從中文翻譯成英文，共約5000字，要求專業術語準確，格式整齊。',
    category: 'translation',
    type: 'normal',
    status: 'IN_PROGRESS',
    priority: 'high',
    budget: {
      min: 6000,
      max: 8000,
      currency: 'TWD'
    },
    location: {
      city: '台北市',
      district: '中山區'
    },
    timeline: {
      startDate: '2024-01-22',
      endDate: '2024-01-25',
      estimatedHours: 12
    },
    requirements: [
      '英語母語或相當程度',
      '具備技術文件翻譯經驗',
      '熟悉電子產品術語',
      '能配合格式要求'
    ],
    skills: ['翻譯', '英文', '技術文件', '校對'],
    languages: ['中文', '英文'],
    clientId: 'client-123',
    assignedWorkerId: 'worker-007',
    applicants: [
      {
        workerId: 'worker-007',
        workerName: 'Emily Chen',
        workerAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-19T11:20:00Z',
        proposedPrice: 7000,
        message: '英語系碩士，專精技術文件翻譯，有豐富的電子產品說明書翻譯經驗。',
        rating: 4.8,
        completedTasks: 156
      }
    ],
    client: {
      id: 'client-123',
      name: '測試用戶',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.5,
      completedTasks: 12,
      isVerified: true,
      joinedAt: '2023-12-01T09:00:00Z'
    },
    assignedWorker: {
      id: 'worker-007',
      name: 'Emily Chen',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      completedTasks: 156,
      skills: ['翻譯', '英文', '技術文件', '校對']
    },
    attachments: [
      {
        id: 'att-003',
        name: '產品說明書原稿.docx',
        url: '/attachments/product_manual_zh.docx',
        type: 'document',
        size: 1024000
      }
    ],
    tags: ['翻譯', '英文', '技術文件', '產品'],
    views: 22,
    applications: 1,
    createdAt: '2024-01-18T16:45:00Z',
    updatedAt: '2024-01-20T09:15:00Z'
  },
  {
    id: 'task-004',
    title: '桃園機場接送服務',
    description: '需要可靠的司機提供桃園機場到台北市區的接送服務，客戶是外國商務人士，需要英語溝通。',
    category: 'delivery',
    type: 'urgent',
    status: 'OPEN',
    priority: 'high',
    budget: {
      min: 1200,
      max: 1800,
      currency: 'TWD'
    },
    location: {
      city: '桃園市',
      district: '大園區',
      address: '桃園國際機場第二航廈'
    },
    timeline: {
      startDate: '2024-01-13',
      endDate: '2024-01-13',
      estimatedHours: 2
    },
    requirements: [
      '持有合法駕照和營業執照',
      '車輛整潔且舒適',
      '具備基本英語溝通能力',
      '準時可靠'
    ],
    skills: ['駕駛', '英語', '機場接送', '商務服務'],
    languages: ['中文', '英文'],
    clientId: 'client-004',
    applicants: [],
    client: {
      id: 'client-004',
      name: 'Johnson Co.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.5,
      completedTasks: 23,
      isVerified: true,
      joinedAt: '2023-07-18T11:30:00Z'
    },
    attachments: [],
    tags: ['接送', '機場', '英語', '商務'],
    views: 23,
    applications: 0,
    createdAt: '2024-01-11T14:20:00Z',
    updatedAt: '2024-01-11T14:20:00Z'
  },
  {
    id: 'task-005',
    title: '社群媒體內容創作',
    description: '尋找創意內容創作者為我們的咖啡店製作Instagram和Facebook的貼文內容，包含文案和圖片設計。',
    category: 'other',
    type: 'long_term',
    status: 'OPEN',
    priority: 'low',
    budget: {
      min: 15000,
      max: 25000,
      currency: 'TWD'
    },
    location: {
      city: '高雄市',
      district: '苓雅區'
    },
    timeline: {
      startDate: '2024-01-20',
      endDate: '2024-02-20',
      estimatedHours: 40
    },
    requirements: [
      '熟悉社群媒體操作',
      '具備圖片設計能力',
      '文案撰寫經驗',
      '了解咖啡文化優先'
    ],
    skills: ['社群媒體', '文案', '設計', '行銷'],
    clientId: 'client-005',
    applicants: [
      {
        workerId: 'worker-005',
        workerName: '小美設計師',
        workerAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        appliedAt: '2024-01-12T09:15:00Z',
        proposedPrice: 20000,
        message: '我是專業的社群媒體行銷人員，有豐富的餐飲業社群操作經驗，可以為您打造吸引人的內容。',
        rating: 4.7,
        completedTasks: 67
      }
    ],
    client: {
      id: 'client-005',
      name: '黑咖啡店',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      completedTasks: 5,
      isVerified: false,
      joinedAt: '2024-01-05T16:20:00Z'
    },
    attachments: [
      {
        id: 'att-003',
        name: 'brand_guidelines.pdf',
        url: '/attachments/brand_guidelines.pdf',
        type: 'document',
        size: 3072000
      }
    ],
    tags: ['社群', '行銷', '設計', '長期'],
    views: 56,
    applications: 1,
    createdAt: '2024-01-10T16:45:00Z',
    updatedAt: '2024-01-12T09:15:00Z'
  }
];

// 任務存儲類
class TaskStorage {
  private tasks: MockTask[] = [];
  private storageKey = 'guidee_mock_tasks';

  constructor() {
    this.loadTasks();
  }

  // 從localStorage載入任務
  private loadTasks() {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem(this.storageKey);
        if (stored) {
          this.tasks = JSON.parse(stored);
        } else {
          // 首次載入使用預設數據
          this.tasks = [...mockTasks];
          this.saveTasks();
        }
      } catch (error) {
        console.error('載入任務數據失敗:', error);
        this.tasks = [...mockTasks];
      }
    } else {
      // 服務端渲染時使用預設數據
      this.tasks = [...mockTasks];
    }
  }

  // 保存任務到localStorage
  private saveTasks() {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.storageKey, JSON.stringify(this.tasks));
      } catch (error) {
        console.error('保存任務數據失敗:', error);
      }
    }
  }

  // 獲取所有任務
  getAll(): MockTask[] {
    return this.tasks;
  }

  // 根據ID獲取任務
  getById(id: string): MockTask | null {
    return this.tasks.find(task => task.id === id) || null;
  }

  // 根據客戶ID獲取任務
  getByClientId(clientId: string): MockTask[] {
    return this.tasks.filter(task => task.clientId === clientId);
  }

  // 根據工作者ID獲取任務
  getByWorkerId(workerId: string): MockTask[] {
    return this.tasks.filter(task => 
      task.assignedWorkerId === workerId || 
      task.applicants.some(app => app.workerId === workerId)
    );
  }

  // 搜尋任務
  search(filters: {
    query?: string;
    category?: string;
    type?: string;
    status?: string;
    priority?: string;
    location?: string;
    budgetMin?: number;
    budgetMax?: number;
    skills?: string[];
    clientId?: string;
    sortBy?: 'newest' | 'oldest' | 'budget_high' | 'budget_low' | 'deadline';
  }): MockTask[] {
    let results = this.tasks;

    // 關鍵字搜尋
    if (filters.query) {
      const query = filters.query.toLowerCase();
      results = results.filter(task => 
        task.title.toLowerCase().includes(query) ||
        task.description.toLowerCase().includes(query) ||
        task.tags.some(tag => tag.toLowerCase().includes(query)) ||
        task.skills.some(skill => skill.toLowerCase().includes(query))
      );
    }

    // 分類篩選
    if (filters.category) {
      results = results.filter(task => task.category === filters.category);
    }

    // 類型篩選
    if (filters.type) {
      results = results.filter(task => task.type === filters.type);
    }

    // 狀態篩選
    if (filters.status) {
      results = results.filter(task => task.status === filters.status);
    }

    // 優先級篩選
    if (filters.priority) {
      results = results.filter(task => task.priority === filters.priority);
    }

    // 地點篩選
    if (filters.location) {
      results = results.filter(task => 
        task.location.city.includes(filters.location!) ||
        (task.location.district && task.location.district.includes(filters.location!))
      );
    }

    // 預算範圍篩選
    if (filters.budgetMin !== undefined) {
      results = results.filter(task => task.budget.max >= filters.budgetMin!);
    }
    if (filters.budgetMax !== undefined) {
      results = results.filter(task => task.budget.min <= filters.budgetMax!);
    }

    // 技能篩選
    if (filters.skills && filters.skills.length > 0) {
      results = results.filter(task => 
        filters.skills!.some(skill => 
          task.skills.some(taskSkill => 
            taskSkill.toLowerCase().includes(skill.toLowerCase())
          )
        )
      );
    }

    // 客戶ID篩選
    if (filters.clientId) {
      results = results.filter(task => task.clientId === filters.clientId);
    }

    // 排序
    if (filters.sortBy) {
      results.sort((a, b) => {
        switch (filters.sortBy) {
          case 'newest':
            return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
          case 'oldest':
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          case 'budget_high':
            return b.budget.max - a.budget.max;
          case 'budget_low':
            return a.budget.min - b.budget.min;
          case 'deadline':
            return new Date(a.timeline.endDate).getTime() - new Date(b.timeline.endDate).getTime();
          default:
            return 0;
        }
      });
    }

    return results;
  }

  // 添加任務
  add(task: Omit<MockTask, 'id' | 'createdAt' | 'updatedAt' | 'views' | 'applications'>): MockTask {
    const newTask: MockTask = {
      ...task,
      id: `task-${Date.now()}`,
      views: 0,
      applications: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    this.tasks.push(newTask);
    this.saveTasks();
    return newTask;
  }

  // 更新任務
  update(id: string, updates: Partial<Omit<MockTask, 'id'>>): MockTask | null {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return null;

    const currentTask = this.tasks[index]!;
    const updatedTask: MockTask = {
      ...currentTask,
      ...updates,
      id, // 保持ID不變
      updatedAt: new Date().toISOString()
    };

    this.tasks[index] = updatedTask;
    this.saveTasks();
    return this.tasks[index];
  }

  // 刪除任務
  delete(id: string): boolean {
    const index = this.tasks.findIndex(task => task.id === id);
    if (index === -1) return false;

    this.tasks.splice(index, 1);
    this.saveTasks();
    return true;
  }

  // 增加瀏覽次數
  incrementViews(id: string): boolean {
    const task = this.getById(id);
    if (!task) return false;

    return !!this.update(id, { views: task.views + 1 });
  }

  // 申請任務
  applyToTask(taskId: string, application: {
    workerId: string;
    workerName: string;
    workerAvatar?: string;
    proposedPrice: number;
    message: string;
    rating: number;
    completedTasks: number;
  }): boolean {
    const task = this.getById(taskId);
    if (!task) return false;

    const newApplication = {
      ...application,
      appliedAt: new Date().toISOString()
    };

    const updatedApplicants = [...task.applicants, newApplication];
    
    return !!this.update(taskId, { 
      applicants: updatedApplicants,
      applications: updatedApplicants.length
    });
  }

  // 分配任務
  assignTask(taskId: string, workerId: string): boolean {
    const task = this.getById(taskId);
    if (!task) return false;

    const applicant = task.applicants.find(app => app.workerId === workerId);
    if (!applicant) return false;

    const assignedWorker = {
      id: applicant.workerId,
      name: applicant.workerName,
      avatar: applicant.workerAvatar,
      rating: applicant.rating,
      completedTasks: applicant.completedTasks,
      skills: [] // 這裡可以根據需要添加技能
    };

    return !!this.update(taskId, {
      status: 'IN_PROGRESS',
      assignedWorkerId: workerId,
      assignedWorker
    });
  }
}

// 導出單例實例
export const taskStorage = new TaskStorage();