import React from 'react';

type BadgeColor = 'blue' | 'green' | 'red' | 'yellow' | 'purple' | 'gray';

interface BadgeProps {
  children: React.ReactNode;
  color?: BadgeColor;
  className?: string;
  onClick?: () => void;
  removable?: boolean;
  onRemove?: () => void;
}

const Badge: React.FC<BadgeProps> = ({
  children,
  color = 'blue',
  className = '',
  onClick,
  removable = false,
  onRemove
}) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
    green: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
    red: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100',
    yellow: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
    purple: 'bg-purple-100 text-purple-800 dark:bg-purple-800 dark:text-purple-100',
    gray: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
  };
  
  const baseClasses = 'inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full';
  const cursorClasses = onClick ? 'cursor-pointer hover:opacity-80' : '';
  
  return (
    <span 
      className={`${baseClasses} ${colorClasses[color]} ${cursorClasses} ${className}`}
      onClick={onClick}
    >
      {children}
      {removable && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onRemove && onRemove();
          }}
          className="ml-1.5 -mr-1 h-3.5 w-3.5 rounded-full inline-flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <span className="sr-only">Remove</span>
          <svg
            className="h-2.5 w-2.5"
            fill="currentColor"
            viewBox="0 0 20 20"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              fillRule="evenodd"
              d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default Badge;