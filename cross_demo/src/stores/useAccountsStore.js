import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

const useAccountsStore = create(
  persist(
    (set, get) => ({
      accounts: [],
      
      // Initialize accounts
      initAccounts: (initialAccounts) => {
        set({ 
          accounts: initialAccounts.map(acc => ({
            ...acc,
            id: acc.id || uuidv4()
          }))
        });
      },
      
      // Get all accounts
      getAllAccounts: () => {
        return get().accounts;
      },
      
      // Get account by ID
      getAccountById: (accountId) => {
        return get().accounts.find(acc => acc.id === accountId);
      },
      
      // Get accounts by rep
      getAccountsByRep: (repId) => {
        return get().accounts.filter(acc => acc.repId === repId);
      },
      
      // Add new account
      addAccount: (accountData) => {
        const newAccount = {
          ...accountData,
          id: uuidv4(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        
        set((state) => ({
          accounts: [...state.accounts, newAccount]
        }));
        
        return newAccount;
      },
      
      // Update account
      updateAccount: (accountId, updates) => {
        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === accountId
              ? {
                  ...acc,
                  ...updates,
                  updatedAt: new Date().toISOString()
                }
              : acc
          )
        }));
      },
      
      // Delete account
      deleteAccount: (accountId) => {
        set((state) => ({
          accounts: state.accounts.filter(acc => acc.id !== accountId)
        }));
      },
      
      // Add contact to account
      addAccountContact: (accountId, contact) => {
        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === accountId
              ? {
                  ...acc,
                  contacts: [
                    ...(acc.contacts || []),
                    {
                      ...contact,
                      id: uuidv4(),
                      addedAt: new Date().toISOString()
                    }
                  ],
                  updatedAt: new Date().toISOString()
                }
              : acc
          )
        }));
      },
      
      // Update account health score
      updateAccountHealth: (accountId, healthScore) => {
        set((state) => ({
          accounts: state.accounts.map(acc =>
            acc.id === accountId
              ? {
                  ...acc,
                  healthScore,
                  updatedAt: new Date().toISOString()
                }
              : acc
          )
        }));
      },
      
      // Search accounts
      searchAccounts: (query) => {
        const lowerQuery = query.toLowerCase();
        return get().accounts.filter(acc =>
          acc.name?.toLowerCase().includes(lowerQuery) ||
          acc.industry?.toLowerCase().includes(lowerQuery) ||
          acc.location?.toLowerCase().includes(lowerQuery)
        );
      },
      
      // Filter accounts by industry
      filterAccountsByIndustry: (industry) => {
        return get().accounts.filter(acc => acc.industry === industry);
      },
      
      // Get accounts by health score range
      getAccountsByHealthScore: (minScore, maxScore) => {
        return get().accounts.filter(acc => 
          acc.healthScore >= minScore && acc.healthScore <= maxScore
        );
      },
      
      // Reset accounts
      resetAccounts: () => {
        set({ accounts: [] });
      }
    }),
    {
      name: 'accounts-storage',
      version: 1
    }
  )
);

export default useAccountsStore;
