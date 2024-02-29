import React, { useState } from "react";
import { X, PencilFill, Check } from "react-bootstrap-icons";

interface ModalProps {
  isOpen: boolean;
  closeModal: () => void;
  contactDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  };
  updateContactDetails: (updatedDetails: {
    name: string;
    email: string;
    phoneNumber: string;
  }) => void;
}

const ModalContact: React.FC<ModalProps> = ({
  isOpen,
  closeModal,
  contactDetails,
  updateContactDetails,
}) => {
  const [isEditMode, setIsEditMode] = useState(false);
  const [editedDetails, setEditedDetails] = useState(contactDetails);

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = event.target;
    setEditedDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  const handleSave = () => {
    updateContactDetails(editedDetails);
    toggleEditMode();
  };

  return (
    <>
      {isOpen && (
        <div className="modal fade show" style={{ display: "block" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Contact Details" : "View Contact Details"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={(e) => e.preventDefault()}>
                  <div className="mb-3">
                    <label htmlFor="name" className="form-label">
                      Name
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="form-control"
                        id="name"
                        name="name"
                        value={editedDetails.name}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div>{contactDetails.name}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    {isEditMode ? (
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        name="email"
                        value={editedDetails.email}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div>{contactDetails.email}</div>
                    )}
                  </div>
                  <div className="mb-3">
                    <label htmlFor="phoneNumber" className="form-label">
                      Phone Number
                    </label>
                    {isEditMode ? (
                      <input
                        type="text"
                        className="form-control"
                        id="phoneNumber"
                        name="phoneNumber"
                        value={editedDetails.phoneNumber}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div>{contactDetails.phoneNumber}</div>
                    )}
                  </div>
                  {isEditMode ? (
                    <button
                      type="button"
                      className="btn btn-primary"
                      onClick={handleSave}
                    >
                      <Check /> Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={toggleEditMode}
                    >
                      <PencilFill /> Edit
                    </button>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ModalContact;
