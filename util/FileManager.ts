import path from 'path';
import fs from 'fs';

const deleteDirectory = async (urlHash: string): Promise<void> => {
  const dirPath = path.resolve(__dirname, `../../tmp/${urlHash}`);

  if (fs.existsSync(dirPath)) {
    fs.readdirSync(dirPath).forEach(function (entry) {
      var entry_path = path.join(dirPath, entry);
      if (fs.lstatSync(entry_path).isDirectory()) {
        deleteDirectory(entry_path);
      } else {
        fs.unlinkSync(entry_path);
      }
    });
    fs.rmdirSync(dirPath);
  }
};

const getFileFromDirectory = async(file : string, cb : Function) => {
  fs.readdir(file, (err, files) => {
    cb(files);
  });
}

export { deleteDirectory, getFileFromDirectory };
