
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
  const [outputImage, setOutputImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const activeTabData = useMemo(() => TABS.find(tab => tab.id === activeTab)!, [activeTab]);

  const handleGenerate = async () => {
    if (!baseImage || !styleImage) {
      setError('Please upload both a base image and a style/reference image.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setOutputImage(null);

    try {
      const prompt = PROMPTS[activeTab];
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
  }

  const isGenerateDisabled = !baseImage || !styleImage || isLoading;

  return (
    <div className="min-h-screen bg-brand-dark text-white font-sans antialiased">
      <div className="container mx-auto p-4 md:p-8">
        <Header />
        <main>
          <Tabs tabs={TABS} activeTab={activeTab} onTabChange={handleTabChange} />

          <div className="mt-8 p-6 bg-brand-gray rounded-lg shadow-2xl">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <ImageUploader
                title={activeTabData.uploader1Title}
                onFileSelect={setBaseImage}
                key={`${activeTab}-1`}
              />
              <ImageUploader
                title={activeTabData.uploader2Title}
                onFileSelect={setStyleImage}
                key={`${activeTab}-2`}
              />
            </div>

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
