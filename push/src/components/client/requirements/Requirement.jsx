
import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addClientRequirements } from '../../../redux/actions/RequirementActions';
import Navbar from './Navbar';
import { toast, Toaster } from 'react-hot-toast'; 

const Requirement = () => {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    jobTitle: '',
    resourceCount: '',
    requiredExperience: '',
    requiredSkills: '',
    jobLocation: '',
    timeline: '',
    buheadApproval: 'null',
    minimumBudget: '',
    maximumBudget: '',
  });
  const [errors, setErrors] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateFields = () => {
    const newErrors = {};
    const requiredFields = [
      'jobTitle',
      'resourceCount',
      'requiredExperience',
      'requiredSkills',
      'jobLocation',
      'timeline',
      'minimumBudget',
      'maximumBudget',
    ];

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

    if (formData.jobLocation === '') {
      newErrors.jobLocation = 'Job Location is required.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    try {
      const clientResponse = await axios.post('http://localhost:3012/clients', {});
      const newRequirement = { ...formData, client: { id: clientResponse.data.id } };
      await axios.post('http://localhost:3012/requirements', newRequirement);
      dispatch(addClientRequirements(newRequirement));
      
     
      toast.success('Your requirement is submitted successfully!', {
        position: 'top-center', 
        style: {
          marginTop: '20px', 
        },
      });
      
      handleCancel();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Error: ' + (error.response ? error.response.data.message : error.message) });
    }
  };

  const handleCancel = () => {
    setFormData({
      jobTitle: '',
      resourceCount: '',
      requiredExperience: '',
      requiredSkills: '',
      jobLocation: '',
      timeline: '',
      buheadApproval: 'null',
      minimumBudget: '',
      maximumBudget: '',
    });
    setErrors({});
  };

  return (
    <div className="flex justify-center">
      <Toaster /> {/* Add the Toaster component */}
      <Navbar toggleSidebar={toggleSidebar} />
      {isSidebarOpen && (
        <div className="fixed top-0 left-0 bg-gray-800 text-white w-64 h-full p-4 z-40">
          <ul>
            <li className="mb-2">Home</li>
            <li className="mb-2">Settings</li>
            <li>Profile</li>
          </ul>
        </div>
      )}
      <div className={`flex-1 flex items-start justify-end ${isSidebarOpen ? 'ml-64' : ''}`}>
        <div className="max-w-3xl w-full p-4 bg-white rounded-lg shadow-lg mt-20 mr-10">
          <h2 className="text-lg font-semibold mb-2 text-center text-[#27235E]">Requirement Form</h2>

          <form onSubmit={handleSubmit} className="flex space-x-4">
            <div className="flex-1 space-y-2">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Job Title</label>
                <input
                  type="text"
                  name="jobTitle"
                  value={formData.jobTitle}
                  onChange={handleChange}
                  placeholder="Enter job Title"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.jobTitle && <span className="text-red-600 text-xs mt-1">{errors.jobTitle}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Resource Count</label>
                <input
                  type="number"
                  name="resourceCount"
                  value={formData.resourceCount}
                  onChange={handleChange}
                  placeholder="Enter resource count"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.resourceCount && <span className="text-red-600 text-xs mt-1">{errors.resourceCount}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Required Experience</label>
                <input
                  type="text"
                  name="requiredExperience"
                  value={formData.requiredExperience}
                  onChange={handleChange}
                  placeholder="Enter required experience"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.requiredExperience && <span className="text-red-600 text-xs mt-1">{errors.requiredExperience}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Minimum Budget</label>
                <input
                  type="number"
                  name="minimumBudget"
                  value={formData.minimumBudget}
                  onChange={handleChange}
                  placeholder="Enter minimum budget"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.minimumBudget && <span className="text-red-600 text-xs mt-1">{errors.minimumBudget}</span>}
              </div>
            </div>
            <div className="border-l border-gray-300 mx-4"></div>
            <div className="flex-1 space-y-2">
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Required Skills</label>
                <input
                  type="text"
                  name="requiredSkills"
                  value={formData.requiredSkills}
                  onChange={handleChange}
                  placeholder="Enter required skills"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.requiredSkills && <span className="text-red-600 text-xs mt-1">{errors.requiredSkills}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Job Location</label>
                <div className="flex space-x-4">
                  <label className="text-[#27235c] text-xs">
                    <input
                      type="radio"
                      name="jobLocation"
                      value="On-Site"
                      checked={formData.jobLocation === "On-Site"}
                      onChange={handleChange}
                    />
                    On-Site
                  </label>
                  <label className="text-[#27235c] text-xs">
                    <input
                      type="radio"
                      name="jobLocation"
                      value="Work From Home"
                      checked={formData.jobLocation === "Work From Home"}
                      onChange={handleChange}
                    />
                    Work From Home
                  </label>
                  <label className="text-[#27235c] text-xs">
                    <input
                      type="radio"
                      name="jobLocation"
                      value="Hybrid"
                      checked={formData.jobLocation === "Hybrid"}
                      onChange={handleChange}
                    />
                    Hybrid
                  </label>
                </div>
                {errors.jobLocation && <span className="text-red-600 text-xs mt-1">{errors.jobLocation}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Timeline</label>
                <input
                  type="text"
                  name="timeline"
                  value={formData.timeline}
                  onChange={handleChange}
                  placeholder="Enter timeline"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.timeline && <span className="text-red-600 text-xs mt-1">{errors.timeline}</span>}
              </div>
              <div className="flex flex-col">
                <label className="mb-1 text-sm font-medium text-[#27235E]">Maximum Budget</label>
                <input
                  type="number"
                  name="maximumBudget"
                  value={formData.maximumBudget}
                  onChange={handleChange}
                  placeholder="Enter maximum budget"
                  className="border border-gray-300 p-1 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#27235E] h-6 text-xs"
                />
                {errors.maximumBudget && <span className="text-red-600 text-xs mt-1">{errors.maximumBudget}</span>}
              </div>
            </div>
          </form>
          <div className="flex justify-center mt-4">
            <button
              type="submit"
              onClick={handleSubmit}
              className="bg-[#27235E] text-white rounded-lg px-4 py-2"
            >
              Submit
            </button>
            <button
              type="button"
              onClick={handleCancel}
              className="ml-4 bg-gray-300 text-gray-700 rounded-lg px-4 py-2"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Requirement;
