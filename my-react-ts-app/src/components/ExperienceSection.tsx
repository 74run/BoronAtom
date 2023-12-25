import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash, faPlus, faSave, faTimes } from '@fortawesome/free-solid-svg-icons';

interface Experience {
  id: number;
  jobTitle: string;
  company: string;
  location: string;
  duration: string;
  description: string;
  isEditing?: boolean;
}

function ExperienceSection() {
  const [experiences, setExperiences] = useState<Experience[]>([
    {
      id: 1,
      jobTitle: 'Job Title',
      company: 'XYZ Corporation',
      location: 'City, Country',
      duration: 'January 2020 - Present',
      description: 'Responsibilities and achievements in the role.',
    },
    // Add more experience entries as needed
  ]);

  const [newExperience, setNewExperience] = useState<Experience>({
    id: 0,
    jobTitle: '',
    company: '',
    location: '',
    duration: '',
    description: '',
  });

  const [isAdding, setIsAdding] = useState(false);

  const handleEditClick = (id: number) => {
    setExperiences((prevExperiences) =>
      prevExperiences.map((experience) =>
        experience.id === id ? { ...experience, isEditing: true } : experience
      )
    );
  };

  const handleSaveClick = (id?: number) => {
    if (id !== undefined) {
      // Editing an existing experience entry
      setExperiences((prevExperiences) =>
        prevExperiences.map((exp) => (exp.id === id ? { ...exp, isEditing: false } : exp))
      );
    } else {
      // Adding a new experience entry
      setNewExperience((prevExperience) => ({
        ...prevExperience,
        id: Date.now(), // Use a timestamp as a unique identifier
      }));
      setExperiences((prevExperiences) => [...prevExperiences, newExperience]);
      setNewExperience({
        id: 0,
        jobTitle: '',
        company: '',
        location: '',
        duration: '',
        description: '',
      });
      setIsAdding(false);
    }
  };

  const handleDeleteClick = (id: number) => {
    // Deleting an experience entry
    setExperiences((prevExperiences) => prevExperiences.filter((exp) => exp.id !== id));
  };

  const handleAddClick = () => {
    setNewExperience({
      id: 0,
      jobTitle: '',
      company: '',
      location: '',
      duration: '',
      description: '',
    });
    setIsAdding(true);
  };

  return (
    <div
      style={{
        border: '2px solid #ddd',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '20px',
      }}
    >
      <h2>Experience</h2>
      {experiences.map((experience) => (
        <div key={experience.id} className="mb-3">
          {experience.isEditing ? (
            // Edit mode
            <div>
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Job Title"
                value={experience.jobTitle}
                onChange={(e) =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, jobTitle: e.target.value } : exp
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Company"
                value={experience.company}
                onChange={(e) =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, company: e.target.value } : exp
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Location"
                value={experience.location}
                onChange={(e) =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, location: e.target.value } : exp
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Duration"
                value={experience.duration}
                onChange={(e) =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, duration: e.target.value } : exp
                    )
                  )
                }
              />
              <input
                type="text"
                className="form-control mb-2"
                placeholder="Description"
                value={experience.description}
                onChange={(e) =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, description: e.target.value } : exp
                    )
                  )
                }
              />
              <button
                className="btn btn-primary me-2"
                onClick={() => handleSaveClick(experience.id)}
              >
                <FontAwesomeIcon icon={faSave} className="me-2" />
                Save
              </button>
              <button
                className="btn btn-secondary"
                onClick={() =>
                  setExperiences((prevExperiences) =>
                    prevExperiences.map((exp) =>
                      exp.id === experience.id ? { ...exp, isEditing: false } : exp
                    )
                  )
                }
              >
                Cancel
              </button>
            </div>
          ) : (
            // View mode
            <div>
              <h3>{experience.jobTitle}</h3>
              <p>Company: {experience.company}</p>
              <p>Location: {experience.location}</p>
              <p>Duration: {experience.duration}</p>
              <p>Description: {experience.description}</p>
              <button
                className="btn btn-primary me-2"
                onClick={() => handleEditClick(experience.id)}
              >
                <FontAwesomeIcon icon={faEdit} className="me-2" />
                Edit
              </button>
              <button
                className="btn btn-danger"
                onClick={() => handleDeleteClick(experience.id)}
              >
                <FontAwesomeIcon icon={faTrash} className="me-2" />
                Delete
              </button>
            </div>
          )}
        </div>
      ))}
      {isAdding && (
        // Add experience entry
        <div>
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Job Title"
            value={newExperience.jobTitle}
            onChange={(e) =>
              setNewExperience({ ...newExperience, jobTitle: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Location"
            value={newExperience.location}
            onChange={(e) =>
              setNewExperience({ ...newExperience, location: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Duration"
            value={newExperience.duration}
            onChange={(e) =>
              setNewExperience({ ...newExperience, duration: e.target.value })
            }
          />
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({ ...newExperience, description: e.target.value })
            }
          />
          <button
            className="btn btn-primary"
            onClick={() => handleSaveClick()}
          >
            <FontAwesomeIcon icon={faSave} className="me-2" />
            Save
          </button>
          <button
            className="btn btn-secondary ms-2"
            onClick={() => setIsAdding(false)}
          >
            Cancel
          </button>
        </div>
      )}
      {!isAdding && (
        // Show "Add Experience" button
        <button
          className="btn btn-primary"
          onClick={handleAddClick}
        >
          <FontAwesomeIcon icon={faPlus} className="me-2" />
          Add Experience
        </button>
      )}
    </div>
  );
}

export default ExperienceSection;
