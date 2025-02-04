'use client';
import React, { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { AiOutlineQuestionCircle } from 'react-icons/ai';
import { faq } from '@/public/constants/images';
import Image from 'next/image';


const Faq = () => {
  const [openFAQ, setOpenFAQ] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setOpenFAQ(openFAQ === index ? null : index);
  };

  const faqsData = [
    {
      question: 'What is the Intelligent Medical Diagnostic System?',
      answer:
        'Our system helps patients get preliminary diagnoses based on their symptoms using advanced machine learning models.',
    },
    {
      question: 'How accurate are the diagnosis predictions?',
      answer:
        'The system uses a trained AI model to provide high-accuracy predictions, but it is not a replacement for a certified doctor’s diagnosis.',
    },
    {
      question: 'Do I need an account to use the system?',
      answer:
        'Yes, you need to create an account to store your medical history and book appointments with doctors.',
    },
    {
      question: 'Can I consult a doctor?',
      answer:
        'Yes, after receiving your preliminary diagnosis, you can book an appointment with a healthcare professional directly through the system.',
    },
  ];

  return (
    <div className='py-10  h-[100vh] mt-[20%]' id='faq'>
      <div className='max-w-[1280px] mx-auto px-4'>
        {/* Section Header */}
        <div className='text-center'>
          <p className='inline-block bg-[#6c4de629] text-[#6B4DE6] px-4 py-2 rounded-full text-sm font-medium'>
            FAQs
          </p>
          <h2 className='text-[40px] font_dm_serif font-medium mt-8 flex justify-center items-center gap-2'>
            Frequently Asked Questions
            <AiOutlineQuestionCircle className='text-[#E49B31] w-7 h-7' />
          </h2>
          <p className='text-gray-600 mt-3 text-sm'>
            Find answers to common questions about our platform.
          </p>
        </div>

        {/* FAQ List */}
        <div className='flex gap-20 justify-between items-center mt-10'>
          <div className='mt-8 space-y-8 w-[60%]'>
            {faqsData.map((faq, index) => (
              <div
                key={index}
                className='border border-gray-300 rounded-lg p-5 bg-white shadow-sm transition-all'
              >
                <div
                  className='flex justify-between items-center cursor-pointer'
                  onClick={() => toggleFAQ(index)}
                >
                  <h3 className='text-lg font-medium text-gray-700'>
                    {faq.question}
                  </h3>
                  <span className='text-gray-600'>
                    {openFAQ === index ? <FiChevronUp /> : <FiChevronDown />}
                  </span>
                </div>
                {openFAQ === index && (
                  <p className='mt-3 text-gray-600 text-sm leading-relaxed'>
                    {faq.answer}
                  </p>
                )}
              </div>
            ))}
          </div>
          <Image src={faq} alt='faq' />
        </div>

      </div>
    </div>
  );
};

export default Faq;
