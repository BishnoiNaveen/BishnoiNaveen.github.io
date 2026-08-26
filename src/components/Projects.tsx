import React from 'react';
import EditorialProjectsList from './projects/EditorialProjectsList';

export default function Projects() {
  return (
    <div className="w-full flex flex-col" id="featured-works">
      <EditorialProjectsList />
    </div>
  );
}
