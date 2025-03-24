import { create } from "zustand";

const useStore = create((set, get) => ({
    inventory : [],

    getInventory: () => get().inventory,

    setInvertory: (newInventory) => set({inventory: newInventory}),

    loadInventoryFromStorage: () => {
        const storedInventory = localStorage.getItem('inventory');
        if (storedInventory) {
            set({inventory: JSON.parse(storedInventory)});
        } 
    },
    
    saveInventoryToStorage: () => {
        localStorage.setItem('inventory', JSON.stringify(get().inventory));
    },

    addToInventory: (item) => {
        const updatedInventory = [...get().inventory, item];
        set({inventory: updatedInventory});
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    },

    updateInventoryItem: (index, updatedItem ) => {
        const updatedInventory = [...get().inventory];
        updatedInventory[index] = updatedItem;
        set({inventory: updatedInventory});
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    },

    removeFromInventory: (index) => {
        const updatedInventory = get().inventory.filter((item, i) => i !== index);
        set({inventory: updatedInventory});
        localStorage.setItem('inventory', JSON.stringify(updatedInventory));
    }
     
}))

export default useStore;