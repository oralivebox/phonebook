import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faAddressBook, faSearch, faTrash, faPhone, faSpinner } from '@fortawesome/free-solid-svg-icons'
import Contact from './Contact';
import { useEffect, useState } from 'react';
import CreateContact from './CreateContact';
import EditContact from './EditContact';
import http from '../api/http';
import Swal from 'sweetalert2';
const Main = () => {

    const [isModalOpen, setModalOpen] = useState(false);
    const [isEditOpen, setEditOpen] = useState(false);
    const [contacts, setContacts] = useState([]);
    const [searchParams, setSearchParams] = useState("");
    const [totalContacts, setTotalContacts] = useState(0);
    
    const [isLoading, setIsLoading] = useState(false);
    const [moreExists, setMoreExist] = useState(false);
    const [nextPage, setNextPage] = useState(1);

    const [editContactData, setEditContactData] = useState({});


    const toggleModal = () => {
        setModalOpen(!isModalOpen);
    };

    const toggleEdit = () => {
        setEditOpen(!isEditOpen);
    }

    //load contacts
    useEffect(() => {
        loadContacts();
    }, []);

    const loadContacts = () => {
        setIsLoading(true);
        http.get(`contacts?page=${nextPage}&search=${searchParams}`).then((response) => {
            setIsLoading(false)
            var loadedContacts = response.data.contacts.data;
            
            if(response.data.contacts.current_page === 1) {
                setContacts(loadedContacts);

                if(searchParams === "") {
                    setTotalContacts(response.data.contacts.total)
                }
            } else {
                setContacts([...contacts, ...loadedContacts]);
            }
            if(response.data.contacts.last_page > response.data.contacts.current_page) {
                setNextPage(response.data.contacts.current_page + 1);
                setMoreExist(true)
            } else {
                setMoreExist(false);
            }

        }).catch((error) => {
            setIsLoading(false)

            console.log(error)
        });
    }


    const handleDeleteContact = (selectedContact) => {

        Swal.fire({
            title: `are you sure you want to remove ${selectedContact.first_name + " " + selectedContact.last_name} from your contact?` ,
            showCancelButton: true,
            confirmButtonText: 'Yes',
          }).then((result) => {
            /* Read more about isConfirmed, isDenied below */
            if (result.isConfirmed) {
                http.delete(`contacts/${selectedContact.id}`).then((response) => {
                    Swal.fire("success", response.data.message, "success");
                    var updatedContactList = contacts.filter((contact) => {
                        return selectedContact.id != contact.id
                    })
                    setContacts(updatedContactList);
                    setTotalContacts(totalContacts - 1)
                }).catch((error) => {
                    if(error.response?.status) {
                        switch(error.response.status) {
                            case 401:
                                Swal.fire("info", error.response.data.message, "info");
                                break;
                            default:
                                Swal.fire("info", error.response.data.message, "info");
                        }
                    } else {
                        Swal.fire("error", "an unkown error occured", "error")
                    }
                })
            } else if (result.isDenied) {
              Swal.fire('Changes are not saved', '', 'info')
            }
          })
        
    };

    const searchContact = () => {
        setMoreExist(false);
        setNextPage(1);
        loadContacts();
    }

    const handleCreateContact = (contactData) => {
        setContacts([contactData, ...contacts]);
        setTotalContacts(totalContacts + 1)
        setModalOpen(false);
    };

    const handleEditContact = (contact) => {
        toggleEdit();
        var updatedContactList = contacts.map((preContact) => {
            return preContact.id === contact.id ? contact : preContact;
        });
        setContacts(updatedContactList)
    }

    const showEditModal = (contact) => {
        setEditContactData(contact)
        toggleEdit()
    }

    return (
        <>
            <div className="container mx-auto px-4 mt-8">
                <div className="flex items-center justify-center my666-11">
                    <FontAwesomeIcon icon={faAddressBook} size="2xl" className='mr-3' />
                    <h1 className="text-4xl font-bold">Phone Book App</h1>
                </div>

                <div className='w-full bg-gray-200 py-4 px-6 mt-8 rounded'>
                    <div className='flex justify-between py-10'>
                        <h4 className='font-bold text-3xl'>Contacts ({totalContacts})</h4>
                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded flex items-center"
                            onClick={toggleModal}
                        >
                            <FontAwesomeIcon icon={faPlus} className='mr-2'/>
                            Add Contact
                        </button>
                    </div>

                    <div className="flex items-center border rounded my-8 bg-white">
                        <input type="text" onChange={(event) => setSearchParams(event.target.value)} placeholder='search for contact by last name ...' className='px-4 py-2 outline-none flex-grow font-extrabold text-gray-500' />
                        <div className='py-3 px-4'>
                            <button onClick={loadContacts}>
                                <FontAwesomeIcon icon={faSearch} className='text-gray-600 font-extrabold' />
                            </button>
                        </div>
                    </div>

                    <div className='border border-4 border-gray-300 rounded-lg'>
                        {contacts.length > 0 ? (
                        contacts.map((contact, index) => (
                            <Contact contact={contact} key={index} itemIndex={index} onDelete={handleDeleteContact} onEdit={showEditModal}/>
                        ))
                        ): (
                            isLoading ? (<div className='text-center my-4'> <FontAwesomeIcon icon={faSpinner}/> Loading ...</div>) : (<p className='text-center my-4 text-gray-400 font-extrabold'>Contact List is Empty</p>)
                        )}
                    </div>

                </div>

                {/* loadmore */}
                {moreExists && (
                    <button onClick={loadContacts}>Load More</button>
                )}

            </div>


            <CreateContact isOpen={isModalOpen} onClose={toggleModal} onCreateContact={handleCreateContact}/>
            <EditContact isOpen={isEditOpen} onClose={toggleEdit} onEditContact={handleEditContact} contact={editContactData}/>
        </>
    );
}

export default Main;


