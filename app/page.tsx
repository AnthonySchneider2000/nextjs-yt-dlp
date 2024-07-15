"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function Home() {
  const [url, setUrl] = useState("");
  const [videoSrc, setVideoSrc] = useState("");

  const handleDownload = async () => {
    if (!url) {
      alert("Please enter a URL");
      return;
    }
    //clear the video src
    setVideoSrc("");

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ command: url }),
      });

      if (response.ok) {
        const blob = await response.blob();
        const videoUrl = URL.createObjectURL(blob);
        setVideoSrc(videoUrl);
      } else {
        const errorText = await response.text();
        alert(`Error: ${errorText}`);
      }
    } catch (error) {
      console.error("Error downloading video:", error);
      alert("An error occurred while downloading the video.");
    }
  };

  return (
    <>
      <section className="flex flex-row items-center justify-center gap-4 w-full">
        <div>yt-dlp</div>
        <Input
          className="sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4"
          placeholder="Enter URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <Button onClick={handleDownload}>Download</Button>
      </section>
      {videoSrc && (
        <video controls className="mt-4 sm:w-96 md:w-1/2 lg:w-1/3 xl:w-1/4">
          <source src={videoSrc} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      )}
    </>
  );
}
