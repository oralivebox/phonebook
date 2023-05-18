import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faC, faClose } from '@fortawesome/free-solid-svg-icons';
import http from '../api/http';
import { API_URL } from '../config/config';
import Swal from 'sweetalert2';
const EditContact = ({ isOpen, onClose, onEditContact, contact }) => {
  if (!isOpen) return null;
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState([]);
  const [contactData, setContactData] = useState(contact);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setContactData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrors([]);
    http.patch(`contacts/${contact.id}`, contactData).then((response) => {
      setIsLoading(false);
      onEditContact(response.data.contact);
      Swal.fire("success", response.data.message, "success")
    }).catch((error) => {
      setIsLoading(false);
      if (error.response?.status) {
        switch (error.response.status) {
          case 422:
            setErrors(error.response.data.errors);
            break;
          case 401:
            Swal.fire("error", error.response.data.message, "info")
            break;
          case 500:
            Swal.fire("error", error.response.data.message, "info")
            break;
          default:
            Swal.fire("error", error.response.data.message, "error")
        }
      } else {
        Swal.fire("error", "an unkown error occured", "error")

      }
    });

  }

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="bg-white p-4 rounded shadow container max-w-md shadow-lg">
        <div className='flex flex-row justify-between'>
          <h2 className="text-xl font-bold mb-4">Update Contact</h2>
          <button onClick={onClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="first_name" className="text-sm font-medium">
              First Name:
            </label>
            <input
              type="text"
              id="first_name"
              name="first_name"
              value={contactData.first_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.first_name && <b className='text-red-400'>{errors.first_name[0]}</b>}
          </div>

          <div className="mb-4">
            <label htmlFor="last_name" className="text-sm font-medium">
              Last Name:
            </label>
            <input
              type="text"
              id="last_name"
              name="last_name"
              value={contactData.last_name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.last_name && <b className='text-red-400'>{errors.last_name[0]}</b>}

          </div>

          <div className="mb-4">
            <label htmlFor="phone_number" className="text-sm font-medium">
              Phone Number:
            </label>
            <input
              type="text"
              id="phone_number"
              name="phone_number"
              value={contactData.phone_number}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
            {errors.phone_number && <b className='text-red-400'>{errors.phone_number[0]}</b>}
          </div>

          <button
            className="bg-blue-500 text-white px-4 py-2 rounded mt-4 w-full"
            type='submit'
          >
            Update Contact
          </button>
        </form>

      </div>
    </div>
  );
};

export default EditContact;
