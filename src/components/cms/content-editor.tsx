'use client';

import { useState, useRef } from 'react';
import { Bold, Italic, Underline, Link, Image, List, Type, Eye, Code, Save, X } from 'lucide-react';

interface ContentEditorProps {
  initialContent?: string;
  title?: string;
  onSave: (content: string, title: string) => void;
  onCancel?: () => void;
  className?: string;
}

export function ContentEditor({
  initialContent = '',
  title: initialTitle = '',
  onSave,
  onCancel,
  className = ''
}: ContentEditorProps) {
  const [content, setContent] = useState(initialContent);
  const [title, setTitle] = useState(initialTitle);
  const [isPreview, setIsPreview] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const editorRef = useRef<HTMLTextAreaElement>(null);

  // 工具列按鈕
  const formatText = (formatType: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end);
    let replacement = selectedText;

    switch (formatType) {
      case 'bold':
        replacement = `**${selectedText}**`;
        break;
      case 'italic':
        replacement = `*${selectedText}*`;
        break;
      case 'underline':
        replacement = `<u>${selectedText}</u>`;
        break;
      case 'link':
        replacement = `[${selectedText || '連結文字'}](https://example.com)`;
        break;
      case 'image':
        replacement = `![${selectedText || '圖片描述'}](圖片網址)`;
        break;
      case 'list':
        replacement = selectedText
          .split('\n')
          .map(line => line.trim() ? `- ${line}` : line)
          .join('\n');
        break;
      case 'heading':
        replacement = `## ${selectedText || '標題'}`;
        break;
      case 'code':
        replacement = `\`${selectedText}\``;
        break;
    }

    const newContent = content.substring(0, start) + replacement + content.substring(end);
    setContent(newContent);

    // 設定新的游標位置
    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + replacement.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 插入內容
  const insertContent = (text: string) => {
    const textarea = editorRef.current;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const newContent = content.substring(0, start) + text + content.substring(start);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      const newCursorPos = start + text.length;
      textarea.setSelectionRange(newCursorPos, newCursorPos);
    }, 0);
  };

  // 處理保存
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await onSave(content, title);
    } catch (error) {
      console.error('保存失敗:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Markdown 轉 HTML 預覽 (簡化版)
  const renderPreview = (markdown: string) => {
    return markdown
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      .replace(/<u>(.*?)<\/u>/g, '<u>$1</u>')
      .replace(/`(.*?)`/g, '<code>$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank">$1</a>')
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" style="max-width: 100%; height: auto;" />')
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      .replace(/(<li>.*<\/li>)/g, '<ul>$1</ul>')
      .replace(/\n/g, '<br>');
  };

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '600px',
      backgroundColor: 'white',
      borderRadius: '0.5rem',
      border: '1px solid #e5e7eb',
      overflow: 'hidden'
    }} className={className}>
      {/* 標題輸入 */}
      <div style={{
        padding: '1rem',
        borderBottom: '1px solid #e5e7eb'
      }}>
        <input
          type="text"
          placeholder="輸入標題..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{
            width: '100%',
            padding: '0.75rem',
            border: '1px solid #e5e7eb',
            borderRadius: '0.375rem',
            fontSize: '1.125rem',
            fontWeight: '600',
            outline: 'none'
          }}
          className="focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        />
      </div>

      {/* 工具列 */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.75rem 1rem',
        backgroundColor: '#f8fafc',
        borderBottom: '1px solid #e5e7eb',
        flexWrap: 'wrap'
      }}>
        {/* 格式化按鈕 */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={() => formatText('bold')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="粗體"
          >
            <Bold style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('italic')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="斜體"
          >
            <Italic style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('underline')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="底線"
          >
            <Underline style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#e5e7eb' }} />

        {/* 內容插入按鈕 */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          <button
            onClick={() => formatText('heading')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="標題"
          >
            <Type style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('link')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="連結"
          >
            <Link style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('image')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="圖片"
          >
            <Image style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('list')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="清單"
          >
            <List style={{ width: '1rem', height: '1rem' }} />
          </button>
          
          <button
            onClick={() => formatText('code')}
            style={{
              padding: '0.5rem',
              backgroundColor: 'white',
              border: '1px solid #e5e7eb',
              borderRadius: '0.25rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
            className="hover:bg-gray-100"
            title="程式碼"
          >
            <Code style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>

        <div style={{ width: '1px', height: '1.5rem', backgroundColor: '#e5e7eb' }} />

        {/* 預覽切換 */}
        <button
          onClick={() => setIsPreview(!isPreview)}
          style={{
            padding: '0.5rem 1rem',
            backgroundColor: isPreview ? '#3b82f6' : 'white',
            color: isPreview ? 'white' : '#374151',
            border: '1px solid #e5e7eb',
            borderRadius: '0.25rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            fontSize: '0.875rem',
            fontWeight: '500'
          }}
          className="hover:bg-gray-100"
        >
          <Eye style={{ width: '1rem', height: '1rem' }} />
          {isPreview ? '編輯' : '預覽'}
        </button>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: '0.5rem' }}>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: 'white',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}
              className="hover:bg-[#cfdbe9]"
            >
              <X style={{ width: '1rem', height: '1rem' }} />
              取消
            </button>
          )}
          
          <button
            onClick={handleSave}
            disabled={isSaving || !title.trim() || !content.trim()}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: !title.trim() || !content.trim() ? '#e5e7eb' : '#10b981',
              color: !title.trim() || !content.trim() ? '#9ca3af' : 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: !title.trim() || !content.trim() ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500'
            }}
            className="hover:bg-green-600"
          >
            <Save style={{ width: '1rem', height: '1rem' }} />
            {isSaving ? '保存中...' : '保存'}
          </button>
        </div>
      </div>

      {/* 編輯器內容 */}
      <div style={{ flex: 1, display: 'flex' }}>
        {!isPreview ? (
          /* 編輯模式 */
          <textarea
            ref={editorRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="開始撰寫內容... 支援 Markdown 語法"
            style={{
              width: '100%',
              height: '100%',
              padding: '1rem',
              border: 'none',
              outline: 'none',
              resize: 'none',
              fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6'
            }}
          />
        ) : (
          /* 預覽模式 */
          <div style={{
            width: '100%',
            height: '100%',
            padding: '1rem',
            overflowY: 'auto',
            backgroundColor: '#fafafa'
          }}>
            {title && (
              <h1 style={{
                fontSize: '2rem',
                fontWeight: '700',
                color: '#111827',
                marginBottom: '1.5rem',
                paddingBottom: '0.5rem',
                borderBottom: '2px solid #e5e7eb'
              }}>
                {title}
              </h1>
            )}
            <div
              style={{
                lineHeight: '1.7',
                color: '#374151'
              }}
              dangerouslySetInnerHTML={{
                __html: content ? renderPreview(content) : '<p style="color: #9ca3af; font-style: italic;">暫無內容</p>'
              }}
            />
          </div>
        )}
      </div>

      {/* 字數統計 */}
      <div style={{
        padding: '0.5rem 1rem',
        backgroundColor: '#f8fafc',
        borderTop: '1px solid #e5e7eb',
        fontSize: '0.75rem',
        color: '#6b7280',
        display: 'flex',
        justifyContent: 'space-between'
      }}>
        <span>字數：{content.length}</span>
        <span>行數：{content.split('\n').length}</span>
      </div>
    </div>
  );
}