import React from 'react';
import ManageListing from './ManageListing';
import UserLayout from '../../components/Layout/UserLayout';

const title = "Manage Listing";
export default {

  path: '/rooms',

  async action({ store }) {

    // From Redux Store
    let isAuthenticated = store.getState().runtime.isAuthenticated;

    if (!isAuthenticated) {
      return { redirect: '/login' };
    }

    return {
      title,
      component: <UserLayout><ManageListing /></UserLayout>,
    };
  },

};
