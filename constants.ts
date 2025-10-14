import { Tab, TabId } from './types';

export const TABS: Tab[] = [
  {
    id: 'pose',
    label: 'Pose',
    uploader1Title: 'Base Image (Person)',
  },
  {
    id: 'carousel',
    label: 'Carousel Posts',
  },
  {
    id: 'ad',
    label: 'Advertisements',
    uploader1Title: 'Image (Subject or Product)',
  },
];

export const PROMPTS: Record<TabId, string> = {
  pose: `The first image is the base image of a person. The second image is a reference for a pose. Recreate the person from the base image in the pose shown in the reference image. Maintain the original person's appearance and clothing.`,
  carousel: `You are a creative social media content strategist. Your task is to generate a structured plan for an Instagram carousel post based on a user's idea.
The user wants a carousel with [NUM_PAGES] pages in a '[STYLE]' 2D illustration style.
The core idea is: '[CAROUSEL_IDEA]'.

Break down the idea into [NUM_PAGES] sequential, coherent image prompts for a text-to-image AI. For each part, create a detailed 'image_prompt'.

Each 'image_prompt' must adhere to these rules:
- It must explicitly include the style: '[STYLE] 2D illustration with graphics'.
- For all prompts EXCEPT the last one, it must include instructions to draw a subtle, stylized 'swipe right' arrow graphic within the illustration itself. The arrow's design must match the '[STYLE]' and be placed in a consistent location like the bottom-right corner.
- The prompt for the FINAL slide must NOT include an arrow. It can optionally include a call-to-action or concluding graphic.`,
  ad: `Magical ultra-realistic commercial photograph of [PRODUCT NAME HERE] as the absolute hero, cinematic environment that automatically adapts to the product’s nature, high Kelvin lighting for pure white tones without yellow, hyper-detailed textures with insane clarity, extreme sharpness that reveals every micro-detail, HDR and upscale effect for flawless premium look, dramatic studio lighting with rim light and soft cinematic shadows, powerful hero composition that highlights the product, atmosphere morphs perfectly to fit the product identity, one-word slogan glowing in a bold creative way, brand logo placed in an epic hero spot, surreal upscale touch that makes it feel larger than life, social-media optimized, iconic and unforgettable`,
};

export const QUICK_POSE_PROMPTS = {
  HANDS_ON_HIPS: 'Make him Hands on Hips',
  ARMS_FOLDED: 'Make him stand with his arms folded behind his back',
  ONE_HAND_POCKET: 'Make him stand with one hand in his pocket and the other hanging at his side',
  POINTING_FINGER: 'Make him point directly ahead with one hand',
  ARMS_RAISED: 'Make him raise his arms — either in victory or surrender.',
};

export const PAGE_OPTIONS = [2, 3, 4, 5, 6];

export const ILLUSTRATION_STYLES = [
  'Flat',
  'Minimalist',
  'Isometric',
  'Geometric',
  'Cartoon',
  'Doodle'
];