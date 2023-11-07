import { BsArrowRightCircle } from 'react-icons/bs';

export const Breadcrumbs = ({ currentPage }) => {
  return (
    <div className="breadcrumbs text-gray-500 text-sm my-4 flex justify-center items-center space-x-4">
      <span className={currentPage === "A" ? "font-bold text-gray-900" : "text-gray-500"}>Section A</span>
      <BsArrowRightCircle className="text-gray-400" />
      <span className={currentPage === "B" ? "font-bold text-gray-900" : "text-gray-500"}>Section B</span>
      <BsArrowRightCircle className="text-gray-400" />
      <span className={currentPage === "C" ? "font-bold text-gray-900" : "text-gray-500"}>Section C</span>
    </div>
  );
};
