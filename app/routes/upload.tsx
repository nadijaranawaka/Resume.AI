import React, {type FormEvent, useState} from 'react';
import Navbar from "~/components/Navbar";
import FileUploader from "~/components/FileUploader";
import {usePuterStore} from "~/lib/puter";
import {useNavigate} from "react-router";
import {convertPdfToImage} from "~/lib/pdf2image";
import {generateUUID} from "~/lib/utils";
import {AIResponseFormat, prepareInstructions} from "~/routes/constants";

const upload = () => {
  const { auth, isLoading, fs, ai, kv} = usePuterStore();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false)
  const [statusText,setStatusText] = useState("")
  const [file, setFile] = useState< File | null >(null)

  const handleAnalyze = async({companyName,jobTitle,jobDescription,file} : {companyName:string,jobTitle:string,jobDescription:string,file:File}) => {
      setIsProcessing(true)
      setStatusText("Uploading...")

      const uploadedFile = await fs.upload([file]);
      if(!uploadedFile) return setStatusText("Error: Failed to Upload File");

      setStatusText("Converting to Image...")
      const image = await convertPdfToImage(file)
      console.log("PdfConversionResult", image);
      if (!image.file) return setStatusText("Error: Failed to convert PDF to Image")

      setStatusText("Uploading the image")
      const uploadedImage = await fs.upload([image.file])
      if (!uploadedImage) return setStatusText("Error: Failed to Upload Image")

      setStatusText("Preparing Data...")

      const uuid = generateUUID();
      const data = {
          id: uuid,
          resumePath: uploadedFile.path,
          imagePath: uploadedImage.path,
          companyName , jobTitle,jobDescription,
          feedback: ''
      }
      await kv.set(`resume:${uuid}`,JSON.stringify(data));

      setStatusText("Analyzing...")

      const feedback = await ai.feedback(
          uploadedFile.path,
          prepareInstructions({jobTitle,jobDescription,AIResponseFormat})
      )
      if (!feedback) return "Error: Failed to Analyze Resume"

      const feedbackText  = typeof feedback.message.content === 'string' ?
          feedback.message.content : feedback.message.content[0].text

      data.feedback = JSON.parse(feedbackText)
      await kv.set(`resume:${uuid}`,JSON.stringify(data))
      setStatusText("Analysis Complete")
      console.log(data)
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      const form = e.currentTarget.closest('form')
      if (!form) return;
      const formData = new FormData(form);

      //data to display on cards
      const companyName = formData.get('company-name') as string;
      const jobTitle = formData.get("job-title") as string;
      const jobDescription = formData.get("job-description") as string;

      if (!file) return;

      handleAnalyze({
          companyName,
          jobTitle,
          jobDescription,
          file
      });

  }
  const handleFileSelect = (f : File | null) => {
    setFile(f)
}
  return (
      <main className={'bg-[url(\'/images/bg-main.svg\')] bg-cover'}>
          <Navbar/>
          <section className={'main-section'}>
              <div className={'page-heading py-16'}>
                  <h1>Smart Feedback For Your Dream Career</h1>
                  {isProcessing ? (
                      <>
                          <h2>{statusText}</h2>
                          <img src={"/images/resume-scan.gif"} className={'w-full'} alt={"PDF Scanner"}/>
                      </>
                      ) : (
                          <h2>Drop Your Resume Below</h2>
                  )}
                  {!isProcessing && (
                      <form id={'upload-form'} onSubmit={handleSubmit} className={'flex flex-col gap-4 mt-8'}>
                          <div className={'form-div'}>
                              <label htmlFor={'company-name'}>Company Name</label>
                              <input type={'text'} name={"company-name"} placeholder={"Company Name"} id={"company-name"} />
                          </div>
                          <div className={'form-div'}>
                              <label htmlFor={'job-title'}>Job Title</label>
                              <input type={'text'} name={"job-title"} placeholder={"Job Title"} id={"job-title"} />
                          </div>
                          <div className={'form-div'}>
                              <label htmlFor={'job-description'}>Job Description</label>
                              <textarea rows={5} name={"job-description"} placeholder={"Job Description"} id={"job-description"} />
                          </div>
                          <div className={'form-div'}>
                              <label htmlFor={'uploader'}>Upload Resume</label>
                              <FileUploader file={file} onFileSelect={handleFileSelect}/>
                          </div>
                          <button className={'primary-button'} type={'submit'}>
                              Get Feedback
                          </button>
                      </form>
                  )}
              </div>
          </section>
      </main>
  );
};

export default upload;