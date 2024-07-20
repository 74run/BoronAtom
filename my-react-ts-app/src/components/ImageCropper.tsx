import React, { useRef, useState, useEffect } from "react";
import ReactCrop, {
  centerCrop,
  convertToPixelCrop,
  makeAspectCrop,
  Crop,
} from "react-image-crop";

import setCanvasPreview from "../setCanvasPreview";
import axios from "axios"; // Import Axios for making HTTP requests

const ASPECT_RATIO = 1;
const MIN_DIMENSION = 150;

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

  useEffect(() => {
    setImgSrc(currentAvatar);
  }, [currentAvatar]);

  const onSelectFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

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
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/api/saveImage`, { imageData: dataUrl });
      // Handle success response (if needed)
      // console.log("Image saved successfully:", response.data);
      // Update the avatar with the cropped image
      updateAvatar(dataUrl);
      closeModal();
    } catch (error) {
      // Handle error
      console.error("Error saving image:", error);
    }
  };

  return (
    <>
      {error && <p className="text-danger text-sm">{error}</p>}
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
                width: "400px",
                height: "auto",
                objectFit: "contain",
                overflow: "visible",
                zIndex: "1",
              }}
              onLoad={onImageLoad}
              className="img-fluid"
            />
          </ReactCrop>
          <hr />
          <button
            className="btn btn-primary mt-4"
            onClick={handleCropImage}
            style={{ position: "absolute", bottom: "16px", left: "50%", transform: "translateX(-50%)" }}
          >
            Crop Image
          </button>
        </div>
      )}
      {crop && (
        <canvas
          ref={previewCanvasRef}
          className="mt-4"
          style={{
            display: "none",
            border: "1px solid black",
            objectFit: "contain",
            width: 150,
            height: 150,
          }}
        />
      )}
      <label className="block mb-3 custom-file-label-container position-absolute bottom-0 end-0 m-3">
        <div className="custom-file">
          <input
            type="file"
            accept="image/*"
            onChange={onSelectFile}
            className="custom-file-input visually-hidden"
            id="fileInput"
          />
          <label className="custom-file-label" htmlFor="fileInput">
            Choose file
          </label>
        </div>
      </label>
    </>
  );
};

export default ImageCropper;
