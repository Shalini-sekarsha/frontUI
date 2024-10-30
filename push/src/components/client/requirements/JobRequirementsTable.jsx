
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import Navbar from './Navbar';

const JobRequirementsTable = () => {
  const [requirements, setRequirements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentRequirement, setCurrentRequirement] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [formData, setFormData] = useState({
    jobTitle: '',
    resourceCount: '',
    requiredExperience: '',
    requiredSkills: '',
    jobLocation: '',
    timeline: '',
    minimumBudget: '',
    maximumBudget: '',
  });
  const [errors, setErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchRequirements = async () => {
      try {
        const response = await fetch('http://localhost:3012/requirements');
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setRequirements(data);
      } catch (error) {
        console.error("Error fetching data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRequirements();
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleEdit = (requirement) => {
    setCurrentRequirement(requirement);
    setFormData(requirement);
    setIsEditModalOpen(true);
  };

  const handleDelete = (id) => {
    setDeletingId(id);
    setIsConfirmationOpen(true);
  };

  const confirmDelete = async () => {
    try {
      await fetch(`http://localhost:3012/requirements/${deletingId}`, { method: 'DELETE' });
      setRequirements(requirements.filter((item) => item.id !== deletingId));
      setIsConfirmationOpen(false);
    } catch (error) {
      console.error("Error deleting requirement:", error);
    }
  };

  const handleSave = async () => {
    const isValid = validateFields();
    if (!isValid) return;

    try {
      await axios.put(`http://localhost:3012/requirements/${currentRequirement.id}`, formData);
      setRequirements(requirements.map(req => req.id === currentRequirement.id ? formData : req));
      setIsEditModalOpen(false);
    } catch (error) {
      console.error('Error updating requirement:', error);
      setErrors({ submit: 'Error updating requirement.' });
    }
  };

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = ['jobTitle', 'resourceCount', 'requiredExperience', 'requiredSkills', 'jobLocation', 'timeline', 'minimumBudget', 'maximumBudget'];

    requiredFields.forEach((field) => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
      }
    });

    if (formData.resourceCount <= 0 || isNaN(formData.resourceCount)) {
      newErrors.resourceCount = 'Resource Count must be a positive number.';
    }

    if (formData.minimumBudget <= 0 || isNaN(formData.minimumBudget)) {
      newErrors.minimumBudget = 'Minimum Budget must be a positive number.';
    }

    if (formData.maximumBudget <= formData.minimumBudget || isNaN(formData.maximumBudget)) {
      newErrors.maximumBudget = 'Maximum Budget must be greater than Minimum Budget.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto mt-10">
      <Navbar toggleSidebar={toggleSidebar} />
      <h1 className="text-2xl font-bold text-center text-[#27235C] mb-6">Job Requirements</h1>
      <div className={`flex justify-end mb-4 transition-all duration-300 ${isSidebarOpen ? 'ml-4' : 'ml-0'}`}>
        <table className="min-w-full bg-white border border-[#27235C] text-sm max-w-3xl transition-all duration-300">
          <thead>
            <tr className="bg-[#27235C] text-white">
              <th className="py-1 px-2 border-b">Job Title</th>
              <th className="py-1 px-2 border-b">Resource Count</th>
              <th className="py-1 px-2 border-b">Experience</th>
              <th className="py-1 px-2 border-b">Skills</th>
              <th className="py-1 px-2 border-b">Location</th>
              <th className="py-1 px-2 border-b">Timeline</th>
              <th className="py-1 px-2 border-b">Budget</th>
              <th className="py-1 px-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {requirements.length > 0 ? (
              requirements.map((item) => (
                <tr key={item.id} className="hover:bg-gray-100">
                  <td className="py-1 px-2 border-b">{item.jobTitle}</td>
                  <td className="py-1 px-2 border-b">{item.resourceCount}</td>
                  <td className="py-1 px-2 border-b">{item.requiredExperience}</td>
                  <td className="py-1 px-2 border-b">{item.requiredSkills}</td>
                  <td className="py-1 px-2 border-b">{item.jobLocation}</td>
                  <td className="py-1 px-2 border-b">{item.timeline}</td>
                  <td className="py-1 px-2 border-b">
                    ₹{item.minimumBudget} - ₹{item.maximumBudget}
                  </td>
                  <td className="py-1 px-2 border-b">
                    <button onClick={() => handleEdit(item)} className="text-[#27235C] hover:text-blue-500">
                      <FontAwesomeIcon icon={faEdit} size="sm" />
                    </button>
                    <button onClick={() => handleDelete(item.id)} className="text-red-500 hover:text-red-700 ml-2">
                      <FontAwesomeIcon icon={faTrash} size="sm" />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={8} className="text-center">No requirements found.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
            <h2 className="text-lg font-semibold mb-4 text-center text-[#27235E]">Edit Job Requirement</h2>
            <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4">
              <div className="flex flex-col space-y-2">
                {['jobTitle', 'resourceCount', 'requiredExperience', 'requiredSkills', 'minimumBudget'].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-[#27235E]">{field.replace(/([A-Z])/g, ' $1')}</label>
                    <input
                      type={field.includes('Budget') || field === 'resourceCount' ? 'number' : 'text'}
                      name={field}
                      value={formData[field]}
                      onChange={handleChange}
                      placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                      className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-8 text-xs"
                    />
                    {errors[field] && <span className="text-red-600 text-xs mt-1">{errors[field]}</span>}
                  </div>
                ))}
              </div>
              <div className="flex flex-col space-y-2">
                {['jobLocation', 'timeline', 'maximumBudget'].map((field) => (
                  <div key={field}>
                    <label className="text-sm font-medium text-[#27235E]">{field.replace(/([A-Z])/g, ' $1')}</label>
                    {field === 'jobLocation' ? (
                      <div className="flex space-x-2">
                        {['On-Site', 'Work From Home', 'Hybrid'].map((location) => (
                          <label className="text-[#27235c] text-xs" key={location}>
                            <input
                              type="radio"
                              name={field}
                              value={location}
                              checked={formData.jobLocation === location}
                              onChange={handleChange}
                            />
                            {location}
                          </label>
                        ))}
                      </div>
                    ) : (
                      <input
                        type={field.includes('Budget') ? 'number' : 'text'}
                        name={field}
                        value={formData[field]}
                        onChange={handleChange}
                        placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
                        className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-8 text-xs"
                      />
                    )}
                    {errors[field] && <span className="text-red-600 text-xs mt-1">{errors[field]}</span>}
                  </div>
                ))}
              </div>
            </form>
            <div className="flex justify-center mt-4">
              <button
                onClick={handleSave}
                className="bg-[#27235E] text-white rounded-lg px-4 py-1"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setIsEditModalOpen(false)}
                className="ml-2 bg-gray-300 text-gray-700 rounded-lg px-4 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {isConfirmationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-sm">
            <h2 className="text-lg font-semibold mb-4 text-center text-[#27235E]">Confirm Deletion</h2>
            <p className="mb-4 text-center">Are you sure you want to delete this requirement?</p>
            <div className="flex justify-center space-x-4">
              <button
                onClick={confirmDelete}
                className="bg-red-500 text-white rounded-lg px-4 py-1"
              >
                Confirm
              </button>
              <button
                onClick={() => setIsConfirmationOpen(false)}
                className="bg-gray-300 text-gray-700 rounded-lg px-4 py-1"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobRequirementsTable;

// import React, { useEffect, useState } from 'react';
// import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
// import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
// import axios from 'axios';
// import { AgGridReact } from 'ag-grid-react';
// import Navbar from './Navbar';
// import 'ag-grid-community/styles/ag-grid.css';
// import 'ag-grid-community/styles/ag-theme-alpine.css';

// const JobRequirementsTable = () => {
//   const [requirements, setRequirements] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const [currentRequirement, setCurrentRequirement] = useState(null);
//   const [isEditModalOpen, setIsEditModalOpen] = useState(false);
//   const [isConfirmationOpen, setIsConfirmationOpen] = useState(false);
//   const [deletingId, setDeletingId] = useState(null);
//   const [formData, setFormData] = useState({
//     jobTitle: '',
//     resourceCount: '',
//     requiredExperience: '',
//     requiredSkills: '',
//     jobLocation: '',
//     timeline: '',
//     minimumBudget: '',
//     maximumBudget: '',
//   });
//   const [errors, setErrors] = useState({});
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);

//   useEffect(() => {
//     const fetchRequirements = async () => {
//       try {
//         const response = await fetch('http://localhost:3012/requirements');
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setRequirements(data);
//       } catch (error) {
//         console.error("Error fetching data:", error);
//         setError(error.message);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchRequirements();
//   }, []);

//   const toggleSidebar = () => {
//     setIsSidebarOpen(!isSidebarOpen);
//   };

//   const handleEdit = (requirement) => {
//     setCurrentRequirement(requirement);
//     setFormData(requirement);
//     setIsEditModalOpen(true);
//   };

//   const handleDelete = (id) => {
//     setDeletingId(id);
//     setIsConfirmationOpen(true);
//   };

//   const confirmDelete = async () => {
//     try {
//       await fetch(`http://localhost:3012/requirements/${deletingId}`, { method: 'DELETE' });
//       setRequirements(requirements.filter((item) => item.id !== deletingId));
//       setIsConfirmationOpen(false);
//     } catch (error) {
//       console.error("Error deleting requirement:", error);
//     }
//   };

//   const handleSave = async () => {
//     const isValid = validateFields();
//     if (!isValid) return;

//     try {
//       await axios.put(`http://localhost:3012/requirements/${currentRequirement.id}`, formData);
//       setRequirements(requirements.map(req => req.id === currentRequirement.id ? { ...req, ...formData } : req));
//       setIsEditModalOpen(false);
//     } catch (error) {
//       console.error('Error updating requirement:', error);
//       setErrors({ submit: 'Error updating requirement.' });
//     }
//   };

//   const validateFields = () => {
//     const newErrors = {};
//     const requiredFields = ['jobTitle', 'resourceCount', 'requiredExperience', 'requiredSkills', 'jobLocation', 'timeline', 'minimumBudget', 'maximumBudget'];

//     requiredFields.forEach((field) => {
//       if (!formData[field]) {
//         newErrors[field] = `${field.replace(/([A-Z])/g, ' $1')} is required.`;
//       }
//     });

//     if (formData.resourceCount <= 0 || isNaN(formData.resourceCount)) {
//       newErrors.resourceCount = 'Resource Count must be a positive number.';
//     }

//     if (formData.minimumBudget <= 0 || isNaN(formData.minimumBudget)) {
//       newErrors.minimumBudget = 'Minimum Budget must be a positive number.';
//     }

//     if (formData.maximumBudget <= formData.minimumBudget || isNaN(formData.maximumBudget)) {
//       newErrors.maximumBudget = 'Maximum Budget must be greater than Minimum Budget.';
//     }

//     setErrors(newErrors);
//     return Object.keys(newErrors).length === 0;
//   };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors({ ...errors, [name]: '' });
//   };

//   const columns = [
//     { headerName: 'Job Title', field: 'jobTitle', flex: 1 },
//     { headerName: 'Resource Count', field: 'resourceCount', flex: 1 },
//     { headerName: 'Experience', field: 'requiredExperience', flex: 1 },
//     { headerName: 'Skills', field: 'requiredSkills', flex: 1 },
//     { headerName: 'Location', field: 'jobLocation', flex: 1 },
//     { headerName: 'Timeline', field: 'timeline', flex: 1 },
//     {
//       headerName: 'Budget',
//       field: 'budget',
//       valueGetter: (params) => `₹${params.data.minimumBudget} - ₹${params.data.maximumBudget}`,
//       flex: 1,
//     },
//     {
//       headerName: 'Actions',
//       field: 'actions',
//       cellRendererFramework: (params) => (
//         <div style={{ display: 'flex', gap: '8px' }}>
//           <button
//             onClick={() => handleEdit(params.data)}
//             className="text-[#27235C]"
//             title="Edit"
//           >
//             <i className="fas fa-edit"></i> Edit
//           </button>
//           <button
//             onClick={() => handleDelete(params.data.id)}
//             className="text-red-500 hover:text-red-700"
//             title="Delete"
//           >
//             <FontAwesomeIcon icon={faTrash} size="sm" />
//           </button>
//         </div>
//       ),
//     },
//   ];

//   if (loading) return <div className="text-center">Loading...</div>;
//   if (error) return <div className="text-center text-red-500">{error}</div>;

//   return (
//     <div className="container mx-auto mt-10">
//       <Navbar toggleSidebar={toggleSidebar} />
//       <h1 className="text-2xl font-bold text-center text-[#27235C] mb-6">Job Requirements</h1>
//       <div className={`ag-theme-alpine ${isSidebarOpen ? 'ml-4' : 'ml-0'}`} style={{ height: 'auto', width: '100%', maxHeight: 'calc(100vh - 200px)' }}>
//         <AgGridReact
//           rowData={requirements}
//           columnDefs={columns}
//           pagination={true}
//           paginationPageSize={5}
//           domLayout='autoHeight'
//           suppressScrollOnNewData={true}
//         />
//       </div>

//       {/* Edit Modal */}
//       {isEditModalOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-4 w-full max-w-3xl">
//             <h2 className="text-lg font-semibold mb-4 text-center text-[#27235E]">Edit Job Requirement</h2>
//             <form onSubmit={(e) => e.preventDefault()} className="flex flex-col space-y-4">
//               <div className="flex flex-col space-y-2">
//                 {['jobTitle', 'resourceCount', 'requiredExperience', 'requiredSkills', 'minimumBudget'].map((field) => (
//                   <div key={field}>
//                     <label className="text-sm font-medium text-[#27235E]">{field.replace(/([A-Z])/g, ' $1')}</label>
//                     <input
//                       type={field.includes('Budget') || field === 'resourceCount' ? 'number' : 'text'}
//                       name={field}
//                       value={formData[field]}
//                       onChange={handleChange}
//                       placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
//                       className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-8 text-xs"
//                     />
//                     {errors[field] && <span className="text-red-600 text-xs mt-1">{errors[field]}</span>}
//                   </div>
//                 ))}
//               </div>
//               <div className="flex flex-col space-y-2">
//                 {['jobLocation', 'timeline', 'maximumBudget'].map((field) => (
//                   <div key={field}>
//                     <label className="text-sm font-medium text-[#27235E]">{field.replace(/([A-Z])/g, ' $1')}</label>
//                     {field === 'jobLocation' ? (
//                       <div className="flex space-x-2">
//                         {['On-Site', 'Work From Home', 'Hybrid'].map((location) => (
//                           <label className="text-[#27235c] text-xs" key={location}>
//                             <input
//                               type="radio"
//                               name={field}
//                               value={location}
//                               checked={formData.jobLocation === location}
//                               onChange={handleChange}
//                             />
//                             {location}
//                           </label>
//                         ))}
//                       </div>
//                     ) : (
//                       <input
//                         type="text"
//                         name={field}
//                         value={formData[field]}
//                         onChange={handleChange}
//                         placeholder={`Enter ${field.replace(/([A-Z])/g, ' $1').toLowerCase()}`}
//                         className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-8 text-xs"
//                       />
//                     )}
//                     {errors[field] && <span className="text-red-600 text-xs mt-1">{errors[field]}</span>}
//                   </div>
//                 ))}
//               </div>
//               <button
//                 onClick={handleSave}
//                 className="bg-[#27235C] text-white py-2 rounded-lg hover:bg-blue-600"
//               >
//                 Save
//               </button>
//               <button
//                 onClick={() => setIsEditModalOpen(false)}
//                 className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
//               >
//                 Cancel
//               </button>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Confirmation Modal */}
//       {isConfirmationOpen && (
//         <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
//           <div className="bg-white rounded-lg shadow-lg p-4 w-96">
//             <h2 className="text-lg font-semibold text-center text-[#27235E]">Confirm Deletion</h2>
//             <p className="text-center text-sm">Are you sure you want to delete this job requirement?</p>
//             <div className="flex justify-between mt-4">
//               <button
//                 onClick={confirmDelete}
//                 className="bg-red-500 text-white py-2 rounded-lg hover:bg-red-600"
//               >
//                 Yes, Delete
//               </button>
//               <button
//                 onClick={() => setIsConfirmationOpen(false)}
//                 className="bg-gray-300 text-black py-2 rounded-lg hover:bg-gray-400"
//               >
//                 Cancel
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default JobRequirementsTable;
