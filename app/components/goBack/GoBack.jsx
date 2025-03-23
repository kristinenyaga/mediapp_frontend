"use client";
import { useRouter } from "next/navigation";

const GoBack = () => {
  const router = useRouter();

  return (
    <button
      onClick={() => router.back()}
      className="px-4 mb-2 py-2 bg-gray-200 hover:bg-gray-300 rounded-md"
    >
      Go Back
    </button>
  );
};

export default GoBack;
