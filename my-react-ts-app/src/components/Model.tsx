import React, { useState } from "react";
import { X, ArrowsFullscreen } from "react-bootstrap-icons";
import ImageCropper from "./ImageCropper";

interface ModalProps {
  currentAvatar: string;
  updateAvatar: (dataUrl: string) => void;
  closeModal: () => void;
}

const Modal: React.FC<ModalProps> = ({ currentAvatar, updateAvatar, closeModal }) => {
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateAvatar(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <>
      <div className="modal fade show" style={{ display: "block" }} aria-labelledby="crop-image-dialog" role="dialog" aria-modal="true">
  <div className="modal-dialog modal-dialog-centered modal-lg">
    <div className="modal-content bg-dark text-light">
      <div className="modal-body p-4">
        {/* Move close button to the top-right corner */}
        <button type="button" className="btn btn-outline-light position-absolute top-0 end-0 m-3" onClick={closeModal}>
          <X size={24} />
        </button>
        <div className="d-flex flex-column-reverse align-items-start mb-3">
        <button
  type="button"
  className="btn btn-outline-light position-absolute bottom-0 start-0 m-3"
  onClick={() => setFullImageModalOpen(true)}
>
  <ArrowsFullscreen size={25} className="me-1" />
  View Full Image
</button>

          <ImageCropper currentAvatar={currentAvatar} updateAvatar={updateAvatar} closeModal={closeModal} />
        </div>
        {/* Additional content can be added here */}
      </div>
    </div>
  </div>
</div>




      {/* Full Image Modal */}
      {fullImageModalOpen && (
          <div
            className="modal fade show"
            style={{ display: "block", backgroundColor: "rgba(0, 0, 0, 0.5)" }}
            onClick={() => setFullImageModalOpen(false)}
          >
            <div className="modal-dialog modal-dialog-centered">
              <div className="modal-content">
                <div className="modal-body text-center">
                  <img
                    src={currentAvatar}
                    alt="Full Avatar"
                    className="img-fluid rounded-circle border border-secondary"
                  />
                <button
                  className="position-absolute top-0 end-0 m-3 bg-dark border border-dark rounded-circle"
                  onClick={() => setFullImageModalOpen(false)}
                >
                  <X size={20} className="text-light" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Modal;
