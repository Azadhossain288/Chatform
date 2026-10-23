import { customAlphabet } from 'nanoid';

// Chhoto hater akkhor ar digit diye unique link: /f/k3j9x2ab
export const generateSlug = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789', 8);