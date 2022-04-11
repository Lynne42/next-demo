import type { NextPage } from "next";
import PLimitDownloadFile from '@/components/file/pLimit.download';
// import PQueueDownloadFile from '@/components/file/pqueue.download';
import PLimitUploaderFile from '@/components/file/pLimit.upload';

const File: NextPage = () => {
  
  return (
    <div className="w-1/2 mx-auto mt-[100px]">
      <PLimitDownloadFile/>
      {/* <PQueueDownloadFile/> */}
      <PLimitUploaderFile/>
    </div>
  );
};

export default File;
