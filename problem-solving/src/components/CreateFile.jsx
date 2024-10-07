import { useState } from 'react'; 
import { Button, Input } from 'antd';
import { useNavigate } from 'react-router-dom';
import { AiOutlinePlus } from 'react-icons/ai';
import { viewport } from '../App';
function CreateFile({ onAddFile, index, mode }) {
    const [fileName, setFileName] = useState("");
    const [hints, setHints] = useState([]);
    const [hint, setHint] = useState("");
    const [tags, setTags] = useState([]);
    const [tag, setTag] = useState("");
    const [link, setLink] = useState("");
    const navigate = useNavigate();
  
    const addHint = () => {
      if (hint.trim()) {
        setHints([...hints, hint]);
        setHint(""); 
      }
    };
  
    
    const addTag = () => {
      if (tag.trim()) {
        setTags([...tags, tag]);
        setTag(""); 
      }
    };
  
    const handleSubmit = () => {
      const newFile = {
        name: fileName,
        hints,
        link,
        tags
      };
      
      onAddFile(newFile, index);
      navigate('/');
    };
  
  
    return (
  <div className={mode ? `text-center w-[600px] h-[600px] flex flex-col items-center justify-start border rounded-lg shadow-lg p-6 bg-white` : `text-center w-[400px] h-[600px] flex flex-col items-center justify-start border rounded-lg shadow-lg p-6 bg-white`} >
    <div className={mode ? `w-[560px] flex flex-col justify-between h-full max-h-[600px] overflow-auto rounded-sm` : `w-[360px] flex flex-col justify-between h-full max-h-[600px] overflow-auto rounded-sm`}>
      <div className='text-2xl font-semibold mt-4 text-slate-800'>Create New File</div>
      <div className='absolute -top-5 -left-2 z-10'><img src={"notes.png"} className='h-[120px] w-[120px] animate-pulse'/></div>
      <div className='flex flex-col gap-4 w-full'>
        <Input
          placeholder="File Name"
          value={fileName}
          onChange={(e) => setFileName(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <div className='flex flex-row gap-2 items-center'>
          <Input
            placeholder="Enter Hint"
            value={hint}
            onChange={(e) => setHint(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-1 focus:outline-none"
          />
          <Button
            icon={<AiOutlinePlus />}
            onClick={addHint}
            
          />
        </div>
        <div className='text-left flex flex-col gap-4'>
          {hints.map((h, index) => (
            <div className='flex flex-col items-center w-full gap-2'>
              <div key={index} className="text-sm text-gray-500 w-full">• {h}</div>
              <hr className='w-full'/>
            </div>
          ))}
        </div>
        <Input
          placeholder="Link"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          className="border border-gray-300 rounded-md p-2 focus:outline-none"
        />
        <div className='flex flex-row gap-2 items-center'>
          <Input
            placeholder="Enter Tag"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-1 focus:outline-none"
          />
          <Button
            icon={<AiOutlinePlus />}
            onClick={addTag}
          />
        </div>
        <div className='mt-2 text-left flex flex-row flex-wrap items-center gap-2'>
          {tags.map((t, index) => (
            <span key={index} className="flex flex-col items-center justify-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2">{t}</span>
          ))}
        </div>
      </div>
      <div className='w-full flex flex-col items-center gap-2'>
        <Button
          type='primary'
          className='w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md shadow-sm'
          onClick={handleSubmit} 
        >
          Save File
        </Button>
        <Button
          onClick={() => navigate('/')} 
          className='w-full'
        >
          Go Back
        </Button>
      </div>
    </div>
  </div>
);
}
export default CreateFile;