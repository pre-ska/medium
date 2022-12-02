import { createCurrentUserHook, createClient } from 'next-sanity';
import createImageUrlBuilder from '@sanity/image-url';

export const config = {
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  apiVersion: '2021-08-31',
  useCdn: process.env.NODE_ENV === 'production',
};

//Fetching data from props page functions
export const sanityClient = createClient(config);

// Generate Image URL
export const urlFor = (source) => createImageUrlBuilder(config).image(source);

// Helper for using current logged in account
// export const useCurrentUser = createCurrentUserHook(config);
