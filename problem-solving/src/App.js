import { useState } from 'react'; 
import { Route, Routes, useNavigate } from 'react-router-dom';
import ViewPage from './components/ViewPage';
import MainPage from './components/MainPage';
import CreateFile from './components/CreateFile';
import Template from './components/Template';
import Ideas from './components/Ideas';
export const viewport = [{outer: '400px', inner: '360px'}, { outer: '600px', inner: '560px'}]
function App() {
  const [data, setData] = useState([]);
  const [folder, setFolder] = useState(0);
  const [foldername, setFoldername] = useState("");
  const [selectedFolder, setSelectedFolder] = useState(1); 
  const [mode, setMode] = useState(0);
  const addFileToFolder = (newFile, key) => {
    setData(prev => {
      return prev.map((file)=>{
        if(file.key == key){
          file.files.push(newFile); 
        }
        return file;
      })
    });
  };

  return (
    <div className={mode === 0 ? 'w-[400px] h-[640px]' : 'w-[600px] h-[660px]'}>
      <Routes>
        <Route path="/" element={<MainPage folder={folder} setFolder={setFolder} foldername={foldername} setFoldername={setFoldername} selectedFolder={selectedFolder} setSelectedFolder={setSelectedFolder} data={data} setData={setData} setMode={setMode} mode={mode}/>} />
        <Route path="/create-file" element={<CreateFile onAddFile={addFileToFolder} index={selectedFolder} mode={mode}/>} />
        <Route path="/view-file/:folder/:filename" element={<ViewPage data={data} mode={mode}/>} />
        <Route path="/edit-templates/:folder" element={<Template data={data} setData={setData} mode={mode}/>}/>
        <Route path="/ideas/:folder" element={<Ideas data={data} setData={setData} mode={mode}/>}/>
      </Routes>
    </div>
  );
}

export default App;
