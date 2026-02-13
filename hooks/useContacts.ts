"use client";

import { useState, useEffect } from "react";
import { Contact } from "@/types/contact";
import { contactService } from "@/lib/contacts";

export function useContacts() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load contacts and sync across components
  useEffect(() => {
    const loadContacts = () => {
      try {
        const loaded = contactService.getAll();
        setContacts(loaded);
      } catch (error) {
        console.error("Failed to load contacts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initial load
    loadContacts();

    // Listen for storage changes in OTHER tabs/windows
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "solpay-contacts") {
        loadContacts();
      }
    };

    // Listen for custom trigger in the SAME tab/window
    const handleLocalUpdate = () => {
      loadContacts();
    };

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("solpay-contacts-updated", handleLocalUpdate);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("solpay-contacts-updated", handleLocalUpdate);
    };
  }, []);

  const addContact = (name: string, address: string, emoji: string = "👤") => {
    try {
      const newContact = contactService.add(name, address, emoji);
      setContacts(prev => [...prev, newContact]);
      return { success: true, contact: newContact };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const deleteContact = (id: string) => {
    try {
      contactService.delete(id);
      setContacts(prev => prev.filter(c => c.id !== id));
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  };

  const updateLastUsed = (id: string) => {
    try {
      contactService.updateLastUsed(id);
      setContacts(prev => 
        prev.map(c => c.id === id ? { ...c, lastUsed: new Date().toISOString() } : c)
      );
    } catch (error) {
      console.error("Failed to update last used:", error);
    }
  };

  return {
    contacts,
    isLoading,
    addContact,
    deleteContact,
    updateLastUsed,
  };
}
