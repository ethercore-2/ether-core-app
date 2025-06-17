'use client';

interface PopupTriggerButtonProps {
  text: string;
  className?: string;
}

const PopupTriggerButton = ({ text, className = '' }: PopupTriggerButtonProps) => {
  return (
    <button 
      className={`open-popup-contact relative inline-flex items-center px-6 py-3 bg-gradient-to-r from-teal-500 to-blue-500 text-white rounded-lg font-semibold hover:from-teal-600 hover:to-blue-600 transition-all duration-300 ${className}`}
    >
      <span className="relative z-10">{text}</span>
      <div className="absolute inset-0 bg-gradient-to-r from-teal-400/20 to-blue-500/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300" />
    </button>
  );
};

export default PopupTriggerButton; 