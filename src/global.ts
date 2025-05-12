export let globalVariable: number = 0; // Initialize the global variable
export let isAdmin: boolean = true; // Initialize the admin variable

// Function to update the global variable
export const setGlobalVariable = (newValue: number) => {
    console.log('Setting global variable:', newValue);
    globalVariable = newValue;
};

// Function to update the admin variable
export const setIsAdmin = (newValue: boolean) => {
    console.log('Setting admin variable:', newValue);
    isAdmin = newValue;
};