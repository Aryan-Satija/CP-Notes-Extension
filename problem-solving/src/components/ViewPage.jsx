import { Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { viewport } from '../App';
function ViewPage({ data, mode }) {
    const { folder, filename } = useParams(); 
    const navigate = useNavigate(); 
    const folderData = data.find((item) => item.key == folder);
    
    const fileData = folderData ? folderData.files.find((f) => f.name === filename) : null;
  
    if (!fileData) {
      message("file not found");
      navigate("/");
    }
  
    return (
      <div className={mode ? `text-center w-[600px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border` : `text-center w-[400px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border`}>
        <div className='absolute -top-5 -left-2 z-10'><img src={"notes.png"} className='h-[120px] w-[120px] animate-pulse'/></div>
        <div className="text-2xl text-stone-700 mb-4 capitalize font-bold text-right w-full">{fileData.name}</div>
        <div className="text-lg font-semibold text-slate-700">Key Points:</div>
        <div className="mt-2 mb-4">
          {fileData.hints && fileData.hints.length > 0 ? (
            fileData.hints.map((hint, index) => (
              <div key={index} className="text-sm text-gray-600 italic">- {hint}</div>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No hints available.</div>
          )}
        </div>
  
        <div className='flex flex-row items-center gap-4'>
          <div className="text-lg font-semibold text-slate-700">Problem Link:</div>
          {fileData.link ? (
            <div>
              <a href={fileData.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline mb-4 capitalize italic">
                problem link
              </a>
            </div>
          ) : (
            <div className="text-sm text-gray-500 italic">No link available.</div>
          )}
        </div>
  
        
        <div className="text-lg font-semibold text-slate-700">Tags:</div>
        <div className="mt-2 flex flex-wrap">
          {fileData.tags && fileData.tags.length > 0 ? (
            fileData.tags.map((tag, index) => (
              <span key={index} className="flex flex-col items-center justify-center bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs font-medium mr-2 mb-2">
                {tag}
              </span>
            ))
          ) : (
            <div className="text-sm text-gray-500 italic">No tags available.</div>
          )}
        </div>
          
        <Button
          className='w-full'
          onClick={() => navigate(-1)} 
        >
          Go Back
        </Button>
      </div>
    );
}
export default ViewPage;