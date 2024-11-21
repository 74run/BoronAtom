import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faToggleOn, faToggleOff, faMagic } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Involvement {
  _id: string;
  organization: string;
  role: string;
  startDate: { month: string; year: string };
  endDate: { month: string; year: string };
  description: string;
  includeInResume: boolean;
  isEditing?: boolean;
  isPresent?: boolean; // Add this field to track if the end date is 'Present'
}

interface InvolvementProps {
  Involvements: Involvement[];
  onEdit: (id: string, data: { organization: string; role: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }; description: string; includeInResume: boolean, isPresent: boolean }) => void;
  onDelete: (id: string) => void;
}

const InvolvementSection: React.FC<InvolvementProps> = ({ Involvements, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; organization: string; role: string; startDate: { month: string; year: string };
    endDate: { month: string; year: string }; description: string; includeInResume: boolean, isPresent: boolean } | null>(null);
  const [involvements, setInvolvements] = useState<Involvement[]>(Involvements);
  const [newInvolvement, setNewInvolvement] = useState<Involvement>({
    _id: '',
    organization: '',
    role: '',
    startDate: { month: '', year: '' },
    endDate: { month: '', year: '' },
    description: '',
    includeInResume: true,
    isPresent: false, // Initialize as false
  });
  const [isAdding, setIsAdding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { userID } = useParams();
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchInvolvement();
  }, []);

  const fetchInvolvement = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch involvements');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        setInvolvements(data); // Set involvements state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching involvements:', error);
      });
  };

  const handleEditClick = (id: string, organization: string, role: string, startDate: { month: string; year: string },
    endDate: { month: string; year: string }, description: string, includeInResume: boolean, isPresent: boolean) => {
    setEditData({ id, organization, role, startDate, endDate, description, includeInResume, isPresent });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        organization: editData.organization,
        role: editData.role,
        startDate: { ...editData.startDate },
        endDate: { ...editData.endDate },
        description: editData.description,
        includeInResume: editData.includeInResume,
        isPresent: editData.isPresent
      });

      const updatedItems = involvements.map((involvement) =>
        involvement._id === editData.id
          ? { ...involvement, organization: editData.organization, role: editData.role, startDate: { ...editData.startDate }, endDate: { ...editData.endDate }, description: editData.description, includeInResume: editData.includeInResume, isPresent: editData.isPresent }
          : involvement
      );

      setInvolvements(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedInvolvement = {
      ...newInvolvement,
      startDate: {
        month: newInvolvement.startDate.month,
        year: newInvolvement.startDate.year,
      },
      endDate: {
        month: newInvolvement.endDate.month,
        year: newInvolvement.endDate.year,
      },
    };

    axios.post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement`, formattedInvolvement)
      .then((response) => {
        const newInvolvementFromServer = response.data.involvement;
        const newInvData = newInvolvementFromServer[newInvolvementFromServer.length - 1];
        setInvolvements([...involvements, newInvData]);

        // Reset the newInvolvement state
        setNewInvolvement({
          _id: '',
          organization: '',
          role: '',
          startDate: { month: '', year: '' },
          endDate: { month: '', year: '' },
          description: '',
          includeInResume: true,
          isPresent: false, // Reset to false
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving involvement:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/involvement/${id}`, {
      method: 'DELETE',
    })
      .then(() => {
        // Update the state to remove the deleted involvement
        const updatedInvolvements = involvements.filter((involvement) => involvement._id !== id);
        setInvolvements(updatedInvolvements);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting involvement:', error);
      });
  };

  const handleAddClick = () => {
    setNewInvolvement({
      _id: '',
      organization: '',
      role: '',
      startDate: { month: '', year: '' },
      endDate: { month: '', year: '' },
      description: '',
      includeInResume: true,
      isPresent: false, // Initialize as false
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedInvolvements = involvements.map((involvement) =>
      involvement._id === id ? { ...involvement, includeInResume: !involvement.includeInResume } : involvement
    );
    setInvolvements(updatedInvolvements);

    const involvementToUpdate = updatedInvolvements.find(involvement => involvement._id === id);
    if (involvementToUpdate) {
      onEdit(id, {
        organization: involvementToUpdate.organization,
        role: involvementToUpdate.role,
        startDate: involvementToUpdate.startDate,
        endDate: involvementToUpdate.endDate,
        description: involvementToUpdate.description,
        includeInResume: involvementToUpdate.includeInResume,
        isPresent: involvementToUpdate.isPresent ?? false, // Use nullish coalescing operator to provide a default value
      });
    }
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    if (lines.length > 0 && !lines[0].startsWith('*')) {
      lines[0] = '* ' + lines[0];
    }

    for (let i = 1; i < lines.length; i++) {
      if (lines[i] !== '' && !lines[i].startsWith('*')) {
        lines[i] = '* ' + lines[i];
      }
    }

    const newDescription = lines.join('\n');
    setNewInvolvement({ ...newInvolvement, description: newDescription });
  };

  const handleEditDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const description = e.target.value;
    const lines = description.split('\n');

    const linesWithAsterisks = lines.map(line => {
      if (line.trim() !== '' && !line.trim().startsWith('*')) {
        return `* ${line}`;
      } else {
        return line;
      }
    });

    const newDescription = linesWithAsterisks.join('\n');

    if (editData) {
      setEditData({
        ...editData,
        description: newDescription
      });
    }
  };

  const handleGenerateDescription = async (organization: string, role: string) => {
    try {
      // Set loading state for the description generation process
      setIsLoading(true);
  
      // Make the API request
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/userprofile/generate-involvement-description/${userID}/${organization}/${role}`,
        {
          params: { organization, role },
        }
      );
  
      const generatedDescription = response.data.text;
  
      // Update the description in the appropriate form state (edit or new involvement)
      if (editData) {
        setEditData((prevData) => ({
          ...prevData!,
          description: generatedDescription,
        }));
      } else {
        setNewInvolvement((prevData) => ({
          ...prevData,
          description: generatedDescription,
        }));
      }
    } catch (error) {
      // Log the error for debugging purposes
      console.error("Error generating description:", error);
  
      // Optional: Show a user-friendly error message
      alert("Failed to generate description. Please try again later.");
    } finally {
      // Reset loading state
      setIsLoading(false);
    }
  };
  
  const handleTogglePresent = () => {
    if (editData) {
      setEditData({ ...editData, isPresent: !editData.isPresent });
    } else {
      setNewInvolvement({ ...newInvolvement, isPresent: !newInvolvement.isPresent });
    }
  };

  return (
    <div
    style={{
      border: "none",
      borderRadius: "0px",
      padding: "24px",
      marginBottom: "30px",
      fontFamily: "'Roboto', sans-serif",
      color: "#f5f5f5",
      backgroundColor: "#1c1c1e",
      boxShadow: "0 20px 40px rgba(0, 0, 0, 0.5)",
    }}
    >
      <h4
        style={{
          color: "#00d084",
          textAlign: "left",
          marginBottom: "1.5rem",
          fontFamily: "'Roboto Slab', serif",
          fontWeight: 700,
          fontSize: "1.6rem",
        }}
      >
        Involvements
      </h4>
  
      {/* Map over Involvements */}
      {involvements.map((involvement) => (
        <div
          key={involvement._id}
          className="involvement-card"
          style={{
            border: "1px solid #333",
            borderRadius: "12px",
            padding: "24px",
            marginBottom: "20px",
            backgroundColor: "#1b1b2f",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            transition: "transform 0.3s, box-shadow 0.3s",
            cursor: "pointer",
            position: "relative",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-5px)";
            e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.3)";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
          }}
        >
          {editData && editData.id === involvement._id ? (
            // Edit mode
            <div
            style={{
              border: "1px solid #444",
              borderRadius: "16px",
              padding: "20px",
              marginBottom: "2rem",
              backgroundColor: "#2d2d30",
              boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            }}
          >
        
          
            {/* Organization Input */}
            <input
              type="text"
              placeholder="Organization"
              value={editData.organization}
              onChange={(e) => setEditData({ ...editData, organization: e.target.value })}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            />
          
            {/* Role Input */}
            <input
              type="text"
              placeholder="Role"
              value={editData.role}
              onChange={(e) => setEditData({ ...editData, role: e.target.value })}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            />
          
            {/* Start and End Date Section */}
            <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
              Start Date
            </h6>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "1.5rem",
              }}
            >
              <select
                value={editData.startDate.month}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    startDate: { ...editData.startDate, month: e.target.value },
                  })
                }
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
          
              <select
                value={editData.startDate.year}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    startDate: { ...editData.startDate, year: e.target.value },
                  })
                }
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Year
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          
            <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
              End Date
            </h6>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "15px",
                marginBottom: "1.5rem",
              }}
            >
              <select
                value={editData.endDate.month}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    endDate: { ...editData.endDate, month: e.target.value },
                  })
                }
                disabled={editData.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Month
                </option>
                {months.map((month) => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
          
              <select
                value={editData.endDate.year}
                onChange={(e) =>
                  setEditData({
                    ...editData,
                    endDate: { ...editData.endDate, year: e.target.value },
                  })
                }
                disabled={editData.isPresent}
                style={{
                  borderRadius: "8px",
                  border: "1px solid #555",
                  padding: "10px",
                  backgroundColor: "#1c1c1e",
                  color: "#f5f5f5",
                  fontSize: "1rem",
                }}
              >
                <option value="" disabled>
                  Select Year
                </option>
                {graduationYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          
            {/* Toggle Present Button */}
            <button
              onClick={handleTogglePresent}
              style={{
                backgroundColor: editData.isPresent ? "#28a745" : "#dc3545",
                color: "#fff",
                border: "none",
                borderRadius: "8px",
                padding: "10px 20px",
                fontSize: "1rem",
                width: "100%",
                marginBottom: "1.5rem",
              }}
            >
              <FontAwesomeIcon
                icon={editData.isPresent ? faToggleOn : faToggleOff}
                style={{ marginRight: "8px" }}
              />
              {editData.isPresent ? "Present" : "Not Present"}
            </button>
          
            {/* Description Textarea */}
            <textarea
              placeholder="Description"
              value={editData.description}
              onChange={handleEditDescriptionChange}
              style={{
                borderRadius: "8px",
                border: "1px solid #555",
                padding: "14px",
                fontSize: "1rem",
                marginBottom: "1.5rem",
                width: "100%",
                height: "200px",
                backgroundColor: "#1c1c1e",
                color: "#f5f5f5",
              }}
            />
          
            {/* Action Buttons */}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <button
                onClick={handleUpdate}
                style={{
                  backgroundColor: "#4CAF50",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  flex: "1",
                  fontSize: "1rem",
                }}
              >
                <FontAwesomeIcon icon={faSave} /> Update
              </button>
          
              <button
                onClick={handleCancelEdit}
                style={{
                  backgroundColor: "#6c757d",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "10px 20px",
                  flex: "1",
                  fontSize: "1rem",
                }}
              >
                Cancel
              </button>
          
              <button
  onClick={() => handleGenerateDescription(editData.organization, editData.role)}
  disabled={isLoading}
  style={{
    backgroundColor: isLoading ? "#17a2b8" : "#17a2b8", // Keep button color visible
    color: "#fff",
    borderRadius: "8px",
    padding: "10px 20px",
    flex: "1",
    border: "none",
    cursor: isLoading ? "not-allowed" : "pointer",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "1rem",
    opacity: isLoading ? 0.8 : 1, // Slight dim effect during loading
    transition: "opacity 0.3s ease",
  }}
>
  {isLoading ? (
    <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          animation: "bounce 1s infinite ease-in-out",
        }}
      ></div>
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          animation: "bounce 1s infinite ease-in-out",
          animationDelay: "0.2s",
        }}
      ></div>
      <div
        style={{
          width: "6px",
          height: "6px",
          borderRadius: "50%",
          backgroundColor: "#fff",
          animation: "bounce 1s infinite ease-in-out",
          animationDelay: "0.4s",
        }}
      ></div>
    </div>
  ) : (
    <>
      <FontAwesomeIcon icon={faMagic} />
      <span style={{ marginLeft: "8px" }}>AI Description</span>
    </>
  )}
</button>

<style>
  {`
    @keyframes bounce {
      0%, 80%, 100% {
        transform: scale(0);
      }
      40% {
        transform: scale(1);
      }
    }
  `}
</style>
            </div>
          </div>
          
          ) : (
            // View mode
            <div
       >
              <h5
               style={{
                color: "#00d084",
                fontFamily: "'Roboto Slab', serif",
                fontSize: "1.4rem",
                marginBottom: "0.5rem",
                fontWeight: 700,
              }}
              >
                {involvement.role}
              </h5>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Start Date:</strong> {involvement.startDate.month}{" "}
                {involvement.startDate.year}
              </p>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>End Date:</strong>{" "}
                {involvement.isPresent
                  ? "Present"
                  : `${involvement.endDate.month} ${involvement.endDate.year}`}
              </p>
  
              <p
                style={{
                  fontSize: "0.9rem",
                  color: "#bbb",
                }}
              >
                <strong>Organization:</strong> {involvement.organization}
              </p>

              <div
  style={{
    marginTop: "20px",
    marginBottom: "20px",
    color: "#f5f5f5", // A softer white for better readability
    whiteSpace: "pre-wrap", // Maintain whitespace and newlines
    lineHeight: "1.6", // Increase line spacing for better readability
    fontSize: "1rem", // Adjust font size
    fontFamily: "'Roboto', sans-serif", // Set a consistent font family
    backgroundColor: "#2c2c2e", // Slightly different background for contrast
    padding: "12px", // Add padding around the text
    borderRadius: "8px", // Rounded corners for a modern look
    border: "1px solid #444", // Subtle border for separation
  }}
>
{involvement.description.split("**").map((part, index) =>
  index % 2 === 1 ? (
    <b key={index} style={{ color: "#00d084", fontWeight: 600 }}>{part}</b> // Bold content
  ) : (
    <span key={index}>{part}</span> // Regular content
  )
)}


</div>
  
              {/* Action buttons */}
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <button
  onClick={() =>
    handleEditClick(
      involvement._id,
      involvement.organization,
      involvement.role,
      involvement.startDate,
      involvement.endDate,
      involvement.description,
      involvement.includeInResume,
      involvement.isPresent || false
    )
  }
  style={{
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(to right, #007bff, #4facfe)", // Blue gradient
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon icon={faEdit} style={{ marginRight: "8px" }} />
  Edit
</button>

<button
  onClick={() => handleDelete(involvement._id)}
  style={{
    padding: "0.7rem 1.5rem",
    background: "linear-gradient(to right, #ff4d4d, #ff8080)", // Red gradient
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon icon={faTrash} style={{ marginRight: "8px" }} />
  Delete
</button>

<button
  onClick={() => handleToggleInclude(involvement._id)}
  style={{
    padding: "0.7rem 1.5rem",
    background: involvement.includeInResume
      ? "linear-gradient(to right, #28a745, #8be78b)" // Green gradient for Included
      : "linear-gradient(to right, #dc3545, #ff7b7b)", // Red gradient for Excluded
    color: "#fff",
    border: "none",
    borderRadius: "25px", // Rounded corners
    cursor: "pointer",
    fontWeight: "500",
    fontSize: "1rem",
    transition: "0.3s ease", // Smooth hover transition
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.3)", // Subtle shadow
  }}
  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
>
  <FontAwesomeIcon
    icon={involvement.includeInResume ? faToggleOn : faToggleOff}
    style={{ marginRight: "8px" }}
  />
  {involvement.includeInResume ? "Included" : "Excluded"}
</button>

              </div>
            </div>
          )}
        </div>
      ))}
  
      {/* Add Involvement Form */}
       {isAdding && (
        // Add involvement entry
        <div
        style={{
          border: "1px solid #444",
          borderRadius: "16px",
          padding: "20px",
          marginBottom: "2rem",
          backgroundColor: "#2d2d30",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
    
      
        {/* Organization Input */}
        <input
          type="text"
          placeholder="Organization"
          value={newInvolvement.organization}
          onChange={(e) =>
            setNewInvolvement({ ...newInvolvement, organization: e.target.value })
          }
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      
        {/* Role Input */}
        <input
          type="text"
          placeholder="Role"
          value={newInvolvement.role}
          onChange={(e) =>
            setNewInvolvement({ ...newInvolvement, role: e.target.value })
          }
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      
        {/* Start Date Section */}
        <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
          Start Date
        </h6>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "1.5rem",
          }}
        >
          <select
            value={newInvolvement.startDate.month}
            onChange={(e) =>
              setNewInvolvement({
                ...newInvolvement,
                startDate: {
                  ...newInvolvement.startDate,
                  month: e.target.value,
                },
              })
            }
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
            }}
          >
            {!newInvolvement.startDate.month && (
              <option value="" disabled>
                Select Month
              </option>
            )}
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
      
          <select
            value={newInvolvement.startDate.year}
            onChange={(e) =>
              setNewInvolvement({
                ...newInvolvement,
                startDate: {
                  ...newInvolvement.startDate,
                  year: e.target.value,
                },
              })
            }
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
            }}
          >
            {!newInvolvement.startDate.year && (
              <option value="" disabled>
                Select Year
              </option>
            )}
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      
        {/* End Date Section */}
        <h6 style={{ color: "#f5f5f5", marginBottom: "1rem", fontWeight: "bold" }}>
          End Date
        </h6>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: "15px",
            marginBottom: "1.5rem",
          }}
        >
          <select
            value={newInvolvement.endDate.month}
            onChange={(e) =>
              setNewInvolvement({
                ...newInvolvement,
                endDate: {
                  ...newInvolvement.endDate,
                  month: e.target.value,
                },
              })
            }
            disabled={newInvolvement.isPresent}
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
            }}
          >
            {!newInvolvement.endDate.month && (
              <option value="" disabled>
                Select Month
              </option>
            )}
            {months.map((month) => (
              <option key={month} value={month}>
                {month}
              </option>
            ))}
          </select>
      
          <select
            value={newInvolvement.endDate.year}
            onChange={(e) =>
              setNewInvolvement({
                ...newInvolvement,
                endDate: {
                  ...newInvolvement.endDate,
                  year: e.target.value,
                },
              })
            }
            disabled={newInvolvement.isPresent}
            style={{
              borderRadius: "8px",
              border: "1px solid #555",
              padding: "10px",
              backgroundColor: "#1c1c1e",
              color: "#f5f5f5",
              fontSize: "1rem",
            }}
          >
            {!newInvolvement.endDate.year && (
              <option value="" disabled>
                Select Year
              </option>
            )}
            {graduationYears.map((year) => (
              <option key={year} value={year}>
                {year}
              </option>
            ))}
          </select>
        </div>
      
        {/* Toggle Present Button */}
        <button
          onClick={handleTogglePresent}
          style={{
            backgroundColor: newInvolvement.isPresent ? "#28a745" : "#dc3545",
            color: "#fff",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            fontSize: "1rem",
            width: "100%",
            marginBottom: "1.5rem",
          }}
        >
          <FontAwesomeIcon
            icon={newInvolvement.isPresent ? faToggleOn : faToggleOff}
            style={{ marginRight: "8px" }}
          />
          {newInvolvement.isPresent ? "Present" : "Not Present"}
        </button>
      
        {/* Description Textarea */}
        <textarea
          placeholder="Description"
          value={newInvolvement.description}
          onChange={(e) => handleDescriptionChange(e)}
          style={{
            borderRadius: "8px",
            border: "1px solid #555",
            padding: "14px",
            fontSize: "1rem",
            marginBottom: "1.5rem",
            width: "100%",
            height: "200px",
            backgroundColor: "#1c1c1e",
            color: "#f5f5f5",
          }}
        />
      
        {/* Action Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleSaveClick}
            style={{
              backgroundColor: "#4CAF50",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              flex: "1",
              fontSize: "1rem",
            }}
          >
            <FontAwesomeIcon icon={faSave} /> Save
          </button>
      
          <button
            onClick={() => setIsAdding(false)}
            style={{
              backgroundColor: "#6c757d",
              color: "#fff",
              border: "none",
              borderRadius: "8px",
              padding: "10px 20px",
              flex: "1",
              fontSize: "1rem",
            }}
          >
            Cancel
          </button>
        </div>
      </div>
      
      )}
  
      {!isAdding && (
        <button
          onClick={handleAddClick}
          style={{
            background: "linear-gradient(to right, #007bff, #4facfe)", // Blue gradient
            color: "#fff",
            border: "none",
            borderRadius: "10px", // Slightly rounded corners
            padding: "0.75rem 1.5rem", // Balanced padding
            width: "100%", // Full-width button
            marginTop: "20px", // Space above the button
            fontSize: "1rem", // Adjusted font size for readability
            fontWeight: "600", // Bold text for prominence
            display: "flex",
            alignItems: "center",
            justifyContent: "center", // Center icon and text
            gap: "10px", // Space between the icon and text
            cursor: "pointer", // Pointer on hover
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)", // Subtle shadow for depth
            transition: "all 0.3s ease", // Smooth hover effect
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Involvement
        </button>
      )}
    </div>
  );
  
};

export default InvolvementSection;
