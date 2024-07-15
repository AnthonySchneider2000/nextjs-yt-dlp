import { exec } from "child_process";
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

const YT_DLP_PATH = path.join(process.cwd(), 'yt-dlp', 'yt-dlp.exe');
export async function POST(req: Request): Promise<Response> {
  const { command } = await req.json();
  const outputDir = os.tmpdir(); // use system's temporary directory
  const outputFilePath = path.join(outputDir, 'downloaded_video.mp4'); // specify the output file path
  
  return new Promise((resolve, reject) => {
    const ytDlpCommand = `"${YT_DLP_PATH}" -o "${path.join(outputDir, 'downloaded_video.%(ext)s')}" ${command}`;
    console.log("ytDlpCommand:", ytDlpCommand);
    
    exec(ytDlpCommand, async (err, stdout, stderr) => {
      if (err) {
        console.error("error:", stderr);
        return reject(new Response("Error downloading video", { status: 500 }));
      }

      console.log(stdout);
      
      try {
        // Ensure the file exists before trying to read it
        await fs.access(outputFilePath);

        const fileBuffer = await fs.readFile(outputFilePath);
        const response = new Response(fileBuffer, {
          status: 200,
          headers: {
            'Content-Type': 'video/mp4',
            'Content-Disposition': 'attachment; filename="downloaded_video.mp4"',
          },
        });
        resolve(response);

        // Clean up the file after sending the response
        await fs.unlink(outputFilePath);
      } catch (fileErr) {
        console.error(fileErr);
        reject(new Response("Error reading video file", { status: 500 }));
      }
    });
  });
}
