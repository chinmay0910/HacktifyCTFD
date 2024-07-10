import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons'

const PageHeader = ({ pageTitle, route }) => {
  const location = useLocation();

  // Extract the path name from location object
  const pathName = location.pathname;

  return (
    <div className="bg-gray-300 flex justify-center items-center py-10">
      <div className="flex flex-row items-center justify-center">
        <h1 className="text-4xl font-normal">{pageTitle}</h1>
        {pathName === '/challenge' && (
          <Link to={route}>
          <FontAwesomeIcon icon={faPlus} className='bg-gray-500 ms-4 p-4 rounded-full text-white cursor-pointer font-extrabold'/>
        </Link>
        )}
      </div>
    </div>
  );
};

export default PageHeader;
