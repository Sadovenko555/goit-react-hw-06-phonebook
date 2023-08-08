import { useState, useEffect, useMemo } from 'react';
import { ContactForm } from './ContactForm/ContactForm';
import { ContactList } from './ContactList/ContactList';
import { Filter } from './Filter/Filter';
import { nanoid } from 'nanoid';
import './App.module.css';

const useContacts = () => {
  const [contacts, setContacts] = useState(
    JSON.parse(localStorage.getItem('contacts')) ?? []
  );

  const addContact = (name, number) => {
    const contact = {
      id: nanoid(),
      name,
      number,
    };
    setContacts([contact, ...contacts]);
  };

  const deleteContact = id => {
    setContacts(contacts.filter(contact => contact.id !== id));
  };

  useEffect(() => {
    localStorage.setItem('contacts', JSON.stringify(contacts));
  }, [contacts]);

  return { contacts, addContact, deleteContact };
};

export const App = () => {
  const { contacts, addContact, deleteContact } = useContacts();
  const [filter, setFilter] = useState('');

  const formSubmit = (name, number) => {
    const contactExists = contacts.find(
      i => i.name.toLowerCase() === name.toLowerCase() || i.number === number
    );

    if (contactExists) {
      alert(`${name} or ${number} is already in contacts`);
    } else {
      addContact(name, number);
    }
  };

  const changeFilterInput = e => {
    setFilter(e.target.value);
  };

  const findContacts = useMemo(() => {
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(filter.toLowerCase())
    );
  }, [contacts, filter]);

  return (
    <section>
      <h1>Phonebook</h1>
      <ContactForm onSubmit={formSubmit} />
      <h2>Contacts</h2>
      <Filter filter={filter} changeFilterInput={changeFilterInput} />
      <ContactList contacts={findContacts} deleteContact={deleteContact} />
    </section>
  );
};
