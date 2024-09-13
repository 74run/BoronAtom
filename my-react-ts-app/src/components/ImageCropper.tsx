import React, { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  Crop,
} from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css"; // Ensure you include the necessary CSS

import { useParams } from 'react-router-dom';
import setCanvasPreview from "../setCanvasPreview";
import axios from "axios";

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;
const MAX_FILE_SIZE = 2 * 1024 * 1024; // 2 MB in bytes

interface ImageCropperProps {
  currentAvatar: string;
  updateAvatar: (dataUrl: string) => void;
  closeModal: () => void;
  style?: React.CSSProperties;
}

const ImageCropper: React.FC<ImageCropperProps> = ({
  currentAvatar,
  updateAvatar,
  closeModal,
}) => {
  const imgRef = useRef<HTMLImageElement>(null);
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const [imgSrc, setImgSrc] = useState<string>(currentAvatar);
  const [crop, setCrop] = useState<Crop | undefined>();
  const [error, setError] = useState<string>("");

  const { userID } = useParams();

  useEffect(() => {
    setImgSrc(currentAvatar);
  }, [currentAvatar]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_FILE_SIZE) {
      setError("File size exceeds the 2 MB limit. Please choose a smaller file.");
      return;
    }

    const reader = new FileReader();
    reader.addEventListener("load", () => {
      const imageElement = new Image();
      const imageUrl = reader.result?.toString() || "";
      imageElement.src = imageUrl;

      imageElement.addEventListener("load", (e: Event) => {
        if (error) setError("");
        const { naturalWidth, naturalHeight } = e.currentTarget as HTMLImageElement;
        if (naturalWidth < MIN_DIMENSION || naturalHeight < MIN_DIMENSION) {
          setError("Image must be at least 150 x 150 pixels.");
          return setImgSrc("");
        }
      });

      setImgSrc(imageUrl);
    });
    reader.readAsDataURL(file);
  };

  const onImageLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    const { width, height } = e.currentTarget;
    const cropWidthInPercent = (MIN_DIMENSION / width) * 100;

    const crop = makeAspectCrop(
      {
        unit: "%",
        width: cropWidthInPercent,
      },
      ASPECT_RATIO,
      width,
      height
    );
    const centeredCrop = centerCrop(crop, width, height);
    setCrop(centeredCrop);
  };

  const handleCropImage = async () => {
    if (!previewCanvasRef.current || !imgRef.current || !crop) return;
  
    setCanvasPreview(
      imgRef.current,
      previewCanvasRef.current,
      convertToPixelCrop(crop, imgRef.current.width, imgRef.current.height)
    );
    const dataUrl = previewCanvasRef.current.toDataURL();
  
    try {
      // Send cropped image data to backend
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/image`, { imageData: dataUrl });
      updateAvatar(dataUrl);
      closeModal();
    } catch (error: any) {
      if (error.response && error.response.status === 413) {
        setError("The image is too large. Please choose a smaller file.");
      } else {
        console.error("Error saving image:", error);
        setError("An error occurred while saving the image. Please try again.");
      }
    }
  };

  return (
    <>
      {error && <p className="text-danger text-center mb-3">{error}</p>}
      {imgSrc && (
        <div className="d-flex flex-column align-items-center">
          <ReactCrop
            crop={crop}
            onChange={(pixelCrop, percentCrop) => setCrop(percentCrop)}
            circularCrop
            keepSelection
            aspect={ASPECT_RATIO}
            minWidth={MIN_DIMENSION}
          >
            <img
              ref={imgRef}
              src={imgSrc}
              alt="Upload"
              style={{
                maxWidth: "100%",
                maxHeight: "400px",
                objectFit: "contain",
                borderRadius: "10px",
                overflow: "visible",
                zIndex: 1,
              }}
              onLoad={onImageLoad}
              className="img-fluid shadow-sm"
            />
          </ReactCrop>
          <hr className="w-100" />
          <button
            className="btn btn-warning mt-4"
            onClick={handleCropImage}
            style={{
              borderRadius: "25px",
              padding: "10px 20px",
              fontSize: "1rem",
              position: "relative",
              bottom: "10px",
            }}
          >
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="d-none"
          style={{
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
        <input
          type="file"
          accept="image/*"
          onChange={onSelectFile}
          style={{ display: "none" }}
          className="custom-file-input visually-hidden"
          id="fileInput"
        />
      <label className="custom-file-label" htmlFor="fileInput"
      style={{
        borderRadius: "25px",
        padding: "10px 20px",
        fontSize: "1rem",
        cursor: "pointer",
        transition: "background-color 0.3s ease",
      }}>Upload New Photo
       
      </label>
    
    </>
  );
};

export default ImageCropper;
