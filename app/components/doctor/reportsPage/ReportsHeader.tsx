import { FaStethoscope, FaBrain, FaUndoAlt, FaCommentDots, FaStar } from "react-icons/fa";

const ReportHeader = ({ averageRating, totalPredictedDiagnoses, doctorOverriddenDiagnoses, totalFeedbackGiven }) => {
  return (
    <div className="mb-10">
      {/* Report Title & Description */}
      <div className="mb-6">
        <h2 className="text-3xl font-medium text-gray-800">Reports</h2>
        <p className="text-gray-600 mt-2">
          A comprehensive overview of diagnosis trends, AI predictions, and patient feedback to help doctors make data-driven decisions.
        </p>
      </div>

      {/* Cards Section */}
      <div className="flex gap-10 flex-wrap">

        <div className="flex justify-between h-24 px-5 items-center border border-gray-300 w-[300px] rounded-md shadow-sm">
          <div className="flex gap-5 items-center px-2">
            <div className="flex justify-center items-center rounded-full w-14 h-14 bg-gray-200">
              <FaBrain className="text-2xl text-blue-700" />
            </div>
            <p className="text-blue-700 text-sm font-medium">AI-Predicted <br /> Diagnoses</p>
          </div>
          <p className="text-gray-700 font-medium text-2xl">{totalPredictedDiagnoses}</p>
        </div>

        <div className="flex justify-between h-24 px-5 items-center border border-gray-300 w-[300px] rounded-md shadow-sm">
          <div className="flex gap-5 items-center px-2">
            <div className="flex justify-center items-center rounded-full w-14 h-14 bg-gray-200">
              <FaUndoAlt className="text-2xl text-red-600" />
            </div>
            <p className="text-red-600 text-sm font-medium">Wrong AI <br /> Diagnoses</p>
          </div>
          <p className="text-gray-700 font-medium text-2xl">{doctorOverriddenDiagnoses}</p>
        </div>

        {/* Feedback Provided */}
        <div className="flex justify-between h-24 px-5 items-center border border-gray-300 w-[300px] rounded-md shadow-sm">
          <div className="flex gap-5 items-center px-2">
            <div className="flex justify-center items-center rounded-full w-14 h-14 bg-gray-200">
              <FaCommentDots className="text-2xl text-green-600" />
            </div>
            <p className="text-green-600 text-sm font-medium">Feedback <br /> Provided</p>
          </div>
          <p className="text-gray-700 font-medium text-2xl">{totalFeedbackGiven}</p>
        </div>

        {/* Average Rating */}
        <div className="flex justify-between h-24 px-5 items-center border border-gray-300 w-[300px] rounded-md shadow-sm">
          <div className="flex gap-5 items-center px-2">
            <div className="flex justify-center items-center rounded-full w-14 h-14 bg-gray-200">
              <FaStar className="text-2xl text-yellow-600" />
            </div>
            <p className="text-yellow-600 text-sm font-medium">Avg. <br /> Rating</p>
          </div>
          <p className="text-gray-700 font-medium text-2xl">{ averageRating}</p>
        </div>
      </div>
    </div>
  );
};

export default ReportHeader;
