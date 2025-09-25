import GuideProfile from '@/components/guides/guide-profile';

interface GuidePageProps {
  params: {
    id: string;
  };
}

export async function generateMetadata({ params }: GuidePageProps) {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/guides/${params.id}`, {
      cache: 'no-store'
    });
    
    if (response.ok) {
      const guide = await response.json();
      return {
        title: `${guide.name} - 專業在地嚮導 | Guidee`,
        description: guide.bio || `與 ${guide.name} 一起探索當地，享受個人化旅遊體驗`,
      };
    }
  } catch (error) {
    console.error('Failed to generate metadata:', error);
  }

  return {
    title: '嚮導檔案 | Guidee',
    description: '查看專業在地嚮導的詳細資料和服務',
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  return <GuideProfile guideId={params.id} />;
}