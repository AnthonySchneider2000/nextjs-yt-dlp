import { exec } from "child_process";
import { promises as fs } from 'fs';
import path from 'path';
import os from 'os';

// Function to determine the correct path for yt-dlp.exe based on OS
function getYtDlpPath(): string {
  const platform = os.platform();
  if (platform === 'win32') {
    // Windows path example
    return path.join(process.cwd(), 'yt-dlp', 'yt-dlp.exe');
  } else if (platform === 'linux') {
    // Linux path example
    return path.join(process.cwd(), 'yt-dlp', 'yt-dlp-linux');
    // Adjust the file name according to the version you downloaded
  } else {
    throw new Error(`Unsupported platform: ${platform}`);
  }
}
export async function POST(req: Request): Promise<Response> {
  const { command } = await req.json();
  const outputDir = os.tmpdir(); // use system's temporary directory
  const outputFilePath = path.join(outputDir, 'downloaded_video.mp4'); // specify the output file path
  
  return new Promise((resolve, reject) => {
    const ytDlpCommand = `"${getYtDlpPath()}" -o "${path.join(outputDir, 'downloaded_video.%(ext)s')}" ${command}`;
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
