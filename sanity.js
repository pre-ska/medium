import {
  createImageUrlBuilder,
  createCurrentUserHook,
  createClient,
} from 'next-sanity';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT,
  apiVersion: '2021-08-31',
  useCdn: process.env.NODE_ENV === 'production',
};

//Fetching data from props page functions
export const sanityClient = createClient(config);

// Generate Image URL
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// Helper for using current logged in account
export const useCurrentUser = createCurrentUserHook(config);
