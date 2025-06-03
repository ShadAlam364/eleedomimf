// components/AnnouncementAdmin.js
import { useState } from 'react';
import axios from 'axios';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import VITE_DATA from '../../../config/config';

const Announcement = () => {
  const [formData, setFormData] = useState({
    message: '',
    isActive: true,
    priority: 1,
    endDate: ''
  });
  const [editingId, setEditingId] = useState(null);
  const queryClient = useQueryClient();

  // Fetch announcements with React Query
  const { data: announcements, isLoading, isError, error } = useQuery({
    queryKey: ['announcements'],
    queryFn: async () => {
      const res = await axios.get(`${VITE_DATA}/announcement/view`);
      return res.data;
    },
    refetchOnWindowFocus: false
  });

  // Create/Update announcement mutation
  const announcementMutation = useMutation({
    mutationFn: async (data) => {
      if (editingId) {
        return await axios.patch(`${VITE_DATA}/announcement/${editingId}`, data);
      } else {
        return await axios.post(`${VITE_DATA}/announcement/add`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
      setFormData({
        message: '',
        isActive: true,
        priority: 1,
        endDate: ''
      });
      setEditingId(null);
    },
    onError: (error) => {
      console.error('Error saving announcement:', error);
    }
  });

  // Delete announcement mutation
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      return await axios.delete(`${VITE_DATA}/announcement/delete/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['announcements']);
    },
    onError: (error) => {
      console.error('Error deleting announcement:', error);
    }
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    announcementMutation.mutate(formData);
  };

  const handleEdit = (announcement) => {
    setFormData({
      message: announcement.message,
      isActive: announcement.isActive,
      priority: announcement.priority,
      endDate: announcement.endDate ? announcement.endDate.split('T')[0] : ''
    });
    setEditingId(announcement?._id);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this announcement?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) {
    return (
      <div className="md:ml-48 mx-auto flex flex-col justify-center tracking-wider">
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-blue-700">Loading announcements...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="md:ml-48 mx-auto flex flex-col justify-center tracking-wider">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
          <strong className="font-bold">Error: </strong>
          <span className="block sm:inline">{error.message}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="md:ml-48 mx-auto flex flex-col justify-center tracking-wider">
      <h2 className="text-2xl text-blue-700 font-semibold my-0.5 text-center">Manage Announcements</h2>
      
      <form onSubmit={handleSubmit} className="mb-8 flex justify-center flex-col bg-white p-4 rounded shadow">
        <div className="mb-4">
          <label className="block font-bold mb-0.5">Message</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-12">
          <div>
            <label className="flex font-bold items-center">
              <input
                type="checkbox"
                name="isActive"
                checked={formData.isActive}
                onChange={handleChange}
                className="mr-2 w-6 h-6 cursor-pointer text-2xl text-green-600 bg-gray-200 border-gray-300 rounded focus:ring-green-500 focus:ring-0"
              />
              {formData.isActive ? "Active" : "Inactive"}
            </label>
          </div>
          
          <div>
            <label className="block font-bold mb-0.5">Priority</label>
            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="1">Low</option>
              <option value="2">Medium</option>
              <option value="3">High</option>
            </select>
          </div>
          
          <div>
            <label className="block font-bold mb-0.5">End Date (optional)</label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>
        
        <div className='flex justify-center'>
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
            disabled={announcementMutation.isLoading}
          >
            {announcementMutation.isLoading ? (
              <>
                <span className="inline-block animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></span>
                {editingId ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingId ? 'Update' : 'Create'
            )}
          </button>
       
          {editingId && (
            <button
              type="button"
              onClick={() => {
                setFormData({
                  message: '',
                  isActive: true,
                  priority: 1,
                  endDate: ''
                });
                setEditingId(null);
              }}
              className="flex ml-2 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancel
            </button>
          )}
        </div>
        
        {announcementMutation.isError && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error: {announcementMutation.error.message}
          </div>
        )}
      </form>
      
      <div className="bg-white p-2 flex justify-center text-center flex-col rounded shadow">
        <h3 className="text-xl text-blue-700 font-bold mb-4">Current Announcements</h3>
        {deleteMutation.isError && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            Error deleting announcement: {deleteMutation.error.message}
          </div>
        )}
        
        <div className="overflow-x-auto items-center">
          <table className="min-w-full bg-white">
            <thead>
              <tr>
                <th className="py-2 px-4 border-b">Message</th>
                <th className="py-2 px-4 border-b">Status</th>
                <th className="py-2 px-4 border-b">Priority</th>
                <th className="py-2 px-4 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {announcements?.map((ann) => (
                <tr key={ann._id} className="hover:bg-gray-50">
                  <td className="py-2 px-4 border-b">{ann.message}</td>
                  <td className="py-2 px-4 border-b">
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      ann.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {ann.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="py-2 px-4 border-b">
                    {['Low', 'Medium', 'High'][ann.priority - 1]}
                  </td>
                  <td className="py-2 px-4 border-b space-x-4">
                    <button
                      onClick={() => handleEdit(ann)}
                      className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-blue-300 shadow-lg shadow-blue-500/50 font-medium rounded-md text-sm px-3 py-1.5 tracking-wider text-center"
                      disabled={deleteMutation.isLoading}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(ann._id)}
                      className="text-white bg-gradient-to-r from-red-500 via-red-600 to-red-700 hover:bg-gradient-to-br focus:ring-0 focus:outline-none focus:ring-red-300 shadow-lg shadow-red-500/50 font-medium rounded-md text-sm px-3 py-1.5 tracking-wider text-center"
                      disabled={deleteMutation.isLoading}
                    >
                      {deleteMutation.isLoading && deleteMutation.variables === ann._id ? (
                        <>
                          <span className="inline-block animate-spin rounded-full h-3 w-3 border-t-2 border-b-2 border-white mr-1"></span>
                          Deleting...
                        </>
                      ) : 'Delete'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Announcement;