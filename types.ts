export type TabId = 'pose' | 'carousel' | 'ad';

export interface Tab {
  id: TabId;
  label: string;
  uploader1Title?: string;
  uploader2Title?: string;
}

export interface UploadedFile {
  name: string;
  type: string;
  base64: string;
  preview: string;
}

export interface CarouselSlide {
  imageUrl: string;
}