
import React from 'react';
import { Tab, TabId } from '../types';

interface TabsProps {
  tabs: Tab[];
  activeTab: TabId;
  onTabChange: (tabId: TabId) => void;
}

export const Tabs: React.FC<TabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <nav className="flex justify-center border-b border-brand-gray-light">
      <ul className="flex flex-wrap -mb-px">
        {tabs.map((tab) => (
          <li className="mr-2" key={tab.id}>
            <button
              onClick={() => onTabChange(tab.id)}
              className={`inline-block py-4 px-6 text-lg font-medium text-center rounded-t-lg border-b-2 transition-colors duration-300 ${
                activeTab === tab.id
                  ? 'text-brand-yellow border-brand-yellow'
                  : 'text-gray-400 border-transparent hover:text-gray-200 hover:border-gray-500'
              }`}
            >
              {tab.label}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
