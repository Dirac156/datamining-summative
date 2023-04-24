import React, { useState } from 'react';
import { Button, Input, Radio, Modal } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { musicStyles } from '../data/musicStyles';
import { toast } from 'react-hot-toast';
import instance from '../services/axios';

const LandingPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [fileUploaded, setFileUploaded] = useState(null);
  const [fileUploadedUrl, setFileUploadedUrl] = useState(null);
  const [searchType, setSearchType] = useState('search');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [styleExamples, setStyleExamples] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);


  const handleStyleClick = async (style) => {
    setSelectedStyle(style);
    setIsModalVisible(true);

    // Fetch examples from the backend using the selected style
    // Replace with the appropriate API endpoint
    const response = await fetch(`http://127.0.0.1:8000/api/examples?style=${encodeURIComponent(style.name)}`);
    const data = await response.json();

    setStyleExamples(data.samples);
  };

  const closeModal = () => {
    setIsModalVisible(false);
    setSelectedStyle(null)
    setFileUploaded(null);
    setFileUploadedUrl(null)
  };

  // const handleSearch = async () => {
  //   try {
  //        const response = await fetch(`http://127.0.0.1:8000/api/examples?style=${encodeURIComponent(searchQuery)}`);
  //   const data = await response.json();
  //   if (response.samples?.length) {
  //       const sampleStyle = response.samples[0].audio.split("/")[0]
  //       const musics = musicStyles.filter((ms) => ms.name.toLowerCase() === sampleStyle.toLowerCase())
  //       setStyleExamples(data.samples);
  //       setSelectedStyle(musics[0]);
  //       setIsModalVisible(true); 
  //   } 
  //   } catch (err) {
  //     toast.error('failed to find a music style')
  //   }
  // };

  const onFileChange = async (info) => {
    const file = info.target.files[0]
    if (!file)
      return toast.error("Select A file")
  const formData = new FormData();
    formData.append('audio', file);

    try {
      await instance.post('/api/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      }).then(async (response) => {
        setFileUploaded(file)
        setFileUploadedUrl(URL.createObjectURL(file))
          const data = musicStyles.filter((ms) => ms.name.toLowerCase() === response.style.toLowerCase())
        if (data.length) {
            const fetchSamples = await fetch(`http://127.0.0.1:8000/api/examples?style=${encodeURIComponent(data[0].name)}`);
            const samples = await fetchSamples.json();
            setStyleExamples(samples.samples);
            setSelectedStyle(data[0]);
          setIsModalVisible(true);
          } else {
            toast.error(`Music Style not recognied: ${response.style}`)
          }
      });
  } catch (error) {
    toast.error(`${info.file.name} file upload failed.`);
  }
};


return (
  <div className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-700 min-h-screen">
    <div className="container mx-auto px-4 py-16">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">Congo Music Archive</h1>
        <p className="text-2xl text-white mb-8">
          Preserving and promoting the rich musical heritage of Congo
        </p>
        <div className="w-full md:w-2/3 lg:w-1/2 mx-auto mb-4">
          <div className="flex items-center justify-center border border-gray-600 p-4 bg-gray-800 rounded">
            <input onChange={onFileChange} type='file' className='bg-gray-600 text-white hover:bg-gray-500'/>
          </div>
        </div>
      </div>
      <div className="mt-16">
        <h2 className="text-3xl font-bold text-white mb-4">Featured Music Styles</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {musicStyles.map(({ name, image, description }) => (
            <div key={name} className="rounded overflow-hidden shadow-lg bg-gray-800" onClick={() => handleStyleClick({ name, image, description })}>
              {
                !!image && <img className="w-full" src={`/images/${image}`} alt={name} />
              }
              <div className="px-6 py-4">
                <div className="font-bold text-xl mb-2 text-white">{name}</div>
                <p className="text-white">{description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Modal
      title={`${selectedStyle ? selectedStyle.name : ''} Examples`}
      open={isModalVisible}
      onCancel={closeModal}
      footer={null}
      width="90%"
      className="bg-black"
    >
      <div><p>{selectedStyle?.description }</p></div>
      <div>          {fileUploaded &&
              (<div className='mt-5'>
        <h2 className='font-bold'>{ fileUploaded.name}</h2>
                <audio key={fileUploadedUrl} controls className="w-full">
                <source src={fileUploadedUrl} type="audio/mpeg" />
                Your browser does not support the audio element.
                </audio>
              </div>)}</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {styleExamples && styleExamples.length > 0 && styleExamples.map((example, index) => (
          <div key={index} className="mt-5 rounded-lg overflow-hidden shadow-lg">
            {/* <img className="w-full" src={example.image} alt={example.title} /> */}
            <div className="px-6 py-4">
              <div className="font-bold text-xl mb-2 text-black">{example.title}</div>
              <p className="text-black">{example.artist}</p>
            </div>
            <div className="flex items-center justify-center">
              <audio key={example.audio} controls className="w-full">
                <source src={`https://healthsyncsolutions.s3.us-east-2.amazonaws.com/MusicDataset/${example.audio}`} type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
            </div>
          </div>
        ))}
      </div>
    </Modal>
  </div>
);

};

export default LandingPage;
