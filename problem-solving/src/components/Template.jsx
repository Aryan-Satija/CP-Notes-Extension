import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialLight as dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Button, Input, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { GoCopy } from 'react-icons/go';
import { viewport } from '../App';
const Template = ({ data, setData, mode }) => {
  const navigate = useNavigate();
  const { folder } = useParams(); 
  const folderData = data.find((item) => item.key == folder);
  const fileData = folderData ? folderData.files.find((f) => f.name === "Templates") : null;
  console.log(folderData);
  console.log(fileData);
  const [newTemplateName, setNewTemplateName] = useState('');
  const [newTemplateCode, setNewTemplateCode] = useState('');

 
    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
        .then(() => {
            message.success('Copied to clipboard!');
        })
        .catch(err => {
            message.error('Failed to copy to clipboard:');
            console.error('Error copying text: ', err);
        });
    };

  const handleAddTemplate = () => {
    if (!newTemplateName || !newTemplateCode) {
      message.error('Please fill in both the template name and the code.');
      return;
    }
    setData(prev => {
        return prev.map((fl)=>{
            if(fl.key == folder){
                return {
                    key: parseInt(folder),
                    name: fl.name,
                    files: fl.files.map((file)=>{
                        if(file.name === 'Templates'){
                            return {
                                name: 'Templates',
                                data: [...file.data, {
                                    name: newTemplateName,
                                    code: newTemplateCode
                                }]
                            }
                        }   
                        return file;
                    })
                }
            }
            return fl;
        })
    })
    message.success('Template added successfully!');
    setNewTemplateName('');
    setNewTemplateCode('');
  };

  return (
    <div className={mode ? `text-center w-[600px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border` : `text-center w-[400px] h-[620px] overflow-auto flex flex-col items-start px-4 justify-around border`}>
      <div className='absolute -top-5 -left-2 z-10'>
        <img src={"notes.png"} className='h-[120px] w-[120px] animate-pulse' alt="notes"/>
      </div>
      <div className="text-2xl text-stone-700 mb-4 capitalize font-bold text-right w-full pt-10">Templates:</div>
      
      <div className={mode ? `mt-2 flex flex-col items-start w-[550px]` : `mt-2 flex flex-col items-start w-[350px]`} >
        {fileData ? fileData.data.map((template, index) => (
          <div key={index} className='w-full flex flex-col items-start'>
            <div className='flex flex-row items-center justify-between w-full'>
                <div>{template.name}</div>
                <div className='cursor-pointer' onClick={()=>{copyToClipboard(template.code)}}><GoCopy/></div>
            </div>
            <SyntaxHighlighter language='cpp' style={dark} className={`w-[${viewport[mode].inner}]`}>
              {template.code}
            </SyntaxHighlighter>
          </div>
        )) : <div>No templates found.</div>}
      </div>

      <div className='w-full flex flex-col items-center justify-center gap-4 mb-4'>
        <Input 
          className='w-full' 
          placeholder='Enter template name' 
          value={newTemplateName}
          onChange={(e) => setNewTemplateName(e.target.value)}
        />
        <TextArea 
          rows={8} 
          placeholder='Enter template code' 
          value={newTemplateCode}
          onChange={(e) => setNewTemplateCode(e.target.value)}
          spellCheck={false}
        />
      </div>

      <div className='w-full flex flex-col items-center gap-2 pb-4'>
        <Button
          className='w-full' 
          type='primary'
          onClick={handleAddTemplate}
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
};

export default Template;
