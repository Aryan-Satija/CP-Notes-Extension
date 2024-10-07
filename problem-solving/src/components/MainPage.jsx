import { useEffect, useState } from 'react'; 
import { Button, List, Input, Collapse, Radio, message, To, Switch } from 'antd';
import { CiLocationArrow1 } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';
import { CiMaximize1 } from "react-icons/ci";
import { viewport } from '../App';
import { MdDelete } from "react-icons/md";

function MainPage({folder, foldername, setFolder, setFoldername, selectedFolder, setSelectedFolder, data, setData, setMode, mode}) {

    const navigate = useNavigate();
    const [deleteEnable, setdeleteEnable] = useState(false);
    
    const handleFolderSelect = (e) => {
      setSelectedFolder(e.target.value);
    };
    function onChange(checked) {
      setdeleteEnable(checked);
    }
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString]);
    const sizeInBytes = blob.size;
    const sizeinMB = sizeInBytes/(1024*1024)

    const save = () => {
      message.success("Saved Successfully")
      localStorage.setItem("data", JSON.stringify(data));      
      localStorage.setItem("key", JSON.stringify(folder));      
    } 
  
    useEffect(()=>{
      if(data.length === 0){
        (async()=>{
          const loading = message.loading("fetching data...", 0);
          const response = await getTopicsFromDB()
          loading();
          message.success("data fetched");          
          console.log(response);
          setData(response);
          if(localStorage.getItem("key"))
            setFolder(localStorage.getItem("key") ? parseInt(localStorage.getItem("key")) : 0);
        })();
      }
    }, []);

    const openDatabase = () => {
      return new Promise((resolve, reject) => {
        const request = indexedDB.open("StudyNotesDB", 1);
    
        request.onupgradeneeded = (event) => {
          const db = event.target.result;
          const objectStore = db.createObjectStore("topics", { keyPath: "key" });
          objectStore.createIndex("name", "name", { unique: false });
        };
    
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
    
        request.onerror = (event) => {
          reject("Database error: " + event.target.errorCode);
        };
      });
    };
    const saveTopicsToDB = async (topics) => {
      const db = await openDatabase();
    
      const transaction = db.transaction("topics", "readwrite");
      const objectStore = transaction.objectStore("topics");
    
      topics.forEach((topic) => {
        objectStore.put(topic);
      });
    
      transaction.oncomplete = () => {
        console.log("All topics saved successfully.");
      };
    
      transaction.onerror = (event) => {
        console.error("Error saving topics: ", event.target.error);
      };
    };

    const getTopicsFromDB = async () => {
      const db = await openDatabase();
      const transaction = db.transaction("topics", "readonly");
      const objectStore = transaction.objectStore("topics");
    
      return new Promise((resolve, reject) => {
        const request = objectStore.getAll(); 
    
        request.onsuccess = (event) => {
          resolve(event.target.result);
        };
    
        request.onerror = (event) => {
          reject("Error retrieving topics: " + event.target.errorCode);
        };
      });
    };
    const deleteTopicFromDB = async (key) => {
      try {
        const db = await openDatabase();
        const transaction = db.transaction("topics", "readwrite");
        const objectStore = transaction.objectStore("topics");
    
        const request = objectStore.delete(key);
    
        request.onsuccess = () => {
          console.log(`Topic with key ${key} deleted successfully.`);
          (async()=>{
            const loading = message.loading("fetching data...", 0);
            const response = await getTopicsFromDB()
            loading();          
            console.log(response);
            setData(response);
            if(localStorage.getItem("key"))
              setFolder(localStorage.getItem("key") ? parseInt(localStorage.getItem("key")) : 0);
          })();
          message.success("Topic deleted successfully");
        };
    
        request.onerror = (event) => {
          console.error("Error deleting topic: ", event.target.error);
          message.error("Failed to delete the topic");
        };
      } catch (error) {
        console.error("Error deleting topic: ", error);
      }
    };
    
    return (
      <div className={mode ? `text-center w-[600px] h-[660px] flex flex-col items-center justify-start border` : `text-center w-[400px] h-[660px] flex flex-col items-center justify-start border`}>
        <div className={mode ? `w-[560px] flex flex-col items-center justify-around h-full` : `w-[360px] flex flex-col items-center justify-around h-full`}>
          <div className='text-xl font-semibold mt-4 text-slate-700 flex flex-row items-center'>
            <div className='absolute -top-7 -left-4'><img src={"notes.png"} className='h-[120px] w-[120px] animate-pulse'/></div>
            <div>Task Loop</div>
            <div className='flex flex-row items-center gap-2'>
              <div className={mode ? 'translate-x-52 cursor-pointer' : 'translate-x-28 cursor-pointer'}>
                <Switch defaultChecked={false} onChange={onChange} size='small'/>
              </div>
              <div className={mode ? 'translate-x-52 cursor-pointer translate-y-1' : 'translate-x-28 cursor-pointer translate-y-1'} onClick={()=>{
                setMode(mode => 1 - mode);
              }}><CiMaximize1/></div>
            </div>
          </div>
          <div className='flex flex-col items-center mt-4 '>
            <div className='text-xs text-right w-full text-slate-600'>
              {sizeinMB.toFixed(5)} MB
            </div>
            <>
              <List
                bordered
                itemLayout='horizontal'
                dataSource={data}
                className={mode ? `w-[560px] max-h-[400px] overflow-auto rounded-sm` : `w-[360px] max-h-[400px] overflow-auto rounded-sm`}
                renderItem={(folder) => (
                  <List.Item className='w-full' key={folder.key}>
                    <div className={`w-[${viewport[mode].inner}] flex flex-row items-start`}>
                      <Radio
                        value={folder.key}
                        checked={selectedFolder === folder.key}
                        onChange={handleFolderSelect}
                        className='pt-3'
                      />
                      <div className={mode == 0 ? `w-[280px]` : `w-[480px]`}>
                        <Collapse
                          className='rounded-sm text-xs'
                          items={[{
                            key: folder.key.toString(),
                            label: folder.name,
                            children: folder.files.map((file, index) => (
                              <div className='flex flex-row items-center justify-between text-sm' key={index}>
                                {
                                  mode === 0 && 
                                  <div>{file.name.length > 25 ? `${file.name.substr(0, 25)}...` : file.name}</div>
                                }
                                {
                                  mode === 1 &&
                                  <div>{file.name.length > 45 ? `${file.name.substr(0, 45)}...` : file.name}</div>
                                }
                                <div className='flex flex-row items-center gap-4'>
                                    <div className='cursor-pointer hover:text-blue-600 font-bold' onClick={()=>{
                                      if(file.name === 'Templates'){
                                        navigate(`/edit-templates/${folder.key}`);
                                        return;
                                      }
                                      if(file.name === 'Ideas'){
                                        navigate(`/ideas/${folder.key}`);
                                        return;
                                      }
                                      navigate(`/view-file/${folder.key}/${file.name}`)
                                    }}><CiLocationArrow1 /></div>
                                </div>
                              </div>
                            ))
                          }]}
                        />
                      </div>
                    </div>
                  </List.Item>
                )}
              />
            </>
          </div>
          <div className='w-full flex flex-col items-center justify-center gap-2 mt-4'>
            <Button type='primary' className='w-full' onClick={() => navigate('/create-file', { state: { selectedFolder } })}>
              Create File
            </Button>
            <div className='w-full'>
              <Button className='w-full bg-red-500' type='primary' onClick={()=>{
                deleteTopicFromDB(selectedFolder);
              }} disabled={!deleteEnable}>
                <div><MdDelete/></div>
                <div>Delete</div>
              </Button>
            </div>
            <div className='flex items-center gap-2 w-full'>
              <Input variant='outlined' value={foldername} onChange={(e) => setFoldername(e.target.value)} />
              <Button type='default' className='w-full' onClick={() => {
                if(foldername === ""){
                  message.error("folder name can't be empty");
                  return;
                }
                let duplicate = false;
                data.map((folder)=>{
                  if(folder.name === foldername){
                    message.error("folder name already exist");
                    duplicate = true;
                  }
                })
                if(duplicate) return;
                setData(prev => [...prev, {
                  key: prev.length > 0  ? Math.max(...prev.map(folder => folder.key)) + 1 : 0,
                  name: foldername,
                  files: [
                    {
                        name: 'Ideas',
                        data: [

                        ]
                    },
                    {
                        name: "Templates",
                        data: [

                        ]
                    }
                  ]
                }]);
                setFoldername("");
                setFolder(folder + 1);
              }}>
                Create Folder
              </Button>
            </div>
            <Button type='default' className='w-full mb-2' onClick={async()=>{
              const loading = message.loading("loading", 0);
              await saveTopicsToDB(data);
              loading();
              message.success("Saved Successfully");
              localStorage.setItem("key", JSON.stringify(folder));
            }}>Save</Button>
          </div>
        </div>
      </div>
    );
}
export default MainPage;  