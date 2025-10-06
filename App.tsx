import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { Tabs } from './components/Tabs';
import { ImageUploader } from './components/ImageUploader';
import { OutputDisplay } from './components/OutputDisplay';
import { TABS, PROMPTS } from './constants';
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