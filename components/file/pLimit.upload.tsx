import type { NextPage } from "next";
import { useCallback, useEffect, useRef, useState } from "react";

import SparkMD5 from "spark-md5";

import uploadFilesManage from "@lib/utils/uploaderManager";

type Files = {
  taskId: string;
  file: File;
}
type FilesList = {
  [str: string]: Files;
}

const PLimitUploaderFile: NextPage = () => {
  const uploadInputRef = useRef<HTMLInputElement>(null);

  const [filesList, setFilesList] = useState<FilesList>({});

  useEffect(() => {}, []);

  // 选择文件弹框
  const handleSelectFile = useCallback(() => {
    uploadInputRef.current?.click();
  }, [uploadInputRef]);

  // 上传
  const handleUpload = useCallback(
    (e) => {
      console.log(111, e.target.files);
      const file = e.target.files[0];
      // 多文件上传时设置的文件id, 避免重复
      const taskId = SparkMD5.hash(file.name + file.size);
      console.log(222, taskId);
      if (filesList.taskId) {
        // 文件已存在
        return;
      }
      const newFilesList = {
        ...filesList,
        taskId: {
          taskId,
          file,
        }
      }
      setFilesList(newFilesList);
      uploadFilesManage.add({
        taskId,
        file,
      })
    },
    [filesList]
  );

  return (
    <div>
      <div>
        <button
          className="border border-primary text-primary rounded-[4px] px-[12px] py-[4px]"
          onClick={handleSelectFile}
        >
          upload file
        </button>
        <input
          className="hidden"
          ref={uploadInputRef}
          type="file"
          onChange={handleUpload}
          accept=".zip,.tar,.tar.gz"
        />
      </div>
      <ul>
        {
          Object.keys(filesList).map(item => (
            <li key={item}>
              <div><span>id: {item}</span><span>{filesList[item].file.name}</span></div>
            </li>
          ))
        }
      </ul>
    </div>
  );
};

export default PLimitUploaderFile;
