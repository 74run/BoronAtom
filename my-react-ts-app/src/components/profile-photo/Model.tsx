import React from "react";
import { X } from "react-bootstrap-icons";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  currentAvatar: string;
  updateAvatar: (dataUrl: string) => void;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ currentAvatar, updateAvatar, closeModal }) => {
  return (
    <>
      <div
        className="modal fade show"
        style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.8)" }}
        aria-labelledby="crop-image-dialog"
        role="dialog"
        aria-modal="true"
      >
        <div className="modal-dialog modal-dialog-centered modal-lg">
          <div
            className="modal-content"
            style={{
              backgroundColor: "#2b2f33",
              borderRadius: "12px",
              padding: "20px",
              boxShadow: "0px 4px 15px rgba(0, 0, 0, 0.3)",
              position: "relative",
            }}
          >
            {/* Close Button */}
            <button
              type="button"
              className="btn btn-outline-light position-absolute"
              style={{
                top: "10px",
                right: "10px",
                borderRadius: "50%",
                padding: "8px",
                transition: "all 0.3s ease",
              }}
              onClick={closeModal}
            >
              <X size={24} />
            </button>

            {/* Image Cropper */}
            <div className="d-flex flex-column align-items-center">
              <ImageCropper
                currentAvatar={currentAvatar}
                updateAvatar={updateAvatar}
                closeModal={closeModal}
                style={{
                  border: "4px solid #ffc107",
                  borderRadius: "10px",
                  padding: "10px",
                  width: "200px",
                  height: "200px",
                  marginBottom: "20px",
                  transition: "transform 0.3s ease",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Modal;
