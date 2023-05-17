import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faPhone } from '@fortawesome/free-solid-svg-icons';
const Contact = ({contact, itemIndex, onEdit, onDelete}) => {

  const editContact = (contact) => {
    onEdit(contact)
  }

  const handleDeleteContact = (id) => {
    onDelete(id)
  }

  return (
    <>

      <div
        className={`border-gray-300 rounded p-4 flex items-center justify-between mb-4 ${itemIndex != 0 && "border-t-4"}`}
      >
        <div>
          <button className="font-bold text-3xl text-gray-700" onClick={() => editContact(contact)}>{contact.last_name } {contact.first_name }</button>
          <div className="flex items-center">
            <FontAwesomeIcon icon={faPhone} className="mr-2 text-gray-500" />
            <div className="text-gray-500 text-xl">{contact.phone_number}</div>
          </div>
        </div>
        <button className='bg-red-500 hover:bg-red-600 text-white font-bold rounded flex items-center px-4 py-4 my-auto'
          onClick={() => handleDeleteContact(contact)}

        >
          <FontAwesomeIcon icon={faTrash} />
        </button>
      </div>
    </>
  )
}

export default Contact