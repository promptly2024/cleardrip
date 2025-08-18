import React from "react";

type AlertBarProps = {
  onClose: () => void;
};

export const TdsAlert: React.FC<AlertBarProps> = ({ onClose }) => {
  return (
    <div
      className="
        box-border
        flex flex-row items-center justify-center
        absolute
        left-1/2 transform -translate-x-1/2
        h-[56px] w-[1440px]
        px-[80px] py-[10px]
        gap-[56px]
        bg-[#F8F3E2] border border-[#FB4F28]
        font-sans text-[24px] text-[#212529]
      "
    >
      {/* Warning icon */}
      <span className="text-[24px]">
        {/* Replace with SVG if you prefer */}
        &#9888;
      </span>
      {/* Message */}
      <span>
        High TDS levels detected;{" "}
        <span className="text-[#2670EB] underline cursor-pointer">
          Service recommended
        </span>
      </span>
      {/* Close Button */}
      <button
        type="button"
        className="text-[24px] bg-transparent border-none cursor-pointer text-[#212529] p-0"
        aria-label="Close"
        onClick={onClose}
      >
        &#10006;
      </button>
    </div>
  );
};
