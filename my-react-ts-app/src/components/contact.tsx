import React, { useState, ChangeEvent, FormEvent } from 'react';
import Modal from 'react-modal';

// Styles for the modal
const modalStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    marginRight: '-50%',
    transform: 'translate(-50%, -50%)',
    maxWidth: '400px',
    padding: '20px',
  },
};

const ContactEditor: React.FC = () => {
  const [modalIsOpen, setModalIsOpen] = useState(false);

  // State to store the contact details
  const [contactDetails, setContactDetails] = useState({
    name: '',
    email: '',
    phone: '',
  });

  // Function to handle input changes
  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setContactDetails({
      ...contactDetails,
      [name]: value,
    });
  };

  // Function to handle form submission
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // You can perform further actions here, such as sending the data to a server
    console.log("Submitted:", contactDetails);
    setModalIsOpen(false);
  };

  return (
    <div>
      {/* Pencil icon to edit contact details */}
      <span
        style={{ cursor: 'pointer' }}
        onClick={() => setModalIsOpen(true)}
      >
        ✏️
      </span>

      {/* Modal for editing contact details */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={() => setModalIsOpen(false)}
        style={modalStyles}
        contentLabel="Edit Contact Details"
      >
        <h2>Edit Contact Details</h2>
        <form onSubmit={handleSubmit}>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={contactDetails.name}
            onChange={handleInputChange}
          />
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={contactDetails.email}
            onChange={handleInputChange}
          />
          <label>Phone:</label>
          <input
            type="tel"
            name="phone"
            value={contactDetails.phone}
            onChange={handleInputChange}
          />
          <button type="submit">Save</button>
        </form>
      </Modal>
    </div>
  );
};

export default ContactEditor;
