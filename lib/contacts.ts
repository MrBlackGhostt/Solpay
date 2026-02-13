import { PublicKey } from "@solana/web3.js";
import { Contact } from "@/types/contact";

const STORAGE_KEY = "solpay-contacts";

/**
 * Contact Service - localStorage CRUD operations
 */
export const contactService = {
  /**
   * Get all contacts from localStorage
   */
  getAll(): Contact[] {
    if (typeof window === "undefined") return [];
    
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load contacts:", error);
      return [];
    }
  },

  /**
   * Add a new contact
   */
  add(name: string, address: string, emoji: string = "👤"): Contact {
    // Validate Solana address
    try {
      new PublicKey(address);
    } catch {
      throw new Error("Invalid Solana address");
    }

    const contacts = this.getAll();
    
    // Check for duplicate address
    if (contacts.some(c => c.address === address)) {
      throw new Error("Contact with this address already exists");
    }

    const newContact: Contact = {
      id: crypto.randomUUID(),
      name,
      address,
      emoji,
      addedDate: new Date().toISOString(),
    };

    const updated = [...contacts, newContact];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("solpay-contacts-updated"));
    
    return newContact;
  },

  /**
   * Delete a contact by ID
   */
  delete(id: string): void {
    const contacts = this.getAll();
    const filtered = contacts.filter(c => c.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
    window.dispatchEvent(new Event("solpay-contacts-updated"));
  },

  /**
   * Find contact by address
   */
  findByAddress(address: string): Contact | undefined {
    return this.getAll().find(c => c.address === address);
  },

  /**
   * Update last used timestamp
   */
  updateLastUsed(id: string): void {
    const contacts = this.getAll();
    const updated = contacts.map(c => 
      c.id === id ? { ...c, lastUsed: new Date().toISOString() } : c
    );
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    window.dispatchEvent(new Event("solpay-contacts-updated"));
  },
};
