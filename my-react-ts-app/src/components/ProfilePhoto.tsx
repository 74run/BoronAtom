import React, { useRef, useState } from "react";
import { Pencil, X } from "react-bootstrap-icons";
import Modal from "./Model";

const Profile: React.FC = () => {
  const avatarUrl = useRef<string>(
    "https://avatarfiles.alphacoders.com/161/161002.jpg"
  );
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [fullImageModalOpen, setFullImageModalOpen] = useState<boolean>(false);

  const updateAvatar = (imgSrc: string) => {
    avatarUrl.current = imgSrc;
  };

  return (
    <div className="container mt-5">
      <div className="d-flex flex-column align-items-center pt-4">
        <div className="position-relative">
          {/* Add onClick handler to the image */}
          <img
            src={avatarUrl.current}
            alt="Avatar"
            className="rounded-circle border border-secondary"
            style={{ width: "150px", height: "150px", cursor: "pointer" }}
            onClick={() => setFullImageModalOpen(true)}
          />
          <button
            className="position-absolute bottom-0 start-50 translate-middle p-1 rounded-circle bg-dark border border-dark"
            title="Change photo"
            onClick={() => setModalOpen(true)}
          >
            <Pencil size={16} className="text-light" />
          </button>
        </div>
        <h2 className="text-black font-weight-bold mt-4">Mack Aroney</h2>
        <p className="text-secondary text-sm mt-2">Software Engineer</p>

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
                    src={avatarUrl.current}
                    alt="Full Avatar"
                    className="img-fluid rounded-circle border border-secondary"
                  />
                  <button
                    className="position-absolute bottom-50 start-50 translate-middle p-1 rounded-circle bg-dark border border-dark"
                    title="Change photo"
                    onClick={() => setModalOpen(true)}
                  >
                    <Pencil size={16} className="text-light" />
                  </button>
                  <div className="mt-3">
                    <label htmlFor="fileInput" className="btn btn-dark">
                      Choose File
                      <input
                        type="file"
                        id="fileInput"
                        className="visually-hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () => {
                              updateAvatar(reader.result as string);
                            };
                            reader.readAsDataURL(file);
                          }
                        }}
                      />
                    </label>
                    <button
                      className="btn btn-dark ms-2"
                      onClick={() => setFullImageModalOpen(false)}
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Avatar Modal */}
        {modalOpen && (
          <Modal
            updateAvatar={updateAvatar}
            closeModal={() => setModalOpen(false)}
            currentAvatar={avatarUrl.current}  
          />
        )}
      </div>
    </div>
  );
};

export default Profile;
