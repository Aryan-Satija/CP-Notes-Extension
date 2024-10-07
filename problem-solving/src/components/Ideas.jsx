import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Button, message } from 'antd';
import Editor from 'react-simple-wysiwyg';
const Ideas = ({ data, setData, mode }) => {
  const navigate = useNavigate();
  const { folder } = useParams(); 
  console.log(data);
  const folderData = data.find((item) => item.key == folder);
  const fileData = folderData ? folderData.files.find((f) => f.name === "Ideas") : null;
  console.log(folderData);
  console.log(fileData);
  const [html, setHtml] = useState('');
  const handleAddIdea = () => {
    if (!html) {
      message.error('Please fill in idea.');
      return;
    }
    setData(prev => {
        console.log(prev);
        console.log(folder)
        return prev.map((fl)=>{
            if(fl.key == folder){
                return {
                    key: parseInt(folder),
                    name: fl.name,
                    files: fl.files.map((file)=>{
                        if(file.name === 'Ideas'){
                            return {
                                name: 'Ideas',
                                data: [...file.data, html]
                            }
                        }   
                        return file;
                    })
                }
            }
            return fl;
        })
    })
    message.success('Idea added successfully!');
    setHtml('');
  };
  return (
    <div className={mode ? `text-center w-[600px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border` : `text-center w-[400px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border`}>
      <div className='absolute -top-5 -left-2 z-10'>
        <img src={"notes.png"} className='h-[120px] w-[120px] animate-pulse' alt="notes"/>
      </div>
      <div className="text-2xl text-stone-700 mb-4 capitalize font-bold text-right w-full pt-10">Ideas:</div>
      
      <div className={mode ? `mt-2 flex flex-col items-start w-[550px] gap-2` : `mt-2 flex flex-col items-start w-[350px] gap-2`} >
        {fileData && fileData.data.length != 0? fileData.data.map((idea, index) => (
          <div key={index} className='w-full flex flex-col items-start'>
            <div
              className='border p-2 w-full text-left'
              dangerouslySetInnerHTML={{ __html: idea }} 
            />
          </div>
        )) : <div>No ideas found.</div>}
      </div>
      <div className='w-full flex flex-col items-center justify-center gap-4 my-4'>
        <div style={{ width: mode ? '550px' : '380px', minHeight: '100px' }}>
          <Editor 
            value={html} 
            onChange={(e) => {
              setHtml(e.target.value);
            }} 
            containerProps={{ style: { textAlign: 'left' } }}
          />
        </div>
      </div>

      <div className='w-full flex flex-col items-center gap-2 pb-4'>
        <Button
          className='w-full' 
          type='primary'
          onClick={()=>{
            handleAddIdea();
          }}
        >
          Add
        </Button>
        <Button
          className='w-full'
          onClick={() => navigate(-1)} 
        >
          Go Back
        </Button>
      </div>
    </div>
  );
}

export default Ideas