import React, { useEffect, useRef, useCallback, useState } from "react";
import uploader from '@/lib/minio-uploader/uploader';
import { toCheckTypeFile, FileStatus } from '@/lib/minio-uploader/file';

interface Props {}
const MinioUpload: React.FunctionComponent<Props> = () => {
  const [fileStatus, setFileStatus] = useState<any>({});
  const uploadFileRef = useRef<any>(null);

  // 保存选择的文件
  const handleUpload = async (e: any) => {
    const file = e.target.files[0];
    uploader.reset();
    uploader.init({
      file,
      callback: handleUpdateFileStatus,
    });
  };

  // 修改文件状态
  const handleUpdateFileStatus = useCallback(
    (params: any) => {
      // 返回当前文件状态，FileStatus(包含上传进度等)
      
      setFileStatus(params);
    },
    [setFileStatus],
  );

  // 点击选择文件
  const handleUploadBox = () => {
    uploadFileRef?.current?.click();
  };

  return (
    <div>
      <input
        type="file"
        ref={uploadFileRef}
        accept=".tar"
        onChange={handleUpload}
        id="uploadFile"
        style={{ display: "none" }}
      />
      <button className="w-[120px] h-[40px] border border-primary rounded-[4px] text-primary" onClick={handleUploadBox}>上传</button>
      <div>
          <p>MD5: {fileStatus.md5}</p>
          <p>progress: {fileStatus.succCount || 0} / { fileStatus.total || 0}</p>
      </div>
    </div>
  );
};
export default MinioUpload;
