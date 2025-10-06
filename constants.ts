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
  ad: `Ultra-realistic CGI shot of a giant [PRODUCT NAME HERE], seamlessly integrated into a matching real-world environment that reflects the product’s identity, surrounded by context-specific city or nature elements, cinematic composition with natural shadows and photorealistic reflections, high Kelvin sunlight for neutral lighting, captured in HDR 8K DSLR quality, surreal yet believable visual integration, brand logo clearly visible, slogan dynamically adapted to the product’s character, dramatic and immersive atmosphere, aspect ratio 2:3`,
};