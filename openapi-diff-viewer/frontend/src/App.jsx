import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { DiffViewer } from './components/DiffViewer';
import { FileUpload } from './components/FileUpload';
import { OverviewReport } from './components/OverviewReport';
import { FullDiffView } from './components/FullDiffView';
import { ApiDocumentation } from './components/ApiDocumentation';
import { ArrowLeft } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [selectedId, setSelectedId] = useState('overview'); // Default to overview

  const handleAnalysisComplete = (analysisData) => {
    setData(analysisData);
    setSelectedId('overview'); // Show overview after analysis
  };

  const handleReset = () => {
    setData(null);
    setSelectedId('overview');
  };

  // Show file upload screen if no data
  if (!data) {
    return <FileUpload onAnalysisComplete={handleAnalysisComplete} />;
  }

  // Determine what to show based on selectedId
  const renderContent = () => {
    if (selectedId === 'overview') {
      return <OverviewReport data={data} />;
    }
    if (selectedId === 'full-diff') {
      return <FullDiffView rawFiles={data.raw_files} />;
    }
    if (selectedId === 'api-docs') {
      return <ApiDocumentation apiSpec={data.api_spec} />;
    }
    // Show specific change details
    const selectedChange = data.changes?.find(c => c.id === selectedId);
    return <DiffViewer change={selectedChange} />;
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white text-gray-900 font-sans">
      <Sidebar
        changes={data.changes || []}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onReset={handleReset}
        summary={data.summary}
      />
      {renderContent()}
    </div>
  );
}

export default App;
