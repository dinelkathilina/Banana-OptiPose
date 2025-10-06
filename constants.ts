import { Tab, TabId } from './types';

export const TABS: Tab[] = [
  {
    id: 'pose',
    label: 'Pose',
    uploader1Title: 'Base Image (Person)',
    uploader2Title: 'Style/Reference Image (Pose)',
  },
  {
    id: 'product',
    label: 'Product Mockups',
    uploader1Title: 'Base Image (Product)',
    uploader2Title: 'Style/Reference Image (Scene)',
  },
  {
    id: 'ad',
    label: 'Advertisements',
    uploader1Title: 'Image (Subject or Product)',
  },
];

export const PROMPTS: Record<TabId, string> = {
  pose: `The first image is the base image of a person. The second image is a reference for a pose. Recreate the person from the base image in the pose shown in the reference image. Maintain the original person's appearance and clothing.`,
  product: `The first image contains a product. The second image is a scene. Create a realistic mockup by placing the product from the first image into the scene from the second image. The product should be integrated naturally, with correct lighting and perspective.`,
  ad: `Create a dynamic and visually appealing advertisement based on the provided image. Enhance its aesthetic to make it look professional and eye-catching.`,
};