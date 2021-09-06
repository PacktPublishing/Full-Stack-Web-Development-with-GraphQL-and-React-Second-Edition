import React, { useState, useRef } from 'react';
import Modal from 'react-modal';
import Cropper from 'react-cropper';
import { useDropzone } from 'react-dropzone';
import { useUploadAvatarMutation } from '../apollo/mutations/uploadAvatar';

Modal.setAppElement('#root');

const modalStyle = {
  content: {
    width: '400px',
    height: '450px',
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)'
  }
};

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);
  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')
  [0];
  var ia = new Uint8Array(byteString.length);

  for (var i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  const file = new Blob([ia], {type:mimeString});
  return file;
}

const AvatarModal = ({ isOpen, showModal }) => {
  const [file, setFile] = useState(null);
  const [result, setResult] = useState(null);
  const [uploadAvatar] = useUploadAvatarMutation();
  const cropperRef = useRef(null);

  const saveAvatar = () => {
    const resultFile = dataURItoBlob(result);
    resultFile.name = file.filename;
    uploadAvatar({variables: { file: resultFile }}).then(() => {
      showModal();
    });
  };

  const changeImage = () => {
    setFile(null);
  };

  const onDrop = (acceptedFiles) => {
    const reader = new FileReader();
    reader.onload = () => {
      setFile({
        src: reader.result,
        filename: acceptedFiles[0].name,
        filetype: acceptedFiles[0].type,
        result: reader.result,
        error: null,
      });
    };
    reader.readAsDataURL(acceptedFiles[0]);
  };
  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop});

  const onCrop = () => {
    const imageElement = cropperRef?.current;
    const cropper = imageElement?.cropper;
    setResult(cropper.getCroppedCanvas().toDataURL());
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={showModal}
      contentLabel="Change avatar"
      style={modalStyle}
    >
      {!file &&
        (<div className="drop" {...getRootProps()}>
          <input {...getInputProps()} />
          {isDragActive ? <p>Drop the files here ...</p> : <p>Drag 'n' drop some files here, or click to select files</p>}
        </div>)
      }
      {file && <Cropper ref={cropperRef} src={file.src} style={{ height: 400, width: "100%" }} initialAspectRatio={16 / 9} guides={false} crop={onCrop}/>}
      {file && (
        <button className="cancelUpload" onClick={changeImage}>Change image</button>
      )}
      <button className="uploadAvatar" onClick={saveAvatar}>Save</button>
    </Modal>
  )
}

export default AvatarModal
