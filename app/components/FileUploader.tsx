import React, {useCallback, useState} from 'react';
import {useDropzone} from 'react-dropzone';

const FileUploader = () => {
    const [file,setFile] = useState()
    const onDrop = useCallback(acceptedFiles => {
        // Do something with the files
    }, [])
    const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

    return (
    <div className={'w-full gradient-border'}>
        <div {...getRootProps()}>
            <input {...getInputProps()} />
            <div className={'space-y-4 cursor-pointer'}>
                <div className={"mx-auto w-16 h-16 flex items-center justify-center"}>
                    <img src={'/icons/info.svg'} alt={"upload"} className={"size-20"} />
                </div>
                {file ? (
                    <div></div>
                ) : (
                    <div>
                        <p className={"text-lg text-gray-500"}>
                            <span className={"font-semibold"}>
                                Click to Upload
                            </span> or drag and drop
                        </p>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
};

export default FileUploader;