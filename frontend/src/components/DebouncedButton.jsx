import { useState, useRef } from 'react';

/**
 * DebouncedButton component that prevents rapid multi-clicks on buttons.
 */
const DebouncedButton = ({
  onClick,
  children,
  delay = 800,
  disabled = false,
  className = '',
  style = {},
  type = 'button',
  ...props
}) => {
  const [isCoolingDown, setIsCoolingDown] = useState(false);
  const isPendingRef = useRef(false);

  const handleClick = async (e) => {
    if (isPendingRef.current || disabled || isCoolingDown) {
      if (e && e.preventDefault) e.preventDefault();
      return;
    }

    isPendingRef.current = true;
    setIsCoolingDown(true);

    try {
      if (onClick) {
        await onClick(e);
      }
    } catch (err) {
      console.error('DebouncedButton error:', err);
    } finally {
      setTimeout(() => {
        isPendingRef.current = false;
        setIsCoolingDown(false);
      }, delay);
    }
  };

  return (
    <button
      {...props}
      type={type}
      disabled={disabled || isCoolingDown}
      onClick={handleClick}
      className={`debounced-btn ${className}`}
      style={{
        opacity: disabled || isCoolingDown ? 0.65 : 1,
        cursor: disabled || isCoolingDown ? 'not-allowed' : 'pointer',
        transition: 'opacity 0.2s ease, transform 0.1s ease',
        ...style
      }}
    >
      {isCoolingDown ? (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
          <span className="spinner-dot" style={{ display: 'inline-block', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid currentColor', borderTopColor: 'transparent', animation: 'spin 0.6s linear infinite' }}></span>
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
};

export default DebouncedButton;
