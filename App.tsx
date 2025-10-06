import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ImageUploader } from './components/ImageUploader';
import { OutputDisplay } from './components/OutputDisplay';
import { TABS, PROMPTS, QUICK_POSE_PROMPTS, HANDS_ON_HIPS_IMAGE_B64 } from './constants';
import { TabId, UploadedFile } from './types';
import { generateImage } from './services/geminiService';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabId>(TABS[0].id);
  const [baseImage, setBaseImage] = useState<UploadedFile | null>(null);
  const [styleImage, setStyleImage] = useState<UploadedFile | null>(null);
  const [productName, setProductName] = useState<string>('');
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeTabData = useMemo(() => TABS.find(tab => tab.id === activeTab)!, [activeTab]);

  const handleGenerate = async () => {
    if (!baseImage || (activeTabData.uploader2Title && !styleImage)) {
      setError('Please upload all required images.');
      return;
    }
    if (activeTab === 'ad' && !productName.trim()) {
      setError('Please enter a product name.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      let prompt = PROMPTS[activeTab];
      if (activeTab === 'ad') {
        prompt = prompt.replace('[PRODUCT NAME HERE]', productName);
      }
      const result = await generateImage(baseImage, styleImage, prompt);
      setOutputImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePoseButtonClick = async (prompt: string) => {
    if (!baseImage) {
      setError('Please upload a base image first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      const result = await generateImage(baseImage, null, prompt);
      setOutputImage(result);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleTabChange = (tabId: TabId) => {
    setActiveTab(tabId);
    setBaseImage(null);
    setStyleImage(null);
    setOutputImage(null);
    setError(null);
    setIsLoading(false);
    setProductName('');
  }

  const isGenerateDisabled = isLoading || !baseImage || (activeTabData.uploader2Title && !styleImage) || (activeTab === 'ad' && !productName.trim());

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans antialiased">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main>
          <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="mt-8 p-6 bg-brand-gray rounded-lg shadow-2xl">
            <div className={`grid grid-cols-1 ${activeTabData.uploader2Title ? 'lg:grid-cols-2' : ''} gap-8`}>
              <ImageUploader
                title={activeTabData.uploader1Title}
                onFileSelect={setBaseImage}
                key={`${activeTab}-1`}
              />
              {activeTabData.uploader2Title && (
                <ImageUploader
                  title={activeTabData.uploader2Title}
                  onFileSelect={setStyleImage}
                  key={`${activeTab}-2`}
                />
              )}
            </div>
            
            {activeTab === 'pose' && (
              <div className="mt-8">
                <h3 className="text-lg font-semibold text-center text-gray-300 mb-4">Or Try a Quick Pose</h3>
                <div className="flex justify-center gap-4">
                  <div className="relative group">
                    <button
                      onClick={() => handlePoseButtonClick(QUICK_POSE_PROMPTS.HANDS_ON_HIPS)}
                      disabled={!baseImage || isLoading}
                      className="rounded-lg overflow-hidden border-2 border-transparent hover:border-brand-yellow focus:border-brand-yellow focus:outline-none transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:border-transparent"
                      aria-label="Apply Hands on Hips pose"
                    >
                      <img src={HANDS_ON_HIPS_IMAGE_B64} alt="Man with hands on hips" className="w-32 h-40 object-cover" />
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 flex items-center justify-center transition-all duration-200">
                        <p className="text-white font-bold opacity-0 group-hover:opacity-100 text-center px-2">Hands on Hips</p>
                      </div>
                    </button>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'ad' && (
              <div className="mt-6">
                <label htmlFor="product-name" className="block text-sm font-medium text-gray-300 mb-2">
                  Product Name
                </label>
                <input
                  type="text"
                  id="product-name"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g., Quantum Sneakers"
                  className="w-full bg-brand-gray-light border border-gray-600 text-white rounded-lg p-3 focus:ring-brand-yellow focus:border-brand-yellow transition-colors"
                  aria-required="true"
                />
              </div>
            )}

            <div className="mt-8 text-center">
              <button
                onClick={handleGenerate}
                disabled={isGenerateDisabled}
                className="w-full md:w-1/2 lg:w-1/3 bg-brand-yellow text-brand-dark font-bold py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out hover:bg-yellow-300 disabled:bg-gray-500 disabled:cursor-not-allowed disabled:shadow-none"
              >
                {isLoading ? 'Generating...' : 'Generate'}
              </button>
            </div>
          </div>
          
          {error && (
            <div className="mt-8 p-4 bg-red-900/50 text-red-300 border border-red-700 rounded-lg text-center">
              <p><strong>Error:</strong> {error}</p>
            </div>
          )}

          <OutputDisplay outputImage={outputImage} isLoading={isLoading} />
        </main>
      </div>
    </div>
  );
};

export default App;