import { Tab, TabId } from './types';

export const TABS: Tab[] = [
  {
    id: 'pose',
    label: 'Pose',
    uploader1Title: 'Base Image (Person)',
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
  ad: `Magical ultra-realistic commercial photograph of [PRODUCT NAME HERE] as the absolute hero, cinematic environment that automatically adapts to the product’s nature, high Kelvin lighting for pure white tones without yellow, hyper-detailed textures with insane clarity, extreme sharpness that reveals every micro-detail, HDR and upscale effect for flawless premium look, dramatic studio lighting with rim light and soft cinematic shadows, powerful hero composition that highlights the product, atmosphere morphs perfectly to fit the product identity, one-word slogan glowing in a bold creative way, brand logo placed in an epic hero spot, surreal upscale touch that makes it feel larger than life, social-media optimized, iconic and unforgettable`,
};

export const QUICK_POSE_PROMPTS = {
  HANDS_ON_HIPS: 'Make him Hands on Hips',
  ARMS_FOLDED: 'Make him stand with his arms folded behind his back',
  ONE_HAND_POCKET: 'Make him stand with one hand in his pocket and the other hanging at his side',
  POINTING_FINGER: 'Make him point directly ahead with one hand',
  ARMS_RAISED: 'Make him raise his arms — either in victory or surrender.',
};
