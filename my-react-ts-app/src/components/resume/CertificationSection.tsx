import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes, faToggleOn, faToggleOff } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import { useParams } from 'react-router-dom';

interface Certification {
  _id: string;
  name: string;
  issuedBy: string;
  issuedDate: { month: string; year: string };
  expirationDate: { month: string; year: string };
  url: string;
  includeInResume: boolean;
  isEditing?: boolean;
}

interface CertificationProps {
  Certifications: Certification[];
  onEdit: (id: string, data: { name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string; includeInResume: boolean }) => void;
  onDelete: (id: string) => void;
}

const CertificationSection: React.FC<CertificationProps> = ({ Certifications, onEdit, onDelete }) => {
  const [editData, setEditData] = useState<{ id: string; name: string; issuedBy: string; issuedDate: { month: string; year: string }; expirationDate: { month: string; year: string }; url: string; includeInResume: boolean } | null>(null);
  const [certifications, setCertifications] = useState<Certification[]>(Certifications);
  const [newCertification, setNewCertification] = useState<Certification>({
    _id: '',
    name: '',
    issuedBy: '',
    issuedDate: { month: '', year: '' },
    expirationDate: { month: '', year: '' },
    url: '',
    includeInResume: true,
  });
  const [isAdding, setIsAdding] = useState(false);
  const { userID } = useParams();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];

  const graduationYears = Array.from({ length: 57 }, (_, index) => (new Date()).getFullYear() + 7 - index);

  useEffect(() => {
    fetchCertification();
  }, []);

  const fetchCertification = () => {
    fetch(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch certifications');
        }
        return response.json(); // Parse the response JSON
      })
      .then(data => {
        setCertifications(data); // Set certifications state with the fetched data
      })
      .catch(error => {
        console.error('Error fetching certifications:', error);
      });
  };

  const handleEditClick = (
    id: string,
    name: string,
    issuedBy: string,
    issuedDate: { month: string; year: string },
    expirationDate: { month: string; year: string },
    url: string,
    includeInResume: boolean
  ) => {
    setEditData({ id, name, issuedBy, issuedDate, expirationDate, url, includeInResume });
  };

  const handleCancelEdit = () => {
    setEditData(null);
  };

  const handleUpdate = () => {
    if (editData) {
      onEdit(editData.id, {
        name: editData.name,
        issuedBy: editData.issuedBy,
        issuedDate: editData.issuedDate,
        expirationDate: editData.expirationDate,
        url: editData.url,
        includeInResume: editData.includeInResume,
      });

      const updatedItems = certifications.map((certification) =>
        certification._id === editData.id
          ? {
              ...certification,
              name: editData.name,
              issuedBy: editData.issuedBy,
              issuedDate: editData.issuedDate,
              expirationDate: editData.expirationDate,
              url: editData.url,
              includeInResume: editData.includeInResume,
            }
          : certification
      );

      setCertifications(updatedItems);
      setEditData(null);
    }
  };

  const handleSaveClick = () => {
    const formattedCertification = {
      ...newCertification,
      issuedDate: {
        month: newCertification.issuedDate.month,
        year: newCertification.issuedDate.year,
      },
      expirationDate: {
        month: newCertification.expirationDate.month,
        year: newCertification.expirationDate.year,
      },
    };

    axios
      .post(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification`, formattedCertification)
      .then((response) => {
        const newCertificationFromServer = response.data.certification;
        const newCertData = newCertificationFromServer[newCertificationFromServer.length - 1];
        setCertifications([...certifications, newCertData]);

        setNewCertification({
          _id: '',
          name: '',
          issuedBy: '',
          issuedDate: { month: '', year: '' },
          expirationDate: { month: '', year: '' },
          url: '',
          includeInResume: true,
        });

        setIsAdding(false);
      })
      .catch((error) => {
        console.error('Error saving certification:', error.message);
      });
  };

  const handleDelete = (id: string) => {
    axios
      .delete(`${process.env.REACT_APP_API_URL}/api/userprofile/${userID}/certification/${id}`)
      .then((response) => {
        const updatedCertifications = certifications.filter((certification) => certification._id !== id);
        setCertifications(updatedCertifications);
        setEditData(null);
      })
      .catch((error) => {
        console.error('Error deleting certification:', error.message);
      });
  };

  const handleAddClick = () => {
    setNewCertification({
      _id: '',
      name: '',
      issuedBy: '',
      issuedDate: { month: '', year: '' },
      expirationDate: { month: '', year: '' },
      url: '',
      includeInResume: true,
    });
    setIsAdding(true);
  };

  const handleToggleInclude = (id: string) => {
    const updatedCertifications = certifications.map((certification) =>
      certification._id === id ? { ...certification, includeInResume: !certification.includeInResume } : certification
    );
    setCertifications(updatedCertifications);

    const certificationToUpdate = updatedCertifications.find((certification) => certification._id === id);
    if (certificationToUpdate) {
      onEdit(id, {
        name: certificationToUpdate.name,
        issuedBy: certificationToUpdate.issuedBy,
        issuedDate: certificationToUpdate.issuedDate,
        expirationDate: certificationToUpdate.expirationDate,
        url: certificationToUpdate.url,
        includeInResume: certificationToUpdate.includeInResume,
      });
    }
  };

  return (
    <div className="certifications-container">
      <style>
        {`
          .certifications-container {
            background-color: rgba(0, 3, 8, 0.45);
            border-radius: 12px;
            padding: 1.5rem;
            color: white;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }

          .section-header {
            color: #63b3ed;
            font-size: 1.5rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
          }

          .certification-card {
            background-color: #1a202c;
            border-radius: 8px;
            padding: 1.5rem;
            margin-bottom: 1rem;
            border: 1px solid #4a5568;
            transition: all 0.2s ease;
          }

          .certification-card:hover {
            transform: translateY(-2px);
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
          }

          .cert-title {
            color: #63b3ed;
            font-size: 1.25rem;
            font-weight: 600;
            margin-bottom: 0.75rem;
          }

          .cert-info {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .cert-url {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
            word-break: break-all;
          }

          .form-group {
            margin-bottom: 1rem;
          }

          .input-field {
            width: 100%;
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.95rem;
            margin-bottom: 1rem;
          }

          .input-field:focus {
            outline: none;
            border-color: #63b3ed;
          }

          .date-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 1rem;
            margin-bottom: 1rem;
          }

          .date-label {
            color: #a0aec0;
            font-size: 0.875rem;
            margin-bottom: 0.5rem;
          }

          .select-field {
            padding: 0.75rem;
            border-radius: 6px;
            background-color: #2d3748;
            border: 1px solid #4a5568;
            color: white;
            font-size: 0.95rem;
            width: 100%;
          }

          .btn-group {
            display: flex;
            gap: 0.75rem;
            margin-top: 1rem;
            flex-wrap: wrap;
          }

          .btn {
            display: flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            border: none;
            cursor: pointer;
            transition: all 0.2s ease;
          }

          .btn:hover {
            transform: translateY(-1px);
          }

          .btn-primary {
            background: linear-gradient(to right, #3182ce, #4facfe);
            color: white;
          }

          .btn-success {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .btn-danger {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          .btn-secondary {
            background-color: #4a5568;
            color: white;
          }

          .include-toggle {
            background: none;
            border: none;
            padding: 0.75rem 1rem;
            border-radius: 6px;
            font-size: 0.875rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            display: flex;
            align-items: center;
            gap: 0.5rem;
          }

          .include-toggle.included {
            background: linear-gradient(to right, #38a169, #68d391);
            color: white;
          }

          .include-toggle.excluded {
            background: linear-gradient(to right, #e53e3e, #fc8181);
            color: white;
          }

          @media (max-width: 640px) {
            .btn-group {
              flex-direction: column;
            }
            
            .btn {
              width: 100%;
            }
          }
        `}
      </style>

      <h2 className="section-header">Certifications</h2>

      {certifications.map((certification) => (
        <div key={certification._id} className="certification-card">
          {editData && editData.id === certification._id ? (
            <div className="form-group">
              <input
                type="text"
                className="input-field"
                placeholder="Certification Name"
                value={editData.name}
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />

              <input
                type="text"
                className="input-field"
                placeholder="Issued By"
                value={editData.issuedBy}
                onChange={(e) => setEditData({ ...editData, issuedBy: e.target.value })}
              />

              <div className="date-grid">
                <div>
                  <div className="date-label">Issue Date</div>
                  <select
                    className="select-field"
                    value={editData.issuedDate.month}
                    onChange={(e) => setEditData({
                      ...editData,
                      issuedDate: { ...editData.issuedDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={editData.issuedDate.year}
                    onChange={(e) => setEditData({
                      ...editData,
                      issuedDate: { ...editData.issuedDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="date-grid">
                <div>
                  <div className="date-label">Expiration Date</div>
                  <select
                    className="select-field"
                    value={editData.expirationDate.month}
                    onChange={(e) => setEditData({
                      ...editData,
                      expirationDate: { ...editData.expirationDate, month: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Month</option>
                    {months.map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <div className="date-label">&nbsp;</div>
                  <select
                    className="select-field"
                    value={editData.expirationDate.year}
                    onChange={(e) => setEditData({
                      ...editData,
                      expirationDate: { ...editData.expirationDate, year: e.target.value }
                    })}
                  >
                    <option value="" disabled>Select Year</option>
                    {graduationYears.map(year => (
                      <option key={year} value={year}>{year}</option>
                    ))}
                  </select>
                </div>
              </div>

              <input
                type="url"
                className="input-field"
                placeholder="Certificate URL"
                value={editData.url}
                onChange={(e) => setEditData({ ...editData, url: e.target.value })}
              />

              <div className="btn-group">
                <button 
                  className="btn btn-success"
                  onClick={handleUpdate}
                >
                  <FontAwesomeIcon icon={faSave} />
                  Save Changes
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleCancelEdit}
                >
                  <FontAwesomeIcon icon={faTimes} />
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3 className="cert-title">{certification.name}</h3>
              <div className="cert-info">
                <strong>Issued By:</strong> {certification.issuedBy}
              </div>
              <div className="cert-info">
                <strong>Issue Date:</strong> {certification.issuedDate.month} {certification.issuedDate.year}
              </div>
              <div className="cert-info">
                <strong>Expiration:</strong> {certification.expirationDate.month} {certification.expirationDate.year}
              </div>
              <div className="cert-url">
                <strong>URL:</strong> {certification.url}
              </div>

              <div className="btn-group">
                <button 
                  className="btn btn-primary"
                  onClick={() =>
                    handleEditClick(
                      certification._id,
                      certification.name,
                      certification.issuedBy,
                      certification.issuedDate,
                      certification.expirationDate,
                      certification.url,
                      certification.includeInResume
                    )
                  }
                >
                  <FontAwesomeIcon icon={faEdit} />
                  Edit
                </button>

                <button 
                  className={`include-toggle ${certification.includeInResume ? 'included' : 'excluded'}`}
                  onClick={() => handleToggleInclude(certification._id)}
                >
                  <FontAwesomeIcon icon={certification.includeInResume ? faToggleOn : faToggleOff} />
                  {certification.includeInResume ? "Included" : "Excluded"}
                </button>

                <button 
                  className="btn btn-danger"
                  onClick={() => handleDelete(certification._id)}
                >
                  <FontAwesomeIcon icon={faTrash} />
                  Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}

      {/* Add Certification Form */}
      {isAdding && (
        <div className="certification-card">
          <div className="form-group">
            <input
              type="text"
              className="input-field"
              placeholder="Certification Name"
              value={newCertification.name}
              onChange={(e) => setNewCertification({ ...newCertification, name: e.target.value })}
            />

            <input
              type="text"
              className="input-field"
              placeholder="Issued By"
              value={newCertification.issuedBy}
              onChange={(e) => setNewCertification({ ...newCertification, issuedBy: e.target.value })}
            />

            <div className="date-grid">
              <div>
                <div className="date-label">Issue Date</div>
                <select
                  className="select-field"
                  value={newCertification.issuedDate.month}
                  onChange={(e) => setNewCertification({
                    ...newCertification,
                    issuedDate: { ...newCertification.issuedDate, month: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="date-label">&nbsp;</div>
                <select
                  className="select-field"
                  value={newCertification.issuedDate.year}
                  onChange={(e) => setNewCertification({
                    ...newCertification,
                    issuedDate: { ...newCertification.issuedDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="date-grid">
              <div>
                <div className="date-label">Expiration Date</div>
                <select
                  className="select-field"
                  value={newCertification.expirationDate.month}
                  onChange={(e) => setNewCertification({
                    ...newCertification,
                    expirationDate: { ...newCertification.expirationDate, month: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Month</option>
                  {months.map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div>
                <div className="date-label">&nbsp;</div>
                <select
                  className="select-field"
                  value={newCertification.expirationDate.year}
                  onChange={(e) => setNewCertification({
                    ...newCertification,
                    expirationDate: { ...newCertification.expirationDate, year: e.target.value }
                  })}
                >
                  <option value="" disabled>Select Year</option>
                  {graduationYears.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>

            <input
              type="url"
              className="input-field"
              placeholder="Certificate URL"
              value={newCertification.url}
              onChange={(e) => setNewCertification({ ...newCertification, url: e.target.value })}
            />

            <div className="btn-group">
              <button 
                className="btn btn-success"
                onClick={handleSaveClick}
              >
                <FontAwesomeIcon icon={faSave} />
                Save
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => setIsAdding(false)}>
                <FontAwesomeIcon icon={faTimes} />
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {!isAdding && (
        <button 
          className="btn btn-primary"
          onClick={handleAddClick}
          style={{ 
            width: '100%',
            marginTop: certifications.length > 0 ? '1rem' : '0',
            background: 'linear-gradient(to right, #3182ce, #4facfe)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
            padding: '1rem'
          }}
        >
          <FontAwesomeIcon icon={faPlus} />
          Add Certification
        </button>
      )}
    </div>
  );
};

export default CertificationSection;
